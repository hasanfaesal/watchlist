# Cleanup Guide: Removing Redundant Merge Commits

## Problem Summary

The current PR branch `copilot/fix-redundant-merge-strategy` contains redundant commits created by Copilot SWE Agent's merge strategy:

### Commit History Analysis

**BEFORE (6 commits total):**
```
* 1966c24 - Initial plan (EMPTY - Tree SHA matches a096cec)
* a096cec - Fix type mismatch for id field in season endpoint ✅
* e01548c - Merge main branch with staging changes (REDUNDANT - Tree SHA matches c57094f)
* c57094f - Merge staging into main ✅ (THE ACTUAL MERGE)
* e3574fa - Initial plan (EMPTY - Tree SHA matches main)
* e71ad56 - chore(actions): schedule 00:30 PKT staging merge (MAIN BRANCH)
```

**Redundant Commits:**
- `e3574fa`: Empty planning commit (Tree SHA: `8bf78e799c0f...` - same as main!)
- `e01548c`: Useless merge commit (Tree SHA: `1449142dae...` - same as c57094f!)
- `1966c24`: Another empty planning commit (Tree SHA: `6d4ecdb71...` - same as a096cec!)

**AFTER (3 commits total - clean history):**
```
* cdf7c90 - Fix type mismatch for id field in season endpoint ✅
* c57094f - Merge staging into main ✅
* e71ad56 - chore(actions): schedule 00:30 PKT staging merge
```

## Solution

This cleanup has been performed locally in the sandboxed environment. The cleaned history:
1. Keeps the actual merge commit (`c57094f`)
2. Keeps the bug fix commit (re-applied as `cdf7c90`)
3. Removes all empty/redundant planning and merge commits

### Tree SHA Verification

The final state is verified to be identical:
- Original `a096cec` tree SHA: `6d4ecdb71316a61a4aebdbc2edf3faff12a50d58`
- Cleaned `cdf7c90` tree SHA: `6d4ecdb71316a61a4aebdbc2edf3faff12a50d58` ✓

## How to Apply This Cleanup (Manual Steps)

Since force push is not available in this environment, the repository owner should apply these steps locally:

```bash
# 1. Fetch the branch
git fetch origin copilot/fix-redundant-merge-strategy

# 2. Create a local copy
git checkout -b cleanup-merge-commits origin/copilot/fix-redundant-merge-strategy

# 3. Reset to the actual merge commit
git reset --hard c57094f

# 4. Cherry-pick the bug fix
git cherry-pick a096cec

# 5. Verify the result
git log --oneline --graph -8
git diff origin/copilot/fix-redundant-merge-strategy  # Should show no differences

# 6. Force push to update the PR
git push --force-with-lease origin cleanup-merge-commits:copilot/fix-redundant-merge-strategy
```

## Alternative: Squash Merge (Recommended)

When merging this PR, use **Squash and Merge** in GitHub's UI. This will:
- Collapse all commits into a single clean commit
- Avoid the messy history in the main branch
- Achieve the same end result with less manual work

## Prevention

To prevent this issue in future Copilot SWE Agent operations:
1. Use squash merge for Copilot-generated PRs
2. Review commit history before merging
3. Consider using the scheduled workflow for automated staging->main merges (already configured in `.github/workflows/scheduled-staging-merge.yml`)
