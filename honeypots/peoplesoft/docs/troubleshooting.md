# Troubleshooting

Common issues and solutions for HTTP 2026-35273 Honeypot.

## Common Issues

### Container Won't Start

**Problem**: Container fails to start or exits immediately.

**Solutions**:

- Check Docker logs: `docker-compose logs`
- Verify port 8000 is not already in use
- Check Docker daemon is running
- Review docker-compose.yml for syntax errors

### No Connections Detected

**Problem**: Honeypot is running but not detecting connections.

**Solutions**:

- Verify port 8000 is exposed correctly
- Check firewall rules allow traffic
- Verify network connectivity
- Check logs for errors: `docker-compose logs`

### Port Already in Use

**Problem**: Port 8000 is already in use.

**Solutions**:

- Change port in docker-compose.yml
- Stop the service using the port
- Use a different port mapping

## Debug Mode

Enable debug logging:

```bash
# In docker-compose.yml
environment:
  - DEBUG=true
  - LOG_LEVEL=DEBUG
```

## Log Analysis

### View Logs

```bash
# Follow logs
docker-compose logs -f

# Search for errors
docker-compose logs | grep ERROR

# View last 50 lines
docker-compose logs --tail=50
```

## Network Issues

### Port Not Accessible

- Check firewall rules
- Verify port mapping in docker-compose.yml
- Test with: `curl http://localhost:8000`

### Connection Refused

- Verify container is running: `docker-compose ps`
- Check container logs: `docker-compose logs`
- Verify port configuration

## Performance Issues

- Check system resources: `docker stats`
- Review log file sizes
- Monitor connection rates
- Adjust Docker resource limits if needed


## Logging Issues

### Stingar Events Not Appearing

**Problem**: Stingar events are not being received.

**Solutions**:

- Verify `default.cfg` has `[stingar]` section with `enabled = True`
- Check Fluent/Fluent Bit host is reachable: `ping fluentbit` or `telnet fluentbit 24284`
- Verify Fluent Bit service is running: `docker-compose ps fluentbit`
- Check Fluent Bit logs: `docker-compose logs fluentbit`
- Verify network connectivity between honeypot and Fluent Bit
- Check `fluent_host` and `fluent_port` in `default.cfg` match your Fluent Bit configuration

### JSON Log Files Not Created

**Problem**: JSON log files are not being written.

**Solutions**:

- Verify `default.cfg` has `[jsonlog]` section with `enabled = True`
- Check log directory exists and is writable: `ls -la /var/log/http_2026-35273_honeypot/`
- Verify log file path in `default.cfg` is correct
- Check Docker volume mounts include log directory
- Verify file permissions on log directory

### Output Manager Not Initializing

**Problem**: Output manager fails to initialize.

**Solutions**:

- Verify `default.cfg` exists in honeypot directory
- Check `CONFIG` environment variable points to correct config file
- Verify `output/` directory exists with `__init__.py`, `stingar.py`, and `jsonlog.py`
- Check Python imports: `python -c "import output; print(output)"`
- Verify `fluent-logger` is installed: `pip list | grep fluent-logger`

### No Logs in Console

**Problem**: Console logging is not appearing.

**Solutions**:

- Console logging is always enabled - check if honeypot is actually receiving connections
- Verify honeypot is running: `docker-compose ps`
- Check for Python errors: `docker-compose logs | grep -i error`
- Verify output manager is being called in protocol handler code


## Next Steps

- [Configuration](configuration.md) - Review configuration
- [FAQ](faq.md) - Common questions
