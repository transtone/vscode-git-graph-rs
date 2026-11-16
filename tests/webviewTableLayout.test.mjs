import assert from 'node:assert/strict';
import { it } from 'node:test';
import { bootView } from './webviewHarness.mjs';

it('keeps references inline, uses graph avatar fallbacks and forces relative table dates', async () => {
 const h=await bootView(5);
 try {
  h.state.history[0].heads=['main','feature/test','release','hotfix'];
  h.state.history[0].tags=[{name:'v0.1.0',annotated:false}];
  h.document.getElementById('refreshBtn').dispatchEvent(new h.window.MouseEvent('click',{bubbles:true})); await h.pump();
  const headers=[...h.document.querySelectorAll('#tableColHeaders th')].map(e=>e.textContent);
  assert.deepEqual(headers,['Graph','Message','Author','Hash','Date']);
  const row=h.rows()[0];
  assert.ok(row.querySelector('.messageCol .gitRef.head'));
  assert.equal(row.querySelector('.refsCol'),null);
  assert.equal(row.querySelector('.authorCol .avatar'),null);
  assert.equal(row.querySelector('.refsOverflow summary').textContent,'+2');
  assert.ok(row.querySelector('.refsMore .gitRef.tag'));
  assert.equal(h.document.querySelectorAll('#commitGraph .graphAvatarRing').length,5);
  assert.equal(h.document.querySelectorAll('#commitGraph image[data-email]').length,5);
  assert.equal(h.document.querySelector('#commitGraph linearGradient[id^="graph-tail"]'),null);
  assert.equal(h.window.initialState.config.graph.colours.length,10);
  const config=JSON.parse(JSON.stringify(h.window.initialState.config));
  config.dateFormat={type:0,iso:false};
  h.dispatch({command:'configChanged',config}); await h.pump();
  assert.match(h.rows()[0].querySelector('.dateCol').textContent,/ago|just now/);
  assert.match(h.rows()[0].querySelector('.dateCol').title,/\d{2}:\d{2}/);
 } finally {h.window.close()}
});
