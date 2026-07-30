# DXM Planner

A DXM configuration planner tool (sensor register mapping + XML builder), built as a
single React component and hosted on GitHub Pages.

**Live site:** https://jeffleuwerke-lang.github.io/dxm-planner/

The URL is permanent — it stays the same across every update, as long as the repo keeps
the name `dxm-planner`.

---

## Updating the tool

All of the app's code lives in **`src/App.jsx`**. That is the only file you normally edit.

### The publish cycle

1. **(Optional) Preview locally** — see changes live before publishing:
   ```bash
   npm run dev
   ```
   Opens a local preview that auto-reloads as you edit. Press `Ctrl+C` to stop.

2. **Commit your changes:**
   ```bash
   git add -A && git commit -m "describe what you changed"
   ```

3. **Publish:**
   ```bash
   git push
   ```

That's it. Pushing to `main` triggers GitHub Actions, which rebuilds the app and
republishes it to the same URL automatically. Wait ~1–2 minutes, then refresh
(hard-refresh with `Ctrl+Shift+R` if you don't see the change).

### Watching a deploy

- Actions / build status: https://github.com/jeffleuwerke-lang/dxm-planner/actions
- Green check = live. Red X = build failed **and the old version stays up** — a broken
  build never replaces the working site. Click the failed run to see the error.

---

## Setting up on a new computer

```bash
git clone https://github.com/jeffleuwerke-lang/dxm-planner.git
cd dxm-planner
npm install
```

Then edit → commit → push as above.

---

## Notes & gotchas

- You do **not** run `npm run build` to publish — GitHub does that on push. Running
  `npm run build` locally is only useful to check that the code compiles.
- **Never rename the repo.** The name `dxm-planner` is baked into the live URL and into
  `vite.config.js` (`base: "/dxm-planner/"`). Renaming would break the site unless both
  are changed together.
- Requires [Node.js](https://nodejs.org/) installed (v18 or newer).

---

## Project layout

| Path | Purpose |
|------|---------|
| `src/App.jsx` | The entire app — **edit this** |
| `src/main.jsx` | Boilerplate that mounts the app (rarely touched) |
| `index.html` | Page shell |
| `vite.config.js` | Build config; holds the `base` path that must match the repo name |
| `.github/workflows/deploy.yml` | Auto-build-and-deploy on every push to `main` |

---

## Tech stack

Built with [Vite](https://vitejs.dev/) + [React](https://react.dev/), deployed via
GitHub Actions to GitHub Pages.
