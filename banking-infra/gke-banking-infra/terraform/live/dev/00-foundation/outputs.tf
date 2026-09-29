output "project_id" { value = var.project_id }
output "region" { value = var.region }
output "env" { value = var.env }
output "state_bucket_name" { value = module.storage.state_bucket_name }
output "assets_bucket_name" { value = module.storage.assets_bucket_name }
output "audit_logs_bucket_name" { value = module.storage.audit_logs_bucket_name }
output "sql_key_id" { value = module.kms.sql_key_id }
output "gcs_key_id" { value = module.kms.gcs_key_id }
output "gcs_regional_key_id" { value = module.kms.gcs_regional_key_id }
output "gke_key_id" { value = module.kms.gke_key_id }
output "secrets_key_id" { value = module.kms.secrets_key_id }
output "gar_key_id" { value = module.kms.gar_key_id }
output "apis_enabled" {
  value      = true
  depends_on = [module.project_services]
}
