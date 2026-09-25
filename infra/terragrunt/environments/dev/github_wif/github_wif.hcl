include "root" {
  path = find_in_parent_folders("root.hcl")
}

include "env" {
  path   = find_in_parent_folders("env.hcl")
  expose = true
}

terraform {
  source = "../../../../terraform/modules/github_wif"

  extra_arguments "module_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      "${get_terragrunt_dir()}/github_wif.tfvars",
    ]
  }
}

inputs = merge(
  include.env.inputs,
  {
    project_id  = include.env.locals.project_id
    env         = include.env.locals.environment
    github_org  = include.env.locals.github_org
    github_repo = include.env.locals.github_repo
  }
)
