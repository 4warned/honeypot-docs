# Architecture

Technical architecture and design of HTTP 2026-35273 Honeypot.

## System Architecture

HTTP 2026-35273 Honeypot is a HTTP protocol honeypot designed to emulate network services.

## Protocol Implementation

### HTTP Protocol

The honeypot implements the **HTTP** protocol with the following characteristics:

- **Primary Port**: 8000

- **Protocol Type**: HTTP
- **Transport Layer**: TCP


### CVE Emulation: CVE-2026-35273

This honeypot emulates the **CVE-2026-35273** vulnerability:


**Vulnerability Description**:
Vulnerability in the PeopleSoft Enterprise PeopleTools product of Oracle PeopleSoft (component: Updates Environment Management). Supported versions that are affected are 8.61 and 8.62. Easily exploitable vulnerability allows unauthenticated attacker with network access via HTTP to compromise PeopleSoft Enterprise PeopleTools. Successful attacks of this vulnerability can result in takeover of PeopleSoft Enterprise PeopleTools. CVSS 3.1 Base Score 9.8 (Confidentiality, Integrity and Availability impacts). CVSS Vector: (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H).


- **CVE ID**: CVE-2026-35273
- **Protocol**: HTTP
- **Port**: 8000

- **CVSS Score**: 9.8 (CRITICAL)





## Component Overview

### Main Components

1. **Protocol Handler**: Handles HTTP protocol interactions


3. **Vulnerability Emulation**: Emulates CVE-2026-35273 vulnerability

4. **Logging System**: Centralized logging infrastructure with multiple backends
   - **Output Manager**: Centralized interface for all logging backends
   - **Stingar Output**: Sends events to Stingar via Fluent protocol
   - **JSON Log Output**: Writes structured events to JSON files
   - **Console Logging**: Real-time console output
5. **Configuration Management**: Environment-based and file-based configuration

## Data Flow

```
Client Connection → Protocol Handler → Service Emulation → Response Generation
                              ↓
                         Output Manager
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
            Stingar/Fluent         JSON File Log
                    ↓                   ↓
            Threat Intelligence    Local Analysis
```

### Logging Architecture

The honeypot uses a centralized output manager that routes events to multiple backends:

1. **Request Parsing**: All incoming requests/commands are parsed into structured data
2. **Output Manager**: Routes events to enabled backends
3. **Stingar Backend**: Sends events to Stingar infrastructure (if enabled)
4. **JSON Log Backend**: Writes events to JSON files (if enabled)
5. **Console Backend**: Outputs events to console (always enabled)

All logging is protocol-agnostic and works consistently across HTTP, FTP, SMTP, MySQL, and other protocols.

## Key Features


- HTTP protocol emulation

- Vulnerability emulation: CVE-2026-35273

- Docker containerization

- Docker Compose deployment

- Stingar logging (threat intelligence integration)

- JSON file logging

- Centralized logging infrastructure


## Security Considerations

- **Non-root User**: Runs as non-root user in Docker
- **Network Isolation**: Uses Docker networking
- **Logging**: All interactions are logged
- **Deceptive Marking**: Code is marked as deceptive

## Next Steps

- [Configuration](configuration.md) - Configure the honeypot
- [Running Guide](running.md) - Learn operational procedures
