variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }
variable "network_id" { type = string }
variable "psc_subnet_self_link" { type = string }

variable "sql_kms_key_id" {
  type = string
}

variable "database_password" {
  type      = string
  sensitive = true
}

variable "workload_service_account_email" {
  type        = string
  default     = ""
  description = "GKE workload SA for Cloud SQL IAM DB authentication."
}

variable "tier" {
  type    = string
  default = "db-custom-2-7680"
}

variable "availability_type" {
  type        = string
  default     = "REGIONAL"
  description = "REGIONAL = HA in-region DR. Cross-region recovery uses backup location."
}

variable "disk_size_gb" {
  type    = number
  default = 50
}

variable "dr_region" {
  type        = string
  default     = "asia-south2"
  description = "Cloud SQL backup location (cross-region DR)."
}

variable "transaction_log_retention_days" {
  type    = number
  default = 7
}

variable "backup_retained_count" {
  type    = number
  default = 14
}

variable "deletion_protection" {
  type    = bool
  default = true
}
