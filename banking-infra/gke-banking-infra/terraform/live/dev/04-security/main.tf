data "terraform_remote_state" "foundation" {
  backend = "gcs"

  config = {
    bucket = var.state_bucket_name
    prefix = "banking/dev/00-foundation"
  }
}

module "security" {
  source = "../../../modules/security"

  project_id             = var.project_id
  env                    = var.env
  audit_logs_bucket_name = data.terraform_remote_state.foundation.outputs.audit_logs_bucket_name
}
