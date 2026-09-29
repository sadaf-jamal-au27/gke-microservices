# Standard resource labels (banking landing zone).

variable "env" {
  type = string
}

variable "project_id" {
  type = string
}

variable "cost_center" {
  type    = string
  default = "digital-banking"
}

variable "data_classification" {
  type    = string
  default = "confidential"
}

locals {
  banking_labels = {
    env                 = var.env
    product             = "banking"
    cost_center         = var.cost_center
    data_classification = var.data_classification
    managed_by          = "terraform"
    compliance_scope    = "pci-dss-aligned-dev"
  }
}

output "banking_labels" {
  value = local.banking_labels
}
