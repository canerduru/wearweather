# STRATA localization implementation plan

Goal: keep the temporary STRATA name, ship Turkish/English, and save a working desktop project.
Spec: approved conversation, multi-language architecture with tr/en launch.
Architecture: typed translation dictionaries, locale provider, persistent explicit language override separate from wardrobe schema; Expo Localization for device detection. No automatic translation API.

- [ ] Copy project to /Users/caner/Desktop/STRATA without changing existing wardrobe schema or storage key.
- [ ] Add typed tr/en dictionaries, locale normalization/fallback, interpolation and translated catalog labels. Preserve custom garment names and migrate legacy default labels by inference only.
- [ ] Add locale store, system detection and language selector at onboarding and profile. Wait for language hydration before rendering, preserving manual choice.
- [ ] Move all visible screen text, recommendation explanations, notices and accessibility labels to translation lookup; format dates/prices per locale. Language does not change currency or city.
- [ ] Add parity, device-language fallback, legacy-name preservation and interpolated message tests.
- [ ] Verify typecheck, lint, tests, web/iOS export, desktop source integrity and locale rendering where browser access permits.
- [ ] Update README, source archive and working preview. Do not rename brand or add external services.

Review focus: no data reset when language changes; unknown language falls back to English; custom names stay unchanged; missing keys cannot ship; manual override survives reload. New RTL languages require extra layout QA and are not promised in this release.

Execution: existing user authorization covers implementation; native implementation in this session.
