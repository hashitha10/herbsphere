# Unresolved plant models and next steps

The following plant models did not resolve to a unique CC0 GLB and require manual review.

Unresolved species:
- ajwain.glb
- fennel.glb
- kalonji.glb

Suggested manual actions:
1. Search Sketchfab or other CC-BY/paid sources for species-specific models.
2. If you find a model that is CC BY (or acceptable license), add the model page URL to `src` in `public/models/model-sources.json` for that species and set `license` to `CC BY (Sketchfab)`.
3. Run `npm run download-models` to attempt to download the model file and dedupe it by SHA256.
4. Re-run `npm run capture-models` to generate updated previews.

If you prefer an approximate generic model (Quaternius/CC0), those have been added as fallbacks already.
