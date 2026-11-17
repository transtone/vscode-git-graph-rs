import assert from 'node:assert/strict';
import { it } from 'node:test';
import { bootView } from './webviewHarness.mjs';

it('restyles desktop details without losing full fields, email links, message or parent navigation',async()=>{
 const h=await bootView(5);
 try {
 h.window.Element.prototype.scroll=function(_x,y){this.scrollTop=y};
 const commit=h.state.history[0], parent=commit.parents[0];
 const requests=[];const post=h.window.VSCODE_API.postMessage;
 h.window.VSCODE_API.postMessage=m=>{requests.push(m);post(m)};
 h.rows()[0].querySelector('.messageCol .text').click();await h.pump();
 const details={hash:commit.hash,parents:[parent,'f'.repeat(40)],author:'Author Name',authorEmail:'author@example.com',authorDate:1700000000,committer:'Committer Name',committerEmail:'committer@example.com',committerDate:1700003600,signature:null,body:'Subject stays unchanged\n\nBody paragraph with details.\nNext line.',fileChanges:[]};
 h.dispatch({command:'commitDetails',repo:'C:\\repo',error:null,avatar:null,codeReview:null,refresh:true,commitDetails:details});
 await h.pump();
 const summary=h.document.getElementById('cdvSummary');
 assert.ok(summary.querySelector('.cdvDesktopStatus'));
 assert.ok(summary.querySelector('.cdvDesktopMessage'));
 assert.ok(summary.classList.contains('cdvHasDesktopDetails'));
 assert.ok(summary.querySelector('.cdvIdentity .cdvmAvatar'));
 assert.ok(summary.querySelector('.cdvAuthor a[href="mailto:author@example.com"]'));
 assert.ok(summary.querySelector('.cdvMeta a[href="mailto:committer@example.com"]'));
 assert.ok(summary.querySelector('.cdvMeta').title);
 assert.equal(summary.querySelector('.cdvIdentity > .cdvHashButton').dataset.copyHash,commit.hash);
 assert.equal(summary.querySelector('.cdvHashButton').textContent,commit.hash.substring(0,8));
 summary.querySelector('.cdvHashButton').click();
 assert.ok(requests.some(m=>m.command==='copyToClipboard'&&m.data===commit.hash));
 for(const text of [parent.substring(0,8),'f'.repeat(8),'Author Name','Committer Name','author@example.com','committer@example.com','Subject stays unchanged','Body paragraph with details.','Next line.']) assert.ok(summary.textContent.includes(text),text);
 assert.ok(summary.querySelector('a[href="mailto:author@example.com"]'));
 assert.ok(summary.querySelector('a[href="mailto:committer@example.com"]'));
 assert.equal(summary.querySelectorAll('.cdvStatusRule').length,2);
 const message=summary.querySelector('#cdvDesktopMessage');
 message.scrollTop=42;message.dispatchEvent(new h.window.Event('scroll'));
 h.dispatch({command:'commitDetails',repo:'C:\\repo',error:null,avatar:null,codeReview:null,refresh:true,commitDetails:details});
 await h.pump();
 assert.equal(h.document.querySelector('#cdvDesktopMessage').scrollTop,42,'message scroll position is restored on refresh');
 const parentLink=h.document.querySelector('#cdvSummary [data-type="commit"][data-value="'+parent+'"]');
 assert.ok(parentLink);
 assert.equal(h.document.querySelector('#cdvSummary [data-value="'+'f'.repeat(40)+'"]'),null,'unloaded parents remain plain text');
 parentLink.click();await h.pump();
 assert.ok(requests.some(m=>m.command==='commitDetails'&&m.commitHash===parent));
 }finally{h.window.close()}
});

it('omits a duplicate committer and keeps identity text escaped',async()=>{
 const h=await bootView(5);
 try {
 const commit=h.state.history[0];
 h.rows()[0].querySelector('.messageCol .text').click();await h.pump();
 const details={hash:commit.hash,parents:[],author:'<Author>',authorEmail:'author@example.com',authorDate:1700000000,committer:'<Author>',committerEmail:'author@example.com',committerDate:1700000000,signature:null,body:'Subject',fileChanges:[]};
 h.dispatch({command:'commitDetails',repo:'C:\\repo',error:null,avatar:null,codeReview:null,refresh:true,commitDetails:details});await h.pump();
 assert.ok(h.document.querySelector('.cdvAuthor').textContent.includes('<Author>'));
 assert.equal(h.document.querySelector('.cdvAuthor author'),null);
 assert.equal(h.document.querySelector('.cdvMeta a'),null);
 assert.ok(h.document.querySelector('.cdvDesktopStatus .cdvmAvatar'));
 }finally{h.window.close()}
});
