/* Constants */
// VS Code allows acquireVsCodeApi() to be called only once per webview; the automation shim
// (inlined into the page before this bundle) posts its results through the shared
// window.__ggVscodeApi handle instead of acquiring its own. Whichever of the two acquires
// first publishes the instance there, so the other can never hit the once-only guard.
const VSCODE_API = window.__ggVscodeApi ?? acquireVsCodeApi();
window.__ggVscodeApi = VSCODE_API;

// Lucide icons match the approved target/icon-preview.html mapping. See licenses/LICENSE_LUCIDE.
const SVG_ICONS = {
	monitor: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-monitor\" aria-hidden=\"true\"><rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\"></rect><line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\"></line><line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\"></line></svg>",
	cloud: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-cloud\" aria-hidden=\"true\"><path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"></path></svg>",
	ellipsis: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-ellipsis\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle></svg>",
	person: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-user-round\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"8\" r=\"5\"></circle><path d=\"M20 21a8 8 0 0 0-16 0\"></path></svg>",
	alert: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-triangle-alert\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"></path><path d=\"M12 9v4\"></path><path d=\"M12 17h.01\"></path></svg>",
	branch: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-git-branch\" aria-hidden=\"true\" focusable=\"false\"><line x1=\"6\" x2=\"6\" y1=\"3\" y2=\"15\"></line><circle cx=\"18\" cy=\"6\" r=\"3\"></circle><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><path d=\"M18 9a9 9 0 0 1-9 9\"></path></svg>",
	check: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M20 6 9 17l-5-5\"></path></svg>",
	commit: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-git-commit-horizontal\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"3\"></circle><line x1=\"3\" x2=\"9\" y1=\"12\" y2=\"12\"></line><line x1=\"15\" x2=\"21\" y1=\"12\" y2=\"12\"></line></svg>",
	copy: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-copy\" aria-hidden=\"true\" focusable=\"false\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path></svg>",
	current: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-locate-fixed" aria-hidden="true" focusable="false"><line x1="2" x2="5" y1="12" y2="12"></line><line x1="19" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="5"></line><line x1="12" x2="12" y1="19" y2="22"></line><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="3"></circle></svg>',
	download: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-cloud-download\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 13v8l-4-4\"></path><path d=\"m12 21 4-4\"></path><path d=\"M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284\"></path></svg>",
	eyeOpen: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-eye\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle></svg>",
	filter: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-filter\" aria-hidden=\"true\" focusable=\"false\"><polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\"></polygon></svg>",
	eyeClosed: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-eye-off\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"></path><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"></path><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"></path><path d=\"m2 2 20 20\"></path></svg>",
	gear: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle></svg>",
	graph: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chart-column\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 3v16a2 2 0 0 0 2 2h16\"></path><path d=\"M18 17V9\"></path><path d=\"M13 17V5\"></path><path d=\"M8 17v-3\"></path></svg>",
	info: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-info\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path></svg>",
	openFile: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-code\" aria-hidden=\"true\" focusable=\"false\"><polyline points=\"16 18 22 12 16 6\"></polyline><polyline points=\"8 6 2 12 8 18\"></polyline></svg>",
	package: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M1 4.27v7.47c0 .45.3.84.75.97l6.5 1.73c.16.05.34.05.5 0l6.5-1.73c.45-.13.75-.52.75-.97V4.27c0-.45-.3-.84-.75-.97l-6.5-1.74a1.4 1.4 0 0 0-.5 0L1.75 3.3c-.45.13-.75.52-.75.97zm7 9.09l-6-1.59V5l6 1.61v6.75zM2 4l2.5-.67L11 5.06l-2.5.67L2 4zm13 7.77l-6 1.59V6.61l2-.55V8.5l2-.53V5.53L15 5v6.77zm-2-7.24L6.5 2.8l2-.53L15 4l-2 .53z\"/></svg>",
	pencil: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-pencil\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"></path><path d=\"m15 5 4 4\"></path></svg>",
	search: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-search\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path></svg>",
	stash: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-archive\" aria-hidden=\"true\" focusable=\"false\"><rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\"></rect><path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8\"></path><path d=\"M10 12h4\"></path></svg>",
	tag: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-tag\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\"></path><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"></circle></svg>",
	terminal: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-square-terminal\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m7 11 2-2-2-2\"></path><path d=\"M11 13h4\"></path><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"></rect></svg>",
	trash: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-trash2\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 6h18\"></path><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"></path><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"></path><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\"></line><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\"></line></svg>",
	loading: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-loader-circle\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M21 12a9 9 0 1 1-6.219-8.56\"></path></svg>",
	refresh: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-refresh-cw\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path></svg>",
	openFolder: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-square-minus openFolderIcon\" aria-hidden=\"true\" focusable=\"false\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M8 12h8\"></path></svg>",
	closedFolder: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-square-plus closedFolderIcon\" aria-hidden=\"true\" focusable=\"false\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M12 8v8\"></path><path d=\"M8 12h8\"></path></svg>",

	arrowDown: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-down\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m6 9 6 6 6-6\"></path></svg>",
	arrowUp: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-up\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m18 15-6-6-6 6\"></path></svg>",
	cdv: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-panel-bottom-open\" aria-hidden=\"true\" focusable=\"false\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M3 15h18\"></path><path d=\"m9 10 3-3 3 3\"></path></svg>",
	close: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-x\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path></svg>",
	failed: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-circle-x\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m15 9-6 6\"></path><path d=\"m9 9 6 6\"></path></svg>",
	fileList: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-list\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 12h.01\"></path><path d=\"M3 18h.01\"></path><path d=\"M3 6h.01\"></path><path d=\"M8 12h13\"></path><path d=\"M8 18h13\"></path><path d=\"M8 6h13\"></path></svg>",
	fileTree: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-folder-tree\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z\"></path><path d=\"M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z\"></path><path d=\"M3 5a2 2 0 0 0 2 2h3\"></path><path d=\"M3 3v13a2 2 0 0 0 2 2h3\"></path></svg>",
	inconclusive: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-circle-help\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path><path d=\"M12 17h.01\"></path></svg>",
	linkExternal: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M15 3h6v6\"></path><path d=\"M10 14 21 3\"></path><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path></svg>",
	passed: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-circle-check\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m9 12 2 2 4-4\"></path></svg>",
	plus: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-plus\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path></svg>",
	pullRequest: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-git-pull-request\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"18\" cy=\"18\" r=\"3\"></circle><circle cx=\"6\" cy=\"6\" r=\"3\"></circle><path d=\"M13 6h3a2 2 0 0 1 2 2v7\"></path><line x1=\"6\" x2=\"6\" y1=\"9\" y2=\"21\"></line></svg>",
	review: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-search-check\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m8 11 2 2 4-4\"></path><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path></svg>",
	chevronDown: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-down\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m6 9 6 6 6-6\"></path></svg>",
	collapseAll: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevrons-down-up\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m7 20 5-5 5 5\"></path><path d=\"m7 4 5 5 5-5\"></path></svg>",
	expandAll: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevrons-up-down\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m7 15 5 5 5-5\"></path><path d=\"m7 9 5-5 5 5\"></path></svg>",
	openChanges: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-diff" aria-hidden="true" focusable="false"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M9 10h6"/><path d="M12 13V7"/><path d="M9 17h6"/></svg>'
};

/**
 * Get the localised display name of a Git file change type (A/M/D/R/U), as shown in file tooltips.
 * @param type The Git file change type code.
 * @returns The localised name.
 */
function getGitFileChangeTypeName(type: string): string {
	switch (type) {
		case 'A': return strings.changeTypeAdded;
		case 'M': return strings.changeTypeModified;
		case 'D': return strings.changeTypeDeleted;
		case 'R': return strings.changeTypeRenamed;
		case 'U': return strings.changeTypeUntracked;
		default: return type;
	}
}

/**
 * Get the localised description of a commit signature status, as shown in signature tooltips.
 * @param status The signature status code (G/U/X/Y/R/E/B).
 * @returns The localised description.
 */
function getGitSignatureStatusDescription(status: string): string {
	switch (status) {
		case 'G': return strings.signatureStatusValid;
		case 'U': return strings.signatureStatusUnknownValidity;
		case 'X': return strings.signatureStatusExpired;
		case 'Y': return strings.signatureStatusExpiredKey;
		case 'R': return strings.signatureStatusRevokedKey;
		case 'E': return strings.signatureStatusCouldNotBeChecked;
		case 'B': return strings.signatureStatusBad;
		default: return status;
	}
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REF_INVALID_REGEX = /^[-\/].*|[\\" ><~^:?*[]|\.\.|\/\/|\/\.|@{|[.\/]$|\.lock$|^@$/g;

const HTML_ESCAPES: { [key: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#x27;', '/': '&#x2F;' };
const HTML_UNESCAPES: { [key: string]: string } = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': '\'', '&#x2F;': '/' };
const HTML_ESCAPER_REGEX = /[&<>"'\/]/g;
const HTML_UNESCAPER_REGEX = /&lt;|&gt;|&amp;|&quot;|&#x27;|&#x2F;/g;

const ELLIPSIS = '&#8230;';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const UNCOMMITTED = '*';
const SHOW_ALL_BRANCHES = '';

const COLUMN_HIDDEN = -100;
const COLUMN_AUTO = -101;

const COLUMN_MIN_WIDTH = 40;
const COLUMN_LEFT_RIGHT_PADDING = 24;

const CLASS_ACTIVE = 'active';
const CLASS_BRANCH_LABELS_ALIGNED_TO_GRAPH = 'branchLabelsAlignedToGraph';
const CLASS_COMMIT_DETAILS_OPEN = 'commitDetailsOpen';
const CLASS_DISABLED = 'disabled';
const CLASS_ENABLED = 'enabled';
const CLASS_FETCH_SUPPORTED = 'fetchSupported';
const CLASS_FOCUSSED = 'focussed';
const CLASS_LOADING = 'loading';
const CLASS_MOBILE_MODE = 'mobileMode';
const CLASS_PENDING_REVIEW = 'pendingReview';
const CLASS_REFRESHING = 'refreshing';
const CLASS_REF_HEAD = 'head';
const CLASS_REF_REMOTE = 'remote';
const CLASS_REF_STASH = 'stash';
const CLASS_REF_TAG = 'tag';
const CLASS_SELECTED = 'selected';
const CLASS_TAG_LABELS_RIGHT_ALIGNED = 'tagLabelsRightAligned';
const CLASS_TRANSITION = 'transition';

const ID_EVENT_CAPTURE_ELEM = 'eventCaptureElem';

const CSS_PROP_FONT_FAMILY = '--vscode-font-family';
const CSS_PROP_EDITOR_FONT_FAMILY = '--vscode-editor-font-family';
const CSS_PROP_FIND_MATCH_HIGHLIGHT_BACKGROUND = '--vscode-editor-findMatchHighlightBackground';
const CSS_PROP_SELECTION_BACKGROUND = '--vscode-selection-background';
const CSS_PROP_LIMIT_GRAPH_WIDTH = '--limitGraphWidth';

const ATTR_ERROR = 'data-error';


/* General Helpers */

/**
 * Are two arrays equal, such that corresponding elements at each index are equal according to the `equalElements` method.
 * @param a An array.
 * @param b An array.
 * @param equalElements A function used to determine if two elements, each at the same index of `a` & `b`, are equal.
 * @returns TRUE => The arrays are equal, FALSE => The arrays are not equal
 */
function arraysEqual<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>, equalElements: (a: T, b: T) => boolean) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (!equalElements(a[i], b[i])) return false;
	}
	return true;
}

/**
 * Are two arrays equal, such that corresponding elements at each index are strictly equal.
 * @param a An array.
 * @param b An array.
 * @returns TRUE => The arrays are equal, FALSE => The arrays are not equal
 */
function arraysStrictlyEqual<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

/**
 * Are two arrays equal, such that corresponding elements of each array are in strictly equal to an element in the other array (i.e. the order of elements doesn't matter).
 * @param a An array.
 * @param b An array.
 * @returns TRUE => The arrays are equal, FALSE => The arrays are not equal
 */
function arraysStrictlyEqualIgnoringOrder<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (b.indexOf(a[i]) === -1) return false;
	}
	return true;
}

/**
 * Modify the opacity of an RGB/RGBA/HEX colour by multiplying it by a new opacity.
 * @param colour The colour to modify.
 * @param opacity The multiplier for the opacity (between 0 & 1).
 * @returns An equivalent RGBA colour with the applied opacity.
 */
function modifyColourOpacity(colour: string, opacity: number) {
	let fadedCol = 'rgba(0,0,0,0)', match;
	if ((match = colour.match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/)) !== null) {
		fadedCol = 'rgba(' + match[1] + ',' + match[2] + ',' + match[3] + ',' + (parseFloat(match[4]) * opacity).toFixed(2) + ')';
	} else if ((match = colour.match(/#\s*([0-9a-fA-F]+)/)) !== null) {
		let hex = match[1];
		let length = hex.length;
		if (length === 3 || length === 4 || length === 6 || length === 8) {
			let col = length < 5
				? { r: hex[0] + hex[0], g: hex[1] + hex[1], b: hex[2] + hex[2], a: length === 4 ? hex[3] + hex[3] : 'ff' }
				: { r: hex[0] + hex[1], g: hex[2] + hex[3], b: hex[4] + hex[5], a: length === 8 ? hex[6] + hex[7] : 'ff' };
			fadedCol = 'rgba(' + parseInt(col.r, 16) + ',' + parseInt(col.g, 16) + ',' + parseInt(col.b, 16) + ',' + (parseInt(col.a, 16) * opacity / 255).toFixed(2) + ')';
		}
	} else if ((match = colour.match(/rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/)) !== null) {
		fadedCol = 'rgba(' + match[1] + ',' + match[2] + ',' + match[3] + ',' + opacity + ')';
	}
	return fadedCol;
}

/**
 * Pad a number with a leading zero, so it contains at least two digits.
 * @param i The number to pad.
 * @returns The padded number.
 */
function pad2(i: number) {
	return i > 9 ? i : '0' + i;
}

/**
 * Get a short name for a repository.
 * @param path The path of the repository.
 * @returns The short name.
 */
function getRepoName(path: string) {
	const firstSep = path.indexOf('/');
	if (firstSep === path.length - 1 || firstSep === -1) {
		return path; // Path has no slashes, or a single trailing slash ==> use the path
	} else {
		const p = path.endsWith('/') ? path.substring(0, path.length - 1) : path; // Remove trailing slash if it exists
		return p.substring(p.lastIndexOf('/') + 1);
	}
}

/**
 * Get the path of a repository relative to the closest repository containing it.
 *
 * A repository contained within another known repository — a submodule or a nested repository —
 * is identified by its path relative to that repository (the way `.gitmodules` names a
 * submodule), which is what the Repos dropdown shows as the tooltip of an option. Canonicalised
 * Windows paths may differ from the workspace path's drive letter and directory casing, so
 * drive-letter paths are compared case-insensitively.
 * @param path The path of the repository.
 * @param repos The set of known repositories.
 * @returns The relative path, or NULL if the repository is not contained within another known repository.
 */
function getSubRepoPath(path: string, repos: GG.GitRepoSet): string | null {
	const caseInsensitive = /^[a-zA-Z]:/.test(path);
	const repoPaths = Object.keys(repos);
	let parent: string | null = null;
	for (let i = 0; i < repoPaths.length; i++) {
		if (repoPaths[i].length >= path.length) continue;
		const contained = caseInsensitive
			? path.substring(0, repoPaths[i].length + 1).toLowerCase() === (repoPaths[i] + '/').toLowerCase()
			: path.startsWith(repoPaths[i] + '/');
		if (contained && (parent === null || repoPaths[i].length > parent.length)) parent = repoPaths[i];
	}
	return parent === null ? null : path.substring(parent.length + 1);
}

/**
 * Get a sorted list of repository paths from a given GitRepoSet.
 * @param repos The set of repositories.
 * @param order The order to sort the repositories.
 * @returns An array of ordered repository paths.
 */
function getSortedRepositoryPaths(repos: GG.GitRepoSet, order: GG.RepoDropdownOrder): ReadonlyArray<string> {
	const repoPaths = Object.keys(repos);
	if (order === GG.RepoDropdownOrder.WorkspaceFullPath) {
		return repoPaths.sort((a, b) => repos[a].workspaceFolderIndex === repos[b].workspaceFolderIndex
			? a.localeCompare(b)
			: repos[a].workspaceFolderIndex === null
				? 1
				: repos[b].workspaceFolderIndex === null
					? -1
					: repos[a].workspaceFolderIndex! - repos[b].workspaceFolderIndex!
		);
	} else if (order === GG.RepoDropdownOrder.FullPath) {
		return repoPaths.sort((a, b) => a.localeCompare(b));
	} else {
		return repoPaths.map((path) => ({ name: repos[path].name || getRepoName(path), path: path }))
			.sort((a, b) => a.name !== b.name ? a.name.localeCompare(b.name) : a.path.localeCompare(b.path))
			.map((x) => x.path);
	}
}


/* HTML Escape / Unescape */

/**
 * Escape HTML in the specified string.
 * @param str The string to escape.
 * @returns The escaped string.
 */
function escapeHtml(str: string) {
	return str.replace(HTML_ESCAPER_REGEX, (match) => HTML_ESCAPES[match]);
}

/**
 * Build attributes for a non-clickable element that exposes explanatory text.
 * The shared tooltip uses the same text for mouse and keyboard users.
 * @param message The explanatory text.
 * @param className Optional additional CSS class.
 * @returns HTML attributes for the tooltip target.
 */
function helpTooltipAttrs(message: string, className: string = '') {
	const escaped = escapeHtml(message);
	return 'class="' + (className !== '' ? className + ' ' : '') + 'gg-helpTooltip" data-tooltip="' + escaped + '" aria-label="' + escaped + '" tabindex="0"';
}

/**
 * Unescape HTML in the specified string.
 * @param str The string to unescape.
 * @returns The unescaped string.
 */
function unescapeHtml(str: string) {
	return str.replace(HTML_UNESCAPER_REGEX, (match) => HTML_UNESCAPES[match]);
}


/* Formatters */

/**
 * Format an array of strings as a comma separated list.
 * @param items The array of strings.
 * @returns A formatted comma separated string (e.g. "A, B & C").
 */
function formatCommaSeparatedList(items: string[]) {
	let str = '';
	for (let i = 0; i < items.length; i++) {
		str += (i > 0 ? (i < items.length - 1 ? ', ' : ' & ') : '') + items[i];
	}
	return str;
}

/**
 * Format a date (short).
 * @param unixTimestamp The unix timestamp of the date to format.
 * @returns The formatted date.
 */
function formatShortDate(unixTimestamp: number, relative: boolean = false) {
	const date = new Date(unixTimestamp * 1000), format = initialState.config.dateFormat, zh = getInterfaceLanguage() === 'zh-cn';
	let dateStr = format.iso
		? date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate())
		: zh
			? date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
			: date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear();
	let hourMinsStr = pad2(date.getHours()) + ':' + pad2(date.getMinutes());
	let formatted;

	if (!relative && format.type === GG.DateFormatType.DateAndTime) {
		formatted = dateStr + ' ' + hourMinsStr;
	} else if (!relative && format.type === GG.DateFormatType.DateOnly) {
		formatted = dateStr;
	} else {
		let diff = Math.floor(Date.now() / 1000 - unixTimestamp), unit;
		// A commit dated in the future (author date set forward, a rebase preserving it, or clock
		// skew between machines) must not render as a negative "seconds ago": clamp it to now.
		if (diff < 0) diff = 0;
		if (diff < 60) {
			unit = 'second';
		} else if (diff < 3600) {
			unit = 'minute';
			diff /= 60;
		} else if (diff < 86400) {
			unit = 'hour';
			diff /= 3600;
		} else if (diff < 86400 * 30) {
			unit = 'day';
			diff /= 86400;
		} else if (diff < 86400 * 365) {
			unit = 'month';
			diff /= 86400 * 30;
		} else {
			unit = 'year';
			diff /= 86400 * 365;
		}
		diff = Math.floor(diff);
		if (unit === 'second') {
			formatted = zh ? '刚刚' : 'just now';
		} else if (zh) {
			const units: { [unit: string]: string } = { minute: '分钟', hour: '小时', day: '天', month: '个月', year: '年' };
			formatted = diff + ' ' + units[unit] + '前';
		} else {
			formatted = diff + ' ' + unit + (diff !== 1 ? 's' : '') + ' ago';
		}
	}
	return {
		title: dateStr + ' ' + hourMinsStr + ':' + pad2(date.getSeconds()),
		formatted: formatted
	};
}

/**
 * Format a date (long).
 * @param unixTimestamp The unix timestamp of the date to format.
 * @returns The formatted date.
 */
function formatLongDate(unixTimestamp: number) {
	const date = new Date(unixTimestamp * 1000);
	if (initialState.config.dateFormat.iso) {
		let timezoneOffset = date.getTimezoneOffset();
		let absoluteTimezoneOffset = Math.abs(timezoneOffset);
		let timezone = timezoneOffset === 0 ? 'Z' : ' ' + (timezoneOffset < 0 ? '+' : '-') + pad2(Math.floor(absoluteTimezoneOffset / 60)) + pad2(absoluteTimezoneOffset % 60);
		return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + ' ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds()) + timezone;
	} else if (getInterfaceLanguage() === 'zh-cn') {
		return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
	} else {
		return date.toString();
	}
}

/**
 * A calendar day for the mobile layout: "Oct 9" / "10月9日" / "10-09", with the year when
 * `withYear` is set ("Oct 9, 2024" / "2024年10月9日" / "2024-10-09").
 */
function formatDayDate(unixTimestamp: number, withYear: boolean) {
	const date = new Date(unixTimestamp * 1000), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
	if (initialState.config.dateFormat.iso) return (withYear ? year + '-' : '') + pad2(month) + '-' + pad2(day);
	if (getInterfaceLanguage() === 'zh-cn') return (withYear ? year + '年' : '') + month + '月' + day + '日';
	return MONTHS[month - 1] + ' ' + day + (withYear ? ', ' + year : '');
}

/**
 * The date of a commit row in the mobile layout, as short as a mail list's: the time for today,
 * "Yesterday", the weekday within the last week, else the day (with the year when it isn't this one).
 */
function formatCompactDate(unixTimestamp: number) {
	const date = new Date(unixTimestamp * 1000), now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(), time = date.getTime();
	if (time >= startOfToday && time < startOfToday + 86400000) return pad2(date.getHours()) + ':' + pad2(date.getMinutes());
	if (time >= startOfToday - 86400000 && time < startOfToday) return strings.mobileYesterday;
	if (time >= startOfToday - 6 * 86400000 && time < startOfToday) return strings.mobileWeekdays[date.getDay()];
	return formatDayDate(unixTimestamp, date.getFullYear() !== now.getFullYear());
}

/** The day and time of a commit in the mobile Commit Details sheet: "Oct 9, 2025 16:32". */
function formatMediumDate(unixTimestamp: number) {
	const date = new Date(unixTimestamp * 1000);
	return formatDayDate(unixTimestamp, true) + ' ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes());
}


/* DOM Helpers */

/**
 * Add an event listener to all elements with a class name.
 * @param className The class name used to identify the elements to add the event listener to.
 * @param event The event to listen for on each element.
 * @param eventListener The event listener to be called when the event occurs.
 */
function addListenerToClass(className: string, event: string, eventListener: EventListener) {
	addListenerToCollectionElems(document.getElementsByClassName(className), event, eventListener);
}

/**
 * Add an event listener to all elements in a collection of elements.
 * @param elems The collection of elements to add the event listener to.
 * @param event The event to listen for on each element.
 * @param eventListener The event listener to be called when the event occurs.
 */
function addListenerToCollectionElems(elems: HTMLCollectionOf<Element>, event: string, eventListener: EventListener) {
	for (let i = 0; i < elems.length; i++) {
		elems[i].addEventListener(event, eventListener);
	}
}

/**
 * Insert an HTML Element directly after a reference HTML Element (as a sibling).
 * @param newNode The HTML Element to insert.
 * @param referenceNode The reference HTML element that `newNode` should be inserted after.
 */
function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement) {
	referenceNode.parentNode!.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Insert an HTML Element directly before the first child element with a specified class name.
 * @param newChild The HTML Element to insert.
 * @param parent The parent element that the `newChild` should be inserted into as a child.
 * @param className The class name identifying the child that `newChild` should be inserted before.
 */
function insertBeforeFirstChildWithClass(newChild: HTMLElement, parent: HTMLElement, className: string) {
	let referenceNode: Node | null = null;
	for (let i = 0; i < parent.children.length; i++) {
		if (parent.children[i].classList.contains(className)) {
			referenceNode = parent.children[i];
			break;
		}
	}
	parent.insertBefore(newChild, referenceNode);
}

/**
 * Alter an HTML Element such that it contains, or doesn't contain the specified class name.
 * @param elem The HTML Element to alter.
 * @param className The class name.
 * @param state TRUE => Ensure the HTML Element has the class name, FALSE => Ensure the HTML Element doesn't have the class name
 * @returns TRUE => The HTML Element was altered, FALSE => No change was required.
 */
function alterClass(elem: HTMLElement, className: string, state: boolean) {
	if (elem.classList.contains(className) !== state) {
		if (state) {
			elem.classList.add(className);
		} else {
			elem.classList.remove(className);
		}
		return true;
	}
	return false;
}

/**
 * Alter each HTML Element in a collection of HTML Elements, such that it contains, or doesn't contain the specified class name.
 * @param elems The collection of HTML Elements.
 * @param className The class name.
 * @param state TRUE => Ensure all HTML Elements have the class name, FALSE => Ensure no HTML Elements have the class name
 */
function alterClassOfCollection(elems: HTMLCollectionOf<HTMLElement>, className: string, state: boolean) {
	const lockedElems = [];
	for (let i = 0; i < elems.length; i++) {
		lockedElems.push(elems[i]);
	}
	for (let i = 0; i < lockedElems.length; i++) {
		alterClass(lockedElems[i], className, state);
	}
}

/**
 * Recursively get all of the child nodes of a node that have text content.
 * @param elem The node to recursively traverse.
 * @returns An array of all child nodes that have text content.
 */
function getChildNodesWithTextContent(elem: Node) {
	let textChildren: Node[] = [];
	for (let i = 0; i < elem.childNodes.length; i++) {
		if (elem.childNodes[i].childNodes.length > 0) {
			textChildren.push(...getChildNodesWithTextContent(elem.childNodes[i]));
		} else if (elem.childNodes[i].textContent !== null && elem.childNodes[i].textContent !== '') {
			textChildren.push(elem.childNodes[i]);
		}
	}
	return textChildren;
}

/**
 * Recursively get all of the child elements of an element that have the specified class name.
 * @param elem The element to recursively traverse.
 * @param className The class name to find.
 * @returns An array of all child elements that have the specified class name.
 */
function getChildrenWithClassName(elem: Element, className: string) {
	let children: Element[] = [];
	for (let i = 0; i < elem.children.length; i++) {
		if (elem.children[i].children.length > 0) {
			children.push(...getChildrenWithClassName(elem.children[i], className));
		} else if (elem.children[i].className === className) {
			children.push(elem.children[i]);
		}
	}
	return children;
}

/**
 * Get the first child of an HTML Element that is a \<ul\>.
 * @param elem The parent HTML Element.
 * @returns The HTML Element, or NULL if no child is a \<ul\>.
 */
function getChildUl(elem: HTMLElement) {
	for (let i = 0; i < elem.children.length; i++) {
		if (elem.children[i].tagName === 'UL') {
			return <HTMLUListElement>elem.children[i];
		}
	}
	return null;
}

/**
 * Initialise scrollTop, and observe scroll events for an HTML Element. Invoke callbacks when the element has been scrolled, and when scrollTop should be saved.
 * @param id The ID identifying the HTML Element.
 * @param initialScrollTop The value used to initialise scrollTop.
 * @param onScroll A callback to be invoked when the element has been scrolled.
 * @param onScrolled A callback to be invoked when scrollTop should be saved.
 */
function observeElemScroll(id: string, initialScrollTop: number, onScroll: (scrollTop: number) => void, onScrolled: () => void) {
	const elem = document.getElementById(id);
	if (elem === null) return;

	let timeout: NodeJS.Timeout | null = null;
	elem.scroll(0, initialScrollTop);
	elem.addEventListener('scroll', () => {
		const elem = document.getElementById(id);
		if (elem === null) return;

		onScroll(elem.scrollTop);

		if (timeout !== null) clearTimeout(timeout);
		timeout = setTimeout(() => {
			onScrolled();
			timeout = null;
		}, 250);
	});
}

/**
 * Get all of the rendered commit HTML Elements.
 * @returns A collection of all commit HTML Elements.
 */
function getCommitElems() {
	return <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('commit');
}

/**
 * Register that an event has been handled, to prevent the default behaviour from occurring, and any further handling of the event.
 * @param event The event.
 */
function handledEvent(event: Event) {
	event.preventDefault();
	event.stopPropagation();
}

/**
 * Make a non-native button element (e.g. a `<div role="button">`) activate on Enter / Space, matching
 * the behaviour a real `<button>` gets for free. Needed wherever a toolbar icon is a styled `<div>`.
 * @param elem The element to make keyboard-activatable.
 */
function makeKeyboardActivatable(elem: HTMLElement) {
	if (elem.getAttribute('role') === null) elem.setAttribute('role', 'button');
	if (elem.tabIndex < 0) elem.tabIndex = 0;
	elem.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			elem.click();
			handledEvent(e);
		}
	});
}

function makeKeyboardActivatableCollection(root: ParentNode, selector: string) {
	for (const elem of Array.from(root.querySelectorAll<HTMLElement>(selector))) {
		makeKeyboardActivatable(elem);
	}
}

let helpTooltipElem: HTMLElement | null = null;
let helpTooltipTarget: HTMLElement | null = null;
let helpTooltipEventsObserved = false;

function getHelpTooltipTarget(target: EventTarget | null) {
	return target instanceof Element ? <HTMLElement | null>target.closest('.gg-helpTooltip') : null;
}

function hideHelpTooltip() {
	if (helpTooltipTarget !== null && helpTooltipTarget.getAttribute('aria-describedby') === 'ggHelpTooltip') {
		helpTooltipTarget.removeAttribute('aria-describedby');
	}
	helpTooltipTarget = null;
	if (helpTooltipElem !== null) {
		helpTooltipElem.remove();
		helpTooltipElem = null;
	}
}

function positionHelpTooltip() {
	if (helpTooltipElem === null || helpTooltipTarget === null) return;
	const targetRect = helpTooltipTarget.getBoundingClientRect();
	const tooltipRect = helpTooltipElem.getBoundingClientRect();
	const maxLeft = Math.max(8, window.innerWidth - tooltipRect.width - 8);
	const left = Math.min(Math.max(8, targetRect.left + (targetRect.width - tooltipRect.width) / 2), maxLeft);
	let top = targetRect.bottom + 6;
	if (top + tooltipRect.height > window.innerHeight - 8) top = targetRect.top - tooltipRect.height - 6;
	helpTooltipElem.style.left = Math.round(left) + 'px';
	helpTooltipElem.style.top = Math.round(Math.max(8, top)) + 'px';
}

function showHelpTooltip(target: HTMLElement) {
	const message = target.dataset.tooltip;
	if (typeof message !== 'string' || message === '') return;
	if (helpTooltipTarget === target) {
		if (helpTooltipElem !== null && helpTooltipElem.textContent !== message) {
			helpTooltipElem.textContent = message;
			positionHelpTooltip();
		}
		return;
	}
	hideHelpTooltip();

	const tooltip = document.createElement('div');
	tooltip.id = 'ggHelpTooltip';
	tooltip.className = 'gg-helpTooltipPopup';
	tooltip.setAttribute('role', 'tooltip');
	tooltip.textContent = message;
	document.body.appendChild(tooltip);
	helpTooltipElem = tooltip;
	helpTooltipTarget = target;
	target.setAttribute('aria-describedby', 'ggHelpTooltip');
	positionHelpTooltip();
}

/**
 * Observe all non-clickable help indicators, including ones rendered after the initial view load.
 * Unlike the browser's native `title` tooltip, this appears immediately on hover and focus.
 */
function observeHelpTooltips() {
	if (helpTooltipEventsObserved) return;
	helpTooltipEventsObserved = true;

	document.addEventListener('mouseover', (e) => {
		const target = getHelpTooltipTarget(e.target);
		if (target === null || (e.relatedTarget instanceof Node && target.contains(e.relatedTarget))) return;
		showHelpTooltip(target);
	});
	document.addEventListener('mouseout', (e) => {
		const target = getHelpTooltipTarget(e.target);
		if (target === null || (e.relatedTarget instanceof Node && target.contains(e.relatedTarget))) return;
		if (target === helpTooltipTarget) hideHelpTooltip();
	});
	document.addEventListener('focusin', (e) => {
		const target = getHelpTooltipTarget(e.target);
		if (target !== null) showHelpTooltip(target);
	});
	document.addEventListener('focusout', (e) => {
		const target = getHelpTooltipTarget(e.target);
		if (target !== null && !(e.relatedTarget instanceof Node && target.contains(e.relatedTarget))) hideHelpTooltip();
	});
	window.addEventListener('scroll', hideHelpTooltip, true);
	window.addEventListener('resize', hideHelpTooltip);
}


/* State Helpers */

/**
 * Update a key-value pair in the Global View State.
 * @param key The key identifying the value to update.
 * @param value The new value.
 */
function updateGlobalViewState<K extends keyof GG.GitGraphViewGlobalState>(key: K, value: GG.GitGraphViewGlobalState[K]) {
	(<GG.DeepWriteable<GG.GitGraphViewGlobalState>>globalState)[key] = value;
	sendMessage({ command: 'setGlobalViewState', state: globalState });
}

/**
 * Update a key-value pair in the Workspace View State.
 * @param key The key identifying the value to update.
 * @param value The new value.
 */
function updateWorkspaceViewState<K extends keyof GG.GitGraphViewWorkspaceState>(key: K, value: GG.GitGraphViewWorkspaceState[K]) {
	(<GG.DeepWriteable<GG.GitGraphViewWorkspaceState>>workspaceState)[key] = value;
	sendMessage({ command: 'setWorkspaceViewState', state: workspaceState });
}


/* VSCode Helpers */

/**
 * Send a message to the extension's back-end (typically to request data, or perform an action).
 * @param msg The message to send.
 */
function sendMessage(msg: GG.RequestMessage) {
	VSCODE_API.postMessage(msg);
}

/**
 * Show a Visual Studio Code Error Message.
 * @param message The message to display.
 */
function showErrorMessage(message: string) {
	sendMessage({ command: 'showErrorMessage', message: message });
}

/**
 * Get the value of a Visual Studio Code style variable.
 * @param name The name of the style variable.
 * @returns The value of the style variable.
 */
function getVSCodeStyle(name: string) {
	return document.documentElement.style.getPropertyValue(name);
}


/**
 * Resizes images for the view (e.g. commit author avatars).
 */
class ImageResizer {
	private canvas: HTMLCanvasElement | null = null;
	private context: CanvasRenderingContext2D | null = null;

	/**
	 * Resize an image to have an effective resolution of 18px x 18px. The actual resolution varies depending of the user's screen pixel ratio.
	 * @param dataUri The data URI containing the image data.
	 * @param callback A callback to be invoked once the image has been resized, with the resized image.
	 */
	public resize(dataUri: string, callback: (dataUri: string) => void) {
		if (this.canvas === null) this.canvas = document.createElement('canvas');
		if (this.context === null) this.context = this.canvas.getContext('2d');
		if (this.context === null) {
			callback(dataUri);
			return;
		}

		let image = new Image();
		image.onload = () => {
			let outputDataUri = '';
			if (this.canvas === null || this.context === null) {
				outputDataUri = dataUri;
			} else {
				let size = Math.ceil(18 * window.devicePixelRatio);
				if (this.canvas.width !== size) this.canvas.width = size;
				if (this.canvas.height !== size) this.canvas.height = size;
				this.context.clearRect(0, 0, size, size);
				this.context.drawImage(image, 0, 0, size, size);
				outputDataUri = this.canvas.toDataURL();
			}
			callback(outputDataUri);
		};
		image.src = dataUri;
	}
}


/**
 * Implements an Event Overlay, which is used for blocking and/or capturing mouse events in the view.
 */
class EventOverlay {
	private move: EventListener | null = null;
	private stop: EventListener | null = null;

	/**
	 * Create an event overlay.
	 * @param className The class name to be used for the event overlay.
	 * @param move A callback to be invoked if the user moves the mouse over the event overlay.
	 * @param stop A callback to be invoked if the user moves the mouse off the event overlay.
	 */
	public create(className: string, move: EventListener | null, stop: EventListener | null) {
		if (document.getElementById(ID_EVENT_CAPTURE_ELEM) !== null) this.remove();

		const eventOverlayElem = document.createElement('div');
		eventOverlayElem.id = ID_EVENT_CAPTURE_ELEM;
		eventOverlayElem.className = className;

		this.move = move;
		this.stop = stop;
		if (this.move !== null) {
			eventOverlayElem.addEventListener('mousemove', this.move);
		}
		if (this.stop !== null) {
			eventOverlayElem.addEventListener('mouseup', this.stop);
			eventOverlayElem.addEventListener('mouseleave', this.stop);
		}

		if (contextMenu.isOpen()) {
			contextMenu.close();
		}

		document.body.appendChild(eventOverlayElem);
	}

	/**
	 * Remove the event overlay that is currently active in the view.
	 */
	public remove() {
		let eventOverlayElem = document.getElementById(ID_EVENT_CAPTURE_ELEM);
		if (eventOverlayElem === null) return;

		if (this.move !== null) {
			eventOverlayElem.removeEventListener('mousemove', this.move);
			this.move = null;
		}
		if (this.stop !== null) {
			eventOverlayElem.removeEventListener('mouseup', this.stop);
			eventOverlayElem.removeEventListener('mouseleave', this.stop);
			this.stop = null;
		}

		document.body.removeChild(eventOverlayElem);
	}
}
