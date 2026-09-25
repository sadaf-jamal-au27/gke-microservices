# Helm commands (dev / qa / test / prod)

Chart path: `platform/helm/retail-platform`

## One-command deploy per environment

```bash
./scripts/helm-deploy.sh dev
./scripts/helm-deploy.sh qa
./scripts/helm-deploy.sh test
./scripts/helm-deploy.sh prod
```

## Manual Helm (equivalent)

```bash
# DEV
helm upgrade --install retail-dev platform/helm/retail-platform \
  --namespace retail-dev --create-namespace \
  -f platform/helm/retail-platform/values.yaml \
  -f platform/helm/retail-platform/values-dev.yaml \
  -f platform/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m

# QA
helm upgrade --install retail-qa platform/helm/retail-platform \
  --namespace retail-qa --create-namespace \
  -f platform/helm/retail-platform/values.yaml \
  -f platform/helm/retail-platform/values-qa.yaml \
  -f platform/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m

# TEST
helm upgrade --install retail-test platform/helm/retail-platform \
  --namespace retail-test --create-namespace \
  -f platform/helm/retail-platform/values.yaml \
  -f platform/helm/retail-platform/values-test.yaml \
  -f platform/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m

# PROD
helm upgrade --install retail-prod platform/helm/retail-platform \
  --namespace retail-prod --create-namespace \
  -f platform/helm/retail-platform/values.yaml \
  -f platform/helm/retail-platform/values-prod.yaml \
  -f platform/helm/retail-platform/services.generated.yaml \
  --wait --timeout 20m
```

## Post-deploy operations

```bash
# Lint / dry-run
helm lint platform/helm/retail-platform \
  -f platform/helm/retail-platform/values-dev.yaml \
  -f platform/helm/retail-platform/services.generated.yaml

helm template retail-dev platform/helm/retail-platform \
  -f platform/helm/retail-platform/values-dev.yaml \
  -f platform/helm/retail-platform/services.generated.yaml > /tmp/rendered.yaml

# Status / rollback
helm -n retail-dev status retail-dev
helm -n retail-dev history retail-dev
helm -n retail-dev rollback retail-dev

# Diff (plugin: helm-diff)
helm diff upgrade retail-dev platform/helm/retail-platform \
  -f platform/helm/retail-platform/values-dev.yaml \
  -f platform/helm/retail-platform/services.generated.yaml
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
