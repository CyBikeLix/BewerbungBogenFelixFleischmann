# Felix Fleischmann – Radsport-Profil & Bewerbungsbogen

Interaktives Fahrerprofil & Bewerbungsbogen für den U23 Straßenradsport mit Leistungsdaten (Power Profile, Durability), Palmarès und interaktiver Strecken- und Leistungsanalyse (.FIT & GPS-Visualisierung mit Leaflet und Chart.js).

## 🚀 Live Demo & Hosting

Diese Website ist für das automatische Deployment via **GitHub Pages** konfiguriert:
- Sobald der Code auf GitHub im Branch `main` (oder `master`) liegt, baut und deployt der GitHub Actions Workflow (`.github/workflows/deploy.yml`) die Seite automatisch.
- In den Repository-Einstellungen unter **Settings -> Pages** muss bei *Build and deployment* die Source **GitHub Actions** ausgewählt sein.

## 🛠️ Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## 📦 Projektstruktur

- `src/` – Svelte-Komponenten (`App.svelte`, `ActivityModal.svelte`, `Chart.svelte`), Stylesheets und Profildaten (`src/lib/data.json`)
- `public/` – Statische Assets: Favicon, Touch-Icon, optimierte WebP-Bilder und die für die Rennanalyse benötigten Rich-JSONs sowie `.fit`-Dateien
- `.github/workflows/` – Automatische GitHub Pages CI/CD Pipeline
