import assert from 'node:assert/strict';
import { it } from 'node:test';
import { bootView } from './webviewHarness.mjs';

it('resizes and remembers the refs column without freezing the automatic graph layout', async () => {
 const h = await bootView(5);
 try {
  const table = h.document.getElementById('commitTable');
  assert.equal(table.style.getPropertyValue('--refs-column-width'), '150px');
  const handle = h.rows()[0].querySelector('.refsCol .resizeCol.right');
  assert.ok(handle);
  handle.dispatchEvent(new h.window.MouseEvent('mousedown', { bubbles:true, clientX:150 }));
  const overlay = h.document.querySelector('.colResize');
  overlay.dispatchEvent(new h.window.MouseEvent('mousemove', { bubbles:true, clientX:220 }));
  overlay.dispatchEvent(new h.window.MouseEvent('mouseup', { bubbles:true, clientX:220 }));
  assert.equal(table.style.getPropertyValue('--refs-column-width'), '220px');
  assert.ok(table.classList.contains('autoLayout'));
  assert.equal(Object.values(h.window.initialState.repos)[0].columnWidths[4], 220);
  h.document.getElementById('refreshBtn').click();
  await h.pump();
  assert.equal(table.style.getPropertyValue('--refs-column-width'), '220px');
  assert.equal(h.rows()[0].querySelectorAll('.refsCol .resizeCol.right').length, 1);
 } finally { h.window.close(); }
});

it('renders a hover expansion for a single ref without a +N indicator', async () => {
 const h = await bootView(5);
 try {
  const group = h.rows()[0].querySelector('.refsGroup');
  assert.ok(group.querySelector(':scope > .gitRef'));
  assert.equal(group.querySelector('.gitRef').firstElementChild.className, 'gitRefName');
  assert.equal(group.querySelector('.gitRef').lastElementChild.tagName.toLowerCase(), 'svg');
  assert.equal(group.querySelector('.refsOverflow'), null);
  assert.equal(group.querySelectorAll('.refsMore > .gitRef').length, 1);
  assert.equal(group.querySelector('.refsMore > .gitRef').dataset.name, 'main');
  const line = h.document.querySelector('.refConnector[data-commit-id="0"]');
  const vertex = h.document.querySelector('#commitGraph circle[data-id="0"]');
  assert.ok(line, 'a labeled commit is connected to its graph node');
  assert.equal(line.getAttribute('x2'), vertex.getAttribute('cx'));
  assert.equal(line.getAttribute('y1'), vertex.getAttribute('cy'));
  assert.equal(line.getAttribute('y2'), vertex.getAttribute('cy'));
  assert.equal(h.document.querySelectorAll('.refConnector').length, 1, 'unlabeled commits have no connector');
 } finally { h.window.close(); }
});

it('keeps references in their own column, uses graph avatar rings and forces relative table dates', async () => {
 const h=await bootView(5);
 try {
  h.state.history[0].heads=['main','feature/test','release','hotfix'];
  h.state.history[0].tags=[{name:'v0.1.0',annotated:false}];
  h.document.getElementById('refreshBtn').dispatchEvent(new h.window.MouseEvent('click',{bubbles:true})); await h.pump();
  const headers=[...h.document.querySelectorAll('#tableColHeaders th')].map(e=>e.textContent);
  assert.deepEqual(headers,['Branches / Tags','Graph','Message','Date']);
  assert.equal(h.document.getElementById('tableColHeaders').getAttribute('aria-hidden'),'true');
  const row=h.rows()[0];
  assert.ok(row.querySelector('.refsCol .gitRef.head'));
  assert.equal(row.querySelector('.messageCol .gitRef'),null);
  assert.deepEqual([...row.cells].map(cell=>cell.className),['refsCol','graphCol','messageCol','dateCol text']);
  assert.equal(row.querySelector('.authorCol'),null);
  assert.equal(row.querySelector('.hashCol'),null);
  assert.equal(row.querySelector('.refsOverflow').textContent,'+4');
  assert.equal(row.querySelectorAll('.refsMore > .gitRef').length,5);
  assert.ok(row.querySelector('.refsMore .gitRef.tag'));
  assert.equal(h.document.querySelectorAll('.refConnector').length,1, 'multiple refs on one commit share its connector');
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
