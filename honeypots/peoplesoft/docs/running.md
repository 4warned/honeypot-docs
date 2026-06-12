# Running HTTP 2026-35273 Honeypot

Guide to running and operating HTTP 2026-35273 Honeypot.


## About CVE-2026-35273


Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploitable vulnerability allows unauthenticated attacker with network access via HTTP to compromise PeopleSoft Enterprise PeopleTools. Successful attacks of this vulnerability can result in takeover of PeopleSoft Enterprise PeopleTools. CVSS 3.1 Base Score 9.8 (Confidentiality, Integrity and Availability impacts). CVSS Vector: (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H).



**CVSS Score**: 9.8 (CRITICAL)




**Published**: 2026-06-11




## Starting the Honeypot

### Docker Compose

```bash
# Start in background
docker-compose up -d

# Start with logs
docker-compose up
```

### Manual Execution

```bash
# Run directly
python honeypot.py --host 0.0.0.0 --port 8000
```

## Stopping the Honeypot

### Docker Compose

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Manual Execution

```bash
# Stop with Ctrl+C or
pkill -f honeypot.py
```

## Health Checks

### Check Container Status

```bash
docker-compose ps
```

### Test Connectivity

```bash

curl http://localhost:8000

```



## Log Management

### View Logs

```bash
# Follow logs
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

### Log Locations

- **Docker**: Container logs via `docker-compose logs`
- **Manual**: `logs/honeypot.log` in honeypot directory


### Stingar Logging

HTTP 2026-35273 Honeypot includes Stingar logging for threat intelligence collection.

#### Viewing Stingar Events

Stingar events are sent to the configured Fluent/Fluent Bit host. To view events:

```bash
# If using Fluent Bit, check Fluent Bit logs
docker-compose logs fluentbit

# Or query Stingar API (if configured)
curl http://stingar-api:8080/api/events
```

#### JSON Log Files

JSON log files are written to the configured location (default: `/var/log/http_2026-35273_honeypot/`):

```bash
# View JSON logs
tail -f /var/log/http_2026-35273_honeypot/http_2026-35273_honeypot.json

# Parse JSON logs
cat /var/log/http_2026-35273_honeypot/http_2026-35273_honeypot.json | jq .
```

#### Log Format

Each log entry contains structured data:

```json
{
  "start_time": "2025-11-26T14:51:30.123456",
  "src_ip": "192.168.1.100",
  "src_port": 54321,
  "dst_ip": "0.0.0.0",
  "dst_port": 8000,
  "method": "GET",
  "path": "/",
  "headers": {...},
  "args": {...}
}
```

#### Stingar Event Structure

Stingar events follow the standard Stingar format:

```json
{
  "app": "http_2026-35273_honeypot",
  "sensor": {
    "uuid": "identifier",
    "hostname": "hostname",
    "tags": {},
    "asn": ""
  },
  "protocol": "http",
  "start_time": "...",
  "src_ip": "...",
  "hp_data": {...}
}
```


## Monitoring

### Container Status

```bash
# Check status
docker-compose ps

# View resource usage
docker stats
```

### Log Analysis

```bash
# Search logs
docker-compose logs | grep ERROR

# Count connections
docker-compose logs | grep "Connection from" | wc -l
```

## Next Steps

- [Configuration](configuration.md) - Customize settings
- [Monitoring](monitoring.md) - Monitor honeypot operation
- [Troubleshooting](troubleshooting.md) - Resolve issues
