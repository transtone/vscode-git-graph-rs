import assert from 'node:assert/strict';
import { it } from 'node:test';
import { bootView } from './webviewHarness.mjs';

async function setup() {
 const h=await bootView(5);
 h.state.remotes=['origin'];
 h.state.branches=['main','feature','remotes/origin/main'];
 h.state.history[0]={...h.state.history[0],heads:['main','feature'],remotes:[{name:'origin/main',remote:'origin'}]};
 h.dispatch({command:'refresh'});await h.pump();
 const requests=[];const post=h.window.VSCODE_API.postMessage;
 h.window.VSCODE_API.postMessage=m=>{requests.push(m);post(m)};
 const open=(local=false)=>{
  const ref=h.document.querySelector(local?'.gitRef.head[data-name="main"] .gitRefName':'.gitRefHeadRemote');
  ref.dispatchEvent(new h.window.MouseEvent('contextmenu',{bubbles:true,clientX:100,clientY:100}));
  const parent=[...h.document.querySelectorAll('.contextMenuItem[aria-haspopup]')].find(e=>e.textContent.includes('Pull'));
  assert.ok(parent);parent.click();
  assert.equal(parent.getAttribute('aria-expanded'),'true');
  assert.equal(h.document.querySelector('.dialogFormRadio'),null);
  return parent;
 };
 return {h,requests,open};
}

for(const [label,method] of [['fast-forward if possible','ff'],['fast-forward only','ff-only'],['rebase','rebase']]) {
 it('submenu directly executes '+method+' without selection or confirmation',async()=>{
  const {h,requests,open}=await setup();
  try {
   const parent=open();
   const leaf=[...parent.querySelectorAll('.contextSubmenu .contextMenuItem')].find(e=>e.textContent.includes(label));
   assert.ok(leaf);leaf.click();
   const request=requests.find(m=>m.command==='pullBranch');
   assert.ok(request);assert.equal(request.method,method);
   assert.equal(request.remote,'origin');assert.equal(request.branchName,'main');assert.equal(request.expectedBranch,'main');
   assert.equal(h.document.querySelector('.dialogFormRadio'),null);
   assert.equal(h.document.querySelector('.contextMenu'),null);
   assert.equal(requests.some(m=>m.command==='setRepoState'),false,'does not save defaults');
  } finally {h.window.close()}
 });
}
it('Fetch All is direct and does not change pull defaults',async()=>{
 const {h,requests,open}=await setup();
 try {
  const parent=open();parent.querySelector('.contextSubmenu .contextMenuItem').click();
  const fetch=requests.find(m=>m.command==='fetch');assert.ok(fetch);assert.equal(fetch.name,null);
  assert.equal(requests.some(m=>m.command==='pullBranch'||m.command==='setRepoState'),false);
 }finally{h.window.close()}
});
it('local branch uses configured upstream without choosing a source',async()=>{
 const {h,requests,open}=await setup();
 try {
  const parent=open(true);
  parent.querySelectorAll('.contextSubmenu .contextMenuItem')[1].click();
  const request=requests.find(m=>m.command==='pullBranch');assert.ok(request);
  assert.equal(request.remote,'');assert.equal(request.branchName,'');
 }finally{h.window.close()}
});
it('blocks pull during an operation but allows direct Fetch All',async()=>{
 const {h,requests,open}=await setup();
 try {
  h.state.operationState={type:'merge',conflictedFiles:['a'],progress:null};
  h.dispatch({command:'refresh'});await h.pump();
  open().querySelectorAll('.contextSubmenu .contextMenuItem')[1].click();
  assert.equal(requests.some(m=>m.command==='pullBranch'),false);
  assert.match(h.document.querySelector('.dialog').textContent,/Complete or abort/);
  open().querySelector('.contextSubmenu .contextMenuItem').click();
  assert.ok(requests.some(m=>m.command==='fetch'));
 }finally{h.window.close()}
});
it('supports submenu navigation and closing with the keyboard',async()=>{
 const {h,requests,open}=await setup();
 try {
  const parent=open();parent.focus();
  const key=value=>h.document.activeElement.dispatchEvent(new h.window.KeyboardEvent('keydown',{key:value,bubbles:true}));
  key('ArrowRight');assert.equal(h.document.activeElement.textContent,'Fetch All');
  key('ArrowDown');assert.match(h.document.activeElement.textContent,/fast-forward if possible/);
  key('ArrowLeft');assert.equal(h.document.activeElement,parent);assert.equal(parent.getAttribute('aria-expanded'),'false');
  key('ArrowRight');key('Enter');assert.ok(requests.some(m=>m.command==='fetch'));
  open();key('Escape');assert.equal(h.document.querySelector('.contextMenu'),null);
 }finally{h.window.close()}
});
