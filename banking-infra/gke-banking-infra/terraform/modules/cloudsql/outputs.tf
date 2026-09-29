output "instance_name" {
  value = google_sql_database_instance.banking.name
}

output "connection_name" {
  value = google_sql_database_instance.banking.connection_name
}

output "psc_endpoint_ip" {
  value = google_compute_address.sql_psc.address
}

output "private_ip" {
  value       = google_compute_address.sql_psc.address
  description = "PSC consumer IP — use as DB_HOST (not legacy PSA IP)."
}

output "dns_name" {
  value = google_dns_record_set.sql_psc.name
}

output "database_name" {
  value = google_sql_database.banking.name
}

output "database_user" {
  value = google_sql_user.app.name
}

output "psc_service_attachment" {
  value = google_sql_database_instance.banking.psc_service_attachment_link
}
