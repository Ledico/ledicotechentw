# Deployment Guide - Dias Costa Portfolio

## Problem gelöst
Die Bolt.new-Umgebung war nicht mit GitHub/Netlify verbunden, daher konnten Änderungen nicht deployed werden.

## Aktuelle Version enthält:
✅ Projektverwaltung CMS (WordPress-ähnlich)
✅ ErrorBoundary für bessere Fehlerbehandlung
✅ Debouncing für Suchfelder
✅ Verbesserte Mobile Responsiveness
✅ TypeScript Type-Fixes
✅ Route `/admin/projects` für Projektverwaltung
✅ Optimierte Datenbank-Queries

## Deployment-Optionen

### Option 1: Über Bolt.new (Schnellste Methode)

1. **In Bolt.new**: Klicke auf den "Deploy" oder "Connect to GitHub" Button
2. **GitHub-Repository wählen**:
   - Entweder bestehendes Repository: `dias-costa-portfolio` (oder wie es heißt)
   - Oder neues Repository erstellen
3. **Automatischer Push**: Bolt.new pushed alle Änderungen automatisch
4. **Netlify-Trigger**: Netlify erkennt den Push und deployed automatisch

### Option 2: Manuell über GitHub Desktop/CLI

1. **Code von Bolt exportieren**:
   - In Bolt.new: "Download as ZIP" oder ähnliche Option
   - Alle Dateien außer `node_modules` und `.env`

2. **In dein lokales Git-Repository**:
   ```bash
   # Zu deinem lokalen Repository navigieren
   cd /pfad/zu/dias-costa-portfolio

   # Aktuellen Stand sichern (optional)
   git checkout -b backup-$(date +%Y%m%d)
   git checkout main

   # Neue Dateien kopieren und committen
   # (ZIP-Inhalt in Repository-Ordner entpacken)

   git add -A
   git commit -m "Add CMS and improvements from Bolt.new"
   git push origin main
   ```

3. **Netlify deployed automatisch** nach dem Push

### Option 3: Direkt zu Netlify (Ohne GitHub)

1. **Build erstellen**:
   ```bash
   npm run build
   ```

2. **In Netlify Dashboard**:
   - Navigiere zu deiner Site (dias-costa.ch)
   - Deploys → "Drag and drop"
   - Den `dist` Ordner hochziehen

## Wichtige Dateien für Deployment

### Netlify-Konfiguration
`netlify.toml` ist bereits konfiguriert mit:
- Build-Command: `npx vite build`
- Publish-Directory: `dist`
- Environment Variables (bereits gesetzt)
- Redirects für SPA-Routing

### Environment Variables
In Netlify müssen folgende Variablen gesetzt sein (bereits in netlify.toml):
```
VITE_SUPABASE_URL=https://ayqitipxqhbubhtjiewb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (bereits gesetzt)
```

## Nach dem Deployment

### Testen:
1. **Homepage**: https://dias-costa.ch/
2. **Admin-Konsole**: https://dias-costa.ch/admin
3. **Projektverwaltung**: https://dias-costa.ch/admin/projects
4. **SUISA-Portal**: https://dias-costa.ch/suisa

### Erste Schritte im CMS:
1. Als Admin einloggen (leonardorafael.costa04@gmail.com)
2. Zu `/admin/projects` navigieren
3. "Neues Projekt" erstellen
4. Projekt veröffentlichen
5. Auf der Homepage im Portfolio-Bereich sichtbar

## Troubleshooting

### "Fehler beim Laden der Daten" im CMS
- **Ursache**: RLS-Policies oder Berechtigungen
- **Lösung**: Überprüfe in Supabase Dashboard, ob alle Migrations gelaufen sind

### CMS zeigt keine Projekte
- **Normal**: Beim ersten Mal sind keine Projekte vorhanden
- **Aktion**: Erstelle das erste Projekt über "Neues Projekt"

### 404-Fehler bei `/admin/projects`
- **Ursache**: Netlify-Redirects nicht aktiv
- **Lösung**: Stelle sicher, dass `netlify.toml` deployed wurde

## Git-Status

```
Current Branch: master
Last Commit: 4b438dd - Add Projects CMS system and improvements
Total Files: 138 files changed, 21454 insertions(+)
```

## Support

Bei Problemen:
1. Console-Errors im Browser checken (F12)
2. Netlify Deploy-Logs überprüfen
3. Supabase Logs überprüfen (falls DB-Probleme)

---
**Deployment bereit**: Alle Änderungen sind committed und bereit zum Deploy! 🚀
