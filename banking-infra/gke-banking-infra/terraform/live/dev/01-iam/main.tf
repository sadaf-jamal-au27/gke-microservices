data "terraform_remote_state" "foundation" {
  backend = "gcs"

  config = {
    bucket = var.state_bucket_name
    prefix = "banking/dev/00-foundation"
  }
}

module "iam" {
  source = "../../../modules/iam"

  project_id          = var.project_id
  env                 = var.env
  break_glass_members = var.break_glass_members
}

module "github_wif" {
  source = "../../../modules/github_wif"

  project_id         = var.project_id
  region             = var.region
  env                = var.env
  github_org         = var.github_org
  github_repos       = var.github_repos
  state_bucket_name  = data.terraform_remote_state.foundation.outputs.state_bucket_name
  assets_bucket_name = data.terraform_remote_state.foundation.outputs.assets_bucket_name
}
