# Troubleshooting

Common issues and solutions for the Ollama CVE-2024-37032 Honeypot.

## Container Issues

### Container Won't Start

```bash
docker compose logs ollama-honeypot
docker compose pull
docker compose up -d
```

### Port Already in Use

If you have a real Ollama instance running on 11434, change the host port:

```yaml
ports:
  - "11435:11434"
```

## STINGAR Issues

### Events Not Reaching STINGAR

1. Check Fluent Bit is running: `docker compose ps fluentbit`
2. Check Fluent Bit logs: `docker compose logs fluentbit`
3. Verify `stingar-hp.env` has correct `FLUENTD_HOST` and `FLUENTD_PORT`
4. Test outbound connectivity to STINGAR server on port 24224

## Network Issues

### Cannot Reach Honeypot

- Verify container is running: `docker compose ps`
- Test locally: `curl http://localhost:11434/`
- Check host firewall allows inbound on port 11434

## Debug Mode

```yaml
environment:
  - LOG_LEVEL=DEBUG
```

Then: `docker compose up -d && docker compose logs -f`

## Next Steps

- [Configuration](configuration.md) -- review settings
- [FAQ](faq.md) -- common questions
