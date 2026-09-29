# Audit logging (evidence store). Destination is the bucket only — GCS sinks do not support object prefixes.

resource "google_logging_project_sink" "audit" {
  name        = "banking-${var.env}-audit-logs"
  project     = var.project_id
  destination = "storage.googleapis.com/${var.audit_logs_bucket_name}"

  filter = <<-EOT
    logName:"cloudaudit.googleapis.com"
    OR protoPayload.serviceName="cloudsql.googleapis.com"
    OR protoPayload.serviceName="container.googleapis.com"
    OR protoPayload.serviceName="iam.googleapis.com"
  EOT

  unique_writer_identity = true
}

resource "google_storage_bucket_iam_member" "audit_sink_writer" {
  bucket = var.audit_logs_bucket_name
  role   = "roles/storage.objectCreator"
  member = google_logging_project_sink.audit.writer_identity
}

resource "google_project_iam_audit_config" "banking" {
  project = var.project_id
  service = "allServices"

  audit_log_config {
    log_type = "ADMIN_READ"
  }

  audit_log_config {
    log_type = "DATA_WRITE"
  }

  audit_log_config {
    log_type = "DATA_READ"
  }
}

resource "google_logging_project_sink" "platform" {
  name        = "banking-${var.env}-platform-logs"
  project     = var.project_id
  destination = "storage.googleapis.com/${var.audit_logs_bucket_name}"

  filter = <<-EOT
    resource.type=("k8s_cluster" OR "k8s_container" OR "k8s_pod" OR "cloudsql_database")
  EOT

  unique_writer_identity = true
}

resource "google_storage_bucket_iam_member" "platform_sink_writer" {
  bucket = var.audit_logs_bucket_name
  role   = "roles/storage.objectCreator"
  member = google_logging_project_sink.platform.writer_identity
}
