# Helm commands (dev / qa / test / prod)

Chart path: `devops/helm/retail-platform`

## One-command deploy per environment

```bash
./devops/scripts/helm-deploy.sh dev
./devops/scripts/helm-deploy.sh qa
./devops/scripts/helm-deploy.sh test
./devops/scripts/helm-deploy.sh prod
```

## Manual Helm (equivalent)

```bash
# DEV
helm upgrade --install retail-dev devops/helm/retail-platform \
  --namespace retail-dev --create-namespace \
  -f devops/helm/retail-platform/values.yaml \
  -f devops/helm/retail-platform/values-dev.yaml \
  -f devops/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m

# QA
helm upgrade --install retail-qa devops/helm/retail-platform \
  --namespace retail-qa --create-namespace \
  -f devops/helm/retail-platform/values.yaml \
  -f devops/helm/retail-platform/values-qa.yaml \
  -f devops/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m

# TEST
helm upgrade --install retail-test devops/helm/retail-platform \
  --namespace retail-test --create-namespace \
  -f devops/helm/retail-platform/values.yaml \
  -f devops/helm/retail-platform/values-test.yaml \
  -f devops/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m

# PROD
helm upgrade --install retail-prod devops/helm/retail-platform \
  --namespace retail-prod --create-namespace \
  -f devops/helm/retail-platform/values.yaml \
  -f devops/helm/retail-platform/values-prod.yaml \
  -f devops/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m
```

## Post-deploy operations

```bash
# Lint / dry-run
helm lint devops/helm/retail-platform \
  -f devops/helm/retail-platform/values-dev.yaml \
  -f devops/helm/retail-platform/services.generated.yaml

helm template retail-dev devops/helm/retail-platform \
  -f devops/helm/retail-platform/values-dev.yaml \
  -f devops/helm/retail-platform/services.generated.yaml > /tmp/rendered.yaml

# Status / rollback
helm -n retail-dev status retail-dev
helm -n retail-dev history retail-dev
helm -n retail-dev rollback retail-dev

# Diff (plugin: helm-diff)
helm diff upgrade retail-dev devops/helm/retail-platform \
  -f devops/helm/retail-platform/values-dev.yaml \
  -f devops/helm/retail-platform/services.generated.yaml
```

## GKE Gateway API (once per cluster)

```bash
gcloud container clusters update retail-dev \
  --region=asia-south1 --gateway-api=standard
```

## kubectl after Helm

```bash
gcloud container clusters get-credentials retail-dev --region asia-south1
kubectl -n retail-dev get pods
kubectl -n retail-dev get gateway,httproute
kubectl -n retail-dev create secret generic retail-db \
  --from-literal=password="$TF_VAR_database_password"
```

See also: [RUNBOOK-DEPLOY.md](./RUNBOOK-DEPLOY.md), [infra/README.md](../infra/README.md).
