locals {
  env_cfg = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

remote_state {
  backend = "gcs"
  config = {
    bucket = "${local.env_cfg.locals.project_id}-retail-tfstate-${local.env_cfg.locals.environment}"
    prefix = "${path_relative_to_include()}/terraform.tfstate"
  }
}
