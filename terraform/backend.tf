terraform {
  backend "s3" {
    bucket       = "jeffrey-doctor-terraform-state-ca-central-1"
    key          = "doctor-eks/dev/terraform.tfstate"
    region       = "ca-central-1"
    use_lockfile = true
    profile      = "doctor-dev"
  }
}