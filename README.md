# andromeda-project
Andromeda is basically a school unblocker (not one of those typical proxies) that actually works in a bunch of different ways depending on what you need. Instead of just relying on one method, it has multiple ways to get around restrictions, so if one thing gets blocked, you’re not just stuck.

It’s not only for unblocking either. There’s some extra stuff built in, like a GitHub file maker and a few other tools that make it kinda useful beyond just getting past filters. It’s meant to be simple to use but still do a lot behind the scenes.

I mainly made it to mess around, experiment, and just have something that works better than most of the usual options out there.

---

## Preview locally

To preview the front-end locally, open any `.html` file in a browser or run a simple local server from the project root:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/` or `http://localhost:8080/MAIN.html`.

The included `index.html` file redirects to `MAIN.html`, making `MAIN.html` the homepage for GitHub Pages or local previews.

## Real email and SMS backend

The temporary email and phone pages now support real delivery through a Node backend service. For real send functionality, use the backend rather than only the static preview server.

1. Copy `.env.example` to `.env` and configure SMTP and Twilio credentials.
2. Install dependencies with `npm install`.
3. Start the backend from the project root with `npm start`.
4. Open the site at `http://localhost:3000/` and navigate to `tempemailgenerator.html` or `tempphonemaker.html`.

If the backend is not configured, the pages will still load, but they will display the configured sender state and prevent real send actions.

## Files

## Files

- `home.html` — main landing page
- `MAIN.html` — app dashboard and proxy launcher
- `dashboard.html` — usage dashboard
- `andromeda.html` — proxy methods page
- `tempfilemaker.html` — temporary file creator
- `tempphonemaker.html` — temporary phone number generator
- `tempemailgenerator.html` — temporary email generator with inbox preview
- `1klinks.html` — proxy links page

## Notes

- The front-end is static HTML, but the temporary email and phone pages can use an optional Node backend for real delivery.
- No build step is required for the front-end.
- Keep `.vscode/`, virtual environment, and editor caches out of version control.

made with love from italy 🇮🇹
