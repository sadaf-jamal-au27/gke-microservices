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

data "terraform_remote_state" "platform" {
  backend = "gcs"

  config = {
    bucket = var.state_bucket_name
    prefix = "banking/dev/05-platform"
  }
}

module "cloudsql" {
  source = "../../../modules/cloudsql"

  project_id                     = var.project_id
  region                         = var.region
  env                            = var.env
  network_id                     = data.terraform_remote_state.network.outputs.network_id
  psc_subnet_self_link           = data.terraform_remote_state.network.outputs.psc_subnet_self_link
  sql_kms_key_id                 = data.terraform_remote_state.foundation.outputs.sql_key_id
  database_password              = var.database_password
  workload_service_account_email = data.terraform_remote_state.platform.outputs.workload_service_account_email
  dr_region                      = var.dr_region
}
