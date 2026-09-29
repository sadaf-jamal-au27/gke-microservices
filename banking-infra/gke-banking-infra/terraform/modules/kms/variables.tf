variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }

variable "rotation_period" {
  type        = string
  default     = "7776000s"
  description = "CMEK rotation period."
}

variable "gcs_kms_location" {
  type        = string
  default     = "asia"
  description = "Must match audit/assets bucket location for CMEK (ASIA dual-region → asia)."
}
