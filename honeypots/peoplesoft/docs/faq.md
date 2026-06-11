# Frequently Asked Questions

Common questions about HTTP 2026-35273 Honeypot.

## General Questions

### What is HTTP 2026-35273 Honeypot?

HTTP 2026-35273 Honeypot is a HTTP protocol honeypot that monitors network traffic and emulates the CVE-2026-35273 vulnerability.


### What is CVE-2026-35273?

Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploitable vulnerability allows unauthenticated attacker with network access via HTTP to compromise PeopleSoft Enterprise PeopleTools. Successful attacks of this vulnerability can result in takeover of PeopleSoft Enterprise PeopleTools. CVSS 3.1 Base Score 9.8 (Confidentiality, Integrity and Availability impacts). CVSS Vector: (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H).


**Severity**: CRITICAL (CVSS 9.8)




**Published**: 2026-06-11





### What protocol does it support?

HTTP 2026-35273 Honeypot supports the **HTTP** protocol on port 8000.


### What CVE does this honeypot emulate?

This honeypot emulates **CVE-2026-35273**:
- **Protocol**: HTTP
- **Port**: 8000

- **Description**: Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploitable vulnerability allows unauthenticated attacker with network access via HTTP to compromise PeopleSoft Enterprise PeopleTools. Successful attacks of this vulnerability can result in takeover of PeopleSoft Enterprise PeopleTools. CVSS 3.1 Base Score 9.8 (Confidentiality, Integrity and Availability impacts). CVSS Vector: (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H).


- **CVSS Score**: 9.8 (CRITICAL)



### Do I need root privileges?

No, the honeypot runs as a non-root user in Docker. Root privileges are not required.

## Configuration Questions

### How do I change the port?

Edit `docker-compose.yml` and change the port mapping:

```yaml
ports:
  - "8080:8000"  # Change host port
```

### How do I enable debug logging?

Set `DEBUG=true` in the environment variables in `docker-compose.yml`.

## Deployment Questions

### Can I run it without Docker?

Yes, you can run it directly with Python:

```bash
python honeypot.py --host 0.0.0.0 --port 8000
```

### What Docker image should I use?

Build from the included Dockerfile:

```bash
docker buildx build --load --provenance=true --sbom=true -t http-2026-35273-honeypot .
```

## Troubleshooting Questions

### Container won't start

Check Docker logs: `docker-compose logs`. Verify port 8000 is not in use.

### No connections detected

Verify port is exposed correctly and firewall rules allow traffic.

### How do I view logs?

```bash
docker-compose logs -f
```


## Logging Questions

### What is Stingar logging?

Stingar logging sends honeypot events to Stingar infrastructure via the Fluent protocol for threat intelligence collection and analysis. It's enabled by default.

### How do I disable Stingar logging?

Edit `default.cfg` and set:

```ini
[stingar]
enabled = False
```

### How do I configure Stingar?

Edit `default.cfg` and modify the `[stingar]` section:

```ini
[stingar]
enabled = True
fluent_host = your-fluent-host
fluent_port = 24284
app = your-app-name
identifier = your-sensor-uuid
tags = tag1=value1,tag2=value2
```

### Where are JSON log files stored?

By default, JSON log files are stored at `/var/log/http_2026-35273_honeypot/http_2026-35273_honeypot.json`. You can change this in `default.cfg`.

### How do I view Stingar events?

Stingar events are sent to your Fluent/Fluent Bit host. To view them:

- Check Fluent Bit logs: `docker-compose logs fluentbit`
- Query Stingar API (if configured)
- Check your threat intelligence platform

### Can I use Stingar without Fluent Bit?

No, Stingar logging requires a Fluent or Fluent Bit service to receive events. You can run Fluent Bit in a Docker container alongside the honeypot.

### What data is logged?

All honeypot interactions are logged, including:
- Source IP and port
- Destination IP and port
- Request method/path
- Headers
- Form data
- File uploads (if any)
- Timestamps

### How do I filter GET requests?

Set `log_get = False` in `default.cfg` under `[stingar]` or `[jsonlog]` sections to exclude GET requests from logs.


## Next Steps

- [Installation](installation.md) - Get started
- [Configuration](configuration.md) - Configure the honeypot
- [Troubleshooting](troubleshooting.md) - Resolve issues
