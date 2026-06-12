# HTTP 2026-35273 Honeypot - Introduction

## What is HTTP 2026-35273 Honeypot?

A http web server honeypot on port 8000 to emulate the CVE-2026-35273 vulnerability for authorized security research, threat detection, and attack pattern analysis.


This honeypot specifically emulates the **CVE-2026-35273** vulnerability, providing a controlled environment for security research, threat detection, and attack pattern analysis.



This honeypot emulates **CVE-2026-35273** vulnerability for authorized security research and monitoring purposes.


## Key Features


- **HTTP protocol emulation**

- **Vulnerability emulation: CVE-2026-35273**

- **Docker containerization**

- **Docker Compose deployment**

- **Stingar logging (threat intelligence integration)**

- **JSON file logging**

- **Centralized logging infrastructure**





## Vulnerability Details

This honeypot emulates **CVE-2026-35273** for authorized security research and monitoring purposes.

### CVE Information

- **CVE ID**: CVE-2026-35273

- **Description**: Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploitable vulnerability allows unauthenticated attacker with network access via HTTP to compromise PeopleSoft Enterprise PeopleTools. Successful attacks of this vulnerability can result in takeover of PeopleSoft Enterprise PeopleTools. CVSS 3.1 Base Score 9.8 (Confidentiality, Integrity and Availability impacts). CVSS Vector: (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H).


- **CVSS Score**: 9.8 (CRITICAL)

- **CVSS Version**: 3.1




- **Published**: 2026-06-11





## Protocol and Port Configuration

### Protocol

This honeypot implements the **HTTP** protocol.


- **Protocol Type**: Web/Application Layer
- **Transport**: TCP
- **Default Port**: 80


### Port Configuration

- **Primary Port**: 8000



#### Standard Ports


- **HTTP Standard Port**: 80





**Note**: This honeypot is configured to run on port **8000**. You may want to adjust this to match the standard port for better realism.


### Deployment

- **Docker Support**: Complete containerization with Docker Compose
- **Dockerfile**: Included for custom builds
- **Configuration**: Environment-based and file-based configuration

### Logging

- **Stingar Integration**: Built-in Stingar logging for threat intelligence collection (enabled by default)
- **JSON File Logging**: Structured JSON log files for local analysis (enabled by default)
- **Console Logging**: Real-time console output for development
- **Centralized Logging**: Single output manager supporting multiple backends


## About CVE-2026-35273

Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploitable vulnerability allows unauthenticated attacker with network access via HTTP to compromise PeopleSoft Enterprise PeopleTools. Successful attacks of this vulnerability can result in takeover of PeopleSoft Enterprise PeopleTools. CVSS 3.1 Base Score 9.8 (Confidentiality, Integrity and Availability impacts). CVSS Vector: (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H).






### Vulnerability Signatures

The following vulnerability signatures are detected and emulated:


- **service_signature**: Vulnerability affects WebSocket service

- **protocol_signature**: Vulnerability affects HTTP protocol

- **banner_signature**: Vulnerability may be detectable via version banners




### Emulation Guidance

# Emulation Guidance for CVE-2026-35273

## Vulnerability Description
Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploita...

## Detected Services

- **WebSocket**: http protocol
  - Known endpoints: /ws, /websocket

## Vulnerability Signatures

- **service_signature**: Vulnerability affects WebSocket service
  - Emulation: Emulate WebSocket service behavior and endpoints
  - Service: WebSocket
  - Endpoints: /ws, /websocket
- **protocol_signature**: Vulnerability affects HTTP protocol
  - Emulation: Emulate HTTP protocol behavior that indicates vulnerability
- **banner_signature**: Vulnerability may be detectable via version banners
  - Emulation: Include version strings in banners that match vulnerable versions

## Implementation Notes

- Log all attempts matching exploit vector patterns
- Emulate vulnerable behavior without actually being vulnerable
- Return responses that would indicate successful exploitation attempt
- Include version strings and error messages matching vulnerable software

## Service-Specific Emulation

- **WebSocket**:
  - Emulate http protocol
  - Include banners: Upgrade: websocket
  - Implement endpoints: /ws, /websocket




## Quick Start

```bash
# 1. Navigate to honeypot directory
cd honeypots/hp-http-emulates-oracle-20260611-122200-cve-2026-35273

# 2. Start with Docker Compose
docker-compose up -d

# 3. Verify it's running
docker-compose ps
```

## Next Steps

- [Installation Guide](installation.md) - Get HTTP 2026-35273 Honeypot up and running
- [Configuration Guide](configuration.md) - Customize for your environment
- [Running Guide](running.md) - Learn how to operate the honeypot
- [Architecture](architecture.md) - Understand how it works

## Related Resources

- **Generated**: 2026-06-11T12:22:00.019457
- **Realism Score**: 0/100
