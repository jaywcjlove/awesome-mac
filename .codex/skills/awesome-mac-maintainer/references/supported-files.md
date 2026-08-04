# Supported Files

This skill is primarily for the repository's multilingual app listings.

## Default targets

- `README.md`
- `README-zh.md`
- `README-ja.md`
- `README-ko.md`

These are the default files for app additions, removals, description updates, and category moves unless the user explicitly asks to touch a different document set.

## Working assumptions

- The four README files are related, but their local section structure may differ.
- English placement does not guarantee identical placement in Chinese, Japanese, or Korean.
- When local structure differs, preserve the established structure in each file.

## Included work

- Add a new app listing.
- Update an existing listing description.
- Reclassify an app into a better category.
- Normalize link and icon formatting for the touched entry.

## Excluded by default

- `command-line-apps.md`
- `command-line-apps-zh.md`
- `command-line-apps-ja.md`
- `command-line-apps-ko.md`
- `editor-plugin.md`
- `editor-plugin-zh.md`
- `editor-plugin-ja.md`

Do not touch these files unless the user explicitly asks for them.

## Placement rule

Use the closest comparable apps already present in the target section as the primary signal for where a new entry belongs.
