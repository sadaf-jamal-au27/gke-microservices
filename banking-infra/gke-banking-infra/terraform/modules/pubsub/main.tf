resource "google_pubsub_topic" "banking" {
  for_each = toset(var.events)

  name = "banking-${var.env}.${each.key}"

  labels = {
    env     = var.env
    product = "banking"
  }
}
