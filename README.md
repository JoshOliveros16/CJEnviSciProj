# Hagonoy GroundWatch

**A Web-Based Environmental Awareness Platform on Land Subsidence in Hagonoy, Bulacan**
BSIT 4A · Final Course Output in Environmental Science

A Node.js (Express) website. The landing page is an infographic that goes deeper into the earth as you scroll, and the other pages open from the side menu.

## How to run (VS Code terminal)

1. Open this folder in VS Code (**File → Open Folder…**).
2. Open the terminal (**Terminal → New Terminal**).
3. Run:

```bash
npm install
npm start
```

4. Open **http://localhost:3000** in your browser.

Use `npm run dev` to auto-restart the server when you edit `server.js`. Requires Node.js 18 or newer (`node -v`).

## Folder structure

```
hagonoy-groundwatch/
├── server.js              Express server + /api/reports (saves reports to data/reports.json)
├── package.json
├── data/                  community reports are saved here (reports.json)
└── public/
    ├── index.html             landing page (infographic, scroll down through the soil layers)
    ├── about.html             About land subsidence
    ├── causes-effects.html    Causes and effects (with the road simulator)
    ├── community.html         Community impact
    ├── solutions.html         Mitigation and solutions
    ├── explore.html           Map, quiz, FAQ and report form
    ├── references.html        All references (opened from the footer)
    ├── 404.html
    ├── css/style.css          theme, layout, animations
    └── js/
        ├── config.js          EDIT THIS: group members, Google Form link
        ├── layout.js          side menu, footer, icons, scroll animations
        ├── home.js            landing page depth meter
        ├── effects.js         road simulator
        └── explore.js         map, quiz, report form
```

## Easy edits

- **Group members / section:** `public/js/config.js`
- **Google Form instead of (or beside) the built-in form:** paste the embed link in `googleFormUrl` inside `config.js`.
- **Colors:** CSS variables at the top of `public/css/style.css`.
- **Quiz questions:** `QUIZ` array in `public/js/explore.js`.
- **Map areas:** `AREAS` array in `public/js/explore.js`.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel (**Add New → Project**). No build command is needed.
2. Each push to the main branch redeploys automatically.
3. Vercel's filesystem is read-only, so reports sent through the form are **not stored permanently** there. Each report is printed to the function logs (**Vercel → your project → Logs**), and the form still shows a reference ID. For permanent collection, paste a Google Form embed link into `googleFormUrl` in `public/js/config.js`.

## Notes

- Photos and the Google Map load from the internet (Wikimedia Commons and Google Maps), so connect to the internet when presenting. If a photo can't load, a neat placeholder is shown instead.
- Fonts (Fraunces, Nunito Sans) come from Google Fonts; system fonts are used if offline.
- If you open `index.html` directly (without the server), everything works except saving reports to `data/reports.json`. The form then keeps a copy in the browser instead.

## Required sections (per the course output)

Home · About Land Subsidence · Causes and Effects · Community Impact · Mitigation and Solutions · Interactive features (Map, Quiz, FAQ, Report form, Road simulator) · References (APA 7th)
