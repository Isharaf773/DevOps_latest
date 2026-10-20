output "public_ip" {
  description = "Elastic IP of the server"
  value       = aws_eip.app.public_ip
}

output "frontend_url" {
  value = "http://${aws_eip.app.public_ip}:3000"
}

output "admin_url" {
  value = "http://${aws_eip.app.public_ip}:3001"
}

output "api_url" {
  value = "http://${aws_eip.app.public_ip}:4000"
}

output "ssh_command" {
  value = "ssh ubuntu@${aws_eip.app.public_ip}"
}
