# OLLAMA 2024-37032 Honeypot - Introduction

## What is OLLAMA 2024-37032 Honeypot?

A ollama service honeypot on port 11434 to emulate the CVE-2024-37032 vulnerability for authorized security research, threat detection, and attack pattern analysis.


This honeypot specifically emulates the **CVE-2024-37032** vulnerability, providing a controlled environment for security research, threat detection, and attack pattern analysis.



This honeypot emulates **CVE-2024-37032** vulnerability for authorized security research and monitoring purposes.


## Key Features


- **OLLAMA protocol emulation**

- **Vulnerability emulation: CVE-2024-37032**

- **Docker containerization**

- **Docker Compose deployment**

- **Stingar logging (threat intelligence integration)**

- **JSON file logging**

- **Centralized logging infrastructure**





## Vulnerability Details

This honeypot emulates **CVE-2024-37032** for authorized security research and monitoring purposes.

### CVE Information

- **CVE ID**: CVE-2024-37032

- **Description**: Ollama before 0.1.34 does not validate the format of the digest (sha256 with 64 hex digits) when getting the model path, and thus mishandles the TestGetBlobsPath test cases such as fewer than 64 hex digits, more than 64 hex digits, or an initial ../ substring.


- **CVSS Score**: 8.8 (HIGH)

- **CVSS Version**: 3.1




- **Published**: 2024-05-31


- **Vulnerable Endpoints**: /wp-content/plugins/ollama/admin.php, /wp-content/plugins/ollama/ajax-handler.php, /wp-content/plugins/ollama/includes/admin.php, /wp-content/plugins/ollama/includes/ajax-actions.php, /wp-content/plugins/ollama/ollama.php, /wp-content/themes/ollama/footer.php, /wp-content/themes/ollama/functions.php, /wp-content/themes/ollama/header.php, /wp-content/themes/ollama/inc/functions.php, /wp-content/themes/ollama/includes/functions.php, /wp-content/themes/ollama/index.php, /wp-content/themes/ollama/style.css, /wp-content/themes/ollama/template-parts/header.php




## Protocol and Port Configuration

### Protocol

This honeypot implements the **OLLAMA** protocol.


- **Protocol Type**: Network Protocol
- **Transport**: TCP/UDP (varies)


### Port Configuration

- **Primary Port**: 11434

- **Additional Ports**: 5000
- **All Ports**: 11434, 5000




### Deployment

- **Docker Support**: Complete containerization with Docker Compose
- **Dockerfile**: Included for custom builds
- **Configuration**: Environment-based and file-based configuration

### Logging

- **Stingar Integration**: Built-in Stingar logging for threat intelligence collection (enabled by default)
- **JSON File Logging**: Structured JSON log files for local analysis (enabled by default)
- **Console Logging**: Real-time console output for development
- **Centralized Logging**: Single output manager supporting multiple backends


## About CVE-2024-37032

Ollama before 0.1.34 does not validate the format of the digest (sha256 with 64 hex digits) when getting the model path, and thus mishandles the TestGetBlobsPath test cases such as fewer than 64 hex digits, more than 64 hex digits, or an initial ../ substring.




### Vulnerable Endpoints

The following endpoints are emulated based on CVE research:


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




### Vulnerability Signatures

The following vulnerability signatures are detected and emulated:


- **endpoint_signature**: Vulnerability affects specific endpoints: /wp-content/plugins/ollama/admin.php, /wp-content/plugins/ollama/ajax-handler.php, /wp-content/plugins/ollama/includes/admin.php, /wp-content/plugins/ollama/includes/ajax-actions.php, /wp-content/plugins/ollama/ollama.php







## Quick Start

```bash
# 1. Navigate to honeypot directory
cd honeypots/hp-ollama-emulates-service-20260410-133823-cve-2024-37032

# 2. Start with Docker Compose
docker-compose up -d

# 3. Verify it's running
docker-compose ps
```

## Next Steps

- [Installation Guide](installation.md) - Get OLLAMA 2024-37032 Honeypot up and running
- [Configuration Guide](configuration.md) - Customize for your environment
- [Running Guide](running.md) - Learn how to operate the honeypot
- [Architecture](architecture.md) - Understand how it works

## Related Resources

- **Generated**: 2026-04-10T13:38:23.560810
- **Realism Score**: 0/100
