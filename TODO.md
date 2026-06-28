# TODO

## Navbar dropdown + link fixes
- [ ] Update `index.html` to add `data-nav` attribute to the "Industries We Serve" parent dropdown control (desktop and mobile if needed).
- [ ] Update `shared.js`:
  - [ ] Prevent default + stop propagation for the Industries We Serve parent dropdown click so it only toggles dropdown.
  - [ ] Ensure sidebar outside-click handler doesn’t close/toggle state when interacting with the Industries We Serve dropdown.
  - [ ] Make Financial Tools parent dropdown behavior consistent (prevent redirect/remove link issues).
- [ ] Test manually:
  - [ ] Desktop: click Industries We Serve; navbar should not change/redirect unexpectedly.
  - [ ] Mobile: click Industries We Serve; sidebar dropdown should toggle cleanly.
  - [ ] Desktop + mobile: click Financial Tools; no link removal/redirect issues.

