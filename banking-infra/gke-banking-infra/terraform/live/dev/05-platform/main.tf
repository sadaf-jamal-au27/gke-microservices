data "terraform_remote_state" "foundation" {
  backend = "gcs"

  config = {
    bucket = var.state_bucket_name
    prefix = "banking/dev/00-foundation"
  }
}

data "terraform_remote_state" "network" {
  backend = "gcs"

  config = {
    bucket = var.state_bucket_name
    prefix = "banking/dev/02-network"
  }
}

module "gke" {
  source = "../../../modules/gke"

  project_id              = var.project_id
  region                  = var.region
  env                     = var.env
  network_name            = data.terraform_remote_state.network.outputs.network_name
  subnet_name             = data.terraform_remote_state.network.outputs.gke_subnet_name
  pods_range_name         = data.terraform_remote_state.network.outputs.pods_range_name
  services_range_name     = data.terraform_remote_state.network.outputs.services_range_name
  assets_bucket_name      = data.terraform_remote_state.foundation.outputs.assets_bucket_name
  gke_kms_key_id          = data.terraform_remote_state.foundation.outputs.gke_key_id
  secrets_kms_key_id      = data.terraform_remote_state.foundation.outputs.secrets_key_id
  gar_kms_key_id          = data.terraform_remote_state.foundation.outputs.gar_key_id
  master_ipv4_cidr        = var.master_ipv4_cidr
  master_authorized_cidrs = var.master_authorized_cidrs
  k8s_namespace           = var.k8s_namespace
  k8s_service_account     = var.k8s_service_account
}

module "pubsub" {
  source = "../../../modules/pubsub"

  project_id = var.project_id
  env        = var.env

  depends_on = [module.gke]
}
