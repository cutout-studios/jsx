/**
 * Auto-label a PR based on its size
 * @param {Object} params - Parameters
 * @param {Object} params.github - GitHub API client
 * @param {Object} params.context - GitHub Actions context
 * @param {Object} params.core - GitHub Actions core utilities
 */
export default async function addLabels({ github, context, core }) {
  const pr = context.payload.pull_request;
  const labels = new Set();

  // Size label
  const totalChanges = (pr.additions || 0) + (pr.deletions || 0);

  if (totalChanges < 2 ** 8) {
    labels.add("size: small");
  } else if (totalChanges < 2 ** 10) {
    labels.add("size: medium");
  } else {
    labels.add("size: large");
  }

  // Add labels
  if (!labels.size) return;

  await github.rest.issues.removeLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: pr.number,
    labels: ["size: small", "size: medium", "size: large"],
  });

  const labelsArray = [...labels];

  await github.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: pr.number,
    labels: labelsArray,
  });

  core.info(`✅ Auto-labeled PR with: ${labelsArray.join(", ")}`);
}
