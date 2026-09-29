module "labels" {
  source = "../common"

  project_id = var.project_id
  env        = var.env
}

resource "google_storage_bucket" "assets" {
  name                        = "${var.project_id}-banking-assets-${var.env}"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = var.force_destroy

  versioning {
    enabled = var.enable_versioning
  }

  encryption {
    default_kms_key_name = var.assets_kms_key_id
  }

  labels = module.labels.banking_labels
}

resource "google_storage_bucket" "audit_logs" {
  name                        = "${var.project_id}-banking-audit-${var.env}"
  location                    = var.audit_location
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false

  versioning {
    enabled = true
  }

  retention_policy {
    is_locked        = var.lock_audit_retention
    retention_period = var.audit_log_retention_seconds
  }

  encryption {
    default_kms_key_name = var.audit_kms_key_id
  }

  labels = merge(module.labels.banking_labels, {
    purpose = "audit-logs"
  })
}

data "google_storage_bucket" "terraform_state" {
  name = var.state_bucket_name
}
