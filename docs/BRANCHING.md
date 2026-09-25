# Branching strategy

Use **GitHub Flow** on every repo. Do **not** maintain a long-lived `develop` branch unless you explicitly want one later.

## Branches

| Branch | Purpose |
|--------|---------|
| **`main`** | Default branch. All merges land here. CI runs on every push and PR. |
| **`feature/<name>`** | Short-lived work. Open a PR into **`main`**. |

```text
feature/checkout-fix ──PR──► main (plan) ──merge──► push main (apply to GCP dev)
```

## Repos (each has its **own** pipeline)

| Repo | Workflow | Runs when |
|------|----------|-----------|
| [gke-retail-infra](https://github.com/sadaf-jamal-au27/gke-retail-infra) | `infra-ci.yml` | PR → **plan**; merge/push **`main`** → **apply** (dev); dispatch for other envs |
| [gke-retail-application](https://github.com/sadaf-jamal-au27/gke-retail-application) | `application-ci.yml` | Push/PR to **`main`** |
| [gke-retail-devops](https://github.com/sadaf-jamal-au27/gke-retail-devops) | `devops-ci.yml` | Push/PR to **`main`** |
| [gke-microservices](https://github.com/sadaf-jamal-au27/gke-microservices) | All lane workflows | Push/PR to **`main`** (optional monorepo) |

**Split repos are canonical for teams.** The monorepo is optional; do not clone infra *inside* the monorepo — use `~/Projects/gke-retail-infra` only.

## GitHub Environments

| Environment | When |
|-------------|------|
| **`dev`** | GCP WIF + Terraform plan/apply + image push (today’s single GCP project) |
| **`prod`** | Add when you have a prod GCP project |

Set secrets once per repo with `./scripts/github-set-wif-secrets.sh dev` from **gke-retail-infra** (see `.github/GITHUB_SETUP.md`).

## Branch protection (recommended)

On **`main`** only:

- Require pull request before merge  
- Require status checks that match **this repo’s** workflow (see `testing/gates/REQUIRED_CHECKS.md` in monorepo)

## Deploy

- **Infra:** PR → validate + **terraform plan**; merge to **`main`** → validate + **terraform apply** (GitHub Environment **dev**). Manual **Run workflow** for qa/test/prod when ready.
- **DevOps:** Actions → `devops-ci` → **Run workflow** → deploy **dev**  
- **Application:** Push to **`main`** builds; image push uses environment **dev**

## If CI “does not run”

1. Confirm you pushed to **`main`** (not only a local branch).  
2. Confirm path filters: infra changes must touch `fast/**` or `scripts/**` in **gke-retail-infra**.  
3. Use **workflow_dispatch** on the workflow page to force a run.  
4. Split repos still on the **initial commit** will fail until you **push** the CI fixes from your laptop (`~/Projects/gke-retail-infra`, not the nested clone under the monorepo).
