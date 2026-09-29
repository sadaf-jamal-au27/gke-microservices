# Project-level constraints. Banks typically set these at folder/org; project overlay still enforces this env.

resource "google_org_policy_policy" "disable_sa_keys" {
  count  = var.enable_org_policies ? 1 : 0
  name   = "projects/${var.project_id}/policies/iam.disableServiceAccountKeyCreation"
  parent = "projects/${var.project_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

resource "google_org_policy_policy" "sql_no_public_ip" {
  count  = var.enable_org_policies ? 1 : 0
  name   = "projects/${var.project_id}/policies/sql.restrictPublicIp"
  parent = "projects/${var.project_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

resource "google_org_policy_policy" "uniform_bucket" {
  count  = var.enable_org_policies ? 1 : 0
  name   = "projects/${var.project_id}/policies/storage.uniformBucketLevelAccess"
  parent = "projects/${var.project_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

resource "google_org_policy_policy" "no_default_sa_grants" {
  count  = var.enable_org_policies ? 1 : 0
  name   = "projects/${var.project_id}/policies/iam.automaticIamGrantsForDefaultServiceAccounts"
  parent = "projects/${var.project_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

resource "google_org_policy_policy" "restrict_vm_external_ip" {
  count  = var.enable_org_policies ? 1 : 0
  name   = "projects/${var.project_id}/policies/compute.vmExternalIpAccess"
  parent = "projects/${var.project_id}"

  spec {
    rules {
      deny_all = "TRUE"
    }
  }
}
