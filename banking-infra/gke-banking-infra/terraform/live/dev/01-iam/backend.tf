terraform {
  backend "gcs" {
    prefix = "banking/dev/01-iam"
  }
}
