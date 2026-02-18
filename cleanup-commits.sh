#!/bin/bash

# Cleanup Script for Redundant Merge Commits
# This script removes empty "Initial plan" commits and redundant merge commits
# from the copilot/fix-redundant-merge-strategy branch

set -e  # Exit on error

echo "============================================"
echo "Redundant Commits Cleanup Script"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Fetch the latest changes
echo "Fetching latest changes..."
git fetch origin copilot/fix-redundant-merge-strategy
echo ""

# Create a backup branch
BACKUP_BRANCH="backup-before-cleanup-$(date +%Y%m%d-%H%M%S)"
echo "Creating backup branch: $BACKUP_BRANCH"
git branch $BACKUP_BRANCH
echo -e "${GREEN}✓ Backup created${NC}"
echo ""

# Checkout the branch if not already on it
if [ "$CURRENT_BRANCH" != "copilot/fix-redundant-merge-strategy" ]; then
    echo "Checking out copilot/fix-redundant-merge-strategy..."
    git checkout copilot/fix-redundant-merge-strategy
fi

# Show current history
echo "Current history (showing redundant commits):"
git log --oneline --graph --decorate -8
echo ""

# Reset to the actual merge commit
echo -e "${YELLOW}Resetting to actual merge commit c57094f...${NC}"
git reset --hard c57094f
echo -e "${GREEN}✓ Reset complete${NC}"
echo ""

# Cherry-pick the bug fix
echo "Cherry-picking bug fix commit a096cec..."
if git cherry-pick a096cec; then
    echo -e "${GREEN}✓ Bug fix applied${NC}"
else
    echo -e "${RED}Error: Failed to cherry-pick bug fix${NC}"
    echo "Restoring from backup..."
    git reset --hard $BACKUP_BRANCH
    exit 1
fi
echo ""

# Show new history
echo "New cleaned history:"
git log --oneline --graph --decorate -8
echo ""

# Verify the tree state matches the original
ORIGINAL_TREE=$(git rev-parse a096cec^{tree})
NEW_TREE=$(git rev-parse HEAD^{tree})

if [ "$ORIGINAL_TREE" == "$NEW_TREE" ]; then
    echo -e "${GREEN}✓ Verification successful: Tree state matches original${NC}"
    echo "  Original tree: $ORIGINAL_TREE"
    echo "  New tree:      $NEW_TREE"
else
    echo -e "${RED}✗ Warning: Tree states don't match${NC}"
    echo "  Original tree: $ORIGINAL_TREE"
    echo "  New tree:      $NEW_TREE"
fi
echo ""

# Ask for confirmation before force push
echo -e "${YELLOW}Ready to force push cleaned history${NC}"
echo "This will rewrite the branch history on origin."
echo ""
read -p "Do you want to proceed with force push? (yes/no): " CONFIRM

if [ "$CONFIRM" == "yes" ]; then
    echo ""
    echo "Force pushing cleaned history..."
    if git push --force-with-lease origin copilot/fix-redundant-merge-strategy; then
        echo -e "${GREEN}✓ Successfully pushed cleaned history${NC}"
        echo ""
        echo "Summary:"
        echo "  - Removed 3 redundant commits (e3574fa, e01548c, 1966c24)"
        echo "  - Kept actual merge (c57094f) and bug fix"
        echo "  - Backup available at: $BACKUP_BRANCH"
    else
        echo -e "${RED}✗ Force push failed${NC}"
        echo "You may need to resolve conflicts or check permissions"
        echo "Backup available at: $BACKUP_BRANCH"
        exit 1
    fi
else
    echo ""
    echo "Force push cancelled."
    echo "Your local branch has been cleaned up."
    echo "To push later, run: git push --force-with-lease origin copilot/fix-redundant-merge-strategy"
    echo "To restore original state, run: git reset --hard $BACKUP_BRANCH"
fi

echo ""
echo "============================================"
echo "Cleanup complete!"
echo "============================================"
