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
    serverless_connector_id = "projects/mock/locations/asia-south1/connectors/mock"
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan"]
}

dependency "gke" {
  config_path = "../gke"
  mock_outputs = {
    workload_gsa_email = "mock@mock.iam.gserviceaccount.com"
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan"]
}

terraform {
  source = "../../../../terraform/modules/cloudrun"

  extra_arguments "module_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      "${get_terragrunt_dir()}/cloudrun.tfvars",
    ]
  }
}

inputs = merge(
  include.env.inputs,
  {
    project_id       = include.env.locals.project_id
    region           = include.env.locals.region
    env              = include.env.locals.environment
    vpc_connector_id = dependency.network.outputs.serverless_connector_id
    bff_sa_email     = dependency.gke.outputs.workload_gsa_email
  }
)
