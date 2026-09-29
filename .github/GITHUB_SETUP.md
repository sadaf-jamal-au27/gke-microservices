# GitHub + WIF (banking pipelines)

**Apex Bank is not the retail app.** Retail folders in this GitHub remote (if any) are a leftover workspace, not part of banking.

GitHub Actions only load workflows from the **repository root**: `.github/workflows/`. Banking jobs only watch `banking-app/` and `banking-infra/` paths.

| Workflow | When | Needs |
|----------|------|--------|
| `banking-infra-plan.yml` | PR / manual | Environment **dev** secrets after WIF exists |
| `banking-infra-apply.yml` | merge to develop/main, or manual | same + `TF_VAR_DATABASE_PASSWORD` |
| `banking-app-ci.yml` | PR always build; **push to develop** pushes GAR | WIF + GAR `banking` |

## Bootstrap order (company standard)

1. Laptop: `00-foundation` then `01-iam` (`node scripts/terraform-stacks.mjs apply dev` from `banking-infra/gke-banking-infra`, with `shared.tfvars`).
2. GitHub → Settings → Environments → **dev**:
   - `GCP_WIF_PROVIDER` — Terraform output `wif_provider`
   - `GCP_CI_SERVICE_ACCOUNT` — `ci_service_account_email`
   - `TF_VAR_DATABASE_PASSWORD` — Cloud SQL app password
   - `GCP_PROJECT_ID` — `ai-rag-agent-project` (optional; workflow defaults this)
3. Protect `develop` / `main` (required checks: infra static + app build).

Until step 1–2, **plan/apply/publish jobs fail at Google auth** — that is expected. Fmt/validate and app typecheck/docker build do not need WIF.

## Three-repo split later

Copy:

- `banking-infra/gke-banking-infra/.github/workflows/` (paths already `terraform/**`)
- `banking-app/gke-banking-application/.github/workflows/` (paths `**`)
