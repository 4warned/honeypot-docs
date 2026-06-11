# Running the Honeypot

Operational guide for the OpenClaw AI Gateway Honeypot.

## About OpenClaw

OpenClaw emulates an AI agent gateway exposing a WebSocket/JSON-RPC API. Attackers
targeting AI infrastructure follow a three-phase playbook: reconnaissance (discovering
the API), enumeration (listing available tools/models), and exploitation (attempting
unauthorized actions). The honeypot captures all three phases.

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

Both `openclaw-honeypot` and `fluentbit-openclaw` should show as "Up".

### Test the Endpoint

```bash
curl -i http://localhost:18789/
```

You should receive an HTTP response indicating the WebSocket gateway is running.

## Monitoring

### View Logs

```bash
# Follow all logs
docker compose logs -f

# View only honeypot logs
docker compose logs -f openclaw-honeypot

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
| `openclaw-recon` | Initial reconnaissance (HTTP probes, endpoint discovery) |
| `openclaw-enumerate` | Tool/model enumeration via JSON-RPC |
| `openclaw-exploit` | Exploitation attempts (unauthorized method calls) |
| `openclaw-websocket` | WebSocket upgrade and message activity |

## Health Checks

The container includes a built-in health check that runs every 30 seconds.
View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q openclaw-honeypot)
```

## Resource Usage

```bash
docker stats --no-stream
```

The honeypot is lightweight -- typical usage is under 50MB RAM and minimal CPU.

## Next Steps

- [Configuration](configuration.md) -- adjust settings
- [Troubleshooting](troubleshooting.md) -- resolve issues
