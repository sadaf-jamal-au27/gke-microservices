terraform {
  backend "gcs" {
    prefix = "banking/dev/04-security"
  }
}
