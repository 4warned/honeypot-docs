# Running the Honeypot

Operational guide for the Ollama CVE-2024-37032 Honeypot.

## Starting

```bash
docker compose up -d
```

## Stopping

```bash
docker compose down
```

## Verifying Operation

```bash
# Check status
docker compose ps

# Test endpoints
curl http://localhost:11434/api/tags
curl -X POST http://localhost:11434/api/generate -d '{"model":"llama2","prompt":"hello"}'
```

## Monitoring

```bash
# Follow logs
docker compose logs -f ollama-honeypot

# Local JSON logs
tail -f logs/honeypot.json | jq .
```

## Event Types

| Event Type | Description |
|------------|-------------|
| `ollama-scan` | General reconnaissance |
| `ollama-generate` | Text generation request |
| `ollama-chat` | Chat completion request |
| `ollama-pull-ssrf` | SSRF exploitation via `/api/pull` (CVE-2024-37032) |
| `ollama-model-enum` | Model enumeration |

## Next Steps

- [Configuration](configuration.md) -- adjust settings
- [Troubleshooting](troubleshooting.md) -- resolve issues
