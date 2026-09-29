terraform {
  backend "gcs" {
    prefix = "banking/dev/00-foundation"
  }
}
