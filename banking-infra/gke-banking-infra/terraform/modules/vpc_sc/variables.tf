variable "org_id" {
  type        = string
  description = "GCP organization ID (numeric)."
}

variable "project_number" {
  type = string
}

variable "env" {
  type = string
}

variable "enable_vpc_sc" {
  type    = bool
  default = true
}

variable "access_policy_id" {
  type        = string
  default     = ""
  description = "Existing Access Context Manager policy ID. Empty creates one (org can have only one)."
}

variable "create_access_policy" {
  type        = bool
  default     = false
  description = "Set true only if the org has no Access Policy yet."
}

variable "ci_service_account_email" {
  type        = string
  description = "Terraform CI SA allowed to ingress the perimeter."
}

variable "restricted_services" {
  type = list(string)
  default = [
    "storage.googleapis.com",
    "sqladmin.googleapis.com",
    "container.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "pubsub.googleapis.com",
    "cloudkms.googleapis.com",
    "logging.googleapis.com",
    "containerregistry.googleapis.com",
    "binaryauthorization.googleapis.com",
  ]
}
