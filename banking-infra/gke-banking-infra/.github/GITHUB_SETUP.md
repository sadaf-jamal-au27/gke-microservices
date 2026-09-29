# GitHub setup (WIF + environments)

This folder’s workflows run only if **this directory is the Git repository root**.

In the current monorepo, use **[../../.github/GITHUB_SETUP.md](../../.github/GITHUB_SETUP.md)** instead.

When this tree is its own GitHub repo (`gke-banking-infra`):

1. Apply stack `01-iam` (after `00-foundation`) so WIF exists.
2. GitHub Environment **dev** secrets: `GCP_WIF_PROVIDER`, `GCP_CI_SERVICE_ACCOUNT`, `TF_VAR_DATABASE_PASSWORD`.
3. Workflows here (`infra-plan.yml`, `infra-apply.yml`) become the live pipelines.
