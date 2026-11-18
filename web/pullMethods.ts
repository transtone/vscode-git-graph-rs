/** Direct branch actions; the target branch is explicit in rebase/fast-forward labels. */
function getPullMethodActions(view: GitGraphView, remote: string, target: DialogTarget & RefTarget): ReadonlyArray<ContextMenuAction> {
	const repo = view.currentRepo;
	const current = view.gitBranchHead;
	const targetRef = target.ref;
	const isAncestor = (ancestor: string, descendant: string) => {
		if (ancestor === descendant) return true;
		const commits = new Map(view.commits.map((commit) => [commit.hash, commit]));
		const pending = [descendant];
		const visited = new Set<string>();
		while (pending.length > 0) {
			const hash = pending.pop()!;
			if (hash === ancestor) return true;
			if (visited.has(hash)) continue;
			visited.add(hash);
			const commit = commits.get(hash);
			if (commit === undefined) return false;
			pending.push(...commit.parents);
		}
		return false;
	};
	const canFastForward = remote === '' && current !== null && targetRef !== current && view.commitHead !== null && isAncestor(target.hash, view.commitHead);
	return [{
		title: strings.pullFetchAll,
		visible: true,
		onClick: () => runAction({ command: 'fetch', repo, name: null, prune: view.config.fetchAndPrune, pruneTags: view.config.fetchAndPruneTags }, strings.pullFetchAll)
	}, {
		title: formatStr(strings.pullRebaseCurrentOnBranch, current!, targetRef),
		visible: current !== null && targetRef !== current,
		onClick: () => rebaseAction(view, targetRef, targetRef, GG.RebaseActionOn.Branch, target)
	}, {
		title: formatStr(strings.pullFastForwardBranch, targetRef, current ?? ''),
		visible: true,
		disabled: !canFastForward,
		onClick: () => {
			if (current === null) return;
			runAction({ command: 'fastForwardBranch', repo, branchName: targetRef, targetBranch: current }, strings.fastForwardingBranch);
		}
	}];
}
