include "root" {
  path = find_in_parent_folders("root.hcl")
}

include "env" {
  path   = find_in_parent_folders("env.hcl")
  expose = true
}

terraform {
  source = "../../../../terraform/modules/cloud_storage"

  extra_arguments "module_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      "${get_terragrunt_dir()}/cloud_storage.tfvars",
    ]
  }
}

inputs = merge(
  include.env.inputs,
  {
    project_id = include.env.locals.project_id
    region     = include.env.locals.region
    env        = include.env.locals.environment
  }
)
