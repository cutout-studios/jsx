const GITHUB_EVENT_PAGE_SIZE = 100;

/**
 * Check if a PR has a linked issue via GitHub's development field
 * @param {Object} params - Parameters
 * @param {Object} params.github - GitHub API client
 * @param {Object} params.context - GitHub Actions context
 * @param {Object} params.core - GitHub Actions core utilities
 */
export default async function hasLinkedIssue({ github, context, core }) {
  const pr = context.payload.pull_request;

  const { data: repoEvents } = await github.rest.issues.listEventsForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: GITHUB_EVENT_PAGE_SIZE,
  });

  if (
    !repoEvents.some(({ issue }) =>
      issue?.pull_request?.url?.includes(`/${pr.number}`)
    )
  ) {
    core.setFailed(
      "❌ PR is not linked to an issue via the development field.\n" +
        "Please link this PR to an issue using the GitHub UI.",
    );
    return;
  }

  core.info("✅ PR is linked to an issue");
}
