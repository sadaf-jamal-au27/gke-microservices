# gke-microservices (infra mirror)

This repo is trimmed to **Terraform / FAST infra only**. Use it as a mirror or archive.

**Canonical infra repo:** [gke-retail-infra](https://github.com/sadaf-jamal-au27/gke-retail-infra)

| Repo | Purpose |
|------|---------|
| [gke-retail-infra](https://github.com/sadaf-jamal-au27/gke-retail-infra) | GCP landing zone (apply here) |
| [gke-retail-application](https://github.com/sadaf-jamal-au27/gke-retail-application) | Apps & services (clone when infra is ready) |
| [gke-retail-devops](https://github.com/sadaf-jamal-au27/gke-retail-devops) | Helm & deploy |

## Infra quick start

```bash
cd infra   # or clone gke-retail-infra and use repo root
./scripts/gcp-bootstrap.sh dev
export TF_VAR_database_password='strong-password'
./scripts/tf-apply-all.sh dev plan
./scripts/tf-apply-all.sh dev apply
```

**Main doc (design, architecture, steps):** [`docs/PLATFORM_GUIDE.md`](docs/PLATFORM_GUIDE.md)

Also: `docs/INFRA_SETUP.md`, `docs/MULTI_REPO.md`, `docs/BRANCHING.md`, `docs/WIF_AND_GITHUB.md`

Do **not** nest-clone `gke-retail-infra` inside this folder.
