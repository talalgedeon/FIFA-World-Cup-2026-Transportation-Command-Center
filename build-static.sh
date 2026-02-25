#!/bin/bash
# Build a static version that doesn't need Vite/npm
mkdir -p dist

# Copy index.html but inline the app
cat > dist/index.html << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>FIFA World Cup 26™ — Transportation Command Center</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏟</text></svg>">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#060a14;overflow:hidden}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.13);border-radius:2px}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes fadeIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
    .leaflet-container{background:#060a14!important}
    .leaflet-popup-content-wrapper{background:#0c1222!important;color:#eef1f8!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:10px!important;box-shadow:0 6px 24px rgba(0,0,0,.5)!important}
    .leaflet-popup-tip{background:#0c1222!important}
    .leaflet-popup-content{margin:8px 12px!important;color:#eef1f8!important}
    .leaflet-control-zoom a{background:#0c1222!important;color:#8fa0c0!important;border-color:rgba(255,255,255,.1)!important}
    .leaflet-control-zoom a:hover{background:#121c30!important}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
HTML

# Now append the App code, converting imports for browser
echo 'const { useState, useEffect, useRef, useCallback } = React;' >> dist/index.html

# Get the App.jsx content, skip the import line, and change "export default function App" to just "function App"
sed '1d' src/App.jsx | sed 's/export default function App/function App/' >> dist/index.html

# Add the React render call and close tags
cat >> dist/index.html << 'ENDHTML'

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
  </script>
</body>
</html>
ENDHTML

echo "Build complete — dist/index.html ready"
