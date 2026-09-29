output "perimeter_name" {
  value = try(google_access_context_manager_service_perimeter.banking[0].name, null)
}

output "access_policy_id" {
  value = var.enable_vpc_sc ? local.policy_id : null
}
