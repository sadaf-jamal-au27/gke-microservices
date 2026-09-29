terraform {
  backend "gcs" {
    prefix = "banking/dev/02-network"
  }
}
