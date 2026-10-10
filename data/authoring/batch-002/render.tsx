import React from 'react';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { questionSchema } from '../../../src/lib/corpus/schema';
import { QuestionView } from '../../../src/components/question-view';
import { LanguageProvider } from '../../../src/components/language';

const dir='data/authoring/batch-002';
const questions=questionSchema.array().parse(JSON.parse(readFileSync(`${dir}/questions.json`,'utf8')));
const html=questions.map(q=>renderToStaticMarkup(<LanguageProvider><h1>{q.id} — DRAFT</h1><QuestionView question={q}/></LanguageProvider>)).join('\n');
assert.ok(html.includes('ドアP'));
assert.ok(html.includes('評価根拠'));
assert.equal((html.match(/data-question-id=/g)??[]).length,20);
assert.equal((html.match(/<svg class="question-diagram"/g)??[]).length,1);
assert.equal((html.match(/<table /g)??[]).length,7);
assert.equal((html.match(/type="radio"/g)??[]).length,98);
writeFileSync(`${dir}/preview.html`, '<!doctype html><html lang="ja"><meta charset="utf-8"><title>batch-002 author preview — DRAFT</title><style>body{font:16px/1.8 sans-serif;max-width:860px;margin:2rem auto;padding:1rem;color:#111;background:white}table{border-collapse:collapse;width:100%;margin:1rem 0}td,th{border:1px solid #555;padding:.5rem;overflow-wrap:anywhere}caption{font-weight:bold}svg.question-diagram{width:100%;max-width:800px;min-width:560px}p{margin:.7rem 0}.question-panel{border:1px solid #999;padding:1rem;margin:1rem 0}.choice{display:inline-block;margin:.3rem;padding:.2rem .6rem}.choice-key{margin:0 .4rem}.question-scroll{overflow:auto}article{border-bottom:2px solid #555;padding-bottom:2rem;margin-bottom:3rem}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden}</style>'+html+'</html>');
console.log('PASS: actual QuestionView SSR for 20 drafts; 1 native SVG, 7 tables, 98 radio choices. Wrote local author preview only.');
