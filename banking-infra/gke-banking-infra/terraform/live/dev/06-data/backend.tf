terraform {
  backend "gcs" {
    prefix = "banking/dev/06-data"
  }
}
