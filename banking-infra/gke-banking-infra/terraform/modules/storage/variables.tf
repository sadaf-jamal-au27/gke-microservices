variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }
variable "state_bucket_name" { type = string }

variable "assets_kms_key_id" {
  type = string
}

variable "audit_kms_key_id" {
  type        = string
  description = "CMEK in the same location as the audit bucket (e.g. asia)."
}

variable "force_destroy" {
  type    = bool
  default = false
}

variable "enable_versioning" {
  type    = bool
  default = true
}

variable "audit_location" {
  type        = string
  default     = "ASIA"
  description = "Dual-region / multi-region for DR of audit evidence."
}

variable "audit_log_retention_seconds" {
  type        = number
  description = "Minimum object retention. Dev default 1 year; prod should be 7 years (220752000)."
  default     = 31536000
}

variable "lock_audit_retention" {
  type        = bool
  default     = false
  description = "Irreversible lock. Enable in prod after legal review."
}
