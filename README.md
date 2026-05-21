# SLF Code Scribe — Deployment Guide

This guide takes you from a folder of files on your computer to a working installable app on your phone, iPad, or tablet — **in about 3 minutes, free, no account required.**

---

## What's in this folder

You should have **5 files**. All five must stay together in the same folder:

| File | What it does |
|---|---|
| `index.html` | The app itself |
| `manifest.json` | Tells your phone "this is an installable app" |
| `sw.js` | The "service worker" — makes the app work offline |
| `icon-192.png` | App icon (used on home screen) |
| `icon-512.png` | App icon (high resolution) |

**Important:** If you only deploy `index.html` by itself, the app will work in the browser but **won't work offline** and **can't be installed properly** to the home screen. You need all 5 files together.

---

## Option 1 (RECOMMENDED): Netlify Drop — fastest, no account

This is the easiest way. Drag-and-drop. Free forever. HTTPS automatic.

### Steps

1. On your computer, put all 5 files in a single folder. Name it whatever you like (e.g. `scribe`).
2. Open this link in your browser: **https://app.netlify.com/drop**
3. Drag your folder onto the page where it says "Drag and drop your site folder here."
4. Wait ~10 seconds. You'll get a URL like `https://gleaming-platypus-12345.netlify.app/`
5. **Save that URL.** That's your app.
6. (Optional) Click "Claim this site" if you want to keep it permanently — but even without claiming, the URL works.

### Install on iPhone / iPad

1. Open the URL in **Safari** (NOT Chrome — iOS only allows Safari to install apps to home screen).
2. Tap the **Share button** (square with arrow pointing up) at the bottom.
3. Scroll down and tap **"Add to Home Screen."**
4. Tap **"Add"** in the top right.
5. The app icon now appears on your home screen.
6. Open it from the home screen — it'll run full-screen like a real app and work offline.

### Install on Android

1. Open the URL in **Chrome.**
2. Tap the **three-dot menu** (top right).
3. Tap **"Install app"** or **"Add to Home screen."**
4. Confirm.
5. The app icon now appears on your home screen.
6. Open it from the home screen — it'll run full-screen and work offline.

---

## Option 2: GitHub Pages (if you already use GitHub)

Slightly more setup, but gives you a permanent URL you control.

1. Create a free account at https://github.com (skip if you have one).
2. Click the green **"New"** button to create a new repository.
3. Name it whatever (e.g. `code-scribe`). Make it **Public**. Check "Add a README file." Click **"Create repository."**
4. Click **"Add file" → "Upload files."**
5. Drag all 5 files (`index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`) into the upload area.
6. Click **"Commit changes."**
7. Click **"Settings"** (top of the repo).
8. In the left sidebar, click **"Pages."**
9. Under "Source," select **"Deploy from a branch."** Branch: **main**, folder: **/ (root).** Click **"Save."**
10. Wait 1–2 minutes. Your URL appears at the top: `https://<your-username>.github.io/<repo-name>/`
11. Follow the same iPhone/Android "Add to Home Screen" steps above.

---

## Testing it works offline (do this once after install)

1. Open the app from your home screen once while you have signal.
2. Turn on **Airplane Mode.**
3. Open the app again. It should still load and work fully.
4. Turn Airplane Mode off when done.

If it doesn't load offline, the service worker didn't register. Force-close the app, reopen it once online, and try again.

---

## How to share a code summary

After ending a code, the **Code Complete** screen has four buttons:

- **Share / Send** — opens your phone's native share sheet (works with iMessage, Mail, Slack, anything you have installed).
- **Copy to Clipboard** — copies the full report; paste anywhere.
- **Email** — opens your email app with the report pre-filled.
- **Text Message** — opens your messages app with the report pre-filled.

Old cases can be re-shared anytime from the **Archive** button at the top — every saved case has the same four buttons.

> **Note on Email/Text:** Some mail and messaging apps truncate very long text in pre-filled messages. To be safe, the app **also copies the report to your clipboard whenever you tap Email or Text** — so if the body looks short, just paste over it.

---

## What was changed / fixed from your previous version

**Safety / accuracy:**
- Timers now use the system clock instead of counting ticks. Previously, when your phone screen locked, the timers would fall behind by seconds per minute (a 30-min code could drift 2–3 min). Now they stay accurate even if the app is backgrounded.
- **Narcan dose math bug fixed.** The previous version displayed milligrams as if they were milliliters (which would have implied a 2.5× under-dose at the 0.4 mg/mL concentration). Now shows both mg and the correct mL.
- Defibrillation now **requires** an energy value before logging (so shocks can't be logged without joules).
- A corrupted save file in localStorage will no longer crash the app — it'll warn you and start fresh instead.
- The intubation attempt timer now resets correctly if you cancel and reopen.
- Fixed a duplicate condition bug in the state restore logic.

**Documentation quality:**
- ETCO2 entries are now auto-annotated in the log: below 10 mmHg shows "⚠️ Low — reassess compressions," 35–45 shows "Target range ✓," etc.
- The H's & T's assessment is now included in the final report.
- Re-arrest counts are summarized in the metrics section.

**UX:**
- After ending a code, you no longer get auto-reloaded. You see a **Code Complete** screen where you can share, copy, email, or text the report as many times as needed before starting fresh.
- Re-arrest now vibrates the phone and shows a clear "RE-ARREST: Resume CPR" prompt.
- "Undo" now tells you exactly what entry it removed.
- The log can no longer be broken by special characters in doctor names or medication names (was a potential issue if a name contained `<` or `&`).
- Archive items work properly with apostrophes in names (e.g. "O'Brien") — previously this could break the list.

**Mobile / iPad fit:**
- Touch targets are now at minimum 44×44 pixels (Apple's standard) so they're easier to tap with gloves.
- Layout adapts: single-column on phones, two-column on iPad and larger.
- Respects iPhone notches and home indicators (won't get cut off).
- Scrolling inside modals and the log now works smoothly on iOS Safari.
- Modal heights handle the iOS dynamic toolbar correctly.

**Offline:**
- Service worker caches the app — works fully without cell signal once installed.
- Web App Manifest enables home screen installation as a full-screen app.

---

## Troubleshooting

**"The app won't install / Add to Home Screen is missing"**
You're probably not on HTTPS. Both Netlify Drop and GitHub Pages give HTTPS automatically — make sure your URL starts with `https://` not `http://`.

**"It works in the browser but not offline"**
Open the app once while online so the service worker can install. After that, it should work offline. If it still doesn't, force-close (swipe up from home), reopen.

**"My old archive is gone after I deployed the new version"**
The archive lives in your browser's localStorage on the specific device, tied to the URL. If you deployed at a new URL, the old archive at the old URL is unaffected — just visit the old URL to see it. If you want to migrate it, open the old URL, copy each case via the Copy button, paste somewhere safe.

**"The Email/Text button just opens a blank email"**
Some apps don't accept pre-filled bodies via these links. The app **always copies the report to your clipboard** at the same time, so just paste into the blank email/message.

**"I want to update the app later"**
With Netlify: drag the updated folder onto Netlify Drop again — same URL, updated app. Users will get the new version next time they open it online (the service worker auto-updates in the background).
With GitHub: just upload the new files to the same repository.

---

## Privacy

This app is **100% local.** Nothing is sent anywhere. The archive lives only in your browser's local storage on your device. Reports are only shared when YOU tap Share/Email/Text and choose where to send them. There is no server, no analytics, no tracking, no cloud sync.

Because there's no cloud sync, **archive doesn't transfer between devices.** Each phone has its own archive.

---

*If something breaks or behaves wrong, the safest move is to use the "Discard / Reset Current Code" button (red, at the bottom of the End/Transfer menu) to clear and start over. Your archive of previous cases is not affected by this.*
