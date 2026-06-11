# honeypot-docs

Public documentation for [STINGAR](https://hub.docker.com/u/4warned) honeypot deployments.

Documentation is published via [Read the Docs](https://4warned-honeypots.readthedocs.io/).

## Structure

```
honeypots/
  peoplesoft/   - Oracle PeopleSoft PeopleTools 8.62 (CVE-2026-35273)
  ollama/       - Ollama LLM Inference Server (CVE-2024-37032)
```

## Building locally

```bash
pip install mkdocs
mkdocs serve                                    # Root landing page
mkdocs serve -f honeypots/peoplesoft/mkdocs.yml # PeopleSoft docs
mkdocs serve -f honeypots/ollama/mkdocs.yml     # Ollama docs
```
