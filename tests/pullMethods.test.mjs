import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Module } from 'node:module';
import { after, before, beforeEach, afterEach, describe, it } from 'node:test';

const originalLoad = Module._load;
Module._load = function (request) {
	if (request === 'vscode') return {
		Uri: { file: (p) => ({ fsPath: p, path: p }) }, env: { language: 'en' },
		ViewColumn: { Active: 1, Beside: 2, One: 1, Two: 2 },
		window: { showWarningMessage: async () => undefined, showErrorMessage: async () => undefined },
		workspace: { getConfiguration: () => ({ get: (_key, value) => value, has: () => false, inspect: () => undefined, update: async () => {} }) }
	};
	return originalLoad.apply(this, arguments);
};
const { DataSource } = await import('../out/dataSource.js');

function git(cwd, ...args) {
	return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_MERGE_AUTOEDIT: 'no' } }).trim();
}

describe('explicit pull methods', () => {
	let ds, dir, bare, local, other;
	before(() => { ds = new DataSource({ path: 'git', version: '2.45.0' }, () => ({ dispose() {} }), () => ({ dispose() {} }), { log() {}, logCmd() {} }); });
	after(() => ds.dispose());
	beforeEach(() => {
		dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gg-pull-'));
		bare = path.join(dir, 'remote.git'); local = path.join(dir, 'local'); other = path.join(dir, 'other');
		git(dir, 'init', '--bare', '--initial-branch=main', bare);
		git(dir, 'clone', bare, local);
		git(local, 'config', 'user.name', 'Test'); git(local, 'config', 'user.email', 'test@example.com');
		fs.writeFileSync(path.join(local, 'base'), 'base'); git(local, 'add', '.'); git(local, 'commit', '-m', 'base'); git(local, 'push', '-u', 'origin', 'main');
		git(dir, 'clone', bare, other);
		git(other, 'config', 'user.name', 'Test'); git(other, 'config', 'user.email', 'test@example.com');
	});
	afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));
	function commit(repo, name) { fs.writeFileSync(path.join(repo, name), name); git(repo, 'add', name); git(repo, 'commit', '-m', name); }
	function remoteAdvance() { commit(other, 'remote'); git(other, 'push'); }
	function pull(method, branch = 'main', remote = 'origin', expected = 'main') { return ds.pullBranch(local, branch, remote, false, false, method, expected); }

	it('fast-forwards despite conflicting pull config', async () => {
		remoteAdvance(); git(local, 'config', 'pull.rebase', 'true'); git(local, 'config', 'pull.ff', 'only');
		assert.equal(await pull('ff'), null); assert.equal(git(local, 'rev-parse', 'HEAD'), git(other, 'rev-parse', 'HEAD'));
	});
	it('ff-only refuses divergence without moving HEAD', async () => {
		commit(local, 'local'); const head = git(local, 'rev-parse', 'HEAD'); remoteAdvance();
		assert.notEqual(await pull('ff-only'), null); assert.equal(git(local, 'rev-parse', 'HEAD'), head);
	});
	it('ff merges divergence despite rebase and ff-only config', async () => {
		commit(local, 'local'); remoteAdvance(); git(local, 'config', 'pull.rebase', 'true'); git(local, 'config', 'pull.ff', 'only');
		assert.equal(await pull('ff'), null); assert.equal(git(local, 'rev-list', '--parents', '-n', '1', 'HEAD').split(' ').length, 3);
	});
	it('rebases divergence despite ff-only config', async () => {
		commit(local, 'local'); remoteAdvance(); git(local, 'config', 'pull.rebase', 'false'); git(local, 'config', 'pull.ff', 'only');
		assert.equal(await pull('rebase'), null); assert.equal(git(local, 'rev-parse', 'HEAD^'), git(other, 'rev-parse', 'HEAD'));
	});
	it('uses the configured upstream even when its branch name differs', async () => {
		git(local, 'checkout', '-b', 'different'); git(local, 'branch', '--set-upstream-to=origin/main'); remoteAdvance();
		assert.equal(await pull('ff', '', '', 'different'), null); assert.equal(git(local, 'rev-parse', 'HEAD'), git(other, 'rev-parse', 'HEAD'));
	});
	it('rejects invalid arguments, missing upstream, mismatch, detached HEAD and ongoing operations', async () => {
		assert.match(await pull('invalid'), /invalid/i);
		assert.match(await ds.pullBranch(local, 'main', '', false, false, 'ff'), /both/i);
		assert.match(await ds.pullBranch(local, 'main', 'origin', true, false, 'ff'), /cannot be combined/i);
		assert.match(await pull('ff', 'main', 'origin', 'wrong'), /expected branch/i);
		git(local, 'checkout', '-b', 'no-upstream'); assert.match(await pull('ff', '', '', 'no-upstream'), /upstream/i);
		git(local, 'checkout', '--detach'); assert.match(await pull('ff'), /detached/i);
		git(local, 'checkout', 'main'); fs.writeFileSync(path.join(local, '.git', 'MERGE_HEAD'), git(local, 'rev-parse', 'HEAD'));
		assert.match(await pull('ff'), /operation.*progress/i);
	});
	it('does not autostash dirty work despite configuration', async () => {
		remoteAdvance(); fs.writeFileSync(path.join(local, 'remote'), 'untracked');
		git(local, 'config', 'pull.autostash', 'true'); git(local, 'config', 'merge.autoStash', 'true'); git(local, 'config', 'rebase.autoStash', 'true');
		assert.notEqual(await pull('rebase'), null); assert.equal(git(local, 'stash', 'list'), ''); assert.equal(fs.readFileSync(path.join(local, 'remote'), 'utf8'), 'untracked');
	});
});
