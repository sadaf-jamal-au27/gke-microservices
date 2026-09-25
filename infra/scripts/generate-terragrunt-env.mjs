#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const tgRoot = path.join(root, "terragrunt");
const modulesRoot = path.join(root, "terraform", "modules");

const ENVIRONMENTS = [
  {
    name: "dev",
    project_id: "REPLACE_GCP_DEV_PROJECT",
    gke_subnet_cidr: "10.10.0.0/20",
    master_ipv4_cidr: "172.16.0.0/28",
    master_authorized_cidr: "0.0.0.0/0",
    sql_tier: "db-custom-1-3840",
    sql_availability: "ZONAL",
    cloudrun_public: true,
    force_destroy_buckets: true,
  },
  {
    name: "qa",
    project_id: "REPLACE_GCP_QA_PROJECT",
    gke_subnet_cidr: "10.12.0.0/20",
    master_ipv4_cidr: "172.16.1.0/28",
    master_authorized_cidr: "0.0.0.0/0",
    sql_tier: "db-custom-1-3840",
    sql_availability: "ZONAL",
    cloudrun_public: false,
    force_destroy_buckets: true,
  },
  {
    name: "test",
    project_id: "REPLACE_GCP_TEST_PROJECT",
    gke_subnet_cidr: "10.14.0.0/20",
    master_ipv4_cidr: "172.16.2.0/28",
    master_authorized_cidr: "0.0.0.0/0",
    sql_tier: "db-custom-2-8192",
    sql_availability: "ZONAL",
    cloudrun_public: false,
    force_destroy_buckets: false,
  },
  {
    name: "prod",
    project_id: "REPLACE_GCP_PROD_PROJECT",
    gke_subnet_cidr: "10.16.0.0/20",
    master_ipv4_cidr: "172.16.3.0/28",
    master_authorized_cidr: "203.0.113.10/32",
    sql_tier: "db-custom-2-8192",
    sql_availability: "REGIONAL",
    cloudrun_public: false,
    force_destroy_buckets: false,
  },
];

const STACKS = {
  project_services: {
    source: "project_services",
    tfvars: () => `# APIs enabled once per environment\n`,
    hclExtra: () => `
include "root" {
  path = find_in_parent_folders("root.hcl")
}

include "env" {
  path   = find_in_parent_folders("env.hcl")
  expose = true
}

terraform {
  source = "../../../../terraform/modules/project_services"

  extra_arguments "module_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      "\${get_terragrunt_dir()}/project_services.tfvars",
    ]
  }
}

inputs = merge(
  include.env.inputs,
  {
    project_id = include.env.locals.project_id
  }
)
`,
  },
  cloud_storage: {
    source: "cloud_storage",
    tfvars: (env) => `force_destroy       = ${env.force_destroy_buckets}
enable_versioning   = true
`,
    hclExtra: () => stackTemplate("cloud_storage", null),
  },
  github_wif: {
    source: "github_wif",
    tfvars: () => `pool_id     = "github-pool"
provider_id = "github-provider"
`,
    hclExtra: () => `
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
      "\${get_terragrunt_dir()}/github_wif.tfvars",
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
`,
  },
  network: {
    source: "network",
    tfvars: (env) => `gke_subnet_cidr            = "${env.gke_subnet_cidr}"
pods_cidr                  = "10.${env.name === "dev" ? "20" : env.name === "qa" ? "22" : env.name === "test" ? "24" : "26"}.0.0/16"
services_cidr              = "10.${env.name === "dev" ? "30" : env.name === "qa" ? "32" : env.name === "test" ? "34" : "36"}.0.0/20"
sql_subnet_cidr            = "10.${env.name === "dev" ? "11" : env.name === "qa" ? "13" : env.name === "test" ? "15" : "17"}.0.0/24"
serverless_connector_cidr  = "10.${env.name === "dev" ? "8" : env.name === "qa" ? "9" : env.name === "test" ? "10" : "12"}.0.0/28"
`,
    hclExtra: () => stackTemplate("network", null),
  },
  gke: {
    source: "gke",
    tfvars: (env) => `master_ipv4_cidr       = "${env.master_ipv4_cidr}"
master_authorized_cidr = "${env.master_authorized_cidr}"
k8s_namespace          = "retail"
k8s_service_account    = "retail-app"
`,
    hclExtra: () => `
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
      "\${get_terragrunt_dir()}/gke.tfvars",
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
`,
  },
  cloudsql: {
    source: "cloudsql",
    tfvars: (env) => `tier               = "${env.sql_tier}"
availability_type  = "${env.sql_availability}"
disk_size_gb       = ${env.name === "prod" ? 50 : 20}
`,
    hclExtra: () => `
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
      "\${get_terragrunt_dir()}/cloudsql.tfvars",
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
`,
  },
  pubsub: {
    source: "pubsub",
    tfvars: () => `# default events defined in module\n`,
    hclExtra: () => stackTemplate("pubsub", null),
  },
  cloudrun: {
    source: "cloudrun",
    tfvars: (env) => `allow_unauthenticated = ${env.cloudrun_public}
`,
    hclExtra: () => `
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
      "\${get_terragrunt_dir()}/cloudrun.tfvars",
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
`,
  },
};

function stackTemplate(moduleName, _dep) {
  return `
include "root" {
  path = find_in_parent_folders("root.hcl")
}

include "env" {
  path   = find_in_parent_folders("env.hcl")
  expose = true
}

terraform {
  source = "../../../../terraform/modules/${moduleName}"

  extra_arguments "module_vars" {
    commands = get_terraform_commands_that_need_vars()
    optional_var_files = [
      "\${get_terragrunt_dir()}/${moduleName}.tfvars",
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
`;
}

// root.hcl
fs.mkdirSync(tgRoot, { recursive: true });
fs.writeFileSync(
  path.join(tgRoot, "root.hcl"),
  `locals {
  env_cfg = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

remote_state {
  backend = "gcs"
  config = {
    bucket = "\${local.env_cfg.locals.project_id}-retail-tfstate-\${local.env_cfg.locals.environment}"
    prefix = "\${path_relative_to_include()}/terraform.tfstate"
  }
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
}

generate "providers" {
  path      = "providers.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.14"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.14"
    }
  }
}

provider "google" {
  project = "\${local.env_cfg.locals.project_id}"
  region  = "\${local.env_cfg.locals.region}"
}

provider "google-beta" {
  project = "\${local.env_cfg.locals.project_id}"
  region  = "\${local.env_cfg.locals.region}"
}
EOF
}
`
);

for (const env of ENVIRONMENTS) {
  const envDir = path.join(tgRoot, "environments", env.name);
  fs.mkdirSync(envDir, { recursive: true });

  fs.writeFileSync(
    path.join(envDir, "env.hcl"),
    `locals {
  environment = "${env.name}"
  project_id  = "${env.project_id}"
  region      = "asia-south1"
  github_org  = "REPLACE_GITHUB_ORG"
  github_repo = "REPLACE_GITHUB_REPO"
}

inputs = {
  env        = local.environment
  project_id = local.project_id
  region     = local.region
}
`
  );

  for (const [stackName, stack] of Object.entries(STACKS)) {
    const stackDir = path.join(envDir, stackName);
    fs.mkdirSync(stackDir, { recursive: true });
    fs.writeFileSync(path.join(stackDir, `${stackName}.hcl`), stack.hclExtra().trimStart());
    fs.writeFileSync(path.join(stackDir, `${stackName}.tfvars`), stack.tfvars(env));
  }
}

console.log("Terragrunt environments generated: dev, qa, test, prod");
