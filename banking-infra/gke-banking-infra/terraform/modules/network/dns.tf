# Force Restricted Google APIs (VPC-SC) through the PSC endpoint.

resource "google_dns_managed_zone" "googleapis" {
  name        = "banking-${var.env}-googleapis"
  dns_name    = "googleapis.com."
  project     = var.project_id
  visibility  = "private"
  description = "VPC-SC restricted VIP via PSC"

  private_visibility_config {
    networks {
      network_url = google_compute_network.vpc.id
    }
  }
}

resource "google_dns_record_set" "restricted" {
  name         = "restricted.googleapis.com."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.googleapis.name
  project      = var.project_id
  rrdatas      = [google_compute_global_address.psc_googleapis.address]
}

resource "google_dns_record_set" "star_googleapis" {
  name         = "*.googleapis.com."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.googleapis.name
  project      = var.project_id
  rrdatas      = ["restricted.googleapis.com."]
}

resource "google_dns_managed_zone" "pkg_dev" {
  name       = "banking-${var.env}-pkg-dev"
  dns_name   = "pkg.dev."
  project    = var.project_id
  visibility = "private"

  private_visibility_config {
    networks {
      network_url = google_compute_network.vpc.id
    }
  }
}

resource "google_dns_record_set" "pkg_dev" {
  name         = "*.pkg.dev."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.pkg_dev.name
  project      = var.project_id
  rrdatas      = ["restricted.googleapis.com."]
}
