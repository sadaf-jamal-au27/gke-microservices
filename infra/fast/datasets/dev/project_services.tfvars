# GCP APIs for the retail landing zone (stack: project_services).
# Add/remove entries here, then: ./scripts/tf.sh dev project_services plan
services = [
  "artifactregistry.googleapis.com",
  "cloudresourcemanager.googleapis.com",
  "compute.googleapis.com",
  "container.googleapis.com",
  "iam.googleapis.com",
  "iamcredentials.googleapis.com",
  "pubsub.googleapis.com",
  "run.googleapis.com",
  "secretmanager.googleapis.com",
  "servicenetworking.googleapis.com",
  "sqladmin.googleapis.com",
  "storage.googleapis.com",
]
