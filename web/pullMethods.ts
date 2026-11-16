/** Direct pull actions; no method selection, saved default, or confirmation dialog. */
function getPullMethodActions(view: GitGraphView, remote: string, branchName: string): ContextMenuActions {
	const repo = view.currentRepo;
	const current = view.gitBranchHead;
	const pull = (method: GG.PullMethod) => {
		if (current === null) {
			dialog.showError(strings.menuPullBranch, strings.pullRequiresBranch, null, null);
			return;
		}
		if (view.conflictBanner.hasOperation) {
			dialog.showError(strings.menuPullBranch, strings.pullOperationInProgress, null, null);
			return;
		}
		runAction({ command: 'pullBranch', repo, remote, branchName, createNewCommit: false, squash: false, method, expectedBranch: current }, strings.pullingBranch);
	};
	return [[{
		title: strings.pullFetchAll,
		visible: true,
		onClick: () => runAction({ command: 'fetch', repo, name: null, prune: view.config.fetchAndPrune, pruneTags: view.config.fetchAndPruneTags }, strings.pullFetchAll)
	}], [
		{ title: strings.pullPreferFastForward, visible: true, onClick: () => pull('ff') },
		{ title: strings.pullFastForwardOnly, visible: true, onClick: () => pull('ff-only') },
		{ title: strings.pullWithRebase, visible: true, onClick: () => pull('rebase') }
	]];
}
