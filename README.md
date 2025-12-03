<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <h1>Rocky Beach Welle – Frontend</h1>
  <p>Dies ist das <strong>Frontend</strong> der Fan-Webapp <em>Rocky Beach Welle</em>, inspiriert von der Hörspielreihe <strong>Die drei ???</strong>. Die Anwendung zeigt alle Spotify-Folgen mit der Möglichkeit diese zu durchsuchen und zu filtern. Sie wurde mit React umgesetzt. Das Backend läuft in der Produktion bei Render, das Frontend wurde direkt beim Hoster hochgeladen.</p>
  Live-Link: <a href="https://rocky-beach-welle.de" target="_blank" rel="noopener noreferrer">https://rocky-beach-welle.de</a>
  <hr />

  <h2>🔧 Installation</h2>
  <pre><code>npm install</code></pre>

  <h2>🚀 Starten der Entwicklungsumgebung</h2>
  <pre><code>npm start</code></pre>
  <p>Die App läuft lokal unter <code>http://localhost:3000</code>. Das Backend läuft in der Produktion bei Render, das Frontend wurde direkt beim Hoster hochgeladen. Die API-URL wird über Umgebungsvariablen konfiguriert.</p>
  <hr />

  <h2>🌐 Umgebungsvariablen</h2>
  <p>Die Datei <code>.env.production</code> wird <strong>nicht</strong> mitversioniert. Bitte lege lokal eine <code>.env.production</code> an oder verwende die mitgelieferte <code>env.example</code> als Vorlage:</p>
  <pre><code># Beispielhafte Struktur – bitte mit deiner echten Backend-URL ersetzen
REACT_APP_API_URL=
</code></pre>
  <hr />

  <h2>🛡️ Datenschutz &amp; Impressum</h2>
  <p>Diese Webanwendung enthält ein eigenes Impressum sowie eine Datenschutzerklärung, die direkt im Projekt eingebunden sind. Die Komponenten befinden sich unter:</p>
  <ul>
    <li><code>pages/Impressum.jsx</code></li>
    <li><code>pages/Datenschutz.jsx</code></li>
  </ul>
  <p>Die Datenschutzerklärung enthält eine Matomo-Opt-Out-Funktion.</p>
  <hr />

  <h2>📁 Projektstruktur</h2>
  <pre><code>rocky-beach-welle-frontend/   
├── public/  
├── src/  
│   ├── components/  
│   ├── fonts/  
│   ├── img/  
│   ├── pages/  
│   ├── App.js  
│   ├── index.css  
│   └── index.js  
├── .env.production  
├── .env.example  
├── .gitignore  
├── package-lock.json  
└── package.json
</code></pre>
  <hr />

  <h2>📜 Lizenz</h2>
  <p>Dieses Projekt ist ein Fanprojekt und steht nicht in Verbindung mit Europa oder Sony Music. Es dient ausschließlich der privaten Nutzung und Community-Interaktion.</p>
  <hr />

  <h2>💬 Kontakt</h2>
  <p>Für Fragen oder Feedback: siehe Impressum innerhalb der Anwendung.</p>
</body>
</html>
