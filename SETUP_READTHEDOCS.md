# Read the Docs Setup Instructions

## Prerequisites

1. Push this repo to GitHub as `4warned/honeypot-docs` (public)
2. Create a Read the Docs account at https://readthedocs.org (sign in with GitHub)

## Step 1: Create the Parent Project

1. Go to https://readthedocs.org/dashboard/import/
2. Select the `4warned/honeypot-docs` repository
3. Set project name: `4warned-honeypots`
4. Leave "Build configuration file" as default (`.readthedocs.yaml` at root)
5. Click "Next" to build

This creates the landing page at: `https://4warned-honeypots.readthedocs.io/`

## Step 2: Create Subproject for PeopleSoft

1. Go to https://readthedocs.org/dashboard/import/ again
2. Select the same `4warned/honeypot-docs` repository
3. Set project name: `hp-peoplesoft`
4. After creation, go to **Admin -> Settings**
5. Set "Build configuration file" to: `honeypots/peoplesoft/.readthedocs.yaml`
6. Save

## Step 3: Create Subproject for Ollama

1. Repeat Step 2 with project name: `hp-ollama`
2. Set "Build configuration file" to: `honeypots/ollama/.readthedocs.yaml`

## Step 4: Link Subprojects to Parent

1. Go to the parent project dashboard: https://readthedocs.org/dashboard/4warned-honeypots/
2. Navigate to **Admin -> Subprojects**
3. Add `hp-peoplesoft` as a subproject (alias: `hp-peoplesoft`)
4. Add `hp-ollama` as a subproject (alias: `hp-ollama`)

## Result

After setup, URLs will be:

- `https://4warned-honeypots.readthedocs.io/` -- landing page
- `https://4warned-honeypots.readthedocs.io/projects/hp-peoplesoft/` -- PeopleSoft docs
- `https://4warned-honeypots.readthedocs.io/projects/hp-ollama/` -- Ollama docs

Search on the parent project will include results from all subprojects.

## Adding a New Honeypot

1. Create `honeypots/<name>/` directory with `mkdocs.yml`, `.readthedocs.yaml`, and `docs/`
2. Push to this repo
3. Import as a new project on RTD with the custom config file path
4. Add as subproject to the parent `4warned-honeypots` project
