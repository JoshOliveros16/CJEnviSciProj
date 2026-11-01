# Hagonoy GroundWatch

**A Web-Based Environmental Awareness Platform on Land Subsidence in Hagonoy, Bulacan**
BSIT 4A · Final Course Output in Environmental Science

A Node.js (Express) website with an "going deeper into the earth" scroll theme.

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
    ├── index.html         the whole website (all sections)
    ├── 404.html
    ├── favicon.svg
    ├── css/style.css      theme, layout, animations
    └── js/
        ├── config.js      EDIT THIS: group members, Google Form link
        └── main.js        depth meter, simulator, map, quiz, form, tabs
```

## Easy edits

- **Group members / section:** `public/js/config.js`
- **Google Form instead of (or beside) the built-in form:** paste the embed link in `googleFormUrl` inside `config.js`.
- **Colors:** CSS variables at the top of `public/css/style.css`.
- **Quiz questions:** `QUIZ` array in `public/js/main.js`.
- **Map areas:** `AREAS` array in `public/js/main.js`.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel (**Add New → Project**). No build command is needed.
2. Each push to the main branch redeploys automatically.
3. Vercel's filesystem is read-only, so reports sent through the form are **not stored permanently** there. Each report is printed to the function logs (**Vercel → your project → Logs**), and the form still shows a reference ID. For permanent collection, paste a Google Form embed link into `googleFormUrl` in `public/js/config.js`.

## Notes

- Photos and the Google Map load from the internet (Wikimedia Commons and Google Maps), so connect to the internet when presenting. If a photo can't load, a neat placeholder is shown instead.
- Fonts (Fraunces, Nunito Sans) come from Google Fonts; system fonts are used if offline.
- If you open `index.html` directly (without the server), everything works except saving reports to `data/reports.json`. The form then keeps a copy in the browser instead.
- Check that all references and dates are correct before submitting, and cite Wikimedia photos as listed in the References section.

## Required sections (per the course output)

Home · About Land Subsidence · Causes and Effects · Community Impact · Mitigation and Solutions · Interactive features (Map, Quiz, FAQ, Report form, Sinking simulator) · References (APA 7th)
