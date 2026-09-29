locals {
  policy_id      = var.create_access_policy ? google_access_context_manager_access_policy.banking[0].name : var.access_policy_id
  perimeter_name = "banking_${replace(var.env, "-", "_")}"
}

resource "google_access_context_manager_access_policy" "banking" {
  count  = var.enable_vpc_sc && var.create_access_policy ? 1 : 0
  parent = "organizations/${var.org_id}"
  title  = "banking-${var.env}"
}

resource "google_access_context_manager_service_perimeter" "banking" {
  count = var.enable_vpc_sc ? 1 : 0

  parent = "accessPolicies/${local.policy_id}"
  name   = "accessPolicies/${local.policy_id}/servicePerimeters/${local.perimeter_name}"
  title  = "banking-${var.env}-regular"

  status {
    resources           = ["projects/${var.project_number}"]
    restricted_services = var.restricted_services

    vpc_accessible_services {
      enable_restriction = true
      allowed_services   = ["RESTRICTED-SERVICES"]
    }

    ingress_policies {
      ingress_from {
        identities = ["serviceAccount:${var.ci_service_account_email}"]
        sources {
          access_level = "*"
        }
      }
      ingress_to {
        resources = ["*"]
        operations {
          service_name = "*"
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [status[0].access_levels]
  }
}
