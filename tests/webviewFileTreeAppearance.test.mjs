import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bootView } from './webviewHarness.mjs';

test('file tree shows status, descendant counts and folder glyphs while remaining interactive', async () => {
	const h = await bootView(5);
	try {
		const commit = h.state.history[0];
		h.rows()[0].querySelector('.messageCol .text').click();
		await h.pump();
		const changes = [
			{ oldFilePath:'src/a.ts', newFilePath:'src/a.ts', type:'M', additions:3, deletions:1 },
			{ oldFilePath:'src/nested/b.ts', newFilePath:'src/nested/b.ts', type:'A', additions:4, deletions:0 }
		];
		const details = { hash:commit.hash, parents:[], author:'Author', authorEmail:'author@example.com', authorDate:1700000000, committer:'Author', committerEmail:'author@example.com', committerDate:1700000000, signature:null, body:'Subject', fileChanges:changes };
		h.dispatch({command:'commitDetails',repo:'C:\\repo',error:null,avatar:null,codeReview:null,refresh:true,commitDetails:details});
		await h.pump();
		const files = h.document.querySelector('#cdvFiles');
		assert.equal(files.querySelector('.fileTreeFolderCount').textContent, '2');
		assert.deepEqual([...files.querySelectorAll('.fileTreeStatus')].map(e => e.textContent).sort(), ['A', 'M']);
		assert.match(files.querySelector('.fileTreeFileRecord[data-index="0"] .fileTreeFileAddDel').textContent, /\+3/);
		assert.match(files.querySelector('.fileTreeFileRecord[data-index="1"] .fileTreeFileAddDel').textContent, /\+4/);
		assert.equal(files.querySelector('.fileTreeFileRecord[data-index="1"]').style.getPropertyValue('--file-tree-depth'), '2');
		assert.ok(files.querySelector('.fileTreeFolderIcon .fileTreeChevron'));
		assert.ok(files.querySelector('.fileTreeFolderIcon .fileTreeFolderGlyph'));
		files.querySelector('.fileTreeFolder').click();
		assert.ok(files.querySelector('.fileTreeFolderContents.hidden'));
		h.document.getElementById('cdvFileViewTypeList').click();
		assert.equal(files.querySelector('.fileTreeFolder'), null);
		assert.equal(files.querySelectorAll('.fileTreeStatus').length, 2);
		assert.ok(files.textContent.includes('src/nested/b.ts'));
	} finally { h.window.close(); }
});