output "cloudsql_psc_ip" {
  value = module.cloudsql.psc_endpoint_ip
}

output "cloudsql_private_ip" {
  value       = module.cloudsql.private_ip
  description = "PSC consumer IP for DB_HOST"
}

output "cloudsql_dns_name" {
  value = module.cloudsql.dns_name
}

output "cloudsql_connection_name" {
  value = module.cloudsql.connection_name
}

output "database_name" {
  value = module.cloudsql.database_name
}

output "database_user" {
  value = module.cloudsql.database_user
}
