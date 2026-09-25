resource "google_compute_network" "vpc" {
  name                    = "retail-${var.env}-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

resource "google_compute_subnetwork" "gke" {
  name          = "retail-${var.env}-gke"
  ip_cidr_range = var.gke_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id

  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = var.pods_cidr
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = var.services_cidr
  }
}

resource "google_compute_subnetwork" "sql" {
  name          = "retail-${var.env}-sql"
  ip_cidr_range = var.sql_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
  purpose       = "PRIVATE"
}

resource "google_vpc_access_connector" "serverless" {
  name          = "retail-${var.env}-conn"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = var.serverless_connector_cidr
  min_instances = 2
  max_instances = 3
}

resource "google_compute_global_address" "private_service_access" {
  name          = "retail-${var.env}-psa"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_service_access.name]
}
