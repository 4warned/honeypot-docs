# Running the Honeypot

Operational guide for the SYNsor Packet Monitoring Honeypot.

## About SYNsor

SYNsor monitors network traffic at the packet level using raw sockets. It detects
port scans, ping sweeps, and reconnaissance activity by capturing TCP SYN packets,
ICMP messages, and UDP traffic. It identifies specific scanning tools (including
Nmap scan patterns) and reports all activity to STINGAR.

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

Both `honey-syn` and `fluentbit-syn` should show as "Up".

### Verify Packet Capture

```bash
docker logs honey-syn --tail=20
```

You should see startup messages indicating the packet capture is active on the
configured network interface.

### Generate Test Traffic

From another host, run a simple scan against the honeypot:

```bash
nmap -sS -p 80,443 <honeypot-ip>
```

Check SYNsor logs for detection:

```bash
docker logs honey-syn --tail=50
```

## Monitoring

### View Logs

```bash
# Follow honeypot logs
docker logs -f honey-syn

# Follow Fluent Bit logs
docker logs -f fluentbit-syn
```

### STINGAR Events

Events are forwarded to your STINGAR server via the Fluent Bit sidecar.
Verify the sidecar is connected:

```bash
docker logs fluentbit-syn
```

## Event Types

SYNsor generates the following event types:

| Event Type | Description |
|------------|-------------|
| `tcp_syn` | TCP SYN packet detected on a monitored port |
| `tcp_connect` | Full TCP connection established (connect scan) |
| `icmp_echo` | ICMP echo request (ping) detected |
| `icmp_timestamp` | ICMP timestamp request detected |
| `udp_probe` | UDP packet to a monitored port |
| `nmap_pattern` | Recognized Nmap scan pattern |

### Event Fields

Each event includes:

- Source IP and port
- Destination IP and port
- Protocol (TCP/ICMP/UDP)
- Scan pattern classification (if detected)
- Timestamp
- Network interface

## Health Checks

View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' honey-syn
```

## Resource Usage

```bash
docker stats --no-stream honey-syn fluentbit-syn
```

SYNsor is highly efficient -- typical usage is under 30MB RAM with minimal CPU,
even under heavy scan traffic.

## Next Steps

- [Configuration](configuration.md) -- adjust monitored ports and interface
- [Troubleshooting](troubleshooting.md) -- resolve issues
