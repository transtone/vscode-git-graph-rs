import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { it } from 'node:test';

it('uses Angkor relative-date boundaries while retaining the full timestamp tooltip', () => {
 const source = fs.readFileSync(new URL('../web/utils.ts', import.meta.url), 'utf8');
 const start = source.indexOf('function formatShortDate(');
 const end = source.indexOf('\n/**', start);
 const now = 1800000000000;
 let language = 'en';
 const context = vm.createContext({ Date: class extends Date { static now() { return now; } }, initialState: { config: { dateFormat: { type: 2, iso: false } } }, GG: { DateFormatType: { DateAndTime: 0, DateOnly: 1 } }, getInterfaceLanguage: () => language, MONTHS: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], pad2: n => String(n).padStart(2,'0') });
 vm.runInContext(ts.transpile(source.slice(start,end)), context);
 const format = secondsAgo => context.formatShortDate(now / 1000 - secondsAgo);
 for (const [age, text] of [[-60,'just now'],[59,'just now'],[60,'1 minute ago'],[3599,'59 minutes ago'],[3600,'1 hour ago'],[86400*29,'29 days ago'],[86400*30,'1 month ago'],[86400*365,'1 year ago']]) assert.equal(format(age).formatted,text);
 assert.match(format(86400).title,/\d{2}:\d{2}:\d{2}/);
 language='zh-cn';
 assert.equal(format(20).formatted,'刚刚');
 assert.equal(format(86400*12).formatted,'12 天前');
});
