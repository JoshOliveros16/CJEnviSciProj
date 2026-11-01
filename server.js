/**
 * Hagonoy GroundWatch - Express server
 * Serves the static website in /public and receives community reports
 * from the reporting form.
 *
 * Works in two places:
 *  - locally:  `npm start`  -> http://localhost:3000  (reports saved to data/reports.json)
 *  - on Vercel: the exported app runs as a serverless function. Vercel's filesystem is
 *    read-only, so reports are written to a temp folder (not permanent) and also printed
 *    to the function logs, where the team can read them under Vercel > Logs.
 */
const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const ON_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = ON_VERCEL ? path.join(os.tmpdir(), "groundwatch") : path.join(__dirname, "data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

app.disable("x-powered-by");
app.set("trust proxy", 1); // so req.ip is the visitor's IP behind Vercel's proxy
app.use(express.json({ limit: "20kb" }));

// Basic security headers (no extra dependency needed)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

/* ---------- helpers ---------- */
function readReports() {
  try {
    return JSON.parse(fs.readFileSync(REPORTS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

// Tiny in-memory rate limiter: 8 reports / hour / IP
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (list.length >= 8) {
    return res.status(429).json({ error: "Too many reports. Please try again later." });
  }
  list.push(now);
  hits.set(ip, list);
  next();
}

const TYPES = ["Flooding", "Cracks / damaged structures", "Sinking ground or road", "Unregulated deep well", "Saltwater / brackish water", "Other"];

/* ---------- API ---------- */
app.get("/api/health", (req, res) => {
  res.json({ ok: true, project: "Hagonoy GroundWatch", host: ON_VERCEL ? "vercel" : "local" });
});

app.post("/api/reports", rateLimit, (req, res) => {
  const b = req.body || {};

  // honeypot field: bots fill this in, humans never see it
  if (b.website) return res.json({ ok: true, id: "GW-OK" });

  const report = {
    id: "GW-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
    createdAt: new Date().toISOString(),
    name: clean(b.name, 80),
    contact: clean(b.contact, 120),
    barangay: clean(b.barangay, 60),
    type: clean(b.type, 60),
    dateObserved: clean(b.dateObserved, 20),
    description: clean(b.description, 1200),
  };

  if (!report.barangay || !report.type || report.description.length < 10) {
    return res.status(400).json({ error: "Please provide a barangay, a report type, and at least 10 characters of description." });
  }
  if (!TYPES.includes(report.type)) {
    return res.status(400).json({ error: "Invalid report type." });
  }

  // Always log the report (on Vercel this is how the team can read it in the Logs tab).
  console.log("[GroundWatch report]", JSON.stringify(report));

  // Best effort: also keep a copy in a JSON file.
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const all = readReports();
    all.push(report);
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(all, null, 2));
  } catch (err) {
    if (!ON_VERCEL) {
      console.error("Could not save report:", err.message);
      return res.status(500).json({ error: "Could not save your report right now." });
    }
    // On Vercel a failed file write is expected; the log line above still has the report.
  }

  res.json({ ok: true, id: report.id });
});

/* ---------- routes ---------- */
app.get("/references", (req, res) => res.redirect("/references.html"));
app.get("/about", (req, res) => res.redirect("/about.html"));
app.get("/explore", (req, res) => res.redirect("/explore.html"));
app.get("/solutions", (req, res) => res.redirect("/solutions.html"));
app.get("/community", (req, res) => res.redirect("/community.html"));
app.get("/causes-effects", (req, res) => res.redirect("/causes-effects.html"));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"), (err) => {
    if (err && !res.headersSent) res.type("text").send("404 - Page not found");
  });
});

// Local development: start a normal server. On Vercel the exported app is used instead.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("\n  Hagonoy GroundWatch is running");
    console.log(`  -> http://localhost:${PORT}\n`);
  });
}

module.exports = app;
