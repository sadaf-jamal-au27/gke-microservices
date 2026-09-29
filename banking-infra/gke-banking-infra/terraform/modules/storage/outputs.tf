output "assets_bucket_name" {
  value = google_storage_bucket.assets.name
}

output "state_bucket_name" {
  value = data.google_storage_bucket.terraform_state.name
}

output "audit_logs_bucket_name" {
  value = google_storage_bucket.audit_logs.name
}
