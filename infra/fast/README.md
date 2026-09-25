# FAST landing zone (single-project retail)

Adapted [Fabric FAST](https://github.com/GoogleCloudPlatform/cloud-foundation-fabric/tree/master/fast) stage model — **full structure:** [`docs/FAST_STRUCTURE.md`](../../docs/FAST_STRUCTURE.md).

```text
infra/fast/
  datasets/<env>/          ← edit env + stack tfvars HERE
  stages/0-bootstrap|1-network|2-platform/<stack>/   ← generated roots
  modules/                 ← wrappers (+ Fabric net-vpc in network/)
```

Apply order: `project_services` → `cloud_storage` → `github_wif` → `network` → `gke` → `cloudsql` → `pubsub`  
(`cloudrun` manual after app images.)

State: `gs://{state_bucket}/{env}/{stack}/` where `state_bucket` is in `datasets/<env>/env.tfvars`.

```bash
node infra/scripts/generate-fast-stages.mjs
./infra/scripts/gcp-bootstrap.sh dev
./infra/scripts/tf-apply-all.sh dev plan
./infra/scripts/test-static.sh dev
```

See [`../README.md`](../README.md).
