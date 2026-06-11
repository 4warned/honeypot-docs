# FAQ

Frequently asked questions about the SYNsor Honeypot.

## General

### What does this honeypot do?

SYNsor monitors network traffic at the packet level to detect port scans,
ping sweeps, and reconnaissance activity. It uses raw sockets to capture
TCP SYN packets, ICMP messages, and UDP probes, then reports all activity
to STINGAR.

### How is it different from other honeypots?

Most honeypots emulate application-level services (HTTP, SSH, etc.). SYNsor
operates at the network/transport layer, detecting scanning activity before
attackers even attempt to connect to a service.

### Why does it need root access?

Raw socket capture (AF_PACKET) requires `NET_RAW` capability and root privileges.
This is a Linux kernel requirement for packet-level monitoring.

## Deployment

### What ports does it monitor?

SYNsor monitors whatever ports you configure in `configs/ports.txt`. It does
not open these ports -- it passively monitors packets destined for them.

### Does it conflict with other services?

The raw socket subsystem is passive and does not bind ports. The fake service
monitor does bind ports, so avoid configuring ports that are already in use by
real services on the host.

### Why host networking?

Raw socket capture requires direct access to the host's network interfaces.
Docker bridge networking would only show NAT-translated traffic, masking
the real source IPs.

### What architectures are supported?

The Docker image supports both `linux/amd64` and `linux/arm64`.

## Security

### Is it safe to run as root?

Yes. The container only captures and analyzes packets. It does not execute
attacker payloads or respond to probes from the raw socket subsystem.

### Does it affect network performance?

No. SYNsor uses passive packet capture (similar to tcpdump). It does not
modify or intercept traffic flow.

### Can attackers detect SYNsor?

The raw socket subsystem is completely passive (invisible). The fake service
monitor accepts and immediately closes connections, which is detectable but
not distinguishable from many legitimate network services.

## Telemetry

### What data is sent to STINGAR?

Each event includes: source/destination IP and port, protocol, scan pattern
classification, network interface, and timestamp.

### Can I use it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml`. Events will
still be logged to the container's stdout (viewable via `docker logs honey-syn`).

### How do I verify events are reaching STINGAR?

```bash
docker logs fluentbit-syn
```

Look for connection confirmations, not error messages.
