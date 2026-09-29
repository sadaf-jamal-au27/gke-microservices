output "network_id" {
  value = google_compute_network.vpc.id
}

output "network_name" {
  value = google_compute_network.vpc.name
}

output "gke_subnet_name" {
  value = google_compute_subnetwork.gke.name
}

output "data_subnet_name" {
  value = google_compute_subnetwork.data.name
}

output "psc_subnet_name" {
  value = google_compute_subnetwork.psc.name
}

output "psc_subnet_self_link" {
  value = google_compute_subnetwork.psc.self_link
}

output "pods_range_name" {
  value = "pods"
}

output "services_range_name" {
  value = "services"
}

output "psc_googleapis_address" {
  value = google_compute_global_address.psc_googleapis.address
}

output "serverless_connector_id" {
  value = try(google_vpc_access_connector.serverless[0].id, null)
}
