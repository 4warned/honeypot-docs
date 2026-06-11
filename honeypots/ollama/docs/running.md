# Running OLLAMA 2024-37032 Honeypot

Guide to running and operating OLLAMA 2024-37032 Honeypot.


## About CVE-2024-37032


Ollama before 0.1.34 does not validate the format of the digest (sha256 with 64 hex digits) when getting the model path, and thus mishandles the TestGetBlobsPath test cases such as fewer than 64 hex digits, more than 64 hex digits, or an initial ../ substring.



**CVSS Score**: 8.8 (HIGH)




**Published**: 2024-05-31




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
python honeypot.py --host 0.0.0.0 --port 11434
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

# Use appropriate client for OLLAMA protocol
nc localhost 11434

```


### Testing Vulnerable Endpoints

This honeypot emulates the following vulnerable endpoints extracted from the CVE description:


- `/wp-content/plugins/ollama/admin.php`

- `/wp-content/plugins/ollama/ajax-handler.php`

- `/wp-content/plugins/ollama/includes/admin.php`

- `/wp-content/plugins/ollama/includes/ajax-actions.php`

- `/wp-content/plugins/ollama/ollama.php`

- `/wp-content/themes/ollama/footer.php`

- `/wp-content/themes/ollama/functions.php`

- `/wp-content/themes/ollama/header.php`

- `/wp-content/themes/ollama/inc/functions.php`

- `/wp-content/themes/ollama/includes/functions.php`

- `/wp-content/themes/ollama/index.php`

- `/wp-content/themes/ollama/style.css`

- `/wp-content/themes/ollama/template-parts/header.php`


#### Test Endpoints

```bash

# Test /wp-content/plugins/ollama/admin.php
curl -v http://localhost:11434/wp-content/plugins/ollama/admin.php


# Test /wp-content/plugins/ollama/ajax-handler.php
curl -v http://localhost:11434/wp-content/plugins/ollama/ajax-handler.php


# Test /wp-content/plugins/ollama/includes/admin.php
curl -v http://localhost:11434/wp-content/plugins/ollama/includes/admin.php


# Test /wp-content/plugins/ollama/includes/ajax-actions.php
curl -v http://localhost:11434/wp-content/plugins/ollama/includes/ajax-actions.php


# Test /wp-content/plugins/ollama/ollama.php
curl -v http://localhost:11434/wp-content/plugins/ollama/ollama.php


```

**Expected Behavior**: The honeypot will log all requests to these endpoints, simulating the vulnerable behavior described in CVE-2024-37032.

#### Example Attack Patterns




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

OLLAMA 2024-37032 Honeypot includes Stingar logging for threat intelligence collection.

#### Viewing Stingar Events

Stingar events are sent to the configured Fluent/Fluent Bit host. To view events:

```bash
# If using Fluent Bit, check Fluent Bit logs
docker-compose logs fluentbit

# Or query Stingar API (if configured)
curl http://stingar-api:8080/api/events
```

#### JSON Log Files

JSON log files are written to the configured location (default: `/var/log/ollama_2024-37032_honeypot/`):

```bash
# View JSON logs
tail -f /var/log/ollama_2024-37032_honeypot/ollama_2024-37032_honeypot.json

# Parse JSON logs
cat /var/log/ollama_2024-37032_honeypot/ollama_2024-37032_honeypot.json | jq .
```

#### Log Format

Each log entry contains structured data:

```json
{
  "start_time": "2025-11-26T14:51:30.123456",
  "src_ip": "192.168.1.100",
  "src_port": 54321,
  "dst_ip": "0.0.0.0",
  "dst_port": 11434,
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
  "app": "ollama_2024-37032_honeypot",
  "sensor": {
    "uuid": "identifier",
    "hostname": "hostname",
    "tags": {},
    "asn": ""
  },
  "protocol": "ollama",
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
