# WIF + GitHub

**GCP:** `ai-rag-agent-project` · **region:** `asia-south1`  
**App repo:** [sadaf-jamal-au27/apex-bank-app](https://github.com/sadaf-jamal-au27/apex-bank-app)  
**Infra CI host (until split):** [sadaf-jamal-au27/gke-microservices](https://github.com/sadaf-jamal-au27/gke-microservices)

`github_repos` in `shared.tfvars` must include every repo that will federate:

```hcl
github_repos = [
  "apex-bank-app",
  "gke-microservices",
]
```

Laptop: apply `00-foundation` then `01-iam`. Copy outputs into GitHub Environment **dev**:

| Secret | From |
|--------|------|
| `GCP_WIF_PROVIDER` | `wif_provider` |
| `GCP_CI_SERVICE_ACCOUNT` | `ci_service_account_email` |
| `TF_VAR_DATABASE_PASSWORD` | Cloud SQL app password (infra apply only) |

App repo needs WIF only when pushing images to Artifact Registry. Typecheck/build/docker-build do not.
