# DevOps layer

Kubernetes delivery and database migrations.

```bash
./devops/scripts/validate-helm.sh dev
./devops/scripts/helm-deploy.sh dev          # needs kubectl + cluster
PROJECT_ID=... ./devops/scripts/build-all-images.sh
```

Helm chart: `devops/helm/retail-platform/`
