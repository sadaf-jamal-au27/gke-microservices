output "network_id" { value = google_compute_network.vpc.id }
output "network_name" { value = google_compute_network.vpc.name }
output "gke_subnet_name" { value = google_compute_subnetwork.gke.name }
output "pods_range_name" { value = "pods" }
output "services_range_name" { value = "services" }
output "serverless_connector_id" { value = google_vpc_access_connector.serverless.id }
