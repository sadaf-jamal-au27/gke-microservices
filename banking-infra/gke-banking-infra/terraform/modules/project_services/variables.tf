variable "project_id" {
  type = string
}

variable "services" {
  type = list(string)
  default = [
    "compute.googleapis.com",
    "container.googleapis.com",
    "sqladmin.googleapis.com",
    "servicenetworking.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "certificatemanager.googleapis.com",
    "pubsub.googleapis.com",
    "vpcaccess.googleapis.com",
    "storage.googleapis.com",
    "logging.googleapis.com",
    "cloudkms.googleapis.com",
    "dns.googleapis.com",
    "accesscontextmanager.googleapis.com",
    "orgpolicy.googleapis.com",
    "binaryauthorization.googleapis.com",
    "containersecurity.googleapis.com",
    "networkconnectivity.googleapis.com",
    "iap.googleapis.com",
    "monitoring.googleapis.com",
    "securitycenter.googleapis.com",
  ]
}
