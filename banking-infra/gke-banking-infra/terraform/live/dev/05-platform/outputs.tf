output "cluster_name" {
  value = module.gke.cluster_name
}

output "artifact_registry_url" {
  value = module.gke.artifact_registry_url
}

output "workload_service_account_email" {
  value = module.gke.workload_service_account_email
}

output "pubsub_topics" {
  value = module.pubsub.topic_names
}

output "k8s_workload_identity" {
  value = "${var.k8s_namespace}/${var.k8s_service_account}"
}
