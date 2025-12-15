Title: Finalize Quaternius CC0 fallbacks for unresolved plant models (2025-12-13)

Summary:
This PR finalizes the use of Quaternius CC0 fallback models for a group of plant model entries where species-accurate CC0 models were not found via automated discovery. It also updates metadata, regenerated previews, and stores backups for all overwritten files.

What changed:
- Marked fallback candidates as final in `public/models/model-sources.json` for selected entries.
- Set `resolved` and `sha256` for finalized GLB files using `scripts/mark-final-resolved.js`.
- Synced final metadata into `src/data/plants.js` using `scripts/sync-model-sources.js` (modelSource, modelLicense, modelAvailable set to true).
- Regenerated previews using `npm run capture-models` (Playwright).
- Updated documentation in `public/models/MODEL_SOURCES.md`, `public/models/MODEL_SOURCES_FOLLOWUP.md`, and added `public/models/FALLBACKS_FINALIZED.md`.
- Updated `public/models/UNRESOLVED.md` to reflect remaining unresolved entries (added link to manual candidate process).
- Backups created in `public/models/backups/` and `src/data/plants.js.bak`/`src/data/plants.js.finalized.bak`.

Files touched:
- public/models/model-sources.json
- src/data/plants.js
- public/models/model-sources.json.bak
- public/models/MODEL_SOURCES.md
- public/models/MODEL_SOURCES_FOLLOWUP.md
- public/models/FALLBACKS_FINALIZED.md
- public/models/UNRESOLVED.md
- public/models/backups/*
- scripts/mark-final-resolved.js (new)
- scripts/sync-model-sources.js (updated to prefer final fields)
- scripts/set-fallback-availability.js (existing)

How to review:
1. Run `npm install` (if needed), then run `npm run lint`.
2. Run `npm run capture-models` to regenerate previews for final files and confirm previews exist under `public/images/model-previews/`.
3. Validate `src/data/plants.js`: verify `modelSource` points to the final source and `modelLicense` is "CC0 (Quaternius fallback)" for finalized entries and `modelAvailable: true`.
4. Check `public/models/model-sources.json` for `final: true`, `finalSource`, `finalLicense`, `finalizedOn`, and `finalizedBy` entries.
5. Confirm backups exist in `public/models/backups/` and `src/data/plants.js.bak` & `src/data/plants.js.finalized.bak`.
6. Run `node ./scripts/report-duplicates.js` to ensure duplicates are expected (fallback copies) and that mapping entries have resolved candidates.

Roll-back procedure:
- Restore the plants metadata: `cp src/data/plants.js.bak src/data/plants.js` (or from `src/data/plants.js.finalized.bak` if needed).
- Restore the mapping file and models backups from `public/models/backups/` as necessary.

Notes and caveats:
- Automations favored CC0 assets. Where species-specific CC0 assets were not available, Quaternius CC0 fallbacks were accepted per user instruction.
- Some entries could be replaced with higher-quality or species-accurate CC BY models (Sketchfab). If you want to add those later, update `public/models/model-sources.json` and re-run `npm run download-models`, `npm run capture-models`.

Suggested reviewers: @data-admins, @frontend, @licenses

Commands used (for reviewers to replicate):
```bash
node ./scripts/mark-final-resolved.js
node ./scripts/sync-model-sources.js
npm run capture-models
node ./scripts/report-duplicates.js
```

Legal/Licensing: Final choices are CC0 Quaternius fallback where noted. For any CC BY models later added, maintain proper attribution in `model-sources.json` and documentation.

If you'd like assistance with a PR description formatting, CI checklist, or opening the PR, I can prepare a PR body or a template for the `merge` stage.