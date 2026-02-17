terraform {
  required_version = ">= 1.0"

  # AWS එකට Connect වෙන්න හදන එක නැවැත්වීමට Backend එක Local කරනවා
  backend "local" {
    path = "terraform.tfstate"
  }

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

# AWS Provider එක දැනට අවශ්‍ය නැති නිසා Comment කරලා තියෙන්නේ
# provider "aws" {
#   region = "us-east-1"
# }

provider "docker" {
  # Windows වල Docker Desktop පාවිච්චි කරන නිසා මේ path එක වැදගත්
  host = "npipe:////./pipe/docker_engine"
}

# දැනට AWS Resources (VPC, EC2) මොනවත් ක්‍රියාත්මක වෙන්නේ නැහැ.
# මේකෙන් කරන්නේ Terraform පයිප්ලයින් එක Error නැතුව Run වෙන එක විතරයි.