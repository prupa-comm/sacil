const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '../public/assets');

// 1. Official Gray Stamp: sacil-basket-stempel.png
const stempelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <!-- Circular Path for Top Text "BASKETBALL" -->
    <path id="topTextArc" d="M 100,250 A 150,150 0 0,1 400,250" />
    <filter id="stampDistort" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>

  <g filter="url(#stampDistort)" fill="none" stroke="#7e858e" stroke-linecap="round" stroke-linejoin="round">
    <!-- Double Outer Border Circle -->
    <circle cx="250" cy="250" r="230" stroke="#7e858e" stroke-width="8" />
    <circle cx="250" cy="250" r="216" stroke="#7e858e" stroke-width="3" />

    <!-- Dotted / Star Ring -->
    <circle cx="250" cy="250" r="195" stroke="#7e858e" stroke-width="2" stroke-dasharray="3, 14" />
    
    <!-- Stars along the outer rim -->
    <polygon points="250,30 254,42 266,42 256,50 260,62 250,54 240,62 244,50 234,42 246,42" fill="#7e858e" stroke="none" />
    <polygon points="65,160 72,168 83,165 77,175 83,184 72,181 65,189 65,178 55,172 66,170" fill="#7e858e" stroke="none" transform="scale(0.8) translate(20, 20)" />
    <polygon points="435,160 428,168 417,165 423,175 417,184 428,181 435,189 435,178 445,172 434,170" fill="#7e858e" stroke="none" transform="scale(0.8) translate(80, 20)" />
    <polygon points="65,340 72,348 83,345 77,355 83,364 72,361 65,369 65,358 55,352 66,350" fill="#7e858e" stroke="none" transform="scale(0.8) translate(20, 40)" />
    <polygon points="435,340 428,348 417,345 423,355 417,364 428,361 435,369 435,358 445,352 434,350" fill="#7e858e" stroke="none" transform="scale(0.8) translate(80, 40)" />

    <!-- Arched Text "BASKETBALL" -->
    <text font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="44" fill="#7e858e" stroke="#7e858e" stroke-width="1.5" letter-spacing="9" text-anchor="middle">
      <textPath href="#topTextArc" startOffset="50%">BASKETBALL</textPath>
    </text>

    <!-- Chevron stripes over eagle -->
    <path d="M 180,128 L 250,96 L 320,128" stroke="#7e858e" stroke-width="7" />
    <path d="M 195,146 L 250,120 L 305,146" stroke="#7e858e" stroke-width="5" />

    <!-- Eagle Head & Crest -->
    <path d="M 235,150 C 230,135 240,125 250,125 C 260,125 270,135 265,150 C 275,145 285,155 282,168 C 278,180 268,188 260,188 C 265,198 255,205 248,205 C 240,205 235,198 238,188 C 230,186 220,175 224,162 C 227,152 232,148 235,150 Z" fill="#7e858e" stroke="#7e858e" stroke-width="2" />
    <!-- Eagle Beak & Sharp Open Jaw -->
    <path d="M 268,155 L 298,162 L 274,172 L 288,182 L 265,180" fill="#7e858e" stroke="#7e858e" stroke-width="3" />
    <circle cx="258" cy="153" r="3.5" fill="#ffffff" stroke="none" />

    <!-- Spread Eagle Wings Left -->
    <g stroke="#7e858e" stroke-width="4.5" fill="#7e858e" fill-opacity="0.15">
      <path d="M 230,180 C 180,140 120,120 70,165 C 100,190 140,205 180,210 Z" />
      <path d="M 220,200 C 170,175 125,185 85,215 C 115,225 155,235 190,230 Z" />
      <path d="M 210,225 C 170,215 135,230 105,255 C 135,260 170,258 200,250 Z" />
      <path d="M 200,248 C 170,250 145,270 125,290 C 150,288 180,280 205,268 Z" />
    </g>

    <!-- Spread Eagle Wings Right -->
    <g stroke="#7e858e" stroke-width="4.5" fill="#7e858e" fill-opacity="0.15">
      <path d="M 270,180 C 320,140 380,120 430,165 C 400,190 360,205 320,210 Z" />
      <path d="M 280,200 C 330,175 375,185 415,215 C 385,225 345,235 310,230 Z" />
      <path d="M 290,225 C 330,215 365,230 395,255 C 365,260 330,258 300,250 Z" />
      <path d="M 300,248 C 330,250 355,270 375,290 C 350,288 320,280 295,268 Z" />
    </g>

    <!-- Basketball in Center -->
    <circle cx="250" cy="285" r="54" stroke="#7e858e" stroke-width="6" fill="#ffffff" fill-opacity="0.05" />
    <!-- Basketball Seam Lines -->
    <line x1="196" y1="285" x2="304" y2="285" stroke="#7e858e" stroke-width="4" />
    <line x1="250" y1="231" x2="250" y2="339" stroke="#7e858e" stroke-width="4" />
    <path d="M 215,246 C 240,265 240,305 215,324" stroke="#7e858e" stroke-width="4" />
    <path d="M 285,246 C 260,265 260,305 285,324" stroke="#7e858e" stroke-width="4" />

    <!-- Eagle Claws Gripping Ball -->
    <g fill="#7e858e" stroke="#7e858e" stroke-width="2">
      <!-- Left Claws -->
      <path d="M 205,255 C 200,248 190,248 185,255 C 190,265 198,272 208,268 Z" />
      <path d="M 218,258 C 215,250 205,248 200,255 C 206,267 212,274 220,270 Z" />
      <path d="M 230,265 C 228,255 218,254 212,262 C 218,272 225,277 232,274 Z" />
      <!-- Right Claws -->
      <path d="M 295,255 C 300,248 310,248 315,255 C 310,265 302,272 292,268 Z" />
      <path d="M 282,258 C 285,250 295,248 300,255 C 294,267 288,274 280,270 Z" />
      <path d="M 270,265 C 272,255 282,254 288,262 C 282,272 275,277 268,274 Z" />
    </g>

    <!-- "EST. 1985" -->
    <text x="250" y="360" font-family="'Arial', sans-serif" font-weight="bold" font-size="16" fill="#7e858e" letter-spacing="3" text-anchor="middle">EST. 1985</text>

    <!-- Ribbon Banner Shape "SMA NEGERI 1 CILEUNYI" -->
    <path d="M 85,365 L 140,360 L 250,380 L 360,360 L 415,365 L 395,410 L 360,400 L 250,425 L 140,400 L 105,410 Z" fill="#ffffff" stroke="#7e858e" stroke-width="6" />
    <!-- Ribbon Tail Folds -->
    <path d="M 85,365 L 60,385 L 105,410 L 95,385 Z" fill="#7e858e" fill-opacity="0.2" stroke="#7e858e" stroke-width="4" />
    <path d="M 415,365 L 440,385 L 395,410 L 405,385 Z" fill="#7e858e" fill-opacity="0.2" stroke="#7e858e" stroke-width="4" />

    <!-- Curved Text: "SMA NEGERI 1 CILEUNYI" -->
    <text x="250" y="405" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="30" fill="#7e858e" letter-spacing="3" text-anchor="middle">SMA NEGERI 1 CILEUNYI</text>

    <!-- Bottom Ribbon "EXTRACURRICULAR" -->
    <path d="M 160,430 L 250,442 L 340,430 L 325,458 L 250,470 L 175,458 Z" fill="#ffffff" stroke="#7e858e" stroke-width="4" />
    <text x="250" y="455" font-family="'Arial Black', sans-serif" font-weight="bold" font-size="15" fill="#7e858e" letter-spacing="3" text-anchor="middle">EXTRACURRICULAR</text>
  </g>
</svg>`;

// 2. Official School Shield Logo: logo-sacil-small.png / logo-sman1-cileunyi.png
const schoolLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <!-- Curve for SMA NEGERI (left) -->
    <path id="arcLeft" d="M 65,190 C 95,115 170,72 225,68" />
    <!-- Curve for CILEUNYI (right) -->
    <path id="arcRight" d="M 275,68 C 330,72 405,115 435,190" />
  </defs>

  <!-- Outermost Thin Blue Border / Rounded Pentagon -->
  <path d="M 250,22 Q 260,22 268,28 L 460,172 Q 472,182 468,198 L 388,435 Q 382,450 366,455 L 258,484 Q 250,486 242,484 L 134,455 Q 118,450 112,435 L 32,198 Q 28,182 40,172 L 232,28 Q 240,22 250,22 Z"
        fill="none" stroke="#0ba3e6" stroke-width="4" />

  <!-- Thick White Margin Border -->
  <path d="M 250,25 Q 258,25 265,31 L 455,174 Q 465,182 462,196 L 383,431 Q 378,444 364,449 L 257,478 Q 250,480 243,478 L 136,449 Q 122,444 117,431 L 38,196 Q 35,182 45,174 L 235,31 Q 242,25 250,25 Z"
        fill="#ffffff" />

  <!-- Inner Blue Shield -->
  <path d="M 250,38 Q 257,38 263,43 L 442,178 Q 451,185 448,197 L 372,422 Q 368,434 355,438 L 256,466 Q 250,468 244,466 L 145,438 Q 132,434 128,422 L 52,197 Q 49,185 58,178 L 237,43 Q 243,38 250,38 Z"
        fill="#0ba3e6" stroke="#0ba3e6" stroke-width="2" />

  <!-- Outer White Hairline on Inner Shield -->
  <path d="M 250,42 Q 256,42 261,46 L 438,180 Q 446,187 443,197 L 368,419 Q 364,430 352,434 L 255,462 Q 250,464 245,462 L 148,434 Q 136,430 132,419 L 57,197 Q 54,187 62,180 L 239,46 Q 244,42 250,42 Z"
        fill="none" stroke="#ffffff" stroke-width="2.5" />

  <!-- School Name: 'SMA NEGERI' on Left Arc -->
  <text font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="24" fill="#fff200" stroke="#0ba3e6" stroke-width="1" letter-spacing="2" text-anchor="middle">
    <textPath href="#arcLeft" startOffset="50%">SMA NEGERI</textPath>
  </text>

  <!-- School Number: '1' in Center (Large & Prominent) -->
  <text x="250" y="88" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="48" fill="#fff200" stroke="#0ba3e6" stroke-width="2" text-anchor="middle">1</text>

  <!-- School Name: 'CILEUNYI' on Right Arc -->
  <text font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="24" fill="#fff200" stroke="#0ba3e6" stroke-width="1" letter-spacing="2" text-anchor="middle">
    <textPath href="#arcRight" startOffset="50%">CILEUNYI</textPath>
  </text>

  <!-- Red Five-Pointed Star Below Digit 1 -->
  <polygon points="250,104 257,124 278,124 261,136 267,156 250,144 233,156 239,136 222,124 243,124"
           fill="#ed1c24" stroke="#ffffff" stroke-width="1.5" />

  <!-- Torch Flame (Red Flames) -->
  <g fill="#ed1c24" stroke="#ffffff" stroke-width="1">
    <path d="M 250,142 C 240,158 238,172 244,182 C 248,175 252,175 254,180 C 260,170 264,158 250,142 Z" />
    <path d="M 248,162 C 244,170 244,178 250,183 C 253,178 254,172 248,162 Z" fill="#ffca28" />
  </g>

  <!-- Torch Body (Wood/Gold Tone with Metal Ring) -->
  <path d="M 232,185 L 268,185 L 263,194 L 256,248 L 244,248 L 237,194 Z" fill="#c68a4c" stroke="#111111" stroke-width="2.5" />
  <rect x="230" y="190" width="40" height="5" rx="2" fill="#ffd54f" stroke="#111111" stroke-width="2" />
  <line x1="235" y1="208" x2="265" y2="208" stroke="#111111" stroke-width="1.5" />
  <line x1="238" y1="226" x2="262" y2="226" stroke="#111111" stroke-width="1.5" />

  <!-- Black Stylized Birds Facing Inward -->
  <!-- Left Bird -->
  <g fill="#000000" stroke="#000000" stroke-width="1">
    <path d="M 236,194 C 215,182 186,204 180,242 C 190,248 206,230 212,216 L 222,264 L 236,264 Z" />
    <circle cx="194" cy="214" r="3.5" fill="#ffffff" stroke="none" />
  </g>

  <!-- Right Bird -->
  <g fill="#000000" stroke="#000000" stroke-width="1">
    <path d="M 264,194 C 285,182 314,204 320,242 C 310,248 294,230 288,216 L 278,264 L 264,264 Z" />
    <circle cx="306" cy="214" r="3.5" fill="#ffffff" stroke="none" />
  </g>

  <!-- Bright Yellow Stylized Wings (Left and Right) -->
  <!-- Left Wing -->
  <path d="M 174,185 C 142,210 112,265 128,312 C 142,322 168,322 178,308 C 158,298 148,284 158,258 C 172,274 192,274 212,278 C 188,258 174,234 174,185 Z"
        fill="#fff200" stroke="#111111" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M 148,230 C 136,252 138,280 152,298" fill="none" stroke="#111111" stroke-width="1.5" />

  <!-- Right Wing -->
  <path d="M 326,185 C 358,210 388,265 372,312 C 358,322 332,322 322,308 C 342,298 352,284 342,258 C 328,274 308,274 288,278 C 312,258 326,234 326,185 Z"
        fill="#fff200" stroke="#111111" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M 352,230 C 364,252 362,280 348,298" fill="none" stroke="#111111" stroke-width="1.5" />

  <!-- Open White Book at Center Base -->
  <g stroke="#111111" stroke-width="2.5">
    <path d="M 248,322 C 220,317 182,321 170,326 L 168,366 C 184,360 220,356 248,364 Z" fill="#ffffff" />
    <path d="M 252,322 C 280,317 318,321 330,326 L 332,366 C 316,360 280,356 252,364 Z" fill="#ffffff" />
    <line x1="250" y1="321" x2="250" y2="365" stroke="#111111" stroke-width="3.5" />
  </g>

  <!-- Left: Golden Paddy / Rice Grains (17 Grains) -->
  <g fill="#f39c12" stroke="#111111" stroke-width="1.5">
    <path d="M 55,200 C 52,285 86,355 142,376" fill="none" stroke="#00a651" stroke-width="3.5" />
    <ellipse cx="62" cy="208" rx="13" ry="7" transform="rotate(-32 62 208)" />
    <ellipse cx="58" cy="226" rx="13" ry="7" transform="rotate(-22 58 226)" />
    <ellipse cx="58" cy="244" rx="13" ry="7" transform="rotate(-12 58 244)" />
    <ellipse cx="63" cy="262" rx="13" ry="7" transform="rotate(-2 63 262)" />
    <ellipse cx="70" cy="280" rx="13" ry="7" transform="rotate(8 70 280)" />
    <ellipse cx="80" cy="298" rx="13" ry="7" transform="rotate(20 80 298)" />
    <ellipse cx="92" cy="316" rx="13" ry="7" transform="rotate(32 92 316)" />
    <ellipse cx="106" cy="332" rx="13" ry="7" transform="rotate(45 106 332)" />
    <ellipse cx="124" cy="346" rx="13" ry="7" transform="rotate(58 124 346)" />
    <ellipse cx="144" cy="356" rx="13" ry="7" transform="rotate(70 144 356)" />
  </g>

  <!-- Right: Cotton Pods (Kapuk/Kapas - Green & White) -->
  <g stroke="#111111" stroke-width="1.5">
    <path d="M 445,200 C 448,285 414,355 358,376" fill="none" stroke="#00a651" stroke-width="3.5" />
    <g transform="translate(438, 210)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
    <g transform="translate(442, 232)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
    <g transform="translate(440, 254)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
    <g transform="translate(432, 276)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
    <g transform="translate(418, 298)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
    <g transform="translate(400, 320)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
    <g transform="translate(378, 340)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
    <g transform="translate(354, 356)"><circle cx="0" cy="0" r="9" fill="#ffffff" /><path d="M -7,0 C -7,6 7,6 7,0 Z" fill="#00a651" /></g>
  </g>

  <!-- Connected Green Stem tying Paddy and Cotton -->
  <path d="M 142,376 C 190,392 310,392 358,376" fill="none" stroke="#00a651" stroke-width="4" />

  <!-- Yellow Ribbon Banner at Bottom -->
  <g stroke="#111111" stroke-width="2.5">
    <path d="M 134,402 L 110,418 L 138,438 L 146,420 Z" fill="#fdd835" />
    <path d="M 366,402 L 390,418 L 362,438 L 354,420 Z" fill="#fdd835" />
    <path d="M 134,402 L 250,420 L 366,402 L 354,438 L 250,454 L 146,438 Z" fill="#fff200" stroke-linejoin="round" />
    <text x="250" y="438" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="26" fill="#111111" letter-spacing="4" text-anchor="middle">BANDUNG</text>
  </g>
</svg>`;

async function main() {
  // Write SVG files
  fs.writeFileSync(path.join(assetsDir, 'sacil-basket-stempel.svg'), stempelSvg);
  fs.writeFileSync(path.join(assetsDir, 'logo-sman1-cileunyi.svg'), schoolLogoSvg);
  fs.writeFileSync(path.join(assetsDir, 'logo-sacil-small.svg'), schoolLogoSvg);

  // Render PNG files (high resolution 600x600)
  await sharp(Buffer.from(stempelSvg))
    .resize(600, 600)
    .png()
    .toFile(path.join(assetsDir, 'sacil-basket-stempel.png'));
  console.log('Generated sacil-basket-stempel.png (600x600)');

  await sharp(Buffer.from(schoolLogoSvg))
    .resize(500, 500)
    .png()
    .toFile(path.join(assetsDir, 'logo-sman1-cileunyi.png'));
  console.log('Generated logo-sman1-cileunyi.png (500x500)');

  await sharp(Buffer.from(schoolLogoSvg))
    .resize(500, 500)
    .png()
    .toFile(path.join(assetsDir, 'logo-sacil-small.png'));
  console.log('Generated logo-sacil-small.png (500x500)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
