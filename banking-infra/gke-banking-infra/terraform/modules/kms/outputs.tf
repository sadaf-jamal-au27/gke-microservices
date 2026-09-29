output "key_ring_id" {
  value = google_kms_key_ring.regional.id
}

output "sql_key_id" {
  value = google_kms_crypto_key.sql.id
}

output "gcs_key_id" {
  value = google_kms_crypto_key.gcs.id
}

output "gcs_regional_key_id" {
  value = google_kms_crypto_key.gcs_regional.id
}

output "gke_key_id" {
  value = google_kms_crypto_key.gke.id
}

output "secrets_key_id" {
  value = google_kms_crypto_key.secrets.id
}

output "gar_key_id" {
  value = google_kms_crypto_key.gar.id
}
