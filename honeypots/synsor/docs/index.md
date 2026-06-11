# SYNsor Honeypot

## Overview

SYNsor is a high-performance, multi-protocol packet monitoring honeypot written in Go. It monitors TCP SYN, ICMP, and UDP traffic using both raw socket packet capture and fake service connection monitoring. SYNsor is designed for integration with the STINGAR threat intelligence platform.

## Key Features

- **Hybrid detection** -- raw socket capture plus fake service monitoring for 100% scan coverage
- **Multi-protocol** -- TCP SYN, ICMP, and UDP monitoring simultaneously
- **Nmap pattern recognition** -- identifies specific scanning tools and techniques
- **STINGAR integration** -- native event forwarding via Fluent Bit
- **High performance** -- concurrent Go goroutines with zero packet dropping
- **Docker ready** -- pre-built multi-arch images (AMD64, ARM64)

## Detection Capabilities

SYNsor detects all Nmap scan types:

| Scan Type | Detection Method |
|-----------|-----------------|
| SYN scan (`nmap -sS`) | Raw socket capture |
| Connect scan (`nmap -sT`) | Fake service monitoring |
| UDP scan (`nmap -sU`) | UDP packet capture |
| ICMP scan (`nmap -sn -PE -PP`) | ICMP monitor |
| Aggressive scan (`nmap -A`) | Combined pattern recognition |

## Deployment

SYNsor is delivered as a pre-built Docker image (`4warned/synsor:latest`) and deployed using Docker Compose with a Fluent Bit sidecar for STINGAR telemetry. It requires host networking and `NET_RAW` capability for raw socket access.

## Quick Start

```bash
mkdir -p ~/honeypots/synsor && cd ~/honeypots/synsor
# Create docker-compose.yml, stingar-hp.env, and configs/ports.txt (see Installation Guide)
docker compose up -d
```

## Next Steps

- [Installation](installation.md) -- deploy the honeypot
- [Configuration](configuration.md) -- customize settings
- [Running](running.md) -- operation and monitoring
- [Architecture](architecture.md) -- how it works
- [Troubleshooting](troubleshooting.md) -- resolve issues
- [FAQ](faq.md) -- common questions
