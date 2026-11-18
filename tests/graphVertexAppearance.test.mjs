import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

function setup(parents, avatar = null) {
	const dom = new JSDOM('<!doctype html><svg></svg>', { runScripts: 'outside-only' });
	const source = fs.readFileSync('web/graph.ts', 'utf8');
	const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
	dom.window.eval('const SVG_NAMESPACE = "http://www.w3.org/2000/svg";\n' + js + '\nwindow.graphTest = { Vertex, Branch, Graph };');
	const { Vertex, Branch, Graph } = dom.window.graphTest;
	const vertex = new Vertex(0, false);
	vertex.addToBranch(new Branch(0), 0);
	const svg = dom.window.document.querySelector('svg');
	vertex.draw(svg, { colours: ['#ff8800'], grid: { x: 20, y: 24, offsetX: 10, offsetY: 12 } }, 0,
		{ email: 'a@example.com', author: 'Alice', parents }, avatar);
	return { dom, svg, Graph };
}

test('merge commits show only a small solid dot even when an avatar exists', () => {
	const { svg } = setup(['parent-a', 'parent-b'], 'data:image/png;base64,AA==');
	const node = svg.querySelector('circle[data-id="0"]');
	assert.equal(node.getAttribute('r'), '4');
	assert.equal(node.getAttribute('fill'), '#ff8800');
	assert.equal(svg.querySelector('image'), null);
	assert.equal(svg.querySelector('text'), null);
});

test('ordinary commits show a blank circle, then accept an asynchronously loaded avatar', () => {
	const { dom, svg, Graph } = setup(['parent']);
	const ring = svg.querySelector('circle[data-id="0"]');
	assert.equal(ring.getAttribute('r'), '9');
	assert.equal(svg.querySelector('circle:not([data-id])').getAttribute('fill'), 'var(--vscode-editor-background)');
	assert.equal(svg.querySelector('text'), null);
	assert.equal(svg.querySelector('image').getAttribute('href'), null);
	const graph = Object.create(Graph.prototype);
	graph.group = svg;
	graph.avatarProvider = () => 'data:image/png;base64,AA==';
	graph.loadAvatar('a@example.com', 'data:image/png;base64,AA==');
	const image = svg.querySelector('image');
	assert.equal(image.getAttribute('href'), 'data:image/png;base64,AA==');
	image.dispatchEvent(new dom.window.Event('error'));
	assert.equal(image.getAttribute('href'), null);
	assert.equal(svg.querySelector('circle[data-id="0"]'), ring);
});

test('ordinary commits with cached avatars render the avatar inside the circle', () => {
	const { svg } = setup(['parent'], 'data:image/png;base64,AA==');
	assert.equal(svg.querySelector('circle[data-id="0"]').getAttribute('r'), '9');
	assert.equal(svg.querySelector('image').getAttribute('href'), 'data:image/png;base64,AA==');
	assert.equal(svg.querySelector('text'), null);
});