import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { questionSchema, type Question } from '../../../src/lib/corpus/schema';
import { choiceText } from '../../../src/lib/corpus/content';
import { readQuestions } from '../../../scripts/corpus-files';
import { contentText, languageMetrics, questionDigest, words } from '../../../scripts/pilot-review';
import type { Review } from '../../../scripts/validate-pilot';
type Resource = { id: string; title: string; url: string; file: string; sha256: string; retrieved: string }; 

const root = 'data/authoring/batch-003';
const read = <T = unknown>(path: string): T => JSON.parse(readFileSync(path, 'utf8'));
const write = (name: string, data: unknown) => writeFileSync(`${root}/${name}`, JSON.stringify(data, null, 2) + '\n');
const official = readQuestions('data/questions/official');
assert.equal(official.length, 120, 'The official language baseline must remain fixed at 120.');
const questions = questionSchema.array().parse(read(`${root}/questions.json`));
const reviews = read<Review[]>(`${root}/reviews.json`);
const resources = read<Resource[]>(`${root}/resources.json`);
const catalogue = read<Resource[]>('data/resources/catalog.json');
const expectedAnchors = [
  'sg-2025-public-01', 'sg-2022-sample-15', 'sg-2024-public-04', 'sg-2022-sample-07',
  'sg-2022-sample-09', 'sg-2025-public-03', 'sg-2022-sample-35', 'sg-2023-public-09',
  'sg-2022-sample-32', 'sg-2022-sample-37', 'sg-2022-sample-46', 'sg-2022-sample-48',
  'sg-2023-public-11', 'sg-2024-public-11', 'sg-2025-public-11', 'sg-2025-public-12',
  'sg-2022-sample-60', 'sg-2022-sample-59', 'sg-2023-public-15', 'sg-2024-public-15',
];
const knownIds = new Set(catalogue.map(r => r.id));
const missingGlobal = new Set<string>();
const sha = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
assert.equal(questions.length, 20);
assert.equal(reviews.length, 20);
assert.equal(new Set(questions.map(q => q.id)).size, 20);
assert.equal(new Set(questions.map(q => q.familyId)).size, 20);
assert.equal(new Set(reviews.map(r => r.questionId)).size, 20);
for (const r of resources) {
  assert.ok(r.id.startsWith('batch-003-'));
  assert.ok(r.file.startsWith('data/resources/batch-003/'));
  assert.equal(r.retrieved, '2026-10-10');
  assert.ok(r.title && new URL(r.url).protocol === 'https:');
  assert.equal(sha(readFileSync(r.file)), r.sha256);
    assert.deepEqual(catalogue.find(c => c.id === r.id), r, `${r.id}: merged catalogue entry differs`);
}

// Canonical structured anchors contain their choices again in the source blocks.
// Only this reading-load comparison removes them; languageMetrics remains unchanged.
function displayedOnce(q: Question): Question {
  const result = structuredClone(q);
  if (q.source.kind !== 'official' || q.display !== 'structured') return result;
  const marker = result.blocks.findIndex(b => b.type === 'paragraph' && b.text === '解答群');
  if (marker >= 0) result.blocks = result.blocks.slice(0, marker);
  else if (q.id === 'sg-2022-sample-48') result.blocks = result.blocks.slice(0, -1);
  else if (q.id === 'sg-2025-public-12') result.blocks = result.blocks.slice(0, -4);
  return result;
}
const length = (q: Question) => contentText(q).replace(/\s/g, '').length;
const languageNotes = [
  '原問と同じリスク用語を用い，数値計算を要求しない活動分類にした。',
  '「外向き」は通信方向を表す通常の語。HTTPS・DNSの名前解決・ゾーン転送とHTTPのポート対応を対比し，必須許可や無害性の断定を消去の手掛かりにしない。',
  '「つなぐ」「集め」「始めて」「途中」は整理方法を記述する通常の語で，専門的な段階名は追加しない。',
  '「調べ」は調査の動詞。CRYPTREC以外の新しい組織名や暗号方式を追加しない。',
  '「クリップボード」「ドライブ」は分離条件に必要な用語。「動」「かし」等は「動かし」の分割結果で，本文を不自然に分断していない。',
  '「取り入れる」「知らせ」は通常の動詞。問いを考え方の説明に統一し，四択を状態・方法・手法・考え方の説明として比較する。ゼロデイと振る舞い検知に不自然な「だけ」「全て」の方針を加えていない。',
  '「要件」「本番」「開発者」「限定」はテスト範囲・環境・実施者の対比に使う。短い原問より長いのは受注・出荷の範囲を明示したため。',
  '「窓口」は共通受付が欠陥なのではないと区別するために必要。未収載の漢字「窓」を残す。',
  '「メモリ」は媒体を具体化するUSBメモリの一部。刑罰の年数などの追加学習は要求しない。',
  '「分担」「負う」は最終責任と担当業務の違いを表す。役割分担の前提のため原問より長い。',
  '地域への雇用・環境改善を一般語で記述し，誰が最も得をするかという主観的な比較は避けた。',
  '「内訳」は表の見出し。「経費」は公式表の「経 費」と空白処理が異なるため，未収載になり得る。二表の空欄を埋める読解を保持。',
  '「再び」「繰り返す」「設計し直し」は継続的な改善の循環を記述する自然な表現として残す。',
  '「相談」「安定」「進め方」等は部門連携や変更の頻度の対比に必要な通常の語。未収載の「談」を残す。',
  '「取り出して」は分析対象のデータ抽出を表す通常の動詞。データベース設計の専門語は追加しない。',
  '「出典」「年度」「提示」等は定義表の帰属のために表示する。「料金」「発注」「工程」は新しい製造業の事例に用いる。「置」「換え」は「置き換え」の分割結果。',
  '「型番」「金額」「書式」「了承」は取引の具体的な一致を表す。「本物らしく」の分割片「しく」，「示されて」の「示」等は本文の誤字ではない。未収載の「普」は「普段」に含まれる。',
  '「返品」「返金」「金額」は受注ではない委託業務への変更に必要。「返」は「返金額」の分割結果。「空欄」は権限なしという表の意味を明示するために残す。',
  '「毎時」「手動」「直前」「前日」等は時刻と更新状態の比較に必要。「いたこ」「わら」等は単語分割上の断片で，本文では「開いたこと」「変わらず」と表記。普段・未更新の漢字は意味上必要なまま残す。',
  '「Escキー」「長押し」「閉じる」は安全な終了手順の説明に必要。「窓口」「連絡先」は偽画面内と社内を区別するために残す。終了方法を確認した主体は社内であると明示する。',
];
const language = questions.map((q, i) => {
  const anchor = official.find(a => a.id === expectedAnchors[i])!;
  assert.ok(anchor);
  assert.equal(q.id, `sg-generated-batch-003-${String(i + 1).padStart(3, '0')}`);
  for (const key of ['familyId', 'topic', 'subject', 'pool'] as const) assert.equal(q[key], anchor[key]);
  assert.equal(q.pool, 'study');
  assert.equal(q.subject, i < 16 ? 'A' : 'B');
  assert.equal(q.source.kind, 'generated');
  if (q.source.kind !== 'generated') throw new Error('Generated expected');
  assert.deepEqual(q.source.referenceQuestionIds, [expectedAnchors[i]]);
  assert.ok(!JSON.stringify(q.source).includes('2026-public'));
  for (const r of q.source.references) {
    assert.ok(knownIds.has(r.resourceId), `${q.id}: unregistered resource ${r.resourceId}`);
    if (!knownIds.has(r.resourceId)) missingGlobal.add(r.resourceId);
    assert.ok(r.section.length >= 10);
  }
  assert.ok(q.source.references.some(r => !r.resourceId.includes('syllabus')));
  assert.deepEqual(q.choices.map(c => c.key), [...'アイウエオカキクケコ'].slice(0, q.choices.length));
  assert.equal(new Set(q.choices.map(choiceText)).size, q.choices.length);
  assert.ok(q.choices.every(c => choiceText(c).trim().length));
  assert.ok(!official.some(a => contentText(a) === contentText(q)), `${q.id}: exact copy`);
  const review = reviews.find(r => r.questionId === q.id);
  assert.ok(review);
  assert.equal(review.status, 'draft');
  assert.deepEqual(Object.keys(review.choiceReasons).sort(), q.choices.map(c => c.key).sort());
  for (const note of [review.rule, review.variation, review.sourceReview, review.languageReview, ...Object.values(review.choiceReasons)]) {
    assert.ok(typeof note === 'string' && note.length >= 10);
  }
  review.contentHash = questionDigest(q);
  const metrics = languageMetrics(q, official);
  review.languageReview = `著者の言語点検メモ（承認ではない）。固定120公式問題での機械測定：語彙 ${(metrics.wordCoverage * 100).toFixed(2)}%，漢字 ${(metrics.kanjiCoverage * 100).toFixed(2)}%，空白除外 ${metrics.characters}字。未収載トークン：${metrics.novelWords.join('／') || 'なし'}。未収載漢字：${metrics.novelKanji.join('') || 'なし'}。${languageNotes[i]} 日本語の自然さと難易度の独立レビューは未実施。`;
  const once = length(displayedOnce(anchor));
  return {
    questionId: q.id, slot: i < 16 ? `A${i + 17}` : `B${i - 11 < 10 ? '0' : ''}${i - 11}`,
    anchorId: anchor.id, contentHash: questionDigest(q), ...metrics,
    anchorRawCharacters: length(anchor), anchorDisplayedOnceCharacters: once,
    displayedLengthRatio: metrics.characters / once,
    wordTargetMet: metrics.wordCoverage >= 0.95, kanjiTargetMet: metrics.kanjiCoverage >= 0.99,
    hardFloorsMet: metrics.wordCoverage >= 0.9 && metrics.kanjiCoverage >= 0.98 && metrics.characters >= (q.subject === 'B' ? 500 : 30),
  };
});

assert.equal(questions[11].blocks.filter(b => b.type === 'table').length, 2);
assert.equal(questions[15].blocks.filter(b => b.type === 'table').length, 1);
assert.equal(questions[16].choices.length, 10);
assert.equal(questions[17].blocks.filter(b => b.type === 'table').length, 1);
const timingPanel = questions[18].blocks.find(b => b.type === 'panel');
assert.ok(timingPanel?.type === 'panel' && timingPanel.paragraphs.length === 11);
assert.equal(questions[19].choices.length, 5);
// Recompute the authored table values and timing independently of stored answer strings.
const costTable = questions[11].blocks[1];
const incomeTable = questions[11].blocks[2];
assert.ok(costTable.type === 'table' && incomeTable.type === 'table');
const values = new Map([...costTable.rows, ...incomeTable.rows]
  .filter(r => r.length === 2 && r[1].text.trim())
  .map(r => [r[0].text, Number(r[1].text.replaceAll(',', ''))]));
const v = (name: string) => { assert.ok(values.has(name)); return values.get(name)!; };
const expense = v('材料費') + v('労務費') + v('経費');
const manufacturing = expense + v('期首仕掛品棚卸高') - v('期末仕掛品棚卸高');
const salesCost = manufacturing + v('期首製品棚卸高') - v('期末製品棚卸高');
const profit = v('売上高') - salesCost;
assert.equal(profit, Number(questions[11].choices.find(c => c.key === questions[11].answer)!.text));
const arithmetic = {
  expense, manufacturing, salesCost, profit,
  alternatives: {
    ア: v('売上高') - (expense + v('期首製品棚卸高') - v('期末製品棚卸高')),
    イ: profit, ウ: v('売上高') - manufacturing,
    エ: v('売上高') - (manufacturing - v('期首製品棚卸高') + v('期末製品棚卸高')),
  },
};
questions[11].choices.forEach(c => assert.equal(Number(c.text), arithmetic.alternatives[c.key as keyof typeof arithmetic.alternatives]));
assert.ok(10 * 60 + 8 <= 10 * 60 + 15 && 10 * 60 + 15 + 2 < 10 * 60 + 24);
assert.ok(10 * 60 < 10 * 60 + 8);
const baselineText = official.map(contentText).join(' ');
const vocabulary = new Set(words(baselineText));
const baselineKanji = new Set(baselineText.match(/\p{Script=Han}/gu) ?? []);
const text = questions.map(contentText).join(' ');
const tokens = words(text);
const kanji = text.match(/\p{Script=Han}/gu) ?? [];
const aggregate = {
  wordCoverage: tokens.filter(t => vocabulary.has(t)).length / tokens.length,
  kanjiCoverage: kanji.filter(c => baselineKanji.has(c)).length / kanji.length,
  wordTokens: tokens.length, kanjiOccurrences: kanji.length,
};
write('language-report.json', {
  baseline: 'Fixed 120 official questions, including benchmark text for language screening only; no benchmark anchors or generated text added.',
  method: 'Unmodified scripts/pilot-review.ts languageMetrics (Intl.Segmenter ja); rendered body, captions and choices. Not a grammar, proficiency, or calibrated-difficulty score.',
  minimumWordCoverage: 0.90, minimumKanjiCoverage: 0.98, wordTarget: 0.95, kanjiTarget: 0.99,
  readingLoad: 'Generated choices occur only once. Structured anchor duplicate choices removed only for displayedLengthRatio, NOT from languageMetrics baseline.',
  baselineFiles: readdirSync('data/questions/official').filter(f => f.endsWith('.json')).sort()
    .map(file => ({ file: `data/questions/official/${file}`, sha256: sha(readFileSync(`data/questions/official/${file}`)) })),
  aggregate, questions: language,
});
write('reviews.json', reviews);
// The parent owns review exports. Do not regenerate the legacy metadata-bearing
// blind packet or overwrite a solve-only packet from this local checker.
write('validation-report.json', {
  schema: 'passed', count: 20, subjectA: 16, subjectB: 4, studyOnly: true,
  exactAnchorInheritance: 'passed', resourceFilesAndHashes: 'passed', status: 'DRAFT',
  globalCatalogueIdsPending: [...missingGlobal].sort(),
  proposedResourceIdsPendingRegistration: resources.filter(r => !catalogue.some(c => c.id === r.id)).map(r => r.id),
  cataloguePolicy: 'All referenced IDs must be registered in the shared catalogue. Batch proposals must match the merged entries exactly. Shared catalogue not changed.',
  arithmetic, timing: 'Available 10:08; fetch 10:15; applied by 10:17 < open 10:24. 10:00 fetch is too early.',
  hardFloorsMet: language.every(r => r.hardFloorsMet),
  wordTargetExceptions: language.filter(r => !r.wordTargetMet).map(r => r.questionId),
  kanjiTargetExceptions: language.filter(r => !r.kanjiTargetMet).map(r => r.questionId),
  lengthReviewPrompts: language.filter(r => r.displayedLengthRatio < 0.8 || r.displayedLengthRatio > 1.2).map(r => r.questionId),
  independentReview: 'Initial reviewer records preserved. 002 and 006 revised and require fresh review; parent also requires a fresh source-blind solve of 001–004 because original-anchor annotations were exposed. No author approvals.',
    reviewExport: 'Not regenerated locally. Parent must generate the current solve-only export before fresh review; legacy blind-review.json contains source hints and stale revised content.',
  renderedDesktopMobile: 'NOT PERFORMED', published: false,
});
for (const r of language) console.log(r.questionId, `${(100*r.wordCoverage).toFixed(2)}% words`, `${(100*r.kanjiCoverage).toFixed(2)}% kanji`, r.characters, `chars; length ${r.displayedLengthRatio.toFixed(2)}x`, '\n  words:', r.novelWords.join(' / '), '\n  kanji:', r.novelKanji.join(''));
console.log('Aggregate:', aggregate, '\nPending global IDs:', [...missingGlobal].sort());
assert.ok(language.every(r => r.hardFloorsMet), 'One or more hard language/length floors failed; see language-report.json.');
console.log('Local schema, scope, provenance, structure, arithmetic and hard language floors passed. DRAFT ONLY.');
