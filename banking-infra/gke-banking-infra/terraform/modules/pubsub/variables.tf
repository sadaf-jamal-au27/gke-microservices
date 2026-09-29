variable "project_id" { type = string }
variable "env" { type = string }

variable "events" {
  type = list(string)
  default = [
    "user-registered",
    "user-login",
    "customer-kyc-verified",
    "account-opened",
    "ledger-posted",
    "transfer-posted",
    "payment-posted",
    "card-issued",
    "card-blocked",
    "audit-entry-recorded",
  ]
}
