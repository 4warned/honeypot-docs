# Troubleshooting

Common issues and solutions for the SYNsor Honeypot.

## Container Issues

### Container Won't Start

**Problem**: Container fails to start or exits immediately.

**Solutions**:

```bash
docker logs honey-syn
docker images | grep synsor
docker compose pull
```

Common causes:
- Missing `NET_RAW` capability (check `cap_add` in compose file)
- Missing `user: root` (required for raw sockets)
- Missing `network_mode: host`

### Permission Denied

**Problem**: Logs show permission errors for socket operations.

**Solutions**:

- Ensure `cap_add: [NET_RAW, NET_ADMIN]` is set in `docker-compose.yml`
- Ensure `user: root` is set
- Verify the host kernel allows raw socket access

## Network Issues

### No Packets Detected

**Problem**: SYNsor is running but not detecting any traffic.

**Solutions**:

- Verify `NETWORK_INTERFACE` in `stingar-hp.env` (try `any` if unsure)
- Check that traffic is actually reaching the host: `tcpdump -i any port 80 -c 5`
- Verify `configs/ports.txt` contains the ports you expect to monitor
- Check host firewall is not dropping packets before they reach the interface

### Wrong Source IPs

**Problem**: Events show `127.0.0.1` or the server IP instead of attacker IPs.

**Solutions**:

- Verify `HONEYPOT_HOST` and `HONEYPOT_IP` in `stingar-hp.env` are set to the
  honeypot's external IP, not the STINGAR server IP
- Check `NETWORK_INTERFACE` is set to the correct interface
- Ensure `network_mode: host` is set (not bridge networking)

## STINGAR / Telemetry Issues

### Events Not Appearing in STINGAR

**Problem**: Honeypot is detecting traffic but events don't show in STINGAR.

**Solutions**:

1. Verify Fluent Bit sidecar is running:
   ```bash
   docker logs fluentbit-syn
   ```

2. Verify `stingar-hp.env` has correct values:
   - `FLUENTD_HOST` must point to your STINGAR server
   - `FLUENTD_PORT` should be `24224`
   - `HONEYPOT_IDENT` must be a valid registered sensor UUID

3. Since SYNsor uses host networking, it connects to Fluent Bit via `localhost`:
   - Verify `FLUENTBIT_HOST=localhost` in `stingar-hp.env`
   - Verify Fluent Bit is binding on `127.0.0.1:24284`

### Fluent Bit Cannot Connect

**Problem**: Fluent Bit logs show connection errors to STINGAR.

**Solutions**:

- Verify STINGAR server is reachable: `nc -zv <STINGAR_IP> 24224`
- Check outbound port 24224 (TCP) is allowed by the host firewall
- Confirm `FLUENTD_HOST` in `stingar-hp.env` is correct

## Debug Mode

Enable verbose logging by adding to `stingar-hp.env`:

```bash
DEBUG=true
```

Then restart:

```bash
docker compose up -d
docker logs -f honey-syn
```

## Getting Help

If issues persist:

1. Collect logs: `docker logs honey-syn > synsor-debug.log 2>&1`
2. Note your Docker version: `docker --version`
3. Note your OS and kernel: `uname -a`
4. Check network interface: `ip link show`
5. Contact your STINGAR administrator with the debug log

## Next Steps

- [Configuration](configuration.md) -- review settings
- [FAQ](faq.md) -- common questions
