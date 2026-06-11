# PeopleSoft CVE-2026-35273 Honeypot

## Overview

A high-fidelity honeypot emulating **Oracle PeopleSoft PeopleTools 8.62** with
the Updates Environment Management component vulnerable to
**CVE-2026-35273** (CVSS 9.8, Critical RCE).

This honeypot is designed for authorized security research, threat detection,
and attack pattern analysis. It captures attacker activity targeting PeopleSoft
environments and forwards telemetry to a centralized STINGAR platform.

## CVE-2026-35273

| Field | Value |
|-------|-------|
| CVE ID | CVE-2026-35273 |
| CVSS Score | 9.8 (Critical) |
| Vector | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |
| Product | Oracle PeopleSoft Enterprise PeopleTools |
| Component | Updates Environment Management |
| Affected Versions | 8.61, 8.62 |
| Attack Vector | Network (HTTP), unauthenticated |
| Impact | Remote Code Execution / Full System Takeover |

Easily exploitable vulnerability allows an unauthenticated attacker with
network access via HTTP to compromise PeopleSoft Enterprise PeopleTools.
Successful attacks result in complete takeover of the PeopleSoft environment.

## Key Features

- **Realistic PeopleSoft emulation** -- login page, portal servlets, PSEMHUB endpoints
- **Oracle response headers** -- X-ORACLE-DMS-ECID, X-ORACLE-DMS-RID, WebLogic server strings
- **RCE payload detection** -- identifies exploitation attempts targeting the vulnerable component
- **Credential capture** -- logs authentication attempts to the PeopleSoft sign-in page
- **STINGAR integration** -- events forwarded via Fluent Bit for centralized telemetry
- **Docker deployment** -- multi-arch image with Docker Compose stack

## Emulated Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/ps/signon.html` | GET | PeopleSoft login page |
| `/psp/ps/?cmd=login` | POST | Credential capture |
| `/psp/ps/` | GET | Portal servlet |
| `/PSEMHUB/hub` | GET | Environment Management Hub (XML) |
| `/PSEMHUB/hub/updates` | GET/POST | **CVE attack surface** |
| `/PSEMHUB/hub/updates/apply` | POST | **RCE trigger endpoint** |
| `/PSEMHUB/hub/updates/upload` | POST | **Malicious upload endpoint** |
| `/PSEMHUB/hub/crawl` | GET/POST | Environment crawl |

## Quick Start

```bash
# Pull and run
docker compose up -d

# Verify
curl http://localhost:8000/ps/signon.html
curl http://localhost:8000/PSEMHUB/hub
```

## Next Steps

- [Installation Guide](installation.md) -- deployment instructions
- [Configuration Guide](configuration.md) -- customize for your environment
- [Running Guide](running.md) -- operation and monitoring
- [Architecture](architecture.md) -- system design
- [Troubleshooting](troubleshooting.md) -- common issues

## Docker Image

```bash
docker pull 4warned/hp-peoplesoft:latest
```

Available on [Docker Hub](https://hub.docker.com/r/4warned/hp-peoplesoft).
