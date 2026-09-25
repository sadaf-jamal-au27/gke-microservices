include "root" {
  path = find_in_parent_folders("root.hcl")
}

include "env" {
  path   = find_in_parent_folders("env.hcl")
  expose = true
}

dependency "network" {
  config_path = "../network"
  mock_outputs = {
    network_id = "projects/mock/global/networks/mock"
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan"]
}

terraform {
  source = "../../../../terraform/modules/cloudsql"

  extra_arguments "module_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      "${get_terragrunt_dir()}/cloudsql.tfvars",
    ]
  }
}

inputs = merge(
  include.env.inputs,
  {
    project_id        = include.env.locals.project_id
    region            = include.env.locals.region
    env               = include.env.locals.environment
    network_id        = dependency.network.outputs.network_id
    database_password = get_env("TF_VAR_database_password", "replace-me-local-only")
  }
)
