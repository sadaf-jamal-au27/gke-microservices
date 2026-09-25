locals {
  environment = "test"
  project_id  = "REPLACE_GCP_TEST_PROJECT"
  region      = "asia-south1"
  github_org  = "REPLACE_GITHUB_ORG"
  github_repo = "REPLACE_GITHUB_REPO"
}

inputs = {
  env        = local.environment
  project_id = local.project_id
  region     = local.region
}
