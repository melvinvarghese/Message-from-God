# Message from God

A peaceful, responsive static website that offers a random inspirational reflection each time the page is opened. The messages are written to be welcoming across faiths and backgrounds; they are not presented as literal divine revelations.

## Features

- Random message on each page load, with no immediate repeat in the same browser tab session
- “Another message” button
- Share button using the native share sheet where available, with a clipboard fallback
- Responsive layout for phones, tablets, and desktops
- Keyboard-accessible controls, visible focus styles, skip link, and live announcement for message changes
- Reduced-motion preference support
- No backend, API key, framework, or build step required

## Run locally

Open `index.html` in a browser. For a local web server, you can run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a new repository on GitHub, for example `message-from-god`.
2. Upload `index.html`, `styles.css`, `script.js`, `favicon.svg`, and this README to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder, then click **Save**.
6. Wait for GitHub Pages to publish the site. Your URL will usually be `https://YOUR-USERNAME.github.io/message-from-god/`.

If the repository is named `YOUR-USERNAME.github.io`, the site will instead be published at the root URL for that account.

## Customize

- Add or edit messages in the `messages` array in `script.js`.
- Change the visual theme in `styles.css`.
- Edit page copy, title, and footer disclaimer in `index.html`.

## Notes

- This is a static site. It does not track visitors or synchronize a daily message across users.
- The Google Fonts import is optional; the page uses system/serif fallbacks if fonts are unavailable. Remove the `@import` line in `styles.css` if you prefer no third-party font request.
- Review and adapt the message collection to your own project's tone and audience.
