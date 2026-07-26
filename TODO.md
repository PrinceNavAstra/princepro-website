# SVG Image Fix - Progress Tracker

## Problem (v2)
SVGs were still broken on both dark & light themes because:
1. **Hero SVGs loaded as `<img>` tags** — `var()` in presentation attributes is NOT supported in `<img>` context (browser limitation). Even with fallback values, `var()` calls make the attribute invalid.
2. **SVG internal `<style>` block** — The `svg { --var: value }` selector overrode parent CSS variables for inline-loaded SVGs (erp-diagram), preventing theme-aware styling.

## Fix (v2)
- **Hero SVGs** (construction, logistics, manufacturing, marketing, textile): Remove `<style>` block, replace all `var()` calls with their hardcoded fallback values
- **erp-diagram.svg** (loaded inline via fetch on index.html): Remove `<style>` block, keep `var()` with fallbacks (parent `.erp-diagram` CSS class provides theme-aware variables)

## Files Fixed
- [x] `assets/construction-hero.svg` — Removed `<style>` block, hardcoded all var() values
- [x] `assets/logistics-hero.svg` — Removed `<style>` block, hardcoded all var() values
- [x] `assets/manufacturing-hero.svg` — Removed `<style>` block, hardcoded all var() values
- [x] `assets/marketing-hero.svg` — Removed `<style>` block, hardcoded all var() values
- [x] `assets/textile-hero.svg` — Removed `<style>` block, hardcoded all var() values
- [x] `assets/erp-diagram.svg` — Removed `<style>` block, kept var() for theme support

## Script
- [x] `scripts/fix-svgs-v2.py` — New script implementing the v2 fix approach

## Verification
- [x] Open each industry page in browser and confirm SVGs render correctly on both themes
