output "ci_service_account_email" {
  value = module.github_wif.ci_service_account_email
}

output "wif_provider" {
  value = module.github_wif.workload_identity_provider
}

output "break_glass_email" {
  value = module.iam.break_glass_email
}
