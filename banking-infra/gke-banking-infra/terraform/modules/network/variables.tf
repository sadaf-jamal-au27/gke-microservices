variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }

variable "gke_subnet_cidr" {
  type    = string
  default = "10.10.0.0/20"
}

variable "pods_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "services_cidr" {
  type    = string
  default = "10.30.0.0/20"
}

variable "data_subnet_cidr" {
  type    = string
  default = "10.11.0.0/24"
}

variable "psc_subnet_cidr" {
  type    = string
  default = "10.12.0.0/24"
}

variable "serverless_connector_cidr" {
  type    = string
  default = "10.8.0.0/28"
}

variable "enable_serverless_connector" {
  type    = bool
  default = false
}

variable "enable_psa" {
  type        = bool
  default     = false
  description = "Legacy Private Service Access. Prefer PSC for Cloud SQL."
}

variable "project_services_dependency" {
  type    = any
  default = null
}

variable "master_ipv4_cidr" {
  type    = string
  default = "172.16.0.0/28"
}

variable "iap_source_ranges" {
  type        = list(string)
  default     = ["35.235.240.0/20"]
  description = "IAP TCP forwarding for break-glass bastion."
}
