data "terraform_remote_state" "foundation" {
  backend = "gcs"

  config = {
    bucket = var.state_bucket_name
    prefix = "banking/dev/00-foundation"
  }
}

module "network" {
  source = "../../../modules/network"

  project_id                  = var.project_id
  region                      = var.region
  env                         = var.env
  master_ipv4_cidr            = var.master_ipv4_cidr
  project_services_dependency = data.terraform_remote_state.foundation.outputs.apis_enabled
}
