import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bootView } from './webviewHarness.mjs';

test('right-clicking the remote icon uses the remote ref and mounts the menu above the graph', async () => {
	const h = await bootView(5);
	try {
		const row = h.rows()[0];
		const ref = row.querySelector('.gitRef.head');
		ref.insertAdjacentHTML('beforeend', '<span class="gitRefHeadRemote" data-remote="origin" data-fullref="origin/main"><svg><path></path></svg>origin</span>');
		ref.querySelector('.gitRefHeadRemote path').dispatchEvent(new h.window.MouseEvent('contextmenu', {
			bubbles: true, cancelable: true, clientX: 200, clientY: 150
		}));
		const menu = h.document.querySelector('.contextMenu');
		assert.ok(menu);
		assert.equal(menu.parentElement, h.document.body);
		assert.match(menu.textContent, /origin\/main/);
		assert.ok(!menu.textContent.includes('Rename Branch'));
	} finally { h.window.close(); }
});