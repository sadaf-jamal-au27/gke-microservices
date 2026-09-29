terraform {
  backend "gcs" {
    prefix = "banking/dev/05-platform"
  }
}
