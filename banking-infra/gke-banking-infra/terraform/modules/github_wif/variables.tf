variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }
variable "github_org" { type = string }
variable "github_repos" { type = list(string) }
variable "state_bucket_name" { type = string }
variable "assets_bucket_name" { type = string }

variable "pool_id" {
  type    = string
  default = "github-pool-banking"
}

variable "provider_id" {
  type    = string
  default = "github-provider-banking"
}

variable "ci_service_account_id" {
  type    = string
  default = "github-ci-banking"
}

variable "terraform_roles" {
  type        = list(string)
  description = "Least-privilege platform roles (never owner/editor)."
  default = [
    "roles/compute.networkAdmin",
    "roles/compute.securityAdmin",
    "roles/container.admin",
    "roles/cloudsql.admin",
    "roles/secretmanager.admin",
    "roles/artifactregistry.admin",
    "roles/pubsub.admin",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.serviceAccountUser",
    "roles/iam.workloadIdentityPoolAdmin",
    "roles/resourcemanager.projectIamAdmin",
    "roles/logging.configWriter",
    "roles/storage.admin",
    "roles/cloudkms.admin",
    "roles/dns.admin",
    "roles/binaryauthorization.policyEditor",
    "roles/accesscontextmanager.policyAdmin",
    "roles/orgpolicy.policyAdmin",
    "roles/vpcaccess.admin",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/iam.securityReviewer",
  ]
}

variable "enable_secret_manager_admin" {
  type    = bool
  default = false
}
