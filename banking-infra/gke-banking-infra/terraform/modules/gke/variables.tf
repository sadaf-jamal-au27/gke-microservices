variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }
variable "network_name" { type = string }
variable "subnet_name" { type = string }
variable "pods_range_name" { type = string }
variable "services_range_name" { type = string }
variable "assets_bucket_name" { type = string }

variable "gke_kms_key_id" { type = string }
variable "secrets_kms_key_id" { type = string }
variable "gar_kms_key_id" { type = string }

variable "master_ipv4_cidr" {
  type    = string
  default = "172.16.0.0/28"
}

variable "allow_insecure_master_access" {
  type        = bool
  default     = false
  description = "Must stay false for banking LZ."
}

variable "master_authorized_cidrs" {
  type = list(object({
    cidr_block   = string
    display_name = string
  }))
  description = "VPN / IAP / private runner CIDRs that can reach the private control plane."

  validation {
    condition     = var.allow_insecure_master_access || !contains([for c in var.master_authorized_cidrs : c.cidr_block], "0.0.0.0/0")
    error_message = "Banking LZ forbids 0.0.0.0/0 on the GKE master endpoint unless allow_insecure_master_access is true."
  }
}

variable "k8s_namespace" {
  type    = string
  default = "banking-dev"
}

variable "k8s_service_account" {
  type    = string
  default = "banking-app"
}

variable "secret_ids" {
  type = list(string)
  default = [
    "banking-db-password",
    "banking-app-config",
    "banking-service-mesh-token",
  ]
}
