variable "aws_region" {
  description = "AWS region (ap-south-1 = Mumbai, closest to Sri Lanka)"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Name prefix for all resources"
  type        = string
  default     = "food-delivery"
}

variable "environment" {
  description = "Environment name (tag only)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 size. t3.small (2 GB) is enough for MongoDB + API + 2 nginx containers"
  type        = string
  default     = "t3.small"
}

variable "root_volume_size" {
  description = "Root disk size in GB"
  type        = number
  default     = 20
}

variable "ssh_public_key_path" {
  description = "Path to your PUBLIC ssh key. It is uploaded as an EC2 key pair."
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}

variable "allowed_ssh_cidrs" {
  description = "CIDRs allowed to SSH, e.g. [\"203.0.113.10/32\"]. Use your own IP, not 0.0.0.0/0."
  type        = list(string)

  validation {
    condition     = length(var.allowed_ssh_cidrs) > 0
    error_message = "Provide at least one CIDR for SSH access."
  }
}

variable "repo_url" {
  description = "Git repo (HTTPS, public) that contains docker-compose.yml"
  type        = string
}

variable "repo_branch" {
  type    = string
  default = "main"
}

variable "image_namespace" {
  description = "Docker Hub user/org that Jenkins pushes images to (images: <ns>/backend, <ns>/frontend, <ns>/admin)"
  type        = string
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "stripe_secret_key" {
  description = "Optional Stripe secret key"
  type        = string
  default     = ""
  sensitive   = true
}
