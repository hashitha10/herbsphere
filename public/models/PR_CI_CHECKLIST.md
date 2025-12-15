PR CI & Manual QA Checklist — Finalize Quaternius CC0 fallbacks

Automated checks (CI):
- [ ] Run `npm ci` or `npm install`.
- [ ] Run `npm run lint` (eslint).
- [ ] Confirm `node ./scripts/report-duplicates.js` returns resolved mapping entries.
- [ ] Confirm `scripts/mark-final-resolved.js` was executed (mapping contains `resolved` and `sha256`).
- [ ] Confirm `public/models/model-sources.json` contains `final: true` and `finalSource` values for finalized entries.
- [ ] Confirm `src/data/plants.js` entries have `modelAvailable: true`.

Manual checks (QA):
- [ ] Run `npm run capture-models`; open `public/images/model-previews/*` and spot-check 4-6 examples to ensure GLBs render.
- [ ] Load `npm run dev` locally and verify model viewer loads in-app; confirm a few plants show the 3D model.
- [ ] Verify backups exist in `public/models/backups/` and `src/data/plants.js.bak`/`src/data/plants.js.finalized.bak`.
- [ ] Review `MODEL_SOURCES.md` updated sections and `FALLBACKS_FINALIZED.md` for accurate documentation.
- [ ] If license constraints exist for later CC BY additions, ensure attribution is present in `model-sources.json` and `MODEL_SOURCES.md`.
- [ ] Confirm `UNRESOLVED.md` lists only the remaining unresolved assets (ajwain/fennel/kalonji). If manual addition is needed, follow the `UNRESOLVED.md` guidance.

Optional steps (merging & release):
- [ ] Tag the release or add a changelog entry referencing the finalized fallbacks.
- [ ] If the app is running a staging environment, deploy to staging and run smoke tests to confirm UI state.
- [ ] Note in release notes that Quaternius fallbacks have been accepted where species-specific CC0 models were not available.

Pre-merge approval:
- [ ] Legal or license reviewer confirms CC0 acceptance.
- [ ] Product reviewer confirms the fallback design is acceptable for the user experience.

Rollback steps:
- [ ] If necessary, restore model files from `public/models/backups/*` and `src/data/plants.js.bak`.
- [ ] Re-run `scripts/sync-model-sources.js` to revert metadata and re-generate previews.

If you'd like me to add CI job steps and/or GitHub Actions automation for these checks, I can prepare a workflow draft to include in `.github/workflows/ci.yml`.