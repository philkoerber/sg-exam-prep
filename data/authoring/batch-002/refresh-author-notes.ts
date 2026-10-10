import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { questionSchema } from '../../../src/lib/corpus/schema';
import { readQuestions } from '../../../scripts/corpus-files';
import { languageMetrics, questionDigest } from '../../../scripts/pilot-review';

const dir = 'data/authoring/batch-002';
const read = (file: string) => JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'));
const questions = questionSchema.array().parse(read('questions.json'));
const reviews = read('reviews.json');
const official = readQuestions('data/questions/official');
assert.equal(official.length, 120);
assert.equal(questions.length, 20);
assert.equal(reviews.length, 20);
for (const q of questions) {
  const r = reviews.find((r: {questionId: string}) => r.questionId === q.id);
  assert.equal(r.status, 'draft');
  const note = r.languageReview.split(' 作者による改訂記録')[0];
  const m = languageMetrics(q, official);
  r.languageReview = `${note} 作者による改訂記録であり，母語話者・専門家の承認ではない。初回独立レビューは旧版に対する記録で，改訂版の独立再レビューは未実施。 機械検査：固定120公式問のみを母集団とする既存languageMetricsで，本文・選択肢${m.characters}字，語彙一致率${(100*m.wordCoverage).toFixed(2)}%，漢字一致率${(100*m.kanjiCoverage).toFixed(2)}%。新出漢字：${m.novelKanji.join('') || 'なし'}。新出語の全件はlanguage-report.jsonに記録。`;
  if (q.id.endsWith('-011')) r.languageReview += ' 真正の“真”は第3条の法的効果の正確さを優先して保持し，99%目標未達を明記する（98%下限は満たす）。';
  r.contentHash = questionDigest(q);
}
writeFileSync(`${dir}/reviews.json`, JSON.stringify(reviews, null, 2) + '\n');
console.log('Refreshed current author hashes and language screening notes only; no question or reviewer file changed, all statuses remain draft.');
