# Jenkins setup

## 1. Start Jenkins

```bash
docker compose -f docker-compose.jenkins.yml up -d --build
docker exec food_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open http://localhost:8080, paste the password, choose **Install suggested plugins** (the image already
contains git, pipeline, credentials-binding, timestamper and ws-cleanup).

The container has the Docker CLI + Compose + Terraform and uses the **host's** Docker daemon through
`/var/run/docker.sock` (works on Docker Desktop for Windows/Mac too). Containers started by the
pipeline therefore run on your machine next to Jenkins.

## 2. Create the job

*New Item -> Pipeline -> Pipeline script from SCM -> Git* -> your repository URL, branch `*/main`,
Script Path `Jenkinsfile`. Save and run **Build with Parameters** once (the first run only
registers the parameters if Jenkins hasn't seen them yet).

## 3. Credentials (Manage Jenkins -> Credentials -> Global)

Only create what the stages you enable need.

| ID | Kind | Needed for |
|----|------|-----------|
| `dockerhub-creds` | Username + password (use a Docker Hub access token) | `PUSH_IMAGES` |
| `aws-creds` | Username = AWS access key ID, password = secret key | `TERRAFORM_PLAN` / `TERRAFORM_APPLY` |
| `terraform-tfvars` | Secret file (your `terraform.tfvars`) | `TERRAFORM_PLAN` / `TERRAFORM_APPLY` |
| `aws-ssh-key` | SSH username with private key (user `ubuntu`) | `DEPLOY_TARGET=aws` |

## 4. Parameters

| Parameter | Meaning |
|-----------|---------|
| `IMAGE_NAMESPACE` | Your Docker Hub username (images `<ns>/backend` ...) |
| `DEPLOY_TARGET` | `local` (compose on this Docker host), `aws` (EC2 via SSH), `none` (CI only) |
| `EC2_HOST` | Elastic IP from `terraform output` (aws only) |
| `PUSH_IMAGES` | Push `:BUILD_NUMBER` and `:latest` to Docker Hub (required for aws) |
| `TERRAFORM_PLAN` / `TERRAFORM_APPLY` | Plan, or plan + manual approval + apply (apply refuses to run without `terraform/aws/backend.tf`, because workspace state would be lost) |
| `FAIL_ON_VULNERABILITIES` | Make Trivy HIGH/CRITICAL findings fail the build |

## 5. What each stage does

1. **Checkout / Prepare** - tool versions, `.env` from `.env.example`.
2. **Quality Gates (parallel)** - backend `node --check` on every file, frontend ESLint
   (reported as *unstable*, not failed - the code has existing lint errors), `terraform fmt` + `validate`.
3. **Build Images** - `docker compose build`, tags `<ns>/<svc>:<build#>` and `:latest`.
4. **Security Scan** - Trivy on all three images.
5. **Push Images** (optional) -> **Terraform Plan/Apply** (optional) -> **Deploy** -> **Verify**
   (container health, then HTTP smoke tests).

A good first run: `DEPLOY_TARGET=local`, everything else off. Then enable pushing, then AWS.
