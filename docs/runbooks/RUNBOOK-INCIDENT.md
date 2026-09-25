# Incident runbook (retail platform)

## Severity guide

- **SEV1**: Checkout down, payment failures >5%, data breach suspected.
- **SEV2**: Single domain degraded (catalog, notifications).
- **SEV3**: Non-critical service unhealthy.

## First 15 minutes

1. Confirm blast radius via Gateway metrics and BFF error rate.
2. `kubectl -n retail get pods | grep -v Running`
3. Check Cloud SQL connections and CPU in Cloud Console.
4. Inspect Pub/Sub backlog for `retail.order-placed` subscription lag.

## Common fixes

| Symptom | Likely cause | Mitigation |
|---------|--------------|------------|
| 502 from Gateway | BFF pods not ready | Scale BFF replicas; check probes |
| SQL connection errors | Pool exhaustion | Raise `DB_POOL_MAX`; scale Cloud SQL |
| Pub/Sub publish failures | IAM / topic missing | Verify Workload Identity + topic names |
| Elevated latency | Cold starts on Cloud Run | Set `min_instance_count` |

## Communication

- Status page update every 30 minutes for SEV1.
- Post-incident review within 48h with action items in ticket system.
