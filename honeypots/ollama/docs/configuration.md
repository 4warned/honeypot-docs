# Configuration Guide

Complete configuration reference for OLLAMA 2024-37032 Honeypot.

## Configuration Overview

OLLAMA 2024-37032 Honeypot uses environment variables and configuration files for customization.

## Environment Variables

### Required Variables

These variables must be set for the honeypot to function:

```bash
# Basic Configuration
HOST=0.0.0.0
PORT=11434
```

### Optional Variables

```bash
# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/honeypot.log

# Advanced
DEBUG=false
```

## Docker Compose Configuration

### Basic Configuration

The `docker-compose.yml` file includes:

```yaml
services:
  honeypot:
    build: .
    ports:
      - "11434:11434"
    environment:
      - HOST=0.0.0.0
      - PORT=11434
```


### Available Environment Variables


- `LOG_LEVEL`: Configuration option

- `HOST`: Configuration option

- `PORT`: Configuration option

- `HONEYPOT_TYPE`: Configuration option

- `FLUENTBIT_HOST`: Configuration option

- `FLUENTBIT_PORT`: Configuration option

- `FLUENTBIT_APP`: Configuration option



## Port Configuration

### Honeypot Ports

- **Primary Port**: 11434 (OLLAMA)

- **Additional Ports**: 5000
- **All Configured Ports**: 11434, 5000



### CVE-Specific Configuration

- **CVE ID**: CVE-2024-37032
- **Protocol**: OLLAMA
- **Port**: 11434

- **Vulnerability**: Ollama before 0.1.34 does not validate the format of the digest (sha256 with 64 hex digits) when getting the model path, and thus mishandles the TestGetBlobsPath test cases such as fewer than 64 hex d...



### Changing Ports

Edit `docker-compose.yml`:

```yaml
ports:
  - "8080:11434"  # Change host port
```

## Logging Configuration

### Stingar Logging

OLLAMA 2024-37032 Honeypot includes built-in Stingar logging for threat intelligence collection. Stingar logging is **enabled by default**.

#### Configuration File

The honeypot uses `default.cfg` for logging configuration:

```ini
[stingar]
enabled = True
fluent_host = fluentbit
fluent_port = 24284
app = ollama_2024-37032_honeypot
hostname =
identifier =
tags =
asn =
log_get = False
```

#### Stingar Configuration Options

- **enabled**: Enable/disable Stingar logging (default: `True`)
- **fluent_host**: Fluent/Fluent Bit hostname (default: `fluentbit`)
- **fluent_port**: Fluent/Fluent Bit port (default: `24284`)
- **app**: Application identifier for Stingar events
- **hostname**: Sensor hostname (optional)
- **identifier**: Sensor UUID/identifier (optional)
- **tags**: Comma-separated tags (optional, format: `tag1=value1,tag2=value2`)
- **asn**: ASN number (optional)
- **log_get**: Log GET requests (default: `False`)

#### JSON File Logging

JSON file logging is also enabled by default:

```ini
[jsonlog]
enabled = True
json_file = /var/log/ollama_2024-37032_honeypot/ollama_2024-37032_honeypot.json
log_get = False
```

#### Logging Backends

The honeypot supports multiple logging backends:

1. **Stingar/Fluent**: Sends events to Stingar infrastructure via Fluent protocol
2. **JSON File**: Writes structured events to JSON log files
3. **Console**: Real-time console logging for development

All backends are enabled by default and can be configured independently.

#### Setting Configuration File Location

The honeypot looks for `default.cfg` in the current directory or uses the `CONFIG` environment variable:

```bash
# Use default location (./default.cfg)
python honeypot.py

# Use custom config file
CONFIG=/path/to/config.cfg python honeypot.py
```

#### Docker Configuration

For Docker deployments, mount the config file:

```yaml
volumes:
  - ./default.cfg:/app/default.cfg
  - ./logs:/var/log/ollama_2024-37032_honeypot
```

## Configuration Examples

### Production Configuration

```yaml
# docker-compose.yml
services:
  honeypot:
    build: .
    ports:
      - "11434:11434"
    environment:
      - HOST=0.0.0.0
      - PORT=11434
      - LOG_LEVEL=INFO
    restart: unless-stopped
```

### Development Configuration

```yaml
# docker-compose.yml
services:
  honeypot:
    build: .
    ports:
      - "11434:11434"
    environment:
      - HOST=0.0.0.0
      - PORT=11434
      - DEBUG=true
      - LOG_LEVEL=DEBUG
    volumes:
      - ./logs:/app/logs
```

## Configuration Validation

### Verify Configuration

```bash
# Check Docker Compose configuration
docker-compose config

# Validate environment variables
docker-compose config | grep -A 10 environment
```

## Next Steps

- [Running Guide](running.md) - Learn how to run the honeypot
- [Troubleshooting](troubleshooting.md) - Resolve configuration issues
