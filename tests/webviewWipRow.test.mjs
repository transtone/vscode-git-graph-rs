import assert from 'node:assert/strict';
import { it } from 'node:test';
import { bootView } from './webviewHarness.mjs';

it('shows working-tree counts in WIP and opens conflicts only on demand', async () => {
 const h=await bootView(5);
 try {
  h.state.uncommitted=8;
  h.state.workingTree={total:8,staged:3,modified:4,conflicts:1};
  h.state.operationState={type:'merge',conflictedFiles:['README.md'],progress:null};
  const refresh=async()=>{h.dispatch({command:'refresh'});await h.pump()};
  await refresh();
  const row=h.document.getElementById('uncommittedChanges');
  assert.ok(row.querySelector('.wipLabel'));
  assert.equal(row.querySelector('.wipStaged').textContent,'3 staged');
  assert.equal(row.querySelector('.wipModified').textContent,'4 modified');
  assert.equal(row.querySelector('.wipConflicts').textContent,'1 conflicts');
  const banner=h.document.getElementById('conflictBanner');
  assert.equal(banner.style.display,'none');
  row.querySelector('.wipConflicts').click();
  assert.equal(banner.style.display,'flex');
  assert.match(banner.textContent,/README.md/);
  assert.ok(banner.querySelector('#conflictBannerContinueBtn'));
  assert.equal(h.document.getElementById('cdv'),null,'conflict click does not open changes');
  await refresh();
  assert.equal(banner.style.display,'flex','refresh keeps explicit expansion');
  h.document.querySelector('.wipConflicts').click();
  assert.equal(banner.style.display,'none');
  const requests=[];
  const postMessage=h.window.VSCODE_API.postMessage;
  h.window.VSCODE_API.postMessage=message=>{requests.push(message);postMessage(message)};
  const openChanges=h.document.querySelector('.wipViewChanges');
  assert.equal(openChanges.textContent,'Open Changes');
  openChanges.click();
  await h.pump();
  const request=requests.find(message=>message.command==='openCompareTab');
  assert.ok(request,'opens the same comparison tab as the commit Open Changes action');
  assert.equal(request.fromHash,h.state.head);
  assert.equal(request.toHash,'*');
  assert.equal(h.document.getElementById('cdv'),null,'does not toggle inline details');
  h.state.operationState={type:null,conflictedFiles:[],progress:null};
  h.state.workingTree={total:8,staged:4,modified:4,conflicts:0};
  await refresh();
  assert.equal(banner.style.display,'none');
  assert.equal(h.document.querySelector('.wipConflicts'),null);
 } finally {h.window.close()}
});
