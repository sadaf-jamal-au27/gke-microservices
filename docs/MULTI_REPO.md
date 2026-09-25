# Three-repo split (`sadaf-jamal-au27`)

## Canonical repos

| Repo | URL |
|------|-----|
| Application | https://github.com/sadaf-jamal-au27/gke-retail-application |
| DevOps | https://github.com/sadaf-jamal-au27/gke-retail-devops |
| Infra | https://github.com/sadaf-jamal-au27/gke-retail-infra |

Monorepo (optional archive): https://github.com/sadaf-jamal-au27/gke-microservices

## Local remotes

```bash
for r in gke-retail-application gke-retail-devops gke-retail-infra gke-microservices; do
  cd "$HOME/Projects/$r" 2>/dev/null || continue
  git remote set-url origin "https://github.com/sadaf-jamal-au27/${r}.git"
done
```

## GitHub CLI

Use only **`sadaf-jamal-au27`**:

```bash
gh auth logout -h github.com
gh auth login -h github.com
gh auth status
```

## Infra CI / WIF

Repo **`gke-retail-infra`**: GitHub repos allowed in `fast/datasets/dev/github_wif.tfvars`.

After `github_wif` apply:

```bash
export TF_VAR_DATABASE_PASSWORD='your-dev-db-password'
./scripts/github-set-wif-secrets.sh dev
```

See **`docs/BRANCHING.md`** and **`.github/GITHUB_SETUP.md`**.

## Re-split from monorepo

```bash
GITHUB_OWNER=sadaf-jamal-au27 ./devops/scripts/split-push-three-repos.sh
```
