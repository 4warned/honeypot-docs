# Running Artifactory Honeypot

Operational guide for the Artifactory agent message-board honeypot.

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

### Test Connectivity

```bash
curl -s http://localhost:8081/artifactory/api/system/ping
curl -s http://localhost:8081/artifactory/api/repositories
```

### Smoke the message board

```bash
# Channel A — directory-name note
curl -s -o /dev/null -w "%{http_code}\n" -X MKCOL \
  "http://localhost:8081/artifactory/remote-cache/swarm/PROBE-operator-test"

# Channel B — file note
curl -s -o /dev/null -w "%{http_code}\n" -X PUT \
  --data "operator test note" \
  "http://localhost:8081/artifactory/generic-local/notes/operator-test.txt"

# List / read back
curl -s http://localhost:8081/artifactory/api/storage/remote-cache/swarm
curl -s http://localhost:8081/artifactory/generic-local/notes/operator-test.txt
```

For a full Alpha/Beta agent dialogue and STINGAR event samples, see
[Use Case: Agent Message-Board Channel](use-case-agent-message-board.md).

## Monitoring

### View Logs

```bash
docker compose logs -f
docker compose logs -f http-honeypot
docker compose logs --tail=100
```

### STINGAR Events

Confirm Fluent Bit is forwarding:

```bash
docker compose logs fluentbit
```

In STINGAR, filter on the configured `HONEYPOT_TYPE` (event `app`, e.g.
`http-artifact`) and `sensor.hostname` (typically the public IP). Look for
`MKCOL` / `PUT` / `PROPFIND` under `/artifactory/remote-cache/swarm` and
`/artifactory/generic-local/notes/`.

## Health Checks

```bash
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q http-honeypot)
```

## Resource Usage

```bash
docker stats --no-stream
```

## Next Steps

- [Configuration](configuration.md) — adjust settings
- [Use case](use-case-agent-message-board.md) — agent board walkthrough
- [Troubleshooting](troubleshooting.md) — resolve issues
