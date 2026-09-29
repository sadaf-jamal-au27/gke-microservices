# Explicit allow lists only. Implicit deny covers the internet — do not deny 0.0.0.0/0 to RFC1918 (that also matches internal sources and wins on priority).

resource "google_compute_firewall" "allow_internal" {
  name    = "banking-${var.env}-allow-internal"
  network = google_compute_network.vpc.name

  direction = "INGRESS"
  priority  = 1000

  source_ranges = [
    var.gke_subnet_cidr,
    var.pods_cidr,
    var.services_cidr,
    var.data_subnet_cidr,
    var.psc_subnet_cidr,
    var.serverless_connector_cidr,
    var.master_ipv4_cidr,
  ]

  allow {
    protocol = "tcp"
  }
  allow {
    protocol = "udp"
  }
  allow {
    protocol = "icmp"
  }
}

resource "google_compute_firewall" "allow_lb_health_checks" {
  name    = "banking-${var.env}-allow-lb-health"
  network = google_compute_network.vpc.name

  direction = "INGRESS"
  priority  = 1000

  source_ranges = [
    "35.191.0.0/16",
    "130.211.0.0/22",
  ]

  allow {
    protocol = "tcp"
  }
}

resource "google_compute_firewall" "allow_iap" {
  name    = "banking-${var.env}-allow-iap"
  network = google_compute_network.vpc.name

  direction = "INGRESS"
  priority  = 1000

  source_ranges = var.iap_source_ranges

  allow {
    protocol = "tcp"
    ports    = ["22", "3389", "8443"]
  }
}

resource "google_compute_firewall" "allow_sql_from_gke" {
  name    = "banking-${var.env}-allow-sql-from-gke"
  network = google_compute_network.vpc.name

  direction = "INGRESS"
  priority  = 900

  source_ranges = [
    var.gke_subnet_cidr,
    var.pods_cidr,
  ]

  destination_ranges = [var.psc_subnet_cidr, var.data_subnet_cidr]

  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }
}
