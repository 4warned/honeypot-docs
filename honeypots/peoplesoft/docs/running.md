# Running the Honeypot

Operational guide for the PeopleSoft CVE-2026-35273 Honeypot.

## About CVE-2026-35273

Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft
(component: Updates Environment Management). Supported versions affected are 8.61
and 8.62. Unauthenticated attacker with network access via HTTP can achieve full
system takeover. CVSS 3.1 Base Score 9.8 (Critical).

## Starting the Honeypot

```bash
docker compose up -d
```

## Stopping the Honeypot

```bash
docker compose down
```

## Verifying Operation

### Check Container Status

```bash
docker compose ps
```

Both `peoplesoft-honeypot` and `fluentbit-peoplesoft` should show as "Up".

### Test Endpoints

```bash
# PeopleSoft login page
curl http://localhost:8000/ps/signon.html

# PSEMHUB Environment Management Hub
curl http://localhost:8000/PSEMHUB/hub

# Updates endpoint (CVE attack surface)
curl http://localhost:8000/PSEMHUB/hub/updates
```

## Monitoring

### View Logs

```bash
# Follow all logs
docker compose logs -f

# View only honeypot logs
docker compose logs -f peoplesoft-honeypot

# View last 100 lines
docker compose logs --tail=100
```

### STINGAR Events

Events are forwarded to your STINGAR server via the Fluent Bit sidecar.
Verify the sidecar is connected:

```bash
docker compose logs fluentbit
```

## Event Types

The honeypot classifies interactions into the following event types:

| Event Type | Description |
|------------|-------------|
| `peoplesoft-scan` | General reconnaissance or 404 access |
| `peoplesoft-login-attempt` | Credential submission to sign-in page |
| `peoplesoft-portal` | Portal/content servlet access |
| `peoplesoft-emhub-probe` | PSEMHUB status or crawl probing |
| `peoplesoft-emhub-recon` | Updates endpoint reconnaissance |
| `peoplesoft-rce-attempt` | RCE exploitation attempt detected |
| `peoplesoft-upload-attempt` | Malicious update upload attempt |

## Health Checks

The container includes a built-in health check that runs every 30 seconds.
View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q peoplesoft-honeypot)
```

## Resource Usage

```bash
docker stats --no-stream
```

The honeypot is lightweight -- typical usage is under 50MB RAM and minimal CPU.

## Next Steps

- [Configuration](configuration.md) -- adjust settings
- [Troubleshooting](troubleshooting.md) -- resolve issues
