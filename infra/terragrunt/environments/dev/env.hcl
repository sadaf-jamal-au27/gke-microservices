locals {
  environment = "dev"
  project_id  = "ai-rag-agent-project"
  region      = "asia-south1"
  github_org  = "REPLACE_GITHUB_ORG"
  github_repo = "REPLACE_GITHUB_REPO"
}

inputs = {
  env        = local.environment
  project_id = local.project_id
  region     = local.region
}
