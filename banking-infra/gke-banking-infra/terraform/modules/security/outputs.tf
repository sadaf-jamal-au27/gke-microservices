output "audit_sink_name" {
  value = google_logging_project_sink.audit.name
}

output "platform_sink_name" {
  value = google_logging_project_sink.platform.name
}
