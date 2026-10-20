terraform {
  required_version = ">= 1.5"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  # Windows (Docker Desktop): npipe:////./pipe/docker_engine
  # Linux / macOS / WSL:      unix:///var/run/docker.sock
  host = var.docker_host
}

locals {
  mongo_uri = "mongodb://${var.mongo_user}:${var.mongo_password}@mongodb:27017/${var.mongo_db}?authSource=admin"
}

resource "docker_network" "app" {
  name = "food-tf-network"
}

resource "docker_volume" "mongo_data" {
  name = "food_tf_mongo_data"
}

resource "docker_volume" "uploads" {
  name = "food_tf_uploads"
}

resource "docker_image" "mongo" {
  name         = "mongo:6.0"
  keep_locally = true
}

resource "docker_container" "mongodb" {
  name    = "food_tf_mongodb"
  image   = docker_image.mongo.image_id
  restart = "unless-stopped"

  env = [
    "MONGO_INITDB_ROOT_USERNAME=${var.mongo_user}",
    "MONGO_INITDB_ROOT_PASSWORD=${var.mongo_password}",
    "MONGO_INITDB_DATABASE=${var.mongo_db}",
  ]

  ports {
    internal = 27017
    external = 27017
    ip       = "127.0.0.1"
  }

  volumes {
    volume_name    = docker_volume.mongo_data.name
    container_path = "/data/db"
  }

  healthcheck {
    test         = ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
    interval     = "10s"
    timeout      = "5s"
    retries      = 5
    start_period = "20s"
  }

  networks_advanced {
    name    = docker_network.app.name
    aliases = ["mongodb"]
  }
}

# The three app images must exist locally first:  docker compose build
# (they are tagged <image_namespace>/<service>:<image_tag>)
resource "docker_container" "backend" {
  name    = "food_tf_backend"
  image   = "${var.image_namespace}/backend:${var.image_tag}"
  restart = "unless-stopped"
  wait    = true

  env = [
    "PORT=4000",
    "NODE_ENV=production",
    "MONGO_URI=${local.mongo_uri}",
    "JWT_SECRET=${var.jwt_secret}",
    "STRIPE_SECRET_KEY=${var.stripe_secret_key}",
    "FRONTEND_URL=http://localhost:3000",
  ]

  ports {
    internal = 4000
    external = 4000
  }

  volumes {
    volume_name    = docker_volume.uploads.name
    container_path = "/app/uploads"
  }

  networks_advanced {
    name    = docker_network.app.name
    aliases = ["backend"]
  }

  depends_on = [docker_container.mongodb]
}

resource "docker_container" "frontend" {
  name    = "food_tf_frontend"
  image   = "${var.image_namespace}/frontend:${var.image_tag}"
  restart = "unless-stopped"

  env = ["API_URL=http://localhost:4000"]

  ports {
    internal = 80
    external = 3000
  }

  networks_advanced {
    name = docker_network.app.name
  }

  depends_on = [docker_container.backend]
}

resource "docker_container" "admin" {
  name    = "food_tf_admin"
  image   = "${var.image_namespace}/admin:${var.image_tag}"
  restart = "unless-stopped"

  env = ["API_URL=http://localhost:4000"]

  ports {
    internal = 80
    external = 3001
  }

  networks_advanced {
    name = docker_network.app.name
  }

  depends_on = [docker_container.backend]
}
