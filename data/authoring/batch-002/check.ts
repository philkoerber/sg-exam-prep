import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { questionSchema } from '../../../src/lib/corpus/schema';
import { choiceText } from '../../../src/lib/corpus/content';
import { readQuestions } from '../../../scripts/corpus-files';
import { contentText, languageMetrics, questionDigest } from '../../../scripts/pilot-review';

const dir = 'data/authoring/batch-002';
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const official = readQuestions('data/questions/official');
assert.equal(official.length, 120, 'The language baseline must remain fixed at 120 official questions.');
const questions = questionSchema.array().parse(read(`${dir}/questions.json`));
const reviews = read(`${dir}/reviews.json`);
const resources = read(`${dir}/resources.json`);
const expected = ['sg-2024-public-01','sg-2024-public-02','sg-2022-sample-12','sg-2023-public-07','sg-2025-public-06','sg-2022-sample-25','sg-2022-sample-30','sg-2023-public-02','sg-2023-public-04','sg-2022-sample-31','sg-2023-public-08','sg-2022-sample-39','sg-2024-public-09','sg-2023-public-10','sg-2024-public-08','sg-2023-public-12','sg-2022-sample-51','sg-2022-sample-53','sg-2022-sample-57','sg-2025-public-15'];
const catalog = read('data/resources/catalog.json');
const registered = new Set(catalog.map((r: {id: string}) => r.id));
for (const [file, hash] of Object.entries({
  'independent-review-initial.json': '40334993dffd0558784da053e967ce6758308caadda068fe053fb3d73bcacadb',
  'independent-review-notes.md': 'b18c7d2d878fc98f6e0c39fd2a6a2d325de7802c8fdf7bb1f648de47fc06f52d',
})) assert.equal(createHash('sha256').update(readFileSync(`${dir}/${file}`)).digest('hex'), hash, `Preserve reviewer file ${file}`);
for (const r of resources) {
  assert.ok(r.id.startsWith('batch-002-'));
    assert.ok(registered.has(r.id), `Resource must already be registered: ${r.id}`);
    assert.deepEqual(catalog.find((c: {id: string}) => c.id === r.id), r);
  assert.ok(r.file.startsWith('data/resources/batch-002/'));
  assert.equal(r.retrieved, '2026-10-10');
  assert.equal(createHash('sha256').update(readFileSync(r.file)).digest('hex'), r.sha256);
}
assert.equal(new Set(resources.map((r: {id: string}) => r.id)).size, resources.length);
assert.equal(questions.length, 20);
assert.equal(reviews.length, 20);
assert.equal(new Set(reviews.map((r: {questionId: string}) => r.questionId)).size, 20);
const report = questions.map((q, i) => {
  const a = official.find((o) => o.id === expected[i])!;
  assert.equal(q.id, `sg-generated-batch-002-${String(i+1).padStart(3,'0')}`);
  assert.equal(q.source.kind, 'generated');
  if (q.source.kind !== 'generated') throw Error('Unreachable');
  assert.deepEqual(q.source.referenceQuestionIds, [expected[i]]);
  for (const field of ['familyId','subject','topic','pool'] as const) assert.equal(q[field], a[field]);
  assert.equal(q.pool, 'study');
  assert.ok(q.source.references.every((r) => registered.has(r.resourceId)));
    assert.ok(q.source.references.every((r) => !/(?:正解|解答)\s*[:：]?\s*[アイウエオカキクケコ]/u.test(r.section)), 'No answer letters in learner-visible source sections');
  assert.ok(q.source.references.every((r) => !r.resourceId.includes('2026') && r.resourceId !== 'ipa-sg-syllabus-4.1'));
  assert.equal(q.subject, i < 16 ? 'A' : 'B');
  assert.ok(q.choices.every((c,j) => c.key === 'アイウエオカキクケコ'[j] && choiceText(c).trim()));
  assert.equal(new Set(q.choices.map(choiceText)).size, q.choices.length);
  assert.ok(!official.some((o) => contentText(o) === contentText(q)));
  const r = reviews.find((r: {questionId: string}) => r.questionId === q.id);
  assert.equal(r.status, 'draft');
  assert.deepEqual(Object.keys(r.choiceReasons).sort(), q.choices.map((c) => c.key).sort());
  for (const v of [r.rule,r.variation,r.sourceReview,r.languageReview,...Object.values(r.choiceReasons)]) assert.ok(typeof v === 'string' && v.length >= 10);
  const metrics = languageMetrics(q, official);
  const hash = questionDigest(q);
  if (r.contentHash) assert.equal(r.contentHash, hash);
  const entry = { questionId:q.id, anchorId:a.id, contentHash:hash, ...metrics };
  console.log(q.id, metrics.characters, `${(100*metrics.wordCoverage).toFixed(2)}% words`, `${(100*metrics.kanjiCoverage).toFixed(2)}% kanji`, 'NOVEL WORDS:', metrics.novelWords.join('/'), 'NOVEL KANJI:', metrics.novelKanji.join(''));
  return entry;
});
assert.equal(questions[16].choices.length,10);
assert.equal(questions[16].answer,'ケ');
assert.equal(choiceText(questions[16].choices[8]),'（三），（五）');
const updateTable = questions[16].blocks.find((b) => b.type === 'table');
assert.ok(updateTable?.type === 'table');
assert.equal(updateTable.rows.length,4);
for (const q of questions) for (const block of q.blocks) {
  if (block.type === 'table') assert.ok(Math.abs(block.columns.reduce((sum,width) => sum + width,0)-100)<1e-8, 'Table widths are percentages');
}
assert.equal(questions[17].choices.length,10);
assert.equal(questions[17].blocks.filter((b) => b.type === 'diagram').length,1);
assert.deepEqual(questions[18].choiceTable?.headers,['評価結果','評価根拠']);
assert.equal(questions[18].choices.length,4);
assert.equal(questions[19].choices.length,10);
assert.equal(questions[19].blocks.filter((b) => b.type === 'table').length,3);
assert.equal(questions[19].choiceTable?.headers.length,3);
// A13: independently evaluate the stated transformations, rather than infer a key from the old question.
for (const [m,r] of [[90,10],[1,1],[12,0.25]]) {
  const base=m/(m+r);
  const values=[3*m/(3*m+3*r),m/(m+r/2),(m/2)/(m/2+r),m/(m+3*r)];
  assert.deepEqual(values.map((v) => v>base+1e-12),[false,true,false,false]);
}
const failures = report.flatMap((r) => [
  ...(r.wordCoverage < .9 ? [`${r.questionId}: word floor`] : []),
  ...(r.kanjiCoverage < .98 ? [`${r.questionId}: kanji floor`] : []),
  ...(r.characters < (r.questionId >= 'sg-generated-batch-002-017' ? 500 : 30) ? [`${r.questionId}: length floor`] : []),
]);
writeFileSync(`${dir}/language-report.json`, JSON.stringify({
  baseline:'120 official questions only; current canonical rendered body and choices; no generated text added, including no repaired B03 text substituted into this fixed baseline',
  method:'Existing languageMetrics from scripts/pilot-review.ts (Node Intl.Segmenter ja); overlap is screening, not independent Japanese review.',
  targetWordCoverage:.95,targetKanjiCoverage:.99,minimumWordCoverage:.90,minimumKanjiCoverage:.98,
  minimumObservedWordCoverage:Math.min(...report.map((r)=>r.wordCoverage)),
  minimumObservedKanjiCoverage:Math.min(...report.map((r)=>r.kanjiCoverage)),
  novelKanji:[...new Set(report.flatMap((r)=>r.novelKanji))].sort(),
  belowTarget:report.filter((r)=>r.wordCoverage<.95 || r.kanjiCoverage<.99).map((r)=>r.questionId),
  sourceCatalogRegistered:true,
    reviewState:'Initial independent review preserved (6 accept / 14 revise); current content hashes await independent re-review. All author statuses remain draft.',
  failures,questions:report,
},null,2)+'\n');
assert.deepEqual(failures, []);
console.log('PASS: 20 schemas, exact Wave-1 inheritance/order, registered source inventory/checksums, draft-only complete author rationales/current hashes, structures, A13 calculations, language hard floors and unchanged original reviewer files. No global report, publication gate or independent re-review was run.');
