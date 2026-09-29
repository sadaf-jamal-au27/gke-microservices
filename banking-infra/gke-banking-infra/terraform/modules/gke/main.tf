module "labels" {
  source = "../common"

  project_id = var.project_id
  env        = var.env
}

resource "google_artifact_registry_repository" "banking" {
  location      = var.region
  repository_id = "banking"
  format        = "DOCKER"
  description   = "Banking microservices (${var.env})"
  kms_key_name  = var.gar_kms_key_id
  labels        = module.labels.banking_labels
}

resource "google_binary_authorization_policy" "banking" {
  project = var.project_id

  admission_whitelist_patterns {
    name_pattern = "${var.region}-docker.pkg.dev/${var.project_id}/banking/*"
  }

  default_admission_rule {
    evaluation_mode  = "ALWAYS_ALLOW"
    enforcement_mode = var.env == "prod" ? "ENFORCED_BLOCK_AND_AUDIT_LOG" : "DRYRUN_AUDIT_LOG_ONLY"
  }

  global_policy_evaluation_mode = "ENABLE"
}

resource "google_service_account" "workload" {
  account_id   = "banking-workload-${var.env}"
  display_name = "Banking workload (${var.env})"
}

resource "google_project_iam_member" "workload_pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_project_iam_member" "workload_pubsub_subscriber" {
  project = var.project_id
  role    = "roles/pubsub.subscriber"
  member  = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_project_iam_member" "workload_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_project_iam_member" "workload_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_project_iam_member" "workload_artifact_registry_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_storage_bucket_iam_member" "workload_assets" {
  bucket = var.assets_bucket_name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_secret_manager_secret" "app" {
  for_each = toset(var.secret_ids)

  project   = var.project_id
  secret_id = each.value

  replication {
    user_managed {
      replicas {
        location = var.region
        customer_managed_encryption {
          kms_key_name = var.secrets_kms_key_id
        }
      }
    }
  }

  labels = module.labels.banking_labels
}

resource "google_container_cluster" "primary" {
  provider = google-beta

  name     = "banking-${var.env}"
  location = var.region

  enable_autopilot = true
  networking_mode  = "VPC_NATIVE"

  network    = var.network_name
  subnetwork = var.subnet_name

  ip_allocation_policy {
    cluster_secondary_range_name  = var.pods_range_name
    services_secondary_range_name = var.services_range_name
  }

  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = true
    master_ipv4_cidr_block  = var.master_ipv4_cidr

    master_global_access_config {
      enabled = true
    }
  }

  master_authorized_networks_config {
    gcp_public_cidrs_access_enabled = false

    dynamic "cidr_blocks" {
      for_each = var.master_authorized_cidrs
      content {
        cidr_block   = cidr_blocks.value.cidr_block
        display_name = cidr_blocks.value.display_name
      }
    }
  }

  binary_authorization {
    evaluation_mode = "PROJECT_SINGLETON_POLICY_ENFORCE"
  }

  security_posture_config {
    mode               = "BASIC"
    vulnerability_mode = "VULNERABILITY_BASIC"
  }

  database_encryption {
    state    = "ENCRYPTED"
    key_name = var.gke_kms_key_id
  }

  release_channel {
    channel = "REGULAR"
  }

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }
}

resource "google_service_account_iam_member" "workload_identity" {
  service_account_id = google_service_account.workload.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[${var.k8s_namespace}/${var.k8s_service_account}]"

  depends_on = [google_container_cluster.primary]
}
