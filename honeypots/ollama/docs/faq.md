# Frequently Asked Questions

Common questions about OLLAMA 2024-37032 Honeypot.

## General Questions

### What is OLLAMA 2024-37032 Honeypot?

OLLAMA 2024-37032 Honeypot is a OLLAMA protocol honeypot that monitors network traffic and emulates the CVE-2024-37032 vulnerability.


### What is CVE-2024-37032?

Ollama before 0.1.34 does not validate the format of the digest (sha256 with 64 hex digits) when getting the model path, and thus mishandles the TestGetBlobsPath test cases such as fewer than 64 hex digits, more than 64 hex digits, or an initial ../ substring.


**Severity**: HIGH (CVSS 8.8)




**Published**: 2024-05-31



**Vulnerable Endpoints**: /wp-content/plugins/ollama/admin.php, /wp-content/plugins/ollama/ajax-handler.php, /wp-content/plugins/ollama/includes/admin.php, /wp-content/plugins/ollama/includes/ajax-actions.php, /wp-content/plugins/ollama/ollama.php, /wp-content/themes/ollama/footer.php, /wp-content/themes/ollama/functions.php, /wp-content/themes/ollama/header.php, /wp-content/themes/ollama/inc/functions.php, /wp-content/themes/ollama/includes/functions.php, /wp-content/themes/ollama/index.php, /wp-content/themes/ollama/style.css, /wp-content/themes/ollama/template-parts/header.php




### What protocol does it support?

OLLAMA 2024-37032 Honeypot supports the **OLLAMA** protocol on port ports 11434, 5000.


### What CVE does this honeypot emulate?

This honeypot emulates **CVE-2024-37032**:
- **Protocol**: OLLAMA
- **Port**: 11434

- **Description**: Ollama before 0.1.34 does not validate the format of the digest (sha256 with 64 hex digits) when getting the model path, and thus mishandles the TestGetBlobsPath test cases such as fewer than 64 hex digits, more than 64 hex digits, or an initial ../ substring.


- **CVSS Score**: 8.8 (HIGH)



### Do I need root privileges?

No, the honeypot runs as a non-root user in Docker. Root privileges are not required.

## Configuration Questions

### How do I change the port?

Edit `docker-compose.yml` and change the port mapping:

```yaml
ports:
  - "8080:11434"  # Change host port
```

### How do I enable debug logging?

Set `DEBUG=true` in the environment variables in `docker-compose.yml`.

## Deployment Questions

### Can I run it without Docker?

Yes, you can run it directly with Python:

```bash
python honeypot.py --host 0.0.0.0 --port 11434
```

### What Docker image should I use?

Build from the included Dockerfile:

```bash
docker build -t ollama-2024-37032-honeypot .
```

## Troubleshooting Questions

### Container won't start

Check Docker logs: `docker-compose logs`. Verify port 11434 is not in use.

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

By default, JSON log files are stored at `/var/log/ollama_2024-37032_honeypot/ollama_2024-37032_honeypot.json`. You can change this in `default.cfg`.

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
