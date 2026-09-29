module "labels" {
  source = "../common"

  project_id = var.project_id
  env        = var.env
}

resource "google_sql_database_instance" "banking" {
  name                = "banking-${var.env}-pg"
  database_version    = "POSTGRES_15"
  region              = var.region
  encryption_key_name = var.sql_kms_key_id

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_autoresize   = true
    disk_size         = var.disk_size_gb
    disk_type         = "PD_SSD"

    user_labels = module.labels.banking_labels

    ip_configuration {
      ipv4_enabled = false
      ssl_mode     = "ENCRYPTED_ONLY"
      psc_config {
        psc_enabled               = true
        allowed_consumer_projects = [var.project_id]
      }
    }

    backup_configuration {
      enabled                        = true
      location                       = var.dr_region
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = var.transaction_log_retention_days
      start_time                     = "19:00"

      backup_retention_settings {
        retained_backups = var.backup_retained_count
        retention_unit   = "COUNT"
      }
    }

    maintenance_window {
      day          = 7
      hour         = 3
      update_track = "stable"
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 4096
      record_application_tags = true
      record_client_address   = true
    }

    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }

    database_flags {
      name  = "log_disconnections"
      value = "on"
    }

    database_flags {
      name  = "log_checkpoints"
      value = "on"
    }

    database_flags {
      name  = "log_statement"
      value = "ddl"
    }
  }

  deletion_protection = var.deletion_protection
}

resource "google_compute_address" "sql_psc" {
  name         = "banking-${var.env}-sql-psc"
  region       = var.region
  address_type = "INTERNAL"
  subnetwork   = var.psc_subnet_self_link
  purpose      = "GCE_ENDPOINT"
}

resource "google_compute_forwarding_rule" "sql_psc" {
  name                    = "banking-${var.env}-sql-psc"
  region                  = var.region
  network                 = var.network_id
  ip_address              = google_compute_address.sql_psc.self_link
  load_balancing_scheme   = ""
  target                  = google_sql_database_instance.banking.psc_service_attachment_link
  allow_psc_global_access = true
}

resource "google_sql_database" "banking" {
  name     = "banking"
  instance = google_sql_database_instance.banking.name
}

resource "google_sql_user" "app" {
  name     = "banking_app"
  instance = google_sql_database_instance.banking.name
  password = var.database_password
}

resource "google_sql_user" "iam_workload" {
  count    = var.workload_service_account_email == "" ? 0 : 1
  name     = trimsuffix(var.workload_service_account_email, ".gserviceaccount.com")
  instance = google_sql_database_instance.banking.name
  type     = "CLOUD_IAM_SERVICE_ACCOUNT"
}

resource "google_dns_managed_zone" "sql_psc" {
  name       = "banking-${var.env}-sql-psc"
  dns_name   = "sql.internal."
  project    = var.project_id
  visibility = "private"

  private_visibility_config {
    networks {
      network_url = var.network_id
    }
  }
}

resource "google_dns_record_set" "sql_psc" {
  name         = "postgres.sql.internal."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.sql_psc.name
  project      = var.project_id
  rrdatas      = [google_compute_address.sql_psc.address]
}
