# Audit-grade VPC: global routing, flow logs, Cloud NAT, PSC for Restricted Google APIs, optional PSA.

resource "google_compute_network" "vpc" {
  name                    = "banking-${var.env}-vpc"
  auto_create_subnetworks = false
  routing_mode            = "GLOBAL"
}

resource "google_compute_subnetwork" "gke" {
  name          = "banking-${var.env}-gke"
  ip_cidr_range = var.gke_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id

  private_ip_google_access = true

  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = var.pods_cidr
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = var.services_cidr
  }
}

resource "google_compute_subnetwork" "data" {
  name          = "banking-${var.env}-data"
  ip_cidr_range = var.data_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id

  private_ip_google_access = true

  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

resource "google_compute_subnetwork" "psc" {
  name          = "banking-${var.env}-psc"
  ip_cidr_range = var.psc_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id

  private_ip_google_access = true
}

resource "google_compute_global_address" "psa" {
  count         = var.enable_psa ? 1 : 0
  name          = "banking-${var.env}-psa"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "psa" {
  count                   = var.enable_psa ? 1 : 0
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.psa[0].name]

  depends_on = [var.project_services_dependency]
}

# Private Service Connect producer endpoint for Restricted Google APIs (VPC-SC compatible).
resource "google_compute_global_address" "psc_googleapis" {
  name         = "banking-${var.env}-psc-googleapis"
  purpose      = "PRIVATE_SERVICE_CONNECT"
  address_type = "INTERNAL"
  network      = google_compute_network.vpc.id
}

resource "google_compute_global_forwarding_rule" "psc_googleapis" {
  name                  = "banking-${var.env}-psc-gapis"
  target                = "vpc-sc-restricted"
  load_balancing_scheme = ""
  network               = google_compute_network.vpc.id
  ip_address            = google_compute_global_address.psc_googleapis.id
}

resource "google_vpc_access_connector" "serverless" {
  count = var.enable_serverless_connector ? 1 : 0

  name          = "banking-${var.env}-conn"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = var.serverless_connector_cidr
  min_instances = 2
  max_instances = 3
}
