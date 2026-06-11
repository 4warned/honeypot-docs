# Custom Content Guide

How to customize the pages and files served by Trainpot.

## Content Directory

Trainpot serves all content from the `./content` directory mounted at
`/opt/trainpot-hp/content` inside the container. The default image ships with
sample content, but you can fully customize it.

## Directory Structure

```
content/
  index.html          # Homepage
  robots.txt          # Defines disallowed paths (detection rules)
  sitemap.xml         # Lists trap URLs
  css/
    style.css         # Stylesheet
  papers/
    paper1.pdf        # Fake research papers
    paper2.pdf
  courses/
    syllabus.html     # Fake course materials
```

## Customizing robots.txt

The `robots.txt` file defines which paths are "disallowed." Any crawler that
accesses a disallowed path is flagged as a violator:

```text
User-agent: *
Disallow: /private/
Disallow: /internal/
Disallow: /admin/
Disallow: /api/training-data/

Sitemap: https://your-domain.com/sitemap.xml
```

Add paths that AI scrapers are likely to target.

## Customizing sitemap.xml

The sitemap should list only disallowed URLs. This creates a trap: scrapers that
fetch the sitemap and follow all links will access disallowed paths.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://your-domain.com/private/dataset.csv</loc></url>
  <url><loc>https://your-domain.com/internal/model-weights.bin</loc></url>
  <url><loc>https://your-domain.com/api/training-data/export</loc></url>
</urlset>
```

## Applying Changes

Content changes take effect immediately -- no container restart is needed
because the directory is mounted as a live volume:

```yaml
volumes:
  - ./content:/opt/trainpot-hp/content
```

## Best Practices

- Make content look realistic (use real-looking course names, paper titles)
- Include a mix of HTML pages and PDF documents
- Ensure robots.txt disallows paths that AI scrapers would target
- Keep sitemap.xml in sync with robots.txt disallowed paths
- Use a realistic domain name in sitemap URLs

## Next Steps

- [Configuration](configuration.md) -- other settings
- [Running](running.md) -- operation and monitoring
