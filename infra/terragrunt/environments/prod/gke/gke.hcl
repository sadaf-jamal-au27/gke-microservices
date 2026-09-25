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
    network_name          = "mock-network"
    gke_subnet_name       = "mock-subnet"
    pods_range_name       = "pods"
    services_range_name   = "services"
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan"]
}

terraform {
  source = "../../../../terraform/modules/gke"

  extra_arguments "module_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      "${get_terragrunt_dir()}/gke.tfvars",
    ]
  }
}

inputs = merge(
  include.env.inputs,
  {
    project_id          = include.env.locals.project_id
    region              = include.env.locals.region
    env                 = include.env.locals.environment
    network_name        = dependency.network.outputs.network_name
    subnet_name         = dependency.network.outputs.gke_subnet_name
    pods_range_name     = dependency.network.outputs.pods_range_name
    services_range_name = dependency.network.outputs.services_range_name
  }
)
