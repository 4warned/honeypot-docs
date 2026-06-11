# Installation Guide

Complete step-by-step installation guide for HTTP 2026-35273 Honeypot.

## Prerequisites

### System Requirements

- **Operating System**: Linux/Unix (Docker support)
- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Python**: Python 3.11+ (if running without Docker)
- **Network Access**: Access to network interface for the honeypot

### Network Requirements

- Network interface access
- Firewall rules allowing traffic to port(s): 8000


### CVE Information

This honeypot emulates **CVE-2026-35273**:

- **Vulnerability Description**: Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploitable vulnerability allows unauthenticated attacker with network access via HTTP to compromise PeopleSoft Enterprise PeopleTools. Successful attacks of this vulnerability can result in takeover of PeopleSoft Enterprise PeopleTools. CVSS 3.1 Base Score 9.8 (Confidentiality, Integrity and Availability impacts). CVSS Vector: (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H).


- **CVSS Score**: 9.8 (CRITICAL)

- **Protocol**: HTTP
- **Port**: 8000



### Port Configuration Guidance


- **HTTP Default Port**: 80
- **This Honeypot Port**: 8000





**Deployment Recommendation**: 

For maximum realism, consider deploying this honeypot on port **80** (the default HTTP port) instead of 8000. This makes the honeypot more likely to be discovered by attackers scanning for default services.

To change the port:
1. Edit `docker-compose.yml` and change the port mapping
2. Edit `default.cfg` and update the `reported_port` setting
3. Rebuild and restart: `docker compose up -d --build`



## Installation Methods

### Method 1: Docker Compose (Recommended)

This is the recommended method for production deployments.

#### Step 1: Navigate to Honeypot Directory

```bash
cd honeypots/hp-http-emulates-oracle-20260611-122200-cve-2026-35273
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
curl http://localhost:8000
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
python honeypot.py --host 0.0.0.0 --port 8000
```



## Post-Installation

### Verify Detection

Test that the honeypot is responding:

```bash
# Test HTTP honeypot
curl http://localhost:8000

# Or use appropriate tool for protocol

curl http://localhost:8000

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
# Build Docker image (SBOM + provenance attestations)
docker buildx build --load --provenance=true --sbom=true -t http-2026-35273-honeypot:latest .

# Run container
docker run -d -p 8000:8000 http-2026-35273-honeypot:latest
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
