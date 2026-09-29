module "project_services" {
  source = "../../../modules/project_services"

  project_id = var.project_id
}

module "kms" {
  source = "../../../modules/kms"

  project_id = var.project_id
  region     = var.region
  env        = var.env

  depends_on = [module.project_services]
}

module "storage" {
  source = "../../../modules/storage"

  project_id                  = var.project_id
  region                      = var.region
  env                         = var.env
  state_bucket_name           = var.state_bucket_name
  assets_kms_key_id           = module.kms.gcs_regional_key_id
  audit_kms_key_id            = module.kms.gcs_key_id
  force_destroy               = false
  audit_log_retention_seconds = var.audit_log_retention_seconds
  lock_audit_retention        = var.lock_audit_retention

  depends_on = [module.kms]
}

module "org_policies" {
  source = "../../../modules/org_policies"

  project_id          = var.project_id
  enable_org_policies = var.enable_org_policies

  depends_on = [module.project_services]
}
