# Installation Guide

Complete step-by-step installation guide for OLLAMA 2024-37032 Honeypot.

## Prerequisites

### System Requirements

- **Operating System**: Linux/Unix (Docker support)
- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Python**: Python 3.11+ (if running without Docker)
- **Network Access**: Access to network interface for the honeypot

### Network Requirements

- Network interface access
- Firewall rules allowing traffic to port(s): 11434, 5000


### CVE Information

This honeypot emulates **CVE-2024-37032**:

- **Vulnerability Description**: Ollama before 0.1.34 does not validate the format of the digest (sha256 with 64 hex digits) when getting the model path, and thus mishandles the TestGetBlobsPath test cases such as fewer than 64 hex digits, more than 64 hex digits, or an initial ../ substring.


- **CVSS Score**: 8.8 (HIGH)

- **Protocol**: OLLAMA
- **Port**: 11434




## Installation Methods

### Method 1: Docker Compose (Recommended)

This is the recommended method for production deployments.

#### Step 1: Navigate to Honeypot Directory

```bash
cd honeypots/hp-ollama-emulates-service-20260410-133823-cve-2024-37032
```

#### Step 2: Review Configuration

```bash
# Review docker-compose.yml
cat docker-compose.yml

# Review Dockerfile
cat Dockerfile
```

#### Step 3: Deploy

```bash
# Start the honeypot
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Step 4: Verify Installation

```bash
# Check container status
docker-compose ps

# Test connectivity
curl http://localhost:11434
```

### Method 2: Manual Installation (Development)

For development or custom builds.

#### Step 1: Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt
```

#### Step 2: Run Manually

```bash
# Run the honeypot
python honeypot.py --host 0.0.0.0 --port 11434
```


### Testing Vulnerable Endpoints

After deployment, you can test the emulated vulnerable endpoints:

```bash

# Test /wp-content/plugins/ollama/admin.php
curl http://localhost:11434/wp-content/plugins/ollama/admin.php


# Test /wp-content/plugins/ollama/ajax-handler.php
curl http://localhost:11434/wp-content/plugins/ollama/ajax-handler.php


# Test /wp-content/plugins/ollama/includes/admin.php
curl http://localhost:11434/wp-content/plugins/ollama/includes/admin.php


# Test /wp-content/plugins/ollama/includes/ajax-actions.php
curl http://localhost:11434/wp-content/plugins/ollama/includes/ajax-actions.php


# Test /wp-content/plugins/ollama/ollama.php
curl http://localhost:11434/wp-content/plugins/ollama/ollama.php


```

**Note**: These endpoints are extracted from the CVE description and represent the actual vulnerable paths that attackers would target.


## Post-Installation

### Verify Detection

Test that the honeypot is responding:

```bash
# Test HTTP honeypot
curl http://localhost:11434

# Or use appropriate tool for protocol

```

### Check Logs

```bash
# Docker Compose
docker-compose logs -f

# Manual installation
tail -f logs/honeypot.log
```

## Docker Images

### Building Custom Image

```bash
# Build Docker image
docker build -t ollama-2024-37032-honeypot:latest .

# Run container
docker run -d -p 11434:11434 ollama-2024-37032-honeypot:latest
```

## Upgrade Instructions

### Upgrading Docker Image

```bash
# Pull latest code (if using git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Troubleshooting Installation

### Container Won't Start

- Check Docker logs: `docker-compose logs`
- Verify port is not already in use
- Check Docker daemon is running

### Permission Denied

- Ensure Docker has proper permissions
- Check file permissions in honeypot directory

### Port Already in Use

- Change port in docker-compose.yml
- Or stop the service using the port

## Next Steps

- [Configuration Guide](configuration.md) - Customize settings
- [Running Guide](running.md) - Learn operational procedures
- [Troubleshooting](troubleshooting.md) - Resolve issues
