import assert from 'node:assert/strict';
import { it } from 'node:test';
import { bootView } from './webviewHarness.mjs';

it('keeps the automatic graph column fixed across scrolling and changing branch counts', async () => {
 const h=await bootView(300);
 try {
  const width=()=>h.document.getElementById('commitTable').style.getPropertyValue('--limitGraphWidth');
  assert.equal(width(),'120px');
  await h.scrollTo(160);
  assert.equal(width(),'120px');
  for(let i=0;i<20;i++) h.state.history[i].parents=[h.state.history[i+1].hash,h.state.history[i+30].hash];
  h.dispatch({command:'refresh'}); await h.pump();
  assert.equal(width(),'120px');
  await h.scrollTo(0);
  assert.equal(width(),'120px');
 } finally {h.window.close()}
});
