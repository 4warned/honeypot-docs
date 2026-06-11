# FAQ

## What does this honeypot do?

It emulates an Ollama LLM inference server and detects exploitation attempts
targeting CVE-2024-37032 (SSRF via `/api/pull`). All interactions are logged
and forwarded to STINGAR.

## Is this a real Ollama instance?

No. No LLM models are loaded or executed. The honeypot returns realistic but
static responses to API requests.

## What architectures are supported?

The Docker image supports `linux/amd64` and `linux/arm64`.

## Can I run it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml`. Events will
still be logged to `./logs/honeypot.json`.

## What data is sent to STINGAR?

Source IP/port, timestamp, HTTP method, path, headers, request body summary,
and event classification.
