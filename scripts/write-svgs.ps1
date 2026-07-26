# Create all industry hero SVGs

# Logistics Hero SVG
$logistics = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none">
  <defs>
    <radialGradient id="lBgRing" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="var(--ring-inner, rgba(212,168,83,0.08))"/>
      <stop offset="55%" stop-color="var(--ring-mid, rgba(45,212,191,0.05))"/>
      <stop offset="100%" stop-color="var(--ring-outer, transparent)"/>
    </radialGradient>
    <linearGradient id="lSw1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="100%" stop-color="#c49a45"/>
    </linearGradient>
    <linearGradient id="lSw2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c9a04a"/>
      <stop offset="100%" stop-color="#3dbda8"/>
    </linearGradient>
    <linearGradient id="lSw3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#24b8a5"/>
    </linearGradient>
    <linearGradient id="lSw4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="lSw5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d4a853"/>
    </linearGradient>
    <linearGradient id="lSw6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
    <filter id="lShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="var(--shadow, rgba(0,0,0,0.25))"/>
    </filter>
    <filter id="lNodeShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="var(--shadow, rgba(0,0,0,0.2))"/>
    </filter>
  </defs>
  <circle cx="400" cy="400" r="360" fill="url(#lBgRing)"/>
  <circle cx="400" cy="400" r="300" fill="none" stroke="var(--ring-stroke, rgba(212,168,83,0.12))" stroke-width="1.5"/>
  <circle cx="400" cy="400" r="240" fill="none" stroke="var(--ring-stroke2, rgba(45,212,191,0.1))" stroke-width="1"/>
  <path d="M400 280 C 380 220, 340 180, 300 160" stroke="url(#lSw5)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M480 310 C 540 270, 590 230, 620 190" stroke="url(#lSw1)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M510 400 C 570 410, 620 440, 650 490" stroke="url(#lSw4)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M460 480 C 480 540, 480 590, 460 640" stroke="url(#lSw3)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M340 480 C 320 540, 280 590, 240 620" stroke="url(#lSw2)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M290 400 C 230 390, 180 360, 150 310" stroke="url(#lSw6)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <circle cx="400" cy="400" r="100" fill="var(--hub-bg, rgba(212,168,83,0.15))" stroke="var(--hub-border, rgba(212,168,83,0.35))" stroke-width="2" filter="url(#lShadow)"/>
  <text x="400" y="385" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="32" font-weight="700" fill="var(--hub-text, #d4a853)">LOGISTICS</text>
  <text x="400" y="422" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="11" fill="var(--hub-sub, #9d9bb8)">Supply chain &amp; distribution</text>
  <g filter="url(#lNodeShadow)"><circle cx="155" cy="285" r="50" fill="#c9a04a"/><g transform="translate(155,285)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="14"/><polyline points="-6,-6 0,0 6,-4"/><line x1="10" y1="10" x2="18" y2="18"/></g>
  <rect x="28" y="267" width="108" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#c9a04a" stroke-width="1.5"/>
  <text x="82" y="289" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Route</text>
  <g filter="url(#lNodeShadow)"><circle cx="300" cy="145" r="50" fill="#d4a853"/><g transform="translate(300,145)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-16" y="-12" width="32" height="24" rx="3"/><line x1="-16" y1="-4" x2="16" y2="-4"/><line x1="-16" y1="4" x2="16" y2="4"/><circle cx="-6" cy="8" r="3" fill="#fff" stroke="none"/><circle cx="6" cy="8" r="3" fill="#fff" stroke="none"/></g>
  <rect x="228" y="82" width="108" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#d4a853" stroke-width="1.5"/>
  <text x="282" y="104" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Fleet</text>
  <g filter="url(#lNodeShadow)"><circle cx="620" cy="190" r="50" fill="#b8923f"/><g transform="translate(620,190)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-16" y="-10" width="14" height="20" rx="2"/><rect x="-2" y="-12" width="14" height="22" rx="2"/><rect x="12" y="-14" width="14" height="24" rx="2"/><line x1="-9" y1="4" x2="-9" y2="10"/><line x1="5" y1="4" x2="5" y2="10"/><line x1="19" y1="4" x2="19" y2="10"/></g>
  <rect x="560" y="132" width="124" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#b8923f" stroke-width="1.5"/>
  <text x="622" y="154" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #8a6020)">Warehouse</text>
  <g filter="url(#lNodeShadow)"><circle cx="655" cy="495" r="50" fill="#3b82f6"/><g transform="translate(655,495)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="-14,-8 -4,4 14,-10"/><circle cx="0" cy="0" r="18"/><line x1="12" y1="12" x2="22" y2="22"/></g>
  <rect x="598" y="558" width="120" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="658" y="580" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Delivery</text>
  <g filter="url(#lNodeShadow)"><circle cx="460" cy="645" r="50" fill="#24b8a5"/><g transform="translate(460,645)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="16"/><polyline points="-8,-4 0,6 10,-6"/><line x1="12" y1="12" x2="22" y2="22"/></g>
  <rect x="398" y="703" width="120" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#24b8a5" stroke-width="1.5"/>
  <text x="458" y="725" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Tracking</text>
  <g filter="url(#lNodeShadow)"><circle cx="240" cy="625" r="50" fill="#3dbda8"/><g transform="translate(240,625)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-18" y="-14" width="14" height="22" rx="2"/><rect x="-4" y="-10" width="14" height="18" rx="2"/><rect x="10" y="-16" width="14" height="26" rx="2"/><line x1="-11" y1="0" x2="-11" y2="8"/><line x1="3" y1="0" x2="3" y2="8"/><line x1="17" y1="0" x2="17" y2="10"/></g>
  <rect x="175" y="635" width="124" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#3dbda8" stroke-width="1.5"/>
  <text x="237" y="657" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Inventory</text>
</svg>
'@

# Textile Hero SVG
$textile = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none">
  <defs>
    <radialGradient id="tBgRing" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="var(--ring-inner, rgba(212,168,83,0.08))"/>
      <stop offset="55%" stop-color="var(--ring-mid, rgba(45,212,191,0.05))"/>
      <stop offset="100%" stop-color="var(--ring-outer, transparent)"/>
    </radialGradient>
    <linearGradient id="tSw1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="100%" stop-color="#c49a45"/>
    </linearGradient>
    <linearGradient id="tSw2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c9a04a"/>
      <stop offset="100%" stop-color="#3dbda8"/>
    </linearGradient>
    <linearGradient id="tSw3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
    <linearGradient id="tSw4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
    <linearGradient id="tSw5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d4a853"/>
    </linearGradient>
    <linearGradient id="tSw6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="tShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="var(--shadow, rgba(0,0,0,0.25))"/>
    </filter>
    <filter id="tNodeShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="var(--shadow, rgba(0,0,0,0.2))"/>
    </filter>
  </defs>
  <circle cx="400" cy="400" r="360" fill="url(#tBgRing)"/>
  <circle cx="400" cy="400" r="300" fill="none" stroke="var(--ring-stroke, rgba(212,168,83,0.12))" stroke-width="1.5"/>
  <circle cx="400" cy="400" r="240" fill="none" stroke="var(--ring-stroke2, rgba(45,212,191,0.1))" stroke-width="1"/>
  <path d="M400 280 C 380 220, 340 180, 300 160" stroke="url(#tSw5)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M480 310 C 540 270, 590 230, 620 190" stroke="url(#tSw1)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M510 400 C 570 410, 620 440, 650 490" stroke="url(#tSw3)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M460 480 C 480 540, 480 590, 460 640" stroke="url(#tSw4)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M340 480 C 320 540, 280 590, 240 620" stroke="url(#tSw2)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M290 400 C 230 390, 180 360, 150 310" stroke="url(#tSw6)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <circle cx="400" cy="400" r="100" fill="var(--hub-bg, rgba(212,168,83,0.15))" stroke="var(--hub-border, rgba(212,168,83,0.35))" stroke-width="2" filter="url(#tShadow)"/>
  <text x="400" y="385" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="32" font-weight="700" fill="var(--hub-text, #d4a853)">TEXTILE</text>
  <text x="400" y="422" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="11" fill="var(--hub-sub, #9d9bb8)">Apparel &amp; fabric supply chain</text>
  <g filter="url(#tNodeShadow)"><circle cx="155" cy="285" r="50" fill="#c9a04a"/><g transform="translate(155,285)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-12" y="-10" width="10" height="16" rx="1"/><rect x="2" y="-12" width="10" height="18" rx="1"/><rect x="-12" y="6" width="24" height="8" rx="1"/><line x1="-7" y1="0" x2="-7" y2="6"/><line x1="7" y1="-2" x2="7" y2="6"/></g>
  <rect x="28" y="267" width="124" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#c9a04a" stroke-width="1.5"/>
  <text x="90" y="289" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Sourcing</text>
  <g filter="url(#tNodeShadow)"><circle cx="300" cy="145" r="50" fill="#d4a853"/><g transform="translate(300,145)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-16" y="-12" width="32" height="24" rx="3"/><line x1="-16" y1="-4" x2="16" y2="-4"/><line x1="-16" y1="4" x2="16" y2="4"/><circle cx="-6" cy="8" r="3" fill="#fff" stroke="none"/><circle cx="6" cy="8" r="3" fill="#fff" stroke="none"/></g>
  <rect x="228" y="82" width="136" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#d4a853" stroke-width="1.5"/>
  <text x="296" y="104" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Production</text>
  <g filter="url(#tNodeShadow)"><circle cx="620" cy="190" r="50" fill="#b8923f"/><g transform="translate(620,190)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="14"/><polyline points="-6,-6 0,0 6,-4"/><line x1="10" y1="10" x2="18" y2="18"/></g>
  <rect x="560" y="132" width="112" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#b8923f" stroke-width="1.5"/>
  <text x="616" y="154" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #8a6020)">Dyeing</text>
  <g filter="url(#tNodeShadow)"><circle cx="655" cy="495" r="50" fill="#ec4899"/><g transform="translate(655,495)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M-18 -8 L-6 -16 L6 -8 L18 -16"/><path d="M-18 0 L-6 -8 L6 0 L18 -8"/><path d="M-18 8 L-6 0 L6 8 L18 0"/><circle cx="-18" cy="-8" r="3" fill="#fff" stroke="none"/></g>
  <rect x="598" y="558" width="120" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#ec4899" stroke-width="1.5"/>
  <text x="658" y="580" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Finishing</text>
  <g filter="url(#tNodeShadow)"><circle cx="460" cy="645" r="50" fill="#14b8a6"/><g transform="translate(460,645)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="16"/><polyline points="-8,-4 0,6 10,-6"/><line x1="12" y1="12" x2="22" y2="22"/></g>
  <rect x="398" y="703" width="112" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#14b8a6" stroke-width="1.5"/>
  <text x="454" y="725" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Quality</text>
  <g filter="url(#tNodeShadow)"><circle cx="240" cy="625" r="50" fill="#3dbda8"/><g transform="translate(240,625)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-18" y="-14" width="14" height="22" rx="2"/><rect x="-4" y="-10" width="14" height="18" rx="2"/><rect x="10" y="-16" width="14" height="26" rx="2"/><line x1="-11" y1="0" x2="-11" y2="8"/><line x1="3" y1="0" x2="3" y2="8"/><line x1="17" y1="0" x2="17" y2="10"/></g>
  <rect x="175" y="635" width="124" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#3dbda8" stroke-width="1.5"/>
  <text x="237" y="657" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Inventory</text>
</svg>
'@

# Construction Hero SVG
$construction = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none">
  <defs>
    <radialGradient id="cBgRing" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="var(--ring-inner, rgba(212,168,83,0.08))"/>
      <stop offset="55%" stop-color="var(--ring-mid, rgba(45,212,191,0.05))"/>
      <stop offset="100%" stop-color="var(--ring-outer, transparent)"/>
    </radialGradient>
    <linearGradient id="cSw1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="100%" stop-color="#c49a45"/>
    </linearGradient>
    <linearGradient id="cSw2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="cSw3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
    <linearGradient id="cSw4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="cSw5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d4a853"/>
    </linearGradient>
    <linearGradient id="cSw6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="cShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="var(--shadow, rgba(0,0,0,0.25))"/>
    </filter>
    <filter id="cNodeShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="var(--shadow, rgba(0,0,0,0.2))"/>
    </filter>
  </defs>
  <circle cx="400" cy="400" r="360" fill="url(#cBgRing)"/>
  <circle cx="400" cy="400" r="300" fill="none" stroke="var(--ring-stroke, rgba(212,168,83,0.12))" stroke-width="1.5"/>
  <circle cx="400" cy="400" r="240" fill="none" stroke="var(--ring-stroke2, rgba(45,212,191,0.1))" stroke-width="1"/>
  <path d="M400 280 C 380 220, 340 180, 300 160" stroke="url(#cSw5)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M480 310 C 540 270, 590 230, 620 190" stroke="url(#cSw1)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M510 400 C 570 410, 620 440, 650 490" stroke="url(#cSw2)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M460 480 C 480 540, 480 590, 460 640" stroke="url(#cSw4)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M340 480 C 320 540, 280 590, 240 620" stroke="url(#cSw3)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M290 400 C 230 390, 180 360, 150 310" stroke="url(#cSw6)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <circle cx="400" cy="400" r="100" fill="var(--hub-bg, rgba(212,168,83,0.15))" stroke="var(--hub-border, rgba(212,168,83,0.35))" stroke-width="2" filter="url(#cShadow)"/>
  <text x="400" y="385" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="32" font-weight="700" fill="var(--hub-text, #d4a853)">CONSTRUCTION</text>
  <text x="400" y="422" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="11" fill="var(--hub-sub, #9d9bb8)">Project control &amp; delivery</text>
  <g filter="url(#cNodeShadow)"><circle cx="155" cy="285" r="50" fill="#c9a04a"/><g transform="translate(155,285)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-14" y="-10" width="12" height="20" rx="2"/><line x1="-8" y1="0" x2="-8" y2="10"/><line x1="2" y1="0" x2="2" y2="10"/><line x1="-8" y1="-4" x2="2" y2="-4"/></g>
  <rect x="28" y="267" width="124" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#c9a04a" stroke-width="1.5"/>
  <text x="90" y="289" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Planning</text>
  <g filter="url(#cNodeShadow)"><circle cx="300" cy="145" r="50" fill="#d4a853"/><g transform="translate(300,145)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="16"/><line x1="0" y1="-12" x2="0" y2="12"/><line x1="-10" y1="-6" x2="10" y2="-6"/><line x1="-8" y1="6" x2="8" y2="6"/></g>
  <rect x="228" y="82" width="112" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#d4a853" stroke-width="1.5"/>
  <text x="284" y="104" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Budget</text>
  <g filter="url(#cNodeShadow)"><circle cx="620" cy="190" r="50" fill="#b8923f"/><g transform="translate(620,190)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-12" y="-16" width="24" height="26" rx="4"/><polyline points="-6,-4 0,4 6,-2"/><line x1="10" y1="10" x2="18" y2="18"/></g>
  <rect x="560" y="132" width="108" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#b8923f" stroke-width="1.5"/>
  <text x="614" y="154" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #8a6020)">Safety</text>
  <g filter="url(#cNodeShadow)"><circle cx="655" cy="495" r="50" fill="#f97316"/><g transform="translate(655,495)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-18" y="-10" width="14" height="20" rx="2"/><rect x="-4" y="-12" width="14" height="22" rx="2"/><rect x="10" y="-14" width="14" height="24" rx="2"/><line x1="-11" y1="4" x2="-11" y2="10"/><line x1="3" y1="4" x2="3" y2="10"/><line x1="17" y1="4" x2="17" y2="10"/></g>
  <rect x="598" y="558" width="120" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#f97316" stroke-width="1.5"/>
  <text x="658" y="580" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Materials</text>
  <g filter="url(#cNodeShadow)"><circle cx="460" cy="645" r="50" fill="#2563eb"/><g transform="translate(460,645)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="16"/><path d="M-8 -8 L0 -16 L8 -8 Z"/><line x1="0" y1="-8" x2="0" y2="8"/><line x1="-8" y1="0" x2="8" y2="0"/></g>
  <rect x="398" y="703" width="96" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#2563eb" stroke-width="1.5"/>
  <text x="446" y="725" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Field</text>
  <g filter="url(#cNodeShadow)"><circle cx="240" cy="625" r="50" fill="#14b8a6"/><g transform="translate(240,625)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-10" y="-16" width="20" height="22" rx="3"/><polyline points="-6,-4 0,4 6,-2"/><line x1="12" y1="12" x2="22" y2="22"/></g>
  <rect x="175" y="635" width="136" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#14b8a6" stroke-width="1.5"/>
  <text x="243" y="657" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Compliance</text>
</svg>
'@

# Marketing Hero SVG
$marketing = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none">
  <defs>
    <radialGradient id="kBgRing" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="var(--ring-inner, rgba(212,168,83,0.08))"/>
      <stop offset="55%" stop-color="var(--ring-mid, rgba(45,212,191,0.05))"/>
      <stop offset="100%" stop-color="var(--ring-outer, transparent)"/>
    </radialGradient>
    <linearGradient id="kSw1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="100%" stop-color="#c49a45"/>
    </linearGradient>
    <linearGradient id="kSw2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
    <linearGradient id="kSw3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
    <linearGradient id="kSw4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="kSw5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d4a853"/>
    </linearGradient>
    <linearGradient id="kSw6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="kShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="var(--shadow, rgba(0,0,0,0.25))"/>
    </filter>
    <filter id="kNodeShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="var(--shadow, rgba(0,0,0,0.2))"/>
    </filter>
  </defs>
  <circle cx="400" cy="400" r="360" fill="url(#kBgRing)"/>
  <circle cx="400" cy="400" r="300" fill="none" stroke="var(--ring-stroke, rgba(212,168,83,0.12))" stroke-width="1.5"/>
  <circle cx="400" cy="400" r="240" fill="none" stroke="var(--ring-stroke2, rgba(45,212,191,0.1))" stroke-width="1"/>
  <path d="M400 280 C 380 220, 340 180, 300 160" stroke="url(#kSw5)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M480 310 C 540 270, 590 230, 620 190" stroke="url(#kSw1)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M510 400 C 570 410, 620 440, 650 490" stroke="url(#kSw2)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M460 480 C 480 540, 480 590, 460 640" stroke="url(#kSw4)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M340 480 C 320 540, 280 590, 240 620" stroke="url(#kSw3)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M290 400 C 230 390, 180 360, 150 310" stroke="url(#kSw6)" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.85"/>
  <circle cx="400" cy="400" r="100" fill="var(--hub-bg, rgba(212,168,83,0.15))" stroke="var(--hub-border, rgba(212,168,83,0.35))" stroke-width="2" filter="url(#kShadow)"/>
  <text x="400" y="385" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="32" font-weight="700" fill="var(--hub-text, #d4a853)">MARKETING</text>
  <text x="400" y="422" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="11" fill="var(--hub-sub, #9d9bb8)">Campaigns, growth &amp; analytics</text>
  <g filter="url(#kNodeShadow)"><circle cx="155" cy="285" r="50" fill="#c9a04a"/><g transform="translate(155,285)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="14"/><polyline points="-4,-12 4,-12 4,0"/><line x1="0" y1="0" x2="10" y2="0"/><line x1="10" y1="0" x2="16" y2="4"/></g>
  <rect x="28" y="267" width="128" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#c9a04a" stroke-width="1.5"/>
  <text x="92" y="289" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Campaign</text>
  <g filter="url(#kNodeShadow)"><circle cx="300" cy="145" r="50" fill="#d4a853"/><g transform="translate(300,145)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="-4" r="6"/><path d="M-10 8 C-10 2,10 2,10 8"/></g>
  <rect x="228" y="82" width="108" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#d4a853" stroke-width="1.5"/>
  <text x="282" y="104" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #a07830)">Leads</text>
  <g filter="url(#kNodeShadow)"><circle cx="620" cy="190" r="50" fill="#b8923f"/><g transform="translate(620,190)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-18" y="-14" width="36" height="28" rx="3"/><line x1="-14" y1="-2" x2="14" y2="-2"/><line x1="-14" y1="6" x2="14" y2="6"/><rect x="-10" y="-2" width="8" height="8"/><rect x="2" y="-2" width="8" height="8"/><rect x="-10" y="6" width="8" height="8"/><rect x="2" y="6" width="8" height="8"/></g>
  <rect x="560" y="132" width="116" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#b8923f" stroke-width="1.5"/>
  <text x="618" y="154" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-gold, #8a6020)">Analytics</text>
  <g filter="url(#kNodeShadow)"><circle cx="655" cy="495" r="50" fill="#ec4899"/><g transform="translate(655,495)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="-16" y="-12" width="20" height="24" rx="2"/><line x1="-12" y1="-4" x2="0" y2="-4"/><line x1="-12" y1="4" x2="0" y2="4"/><circle cx="8" cy="-4" r="6" fill="#fff" stroke="none"/><circle cx="8" cy="8" r="6" fill="#fff" stroke="none"/></g>
  <rect x="598" y="558" width="108" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#ec4899" stroke-width="1.5"/>
  <text x="652" y="580" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="var(--label-teal, #0d7a6e)">Content</text>
  <g filter="url(#kNodeShadow)"><circle cx="460" cy="645" r="50" fill="#2563eb"/><g transform="translate(460,645)" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="16"/><circle cx="0" cy="0" r="6" fill="#fff" stroke="none"/><line x1="0" y1="-16" x2="0" y2="16"/><line x1="-16" y1="0" x2="16" y2="0"/></g>
  <rect x="398" y="703" width="100" height="34" rx="17" fill="var(--label-bg, #fff)" stroke="#2563eb" stroke-width="1.5"/>


<execute_command>
<command>cd "d:\Development\PrincePro" && powershell -Command "Get-ChildItem assets"</command>
</execute_command>
