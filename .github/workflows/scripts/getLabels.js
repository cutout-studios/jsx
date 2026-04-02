const VALID_SCOPES = [
  ".github",
  ".qlty",
  ".vscode",
  "docs",
  "element",
  "helpers",
  "html",
  "pragma",
  "server",
];

const SMALL_THRESHOLD = 2 ** 8;
const MEDIUM_THRESHOLD = 2 ** 10;

/**
 * Auto-label a PR based on scope and size
 * @param {Object} params - Parameters
 * @param {Object} params.github - GitHub API client
 * @param {Object} params.context - GitHub Actions context
 * @param {Object} params.core - GitHub Actions core utilities
 */
export default async function getLabels({ github, context, core }) {
  const pr = context.payload.pull_request;
  const labels = new Set();

  // scope label
  const [scope] = pr.title.match(/^(?:feat|fix|chore)\(([^)]+)\):/) ?? [];
  if (scope && VALID_SCOPES.includes(scope)) {
    labels.add(`scope: ${scope}`);
  }

  // size label
  const totalChanges = (pr.additions || 0) + (pr.deletions || 0);

  if (totalChanges < SMALL_THRESHOLD) {
    labels.add("size: small");
  } else if (totalChanges < MEDIUM_THRESHOLD) {
    labels.add("size: medium");
  } else {
    labels.add("size: large");
  }

  // Add labels
  if (!labels.size) return;

  const labelsArray = [...labels];

  await github.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: pr.number,
    labels: labelsArray,
  });

  core.info(`✅ Auto-labeled PR with: ${labelsArray.join(", ")}`);
}
