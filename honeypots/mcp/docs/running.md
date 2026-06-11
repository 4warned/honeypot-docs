# Running the Honeypot

Operational guide for the MCP Server Honeypot.

## About the MCP Honeypot

The MCP (Model Context Protocol) honeypot emulates an exposed MCP server with
deliberately vulnerable configurations. It presents tool poisoning bait, an
unauthenticated admin panel, and fake sensitive resources (honeytokens) to
detect attackers probing AI/LLM infrastructure.

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

Both `mcp-honeypot` and `fluentbit-mcp` should show as "Up".

### Test Endpoints

```bash
# MCP server info
curl http://localhost:3000/

# SSE transport endpoint
curl http://localhost:3000/sse

# Admin panel (honeytoken)
curl http://localhost:3000/admin
```

## Monitoring

### View Logs

```bash
# Follow all logs
docker compose logs -f

# View only honeypot logs
docker compose logs -f mcp-honeypot

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
| `mcp-initialize` | Client initialization handshake |
| `mcp-tool-list` | Tool enumeration (listing available tools) |
| `mcp-tool-call` | Tool invocation attempt |
| `mcp-resource-access` | Resource/honeytoken access |
| `mcp-admin-access` | Admin panel access attempt |
| `mcp-prompt-injection` | Prompt injection pattern detected |

## Health Checks

The container includes a built-in health check that runs every 30 seconds.
View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q mcp-honeypot)
```

## Resource Usage

```bash
docker stats --no-stream
```

The honeypot is lightweight -- typical usage is under 50MB RAM and minimal CPU.

## Next Steps

- [Configuration](configuration.md) -- adjust settings
- [Troubleshooting](troubleshooting.md) -- resolve issues
