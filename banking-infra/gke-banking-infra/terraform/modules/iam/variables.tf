variable "project_id" { type = string }
variable "env" { type = string }

variable "break_glass_members" {
  type        = list(string)
  description = "Human principals (user: / group:) who can impersonate break-glass. Empty = SA created, unused."
  default     = []
}
