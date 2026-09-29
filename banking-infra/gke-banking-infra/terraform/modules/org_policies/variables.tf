variable "project_id" { type = string }

variable "enable_org_policies" {
  type        = bool
  default     = true
  description = "Project-level org policy constraints (requires orgpolicy API + Policy Admin)."
}
