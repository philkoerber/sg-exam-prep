"""Convert PDF text, grids and vector drawings to validated, native web blocks.

Nothing is rasterized. Unknown embedded bitmap content is rejected. The source
PDFs remain the reference; the extraction audit checks that every character in
each converted region is represented in its text or cells.
"""
import re
from collections import Counter

KEYS = 'アイウエオカキクケコサシスセソ'
DIAGRAMS = {
    'sg-2022-sample-53': 'A社の事務所の配置図',
    'sg-2026-public-11': 'データをビジネス戦略に活用する流れ',
}
AUDIT = []


def compact(text):
    result = ''
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        space = ' ' if result and re.search(r'[a-zA-Z0-9]$', result) and re.match(r'[a-zA-Z0-9]', line) else ''
        result += space + line
    return result


def paragraphs(page):
    merged = []
    for line in page.extract_text_lines():
        text = line['text'].strip()
        if not text or re.fullmatch(r'[－−-]\s*\d+\s*[－−-]', text):
            continue
        new_item = re.match(r'^(?:〔|\[|[（(][0-9０-９一二三四五]|[・●]|[0-9]+[.． ]|['+KEYS+r']\s|設問|解答群|表\d|図\d|[^：:]{1,15}[：:])', text)
        if merged and line['top'] - merged[-1]['bottom'] < 14 and not new_item and not merged[-1]['text'].endswith(('。', '？', '〕', '群', '〉')):
            merged[-1]['text'] = compact(merged[-1]['text'] + '\n' + text)
            merged[-1]['bottom'] = line['bottom']
        else:
            merged.append({'type': 'paragraph', 'text': text, 'top': line['top'], 'bottom': line['bottom']})
    return merged


def inside(obj, bounds, pad=0):
    return bounds[0]-pad <= (obj['x0']+obj['x1'])/2 <= bounds[2]+pad and bounds[1]-pad <= (obj['top']+obj['bottom'])/2 <= bounds[3]+pad


def overlap(a, b, gap=3):
    return a[0] <= b[2]+gap and b[0] <= a[2]+gap and a[1] <= b[3]+gap and b[1] <= a[3]+gap


def graphics_groups(crop, bounds):
    groups = [(max(bounds[0], o['x0']), max(bounds[1], o['top']), min(bounds[2], o['x1']), min(bounds[3], o['bottom'])) for o in crop.rects+crop.lines+crop.curves]
    changed = True
    while changed:
        changed = False
        for i in range(len(groups)):
            for j in range(i+1, len(groups)):
                if overlap(groups[i], groups[j]):
                    a, b = groups[i], groups.pop(j)
                    groups[i] = (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))
                    changed = True
                    break
            if changed:
                break
    return sorted([g for g in groups if g[2]-g[0] > 20 and g[3]-g[1] > 14 and (g[2]-g[0] > 60 or g[3]-g[1] > 40)], key=lambda g: (g[1], g[0]))


def cell_text(page, cell):
    # Midpoint ownership avoids duplicating glyphs that touch a ruling line.
    chars = page.filter(lambda o: o.get('object_type') != 'char' or inside(o, cell))
    lines = chars.extract_text_lines()
    out = ''
    for line in lines:
        text = line['text'].strip()
        if re.match(r'^[・●]', text) and out:
            out += '\n' + text
        else:
            out = compact(out + '\n' + text)
    return out


def table_block(page, table):
    xs = sorted(set(round(c[x], 2) for c in table.cells for x in (0, 2)))
    ys = sorted(set(round(c[y], 2) for c in table.cells for y in (1, 3)))
    rows = [[] for _ in ys[:-1]]
    occupied = set()
    for cell in sorted(table.cells, key=lambda c: (c[1], c[0])):
        x, y, right, bottom = [round(n, 2) for n in cell]
        col, row = xs.index(x), ys.index(y)
        colspan, rowspan = xs.index(right)-col, ys.index(bottom)-row
        # Guard against cells containing other cells (inline answer boxes).
        covered = {(r,c) for r in range(row,row+rowspan) for c in range(col,col+colspan)}
        if occupied & covered:
            raise ValueError('Overlapping table cells require a source review')
        occupied |= covered
        rows[row].append({'text': cell_text(page, cell), 'colSpan': colspan, 'rowSpan': rowspan, 'column': col})
    # Choice tables intentionally omit the top-left corner in the source.
    for r, row in enumerate(rows):
        for c in range(len(xs)-1):
            if (r,c) not in occupied:
                row.append({'text':'', 'colSpan':1, 'rowSpan':1, 'column':c})
        row.sort(key=lambda cell: cell['column'])
        for cell in row:
            del cell['column']
    return {'type':'table', 'columns': [round((b-a)/(xs[-1]-xs[0])*100, 2) for a,b in zip(xs,xs[1:])], 'headerRows':1, 'rows':rows}


def color(value):
    if value is None:
        return '#000'
    if isinstance(value, (float,int)):
        value = (value,)*3
    if len(value) == 1:
        value = value*3
    if len(value) == 4:
        c,m,y,k = value
        value = (1-min(1,c+k), 1-min(1,m+k), 1-min(1,y+k))
    return '#' + ''.join(f'{round(v*255):02x}' for v in value[:3])


def diagram_block(page, bounds, label):
    paths = []
    # Keep PDF paint order: label backgrounds must cover the lines below them.
    for obj in page.root_page.iter_layout_objects(page.root_page.layout):
        if obj.get('object_type') not in ('rect','line','curve') or not overlap((obj['x0'],obj['top'],obj['x1'],obj['bottom']),bounds,0):
            continue
        if not obj.get('path'):
            raise ValueError('Vector path missing')
        d = []
        for segment in obj['path']:
            op = {'m':'M','l':'L','c':'C','h':'Z'}.get(segment[0])
            if not op:
                raise ValueError(f'Unsupported path command {segment[0]}')
            d.append(op + ' '.join(f'{n:.3f}' for point in segment[1:] for n in point))
        paths.append({'d':' '.join(d), 'fill':color(obj['non_stroking_color']) if obj['fill'] else 'none', 'stroke':color(obj['stroking_color']) if obj['stroke'] else 'none', 'strokeWidth':max(.45,obj['linewidth']), 'dash':obj['dash'][0] if obj.get('dash') else []})
    texts = []
    for word in page.extract_words(return_chars=True, x_tolerance=2, y_tolerance=2):
        chars = word['chars']
        if not all(c['upright'] for c in chars):
            raise ValueError('Rotated diagram text requires source review')
        texts.append({'text':word['text'], 'x':word['x0'], 'y':chars[0]['bottom']+chars[0]['y0']-chars[0]['matrix'][5], 'width':word['x1']-word['x0'], 'size':max(c['size'] for c in chars)})
    return {'type':'diagram', 'label':label, 'viewBox':[round(bounds[0],3),round(bounds[1],3),round(bounds[2]-bounds[0],3),round(bounds[3]-bounds[1],3)], 'paths':paths, 'texts':texts}


def financial_statement(index):
    # These statements have no grid lines. Preserve the five unfilled boxes.
    if index == 0:
        title = '製造原価明細書'
        entries = [('材料費','400'), ('労務費','300'), ('経 費','200'), ('当期総製造費用',None), ('期首仕掛品棚卸高','150'), ('期末仕掛品棚卸高','250'), ('当期製品製造原価',None)]
    elif index == 1:
        title = '損益計算書'
        entries = [('売上高','1,000'), ('売上原価',''), ('期首製品棚卸高','120'), ('当期製品製造原価',None), ('期末製品棚卸高','70'), ('売上原価',None), ('売上総利益',None)]
    else:
        raise ValueError('Unexpected financial statement')
    rows = [[{'text':title,'colSpan':2,'rowSpan':1}]]
    for label,value in entries:
        rows.append([{'text':label,'colSpan':1,'rowSpan':1}, {'text':value or '', 'colSpan':1,'rowSpan':1, **({'blank':True} if value is None else {})}])
    return {'type':'table','columns':[72,28],'headerRows':1,'caption':'単位：千円','rows':rows}


def native_text(block):
    if block['type'] == 'paragraph': return block['text']
    if block['type'] == 'panel': return ''.join(block['paragraphs'])
    if block['type'] == 'table': return ''.join(c['text'] for r in block['rows'] for c in r)
    if block['type'] == 'diagram': return ''.join(t['text'] for t in block['texts'])
    raise ValueError(block['type'])


def character_counts(text):
    return Counter(c for c in text if not c.isspace())


def page_blocks(page, bounds, qid):
    crop = page.crop(bounds)
    if crop.images:
        raise ValueError(f'{qid}: embedded bitmap needs a manual native replacement')
    groups = graphics_groups(crop,bounds)
    # The flowchart's arrows connect all four boxes; its full labels stay together.
    blocks = []
    for n,g in enumerate(groups):
        region = (max(bounds[0],g[0]-1),max(bounds[1],g[1]-1),min(bounds[2],g[2]+1),min(bounds[3],g[3]+1))
        area = crop.filter(lambda o: inside(o,region) if o.get('object_type') == 'char' else overlap((o['x0'],o['top'],o['x1'],o['bottom']),region,0))
        tables = [t for t in area.find_tables() if len(t.rows)>1 and len(t.columns)>1]
        if qid in DIAGRAMS:
            converted = [diagram_block(area, region, DIAGRAMS[qid])]
        elif qid == 'sg-2022-sample-48':
            converted = [financial_statement(n)]
        elif tables:
            converted = []
            for t in tables:
                converted.append((t.bbox[1],table_block(area,t)))
            outside = area.filter(lambda o: o.get('object_type')!='char' or not any(inside(o,t.bbox) for t in tables))
            for p in paragraphs(outside):
                converted.append((p['top'],{'type':'paragraph','text':p['text']}))
            converted = [b for _,b in sorted(converted,key=lambda b:b[0])]
        else:
            converted = [{'type':'panel', 'paragraphs':[p['text'] for p in paragraphs(area)]}]
        source = ''.join(c['text'] for c in area.chars)
        rendered = ''.join(native_text(b) for b in converted)
        missing = character_counts(source)-character_counts(rendered)
        extra = character_counts(rendered)-character_counts(source)
        if missing or extra:
            raise ValueError(f'{qid} region {n+1}: character mismatch missing={missing} extra={extra}')
        AUDIT.append({'question':qid,'page':page.page_number,'region':n+1,'types':[b['type'] for b in converted],'characters':sum(character_counts(source).values())})
        blocks.extend({**b,'top':g[1],'bottom':g[3]} for b in converted)
    prose = crop.filter(lambda o:o.get('object_type')!='char' or (o.get('size',10)>=8 and not any(inside(o,g,1) for g in groups)))
    blocks.extend(paragraphs(prose))
    blocks.sort(key=lambda b:b['top'])
    return [{k:v for k,v in b.items() if k not in ('top','bottom')} for b in blocks]
