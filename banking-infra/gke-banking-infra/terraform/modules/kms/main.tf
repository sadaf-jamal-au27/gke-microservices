data "google_project" "current" {
  project_id = var.project_id
}

locals {
  encrypter      = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
  project_number = data.google_project.current.number
}

resource "google_kms_key_ring" "regional" {
  name     = "banking-${var.env}"
  location = var.region
  project  = var.project_id
}

resource "google_kms_key_ring" "gcs" {
  name     = "banking-${var.env}-gcs"
  location = var.gcs_kms_location
  project  = var.project_id
}

resource "google_kms_crypto_key" "sql" {
  name            = "sql"
  key_ring        = google_kms_key_ring.regional.id
  rotation_period = var.rotation_period
  purpose         = "ENCRYPT_DECRYPT"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key" "gke" {
  name            = "gke-etcd"
  key_ring        = google_kms_key_ring.regional.id
  rotation_period = var.rotation_period
  purpose         = "ENCRYPT_DECRYPT"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key" "secrets" {
  name            = "secrets"
  key_ring        = google_kms_key_ring.regional.id
  rotation_period = var.rotation_period
  purpose         = "ENCRYPT_DECRYPT"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key" "gcs" {
  name            = "gcs"
  key_ring        = google_kms_key_ring.gcs.id
  rotation_period = var.rotation_period
  purpose         = "ENCRYPT_DECRYPT"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key_iam_member" "sql" {
  crypto_key_id = google_kms_crypto_key.sql.id
  role          = local.encrypter
  member        = "serviceAccount:service-${local.project_number}@gcp-sa-cloud-sql.iam.gserviceaccount.com"
}

resource "google_kms_crypto_key_iam_member" "gcs" {
  crypto_key_id = google_kms_crypto_key.gcs.id
  role          = local.encrypter
  member        = "serviceAccount:service-${local.project_number}@gs-project-accounts.iam.gserviceaccount.com"
}

resource "google_kms_crypto_key" "gcs_regional" {
  name            = "gcs-regional"
  key_ring        = google_kms_key_ring.regional.id
  rotation_period = var.rotation_period
  purpose         = "ENCRYPT_DECRYPT"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key_iam_member" "gcs_regional" {
  crypto_key_id = google_kms_crypto_key.gcs_regional.id
  role          = local.encrypter
  member        = "serviceAccount:service-${local.project_number}@gs-project-accounts.iam.gserviceaccount.com"
}

resource "google_kms_crypto_key_iam_member" "gke" {
  crypto_key_id = google_kms_crypto_key.gke.id
  role          = local.encrypter
  member        = "serviceAccount:service-${local.project_number}@container-engine-robot.iam.gserviceaccount.com"
}

resource "google_kms_crypto_key_iam_member" "secrets" {
  crypto_key_id = google_kms_crypto_key.secrets.id
  role          = local.encrypter
  member        = "serviceAccount:service-${local.project_number}@gcp-sa-secretmanager.iam.gserviceaccount.com"
}

resource "google_kms_crypto_key" "gar" {
  name            = "gar"
  key_ring        = google_kms_key_ring.regional.id
  rotation_period = var.rotation_period
  purpose         = "ENCRYPT_DECRYPT"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key_iam_member" "gar" {
  crypto_key_id = google_kms_crypto_key.gar.id
  role          = local.encrypter
  member        = "serviceAccount:service-${local.project_number}@gcp-sa-artifactregistry.iam.gserviceaccount.com"
}
