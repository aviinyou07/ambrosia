const fs = require('fs');
const path = require('path');

const categories = ['palazzo', 'sharara', 'gown', 'fusion'];
const outDir = path.join(__dirname, 'public', 'images');

const patterns = [
  `<pattern id="pat1" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/></pattern>`,
  `<pattern id="pat2" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.3"/></pattern>`,
  `<pattern id="pat3" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-width="2" opacity="0.2"/></pattern>`,
  `<pattern id="pat4" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/></pattern>`,
  `<pattern id="pat5" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M 0 10 Q 10 0 20 10 T 40 10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/></pattern>`,
  `<pattern id="pat6" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 16L16 0ZM-2 2L2 -2ZM14 18L18 14Z" stroke="currentColor" stroke-width="1" opacity="0.2"/><path d="M0 0L16 16ZM-2 14L2 18ZM14 -2L18 2Z" stroke="currentColor" stroke-width="1" opacity="0.2"/></pattern>`,
  `<pattern id="pat7" width="28" height="48" patternUnits="userSpaceOnUse"><path d="M14 0l14 8v16l-14 8-14-8V8z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/></pattern>`,
  `<pattern id="pat8" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/></pattern>`
];

const colors = [
  ['#8B4513', '#D2B48C'], ['#4B0082', '#9370DB'], ['#800000', '#CD5C5C'], ['#2F4F4F', '#20B2AA'],
  ['#B8860B', '#F0E68C'], ['#483D8B', '#7B68EE'], ['#8B0000', '#FA8072'], ['#556B2F', '#9ACD32']
];

function generateSVG(category, index) {
  const pattern = patterns[index % patterns.length];
  const [color1, color2] = colors[index % colors.length];
  const patId = `pat${index + 1}`;
  return `<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
      ${pattern.replace(/pat\d+/, patId)}
    </defs>
    <rect width="800" height="1200" fill="url(#grad${index})" />
    <rect width="800" height="1200" fill="url(#${patId})" color="#ffffff" />
    <rect x="200" y="500" width="400" height="200" fill="#ffffff" fill-opacity="0.9" rx="10" />
    <text x="400" y="590" font-family="serif" font-size="48" fill="${color1}" text-anchor="middle" font-weight="bold">${category.toUpperCase()}</text>
    <text x="400" y="640" font-family="sans-serif" font-size="24" fill="#333333" text-anchor="middle" letter-spacing="4">STYLE ${index + 1}</text>
  </svg>`;
}

categories.forEach(category => {
  for (let i = 0; i < 8; i++) {
    fs.writeFileSync(path.join(outDir, `generated_${category}_${i + 1}.svg`), generateSVG(category, i));
  }
});
