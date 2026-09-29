terraform {
  backend "gcs" {
    prefix = "banking/dev/03-vpcsc"
  }
}
