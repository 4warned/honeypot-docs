# Architecture

Technical architecture of the SYNsor Packet Monitoring Honeypot.

## System Overview

SYNsor uses host networking for raw socket access. The architecture differs
from other honeypots because it captures packets at the network layer rather
than emulating application-level services.

```
        Internet Traffic
               |
        Host Network Stack
               |
    +----------+-----------+
    |   SYNsor             |
    |  (4warned/synsor:    |
    |   latest)            |
    |                      |
    |  Raw Socket Capture  |
    |  + Fake Services     |
    +----------+-----------+
               |
          localhost:24284
               |
    +----------+-----------+
    |    Fluent Bit        |
    |  (4warned/fluentbit) |
    +----------+-----------+
               |
          TCP port 24224
               |
    +----------+-----------+
    |   STINGAR Server     |
    +-----------------------+
```

## Components

### SYNsor Container

A Go binary with two detection subsystems:

- **Raw Socket Capture** -- monitors packets using AF_PACKET sockets, detecting
  SYN packets, ICMP messages, and UDP probes without establishing connections.
  This catches stealth scans that never complete the TCP handshake.
- **Fake Service Monitor** -- listens on configured ports to detect TCP connect
  scans that complete the three-way handshake.

### Fluent Bit Sidecar

Standard Fluent Bit container that receives events from SYNsor via the Fluent
forward protocol and delivers them to the STINGAR server.

## Detection Methods

### Raw Socket (Stealth Scan Detection)

- Opens AF_PACKET socket with `NET_RAW` capability
- Captures SYN packets to monitored ports
- Detects ICMP echo/timestamp requests
- Identifies UDP probes
- Never responds to packets (passive monitoring)

### Fake Service (Connect Scan Detection)

- Binds to configured TCP ports
- Accepts connections to detect TCP connect scans
- Captures source IP/port of connecting clients
- Immediately closes connections after detection

### Nmap Pattern Recognition

Analyzes scan behavior to identify specific tools:

- **Port sequence analysis** -- detects Top 1000 port scans
- **Timing analysis** -- identifies aggressive vs. stealth scanning
- **Protocol correlation** -- combines TCP/ICMP/UDP signals

## Data Flow

1. Packet arrives at host network interface
2. Raw socket captures the packet header
3. SYNsor classifies the traffic (TCP SYN, ICMP, UDP, connect)
4. Nmap pattern analysis correlates multiple events
5. Event is sent to Fluent Bit via forward protocol (localhost:24284)
6. Fluent Bit delivers to STINGAR server

## Networking Model

Unlike other honeypots that use Docker bridge networking, SYNsor uses
`network_mode: host`:

- Direct access to host network interfaces
- Sees real source IPs (no Docker NAT)
- Requires `NET_RAW` and `NET_ADMIN` capabilities
- Fluent Bit uses standard Docker networking (port 24284 on localhost)

## Security Considerations

- Runs as root (required for raw socket access)
- Uses host networking (sees all host traffic on monitored ports)
- Does not respond to probes from the raw socket subsystem (passive)
- Fake service connections are immediately closed (no exploitable surface)
- Fluent Bit binds only to localhost (127.0.0.1)

## Next Steps

- [Configuration](configuration.md) -- customize monitored ports
- [Running Guide](running.md) -- operation and monitoring
