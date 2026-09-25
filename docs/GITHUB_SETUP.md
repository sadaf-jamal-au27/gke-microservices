# GitHub setup (quick links)

Full guide: **[docs/WIF_AND_GITHUB.md](../docs/WIF_AND_GITHUB.md)**  
Branching: **[docs/BRANCHING.md](../docs/BRANCHING.md)**

```bash
cd infra   # monorepo, or gke-retail-infra repo root
./scripts/tf.sh dev github_wif apply
export TF_VAR_DATABASE_PASSWORD='...'
./scripts/github-set-wif-secrets.sh dev
./scripts/github-setup-environments.sh dev
```
