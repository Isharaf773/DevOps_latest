variable "docker_host" {
  description = "Docker daemon address"
  type        = string
  default     = "npipe:////./pipe/docker_engine"
}

variable "image_namespace" {
  type    = string
  default = "foodapp"
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "mongo_user" {
  type    = string
  default = "admin"
}

variable "mongo_password" {
  type      = string
  sensitive = true
}

variable "mongo_db" {
  type    = string
  default = "fooddb"
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "stripe_secret_key" {
  type      = string
  default   = ""
  sensitive = true
}
