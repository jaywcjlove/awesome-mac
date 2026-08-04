---
name: awesome-mac-maintainer
description: Maintain the Awesome Mac repository when adding, updating, or relocating app entries across README.md, README-zh.md, README-ja.md, and README-ko.md. Use this when the task requires category selection, multilingual sync, concise listing copy, ordering consistency, or repository-specific curation rules.
---

# Awesome Mac Maintainer

Use this skill for repository curation tasks that touch app listings, especially when the user wants to add, update, or reclassify an app across the English, Chinese, Japanese, and Korean READMEs.

## Use this skill for

- Add a new app entry to the right category in `README.md`.
- Sync the same app into `README-zh.md`, `README-ja.md`, and `README-ko.md`.
- Update or shorten an existing listing without drifting from repository style.
- Move an entry to a better category while preserving local document structure.

For supported repository files and scope boundaries, see [references/supported-files.md](references/supported-files.md).

## Core workflow

1. Identify the most appropriate category by searching the existing README files for similar apps or keywords.
2. Read the local context around the target section in each language before editing.
3. Add or update the entry in all required language files.
4. Keep the description to one sentence.
5. Verify placement, wording, and formatting with `rg` and `git diff`.

## Curation rules

- Match the local section used by each document instead of assuming all four files have identical structure.
- Preserve existing ordering within a section. In practice this is usually alphabetical by app name.
- Do not rewrite neighboring entries unless needed for the requested task.
- Keep edits narrowly scoped to the requested listing work.

## Description style

- Explain what the app is in one sentence.
- Keep it brief and concrete.
- Prefer product identity over feature lists.
- Do not emphasize that the app is a macOS app unless that detail is necessary.
- Avoid marketing phrasing unless the repository already uses it for that exact product.

Preferred patterns:

- "Open-source HTTP(S) debugging proxy for intercepting, inspecting, modifying, and replaying requests."
- "Open-source screen recorder and editor for polished demos, tutorials, and product videos."
- "Open-source tool for switching Git identities and managing SSH keys."

## Icons and links

- Use the product site or primary project URL for the main link when that matches surrounding entries.
- If the project is open source and the repository URL is known, add the OSS icon linking to the repository.
- If the project is presented as free/open source and nearby entries use the freeware marker, add `![Freeware][Freeware Icon]`.
- Follow the exact icon formatting already used in the target section.

## Category selection guidance

- Prefer the category that contains the closest comparable apps already in the repo.
- For developer tools, distinguish between:
  - API clients / API development
  - Network analysis / debugging proxies
  - Version control
- For media apps, check whether the document uses a broad audio/video section or a dedicated streaming music subsection.
- If Chinese uses a more specific subsection than the other languages, follow that document's local structure rather than forcing uniform placement.

## Validation

- Search for the app name in all target files.
- Review `git diff` for only the intended changes.
- Confirm the entry appears once per intended file.
- Confirm the wording remains one sentence in each language.

## Scope boundary

- This skill is for repository curation, not for rewriting the repository structure or reformatting unrelated content.
- If the user asks for a broader taxonomy change, inspect the surrounding sections first and then make the smallest consistent change.
