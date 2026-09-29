# Declared in every stack so ../shared.tfvars can be passed uniformly.

variable "project_id" { type = string }
variable "org_id" { type = string }
variable "region" { type = string }
variable "dr_region" { type = string }
variable "env" { type = string }
variable "state_bucket_name" { type = string }
variable "github_org" { type = string }
variable "github_repos" { type = list(string) }
variable "access_policy_id" { type = string }
variable "create_access_policy" { type = bool }
variable "enable_vpc_sc" { type = bool }
variable "enable_org_policies" { type = bool }
variable "k8s_namespace" { type = string }
variable "k8s_service_account" { type = string }
variable "master_ipv4_cidr" { type = string }
variable "master_authorized_cidrs" {
  type = list(object({
    cidr_block   = string
    display_name = string
  }))
}
variable "break_glass_members" {
  type    = list(string)
  default = []
}
variable "audit_log_retention_seconds" {
  type    = number
  default = 31536000
}
variable "lock_audit_retention" {
  type    = bool
  default = false
}
