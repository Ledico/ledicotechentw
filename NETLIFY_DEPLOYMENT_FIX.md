# Netlify Deployment Problem lösen

## 🔍 Problem erkannt:

Du bist mit GitHub verbunden (`Ledico/ledicotechentw`), aber **Netlify ist nicht mit diesem Repository verbunden**.

Das ist das klassische Problem: dias-costa.ch zeigt eine alte Version, weil Netlify von einem **anderen** Repository oder Branch deployed.

---

## ✅ Lösung: Netlify neu verbinden

### Schritt 1: Netlify Dashboard öffnen

1. Gehe zu: https://app.netlify.com/
2. Logge dich ein
3. Suche deine Site: **dias-costa** (oder wie sie heißt)

### Schritt 2: Aktuelles Repository überprüfen

1. Klicke auf deine Site (dias-costa.ch)
2. Gehe zu **Site settings** (oben rechts)
3. Im Menü links: **Build & deploy** → **Continuous deployment**
4. Schaue unter **Repository**:
   - **Wenn es NICHT `Ledico/ledicotechentw` ist** → Das ist das Problem!
   - **Wenn es `Ledico/ledicotechentw` ist** → Weiter zu Schritt 3

### Schritt 3: Repository neu verbinden

#### Option A: Repository ändern (wenn falsches Repo verbunden)

1. In **Build & deploy** → **Continuous deployment**
2. Klicke auf **Link site to Git**
3. Wähle **GitHub**
4. Wähle Repository: **Ledico/ledicotechentw**
5. Branch: **main**
6. Build-Settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
7. Klicke **Deploy site**

#### Option B: Deployment-Branch ändern (wenn richtiges Repo, aber falscher Branch)

1. In **Build & deploy** → **Continuous deployment**
2. Unter **Branches**: Klicke **Edit settings**
3. Production branch: **main** (statt master oder anderem Branch)
4. Speichern

#### Option C: Manuelles Trigger (wenn alles richtig ist)

1. In **Deploys** (Tab oben)
2. Klicke **Trigger deploy** → **Deploy site**

---

## 🚨 Häufiges Problem: Netlify zeigt altes Repo

Wenn Netlify ein ALTES Repository anzeigt, das du nicht mehr nutzt:

### Lösung: Site neu erstellen

1. **Aktuelle Site löschen** (oder umbenennen zu "dias-costa-old")
   - Site settings → General → Danger Zone → Delete site

2. **Neue Site erstellen**:
   - Dashboard → **Add new site** → **Import an existing project**
   - Wähle **GitHub**
   - Wähle **Ledico/ledicotechentw**
   - Branch: **main**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - **Deploy**

3. **Domain verbinden**:
   - Nach dem Deployment: **Domain settings**
   - **Add custom domain**: `dias-costa.ch`
   - Netlify konfiguriert DNS automatisch

---

## 🔧 Alternative: Manuelles Deployment (Schnelltest)

Wenn du schnell testen willst, ob der neue Code funktioniert:

### Via Drag & Drop:

1. In Netlify Dashboard → **Deploys**
2. Scrolle nach unten zu **"Drag and drop your site output folder here"**
3. Ziehe den **`dist`** Ordner aus Bolt.new rein
4. Warte 30 Sekunden → Site ist live!

**Nachteil**: Nur einmalig, kein automatisches Deployment bei neuen Commits.

---

## 📋 Checkliste

Nach der Verbindung solltest du folgendes sehen:

- [ ] In Netlify: Repository = `Ledico/ledicotechentw`
- [ ] In Netlify: Branch = `main`
- [ ] In Netlify: Build command = `npm run build`
- [ ] In Netlify: Publish directory = `dist`
- [ ] Deployment läuft automatisch nach jedem Push

---

## 🎯 So testest du, ob es funktioniert:

1. **Kleine Änderung in Bolt.new machen**:
   - Z.B. in `src/App.tsx` einen Kommentar hinzufügen
   - Bolt pusht automatisch zu GitHub

2. **In Netlify Dashboard schauen**:
   - Gehe zu **Deploys**
   - Du solltest einen **neuen Deployment** sehen mit Status "Building"
   - Nach 2-3 Minuten: Status "Published"

3. **Website aufrufen**:
   - https://dias-costa.ch/
   - Die Änderung sollte sichtbar sein

---

## 🆘 Wenn immer noch nichts funktioniert:

### Debug-Schritte:

1. **GitHub Push überprüfen**:
   - Gehe zu: https://github.com/Ledico/ledicotechentw
   - Schaue unter **Commits**: Ist dein letzter Commit sichtbar?
   - Wenn NEIN: Bolt pusht nicht richtig zu GitHub

2. **Netlify Webhook überprüfen**:
   - In Netlify: **Build & deploy** → **Build hooks**
   - Sollte einen GitHub-Webhook geben
   - Wenn NEIN: Verbindung ist nicht richtig

3. **Deployment-Logs checken**:
   - In Netlify: **Deploys** → Klicke auf letztes Deployment
   - Schaue die **Deploy log**
   - Fehlermeldungen dort? → Schicke mir Screenshot

---

## 💡 Empfohlener Weg (am einfachsten):

1. Gehe zu https://app.netlify.com/
2. Klicke auf dias-costa.ch Site
3. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
4. Wenn das nicht funktioniert → Option A (Repository neu verbinden)

---

**Zusammenfassung**: Das Problem ist **nicht** dein Code oder Build, sondern die **Netlify ↔ GitHub Verbindung**.

Führe Schritt 1-3 oben durch, dann sollte es funktionieren! 🚀
