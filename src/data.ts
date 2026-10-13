/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artwork, Collection, JournalPost, TimelineEvent, Testimonial, Artist, ArtistApplication, CommissionRequest } from './types';

// Beautiful SVG helper to render high-fidelity art dynamically without external asset dependency.
// Uses complex gradients, organic paths, and lighting effects to look like actual high-end canvas painting.
export const getArtworkSvg = (type: string, title: string): string => {
  let innerSvg = '';
  if (type === 'ocean') {
    innerSvg = `
      <defs>
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:%230A192F;stop-opacity:1" />
          <stop offset="40%" style="stop-color:%23172A45;stop-opacity:1" />
          <stop offset="70%" style="stop-color:%23C4D8E2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:%23FFC0CB;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="40%" r="30%">
          <stop offset="0%" style="stop-color:%23FFF7E6;stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:%23FFD580;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:%23FFD580;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(%23oceanGrad)" />
      <circle cx="280" cy="180" r="140" fill="url(%23sun)" />
      <!-- Stylized wave contours -->
      <path d="M-50,300 C150,220 350,380 650,300 L650,500 L-50,500 Z" fill="%230F2537" opacity="0.8" />
      <path d="M-50,350 C100,280 250,420 650,340 L650,500 L-50,500 Z" fill="%23173B54" opacity="0.7" />
      <path d="M-50,400 C200,340 300,450 650,390 L650,500 L-50,500 Z" fill="%23C4D8E2" opacity="0.3" />
      <path d="M-50,430 C150,410 400,460 650,420 L650,500 L-50,500 Z" fill="%23FF0038" opacity="0.15" />
      <!-- Artist textured brush strokes -->
      <line x1="100" y1="200" x2="400" y2="200" stroke="%23FFF" stroke-width="0.5" stroke-dasharray="2,8" opacity="0.4" />
      <line x1="50" y1="280" x2="550" y2="280" stroke="%23FFF" stroke-width="1" stroke-dasharray="20,15" opacity="0.2" />
    `;
  } else if (type === 'forest') {
    innerSvg = `
      <defs>
        <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:%231E351E;stop-opacity:1" />
          <stop offset="50%" style="stop-color:%23F0FFF0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:%23D3E2D3;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:%23111F11" />
          <stop offset="100%" style="stop-color:%232B4C2B" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(%23forestGrad)" />
      <!-- Stylized Abstract Trees -->
      <path d="M100,500 L120,200 L140,500 Z" fill="url(%23trunk)" opacity="0.8" />
      <path d="M220,500 L245,120 L270,500 Z" fill="url(%23trunk)" opacity="0.9" />
      <path d="M380,500 L400,180 L420,500 Z" fill="url(%23trunk)" opacity="0.75" />
      <path d="M480,500 L510,240 L540,500 Z" fill="url(%23trunk)" opacity="0.85" />
      <!-- Glowing atmospheric light circles -->
      <circle cx="245" cy="180" r="100" fill="%23FFF" opacity="0.25" filter="blur" />
      <circle cx="400" cy="220" r="70" fill="%23FFE0B2" opacity="0.3" />
      <circle cx="150" cy="300" r="120" fill="%23C4D8E2" opacity="0.2" />
      <!-- Golden sparkles -->
      <circle cx="280" cy="150" r="3" fill="%23FFD700" />
      <circle cx="210" cy="200" r="2" fill="%23FFD700" />
      <circle cx="340" cy="180" r="4" fill="%23FFD700" />
      <circle cx="450" cy="280" r="3.5" fill="%23FFD700" />
    `;
  } else if (type === 'abstract') {
    innerSvg = `
      <defs>
        <linearGradient id="absGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:%23111111;stop-opacity:1" />
          <stop offset="50%" style="stop-color:%232D2D2D;stop-opacity:1" />
          <stop offset="100%" style="stop-color:%231E1E1E;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(%23absGrad)" />
      <!-- Textured abstract blocks representing paint knife strokes -->
      <rect x="80" y="80" width="220" height="280" fill="%23FF0038" opacity="0.85" rx="4" transform="rotate(-5 190 220)" />
      <rect x="240" y="140" width="260" height="200" fill="%23C4D8E2" opacity="0.7" rx="8" transform="rotate(8 370 240)" />
      <rect x="180" y="220" width="180" height="180" fill="%23FFFAFA" opacity="0.9" rx="2" transform="rotate(-15 270 310)" />
      <!-- Fine gold/yellow lines representing raw pencil sketches -->
      <path d="M50,100 Q150,50 300,120 T550,80" fill="none" stroke="%23FFD700" stroke-width="2" opacity="0.6" />
      <path d="M80,380 Q250,450 450,380 T520,440" fill="none" stroke="%23FFD700" stroke-width="1.5" opacity="0.5" />
      <!-- Splatters -->
      <circle cx="120" cy="130" r="6" fill="%23FFFAFA" />
      <circle cx="135" cy="120" r="3" fill="%23FFFAFA" />
      <circle cx="420" cy="380" r="5" fill="%23FF0038" />
      <circle cx="435" cy="395" r="2" fill="%23FF0038" />
    `;
  } else if (type === 'minimalist') {
    innerSvg = `
      <defs>
        <linearGradient id="minGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:%23FFFAFA;stop-opacity:1" />
          <stop offset="100%" style="stop-color:%23F5EFEF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(%23minGrad)" />
      <!-- Minimalist perfect geometric elements -->
      <circle cx="300" cy="200" r="110" fill="%231B1B1B" opacity="0.95" />
      <circle cx="300" cy="280" r="110" fill="%23C4D8E2" opacity="0.6" style="mix-blend-mode: multiply;" />
      <line x1="300" y1="50" x2="300" y2="350" stroke="%23FF0038" stroke-width="3" />
      <circle cx="300" cy="200" r="8" fill="%23FF0038" />
    `;
  } else if (type === 'monsoon') {
    innerSvg = `
      <defs>
        <linearGradient id="monsoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:%231A2634;stop-opacity:1" />
          <stop offset="50%" style="stop-color:%232E3D52;stop-opacity:1" />
          <stop offset="100%" style="stop-color:%234A5C70;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(%23monsoonGrad)" />
      <!-- Atmospheric rain clouds and deep organic contours -->
      <path d="M-50,150 Q150,80 400,180 T850,120 L850,500 L-50,500 Z" fill="%23131D29" opacity="0.8" />
      <path d="M-50,220 Q200,320 500,240 T850,300 L850,500 L-50,500 Z" fill="%231B2A3B" opacity="0.75" />
      <path d="M-50,300 Q250,200 600,350 T850,280 L850,500 L-50,500 Z" fill="%23C4D8E2" opacity="0.15" />
      <!-- Vertical organic rain streaks and pigment overlays -->
      <line x1="120" y1="50" x2="100" y2="400" stroke="%23C4D8E2" stroke-width="1.5" stroke-dasharray="80,120" opacity="0.1" />
      <line x1="280" y1="20" x2="250" y2="450" stroke="%23FFF" stroke-width="1" stroke-dasharray="100,200" opacity="0.15" />
      <line x1="420" y1="80" x2="390" y2="420" stroke="%23FF0038" stroke-width="0.75" stroke-dasharray="50,150" opacity="0.1" />
      <circle cx="300" cy="220" r="160" fill="%23F0FFF0" opacity="0.03" />
    `;
  } else {
    innerSvg = `
      <rect width="100%" height="100%" fill="%23FFFAFA" />
      <circle cx="300" cy="225" r="100" fill="%23C4D8E2" />
      <text x="300" y="235" font-family="serif" font-size="24" fill="%231B1B1B" text-anchor="middle">${title}</text>
    `;
  }

  const svg = `<svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" style="background:%23FFF;">${innerSvg}</svg>`;
  return `data:image/svg+xml;utf8,${svg.replace(/"/g, "'").replace(/#/g, '%23')}`;
};

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'tanveen',
    name: 'Tanveen',
    slug: 'tanveen',
    role: 'Featured Artist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Tanveen is a contemporary fine artist whose work explores sea-salt textures, natural earth pigments, and deep editorial narratives of coastal landscapes.',
    story: 'Born and raised with the scent of the sea, Tanveen transitioned from a structured corporate design career to a beachside bamboo studio in Cox’s Bazar. Her practice centers on extreme material tactility—infusing local sea salts, crushed stone pigments, and raw rainwater directly into her canvases to let nature leave its own physical signature.',
    verified: true,
    location: 'Cox’s Bazar, Bangladesh',
    featured: true,
    socials: {
      instagram: 'https://instagram.com/tanveenartescape',
      pinterest: 'https://pinterest.com/tanveenartescape',
      website: 'https://tanveenartescape.com'
    },
    earnings: 43500,
    commissionEnabled: true
  },
  {
    id: 'kazi-rahim',
    name: 'Kazi Rahim',
    slug: 'kazi-rahim',
    role: 'Guest Artist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Kazi Rahim is a minimalist sculptor and digital printmaker based in Dhaka, working with geometric space and organic brass forms.',
    story: 'A graduate of the Fine Arts Institute, Kazi Rahim’s work explores the boundaries between negative space and three-dimensional balance. His series of mathematical sketches explore silent visual loops.',
    verified: true,
    location: 'Dhaka, Bangladesh',
    featured: false,
    socials: {
      instagram: 'https://instagram.com/kazirahim',
    },
    earnings: 12400,
    commissionEnabled: true
  },
  {
    id: 'anika-chowdhury',
    name: 'Anika Chowdhury',
    slug: 'anika-chowdhury',
    role: 'Gallery Partner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Anika Chowdhury is a mixed-media curator and oil painter specializing in tea garden vistas and Sreemangal highlands.',
    story: 'Growing up near the highland mist, Anika utilizes deep moss greens and golden leaf accents to paint Sreemangal’s ancient tree canopies.',
    verified: true,
    location: 'Sreemangal, Bangladesh',
    featured: false,
    socials: {
      instagram: 'https://instagram.com/anikachowdhury',
    },
    earnings: 8900,
    commissionEnabled: false
  }
];

export const INITIAL_APPLICATIONS: ArtistApplication[] = [
  {
    id: 'app-1',
    name: 'Sajid Mahmud',
    email: 'sajid@mahmudart.com',
    portfolioUrl: 'https://sajidmahmud.art',
    statement: 'I am deeply inspired by the high tactility of Tanveen’s Art Escape. I would love to showcase my woodblock ocean prints alongside her sea-salt canvases, building a collaborative regional ecosystem.',
    mediums: ['Woodblock Prints', 'Linen Ink'],
    status: 'Pending',
    date: 'July 8, 2026'
  },
  {
    id: 'app-2',
    name: 'Meera Sen',
    email: 'meera.sen@gmail.com',
    portfolioUrl: 'https://meerasenstudio.com',
    statement: 'My practice deals with natural clay pigments and copper leaf gilding, exploring the ancient river deltas of southern Bengal.',
    mediums: ['Earthen Tempera', 'Copper Leaf'],
    status: 'Approved',
    date: 'July 5, 2026'
  }
];

export const INITIAL_COMMISSIONS: CommissionRequest[] = [
  {
    id: 'comm-1',
    artistId: 'tanveen',
    clientName: 'Julianne Vance',
    clientEmail: 'julianne@vanceinteriors.com',
    dimensions: '72 × 48 inches (Large Scale)',
    description: 'A custom sea-salt horizontal abstract canvas in deep Columbia Blue, cream, and faint gold sand layers for a corporate reception wall in New York.',
    budget: 6500,
    status: 'Requested',
    date: 'July 7, 2026'
  },
  {
    id: 'comm-2',
    artistId: 'kazi-rahim',
    clientName: 'Marcus Sterling',
    clientEmail: 'marcus@sterlingcollection.sg',
    dimensions: '36 × 36 inches',
    description: 'A balanced geometric ink study of circular sound waves with custom graphite texture layers.',
    budget: 3200,
    status: 'In_Progress',
    date: 'June 30, 2026'
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'ocean-dreams',
    artistId: 'tanveen',
    title: 'Ocean Dreams',
    description: 'A poetic collection inspired by the shifting moods, golden crests, and therapeutic depths of Bangladesh’s coastal horizons.',
    coverImage: getArtworkSvg('ocean', 'Ocean Dreams'),
    story: 'For months, I woke up before dawn to observe the meeting of sky and water at Inani. The "Ocean Dreams" collection is my attempt to capture not just the physical waves, but the emotional release of staring into an endless blue. Every stroke is built slowly with modeling paste and acrylic glazes, mimicking the physical texture of dried sea salt and rolling foam.',
    featured: true
  },
  {
    id: 'nature-spirit',
    artistId: 'tanveen',
    title: 'Nature Spirit',
    description: 'A quiet, deep study of visual dappling, misted forests, and the golden sunlight filtering through leaves.',
    coverImage: getArtworkSvg('forest', 'Nature Spirit'),
    story: 'In the busy modern world, we forget how to breathe with the trees. "Nature Spirit" represents my private escape into the deep green forests. I used thin, atmospheric glazes of Studio Mist and earthen pigment to let the light appear as if it is emanating directly from the canvas itself.',
    featured: true
  },
  {
    id: 'abstract-soul',
    artistId: 'tanveen',
    title: 'Abstract Soul',
    description: 'Raw tactile textures, bold knife strokes, and geometric anchors exploring the landscapes of the inner self.',
    coverImage: getArtworkSvg('abstract', 'Abstract Soul'),
    story: 'These works represent the moments where words failed me entirely. By discarding recognizable shapes, I allow the heavy texture, pure Carmine Red accents, and balanced charcoal outlines to speak directly to the viewer’s subconscious. It is art felt, not just seen.',
    featured: true
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'whisper-of-the-ocean',
    artistId: 'tanveen',
    title: 'Whisper of the Ocean',
    year: '2026',
    medium: 'Acrylic and Sea Salt on Heavy Canvas',
    size: '48 × 36 inches',
    price: 2400,
    isOriginal: true,
    isSold: false,
    collectionId: 'ocean-dreams',
    description: 'An immersive seascape capturing the serene light of dawn blending into coastal waters, textured with actual hand-harvested sea salt grains to create a tactile surface.',
    story: 'This was painted in early January as the winter mist lifted from the Cox’s Bazar shore. I blended hand-harvested sea salt directly into the final layers of acrylic glaze. When the room light shifts, the crystalline grains catch the light, mirroring the shimmer of actual wet sand.',
    artistNotes: 'Try hanging this in a space that receives natural morning light. The golden pigments are highly light-sensitive and will reveal deep coral undertones as the sun rises.',
    image: getArtworkSvg('ocean', 'Whisper of the Ocean'),
    orientation: 'portrait',
    featured: true,
    theme: 'Seascape',
    limitedEditionSize: 50,
    printsAvailable: true,
    printPrice: 180,
    locationInspiration: 'Cox’s Bazar Coast, Bangladesh',
    moodTags: ['Calm', 'Contemplative', 'Luxurious', 'Tactile'],
    handwrittenNote: "The ocean doesn't argue with the shore, it simply embraces it. This piece is my prayer for that kind of acceptance."
  },
  {
    id: 'mist-over-the-canopy',
    artistId: 'tanveen',
    title: 'Mist Over the Canopy',
    year: '2025',
    medium: 'Mixed Media and Gold Leaf on Wood Panel',
    size: '40 × 40 inches',
    price: 1950,
    isOriginal: true,
    isSold: false,
    collectionId: 'nature-spirit',
    description: 'An ethereal landscape representing sunlight piercing through heavy forest fog, highlighted with delicate layers of 24k gold leaf.',
    story: 'While staying in Sreemangal, I watched the morning fog drape over the tea gardens and dense forest canopies. I wanted to capture that precise moment of silent breakthrough—when the golden warmth first tears through the cool mist.',
    artistNotes: 'Framed in a custom floating raw oak frame. The gold leaf detailing is hand-applied and reflects warm light beautifully under spotlights.',
    image: getArtworkSvg('forest', 'Mist Over the Canopy'),
    orientation: 'square',
    featured: true,
    theme: 'Landscape',
    printsAvailable: false,
    locationInspiration: 'Sreemangal Forests',
    moodTags: ['Mystical', 'Warm', 'Ethereal', 'Organic'],
    handwrittenNote: "In the silence of the canopy, I found the answers I wasn't even brave enough to ask out loud."
  },
  {
    id: 'crimson-solitude',
    artistId: 'tanveen',
    title: 'Crimson Solitude',
    year: '2026',
    medium: 'Heavy Impasto Acrylic on Canvas',
    size: '30 × 40 inches',
    price: 1650,
    isOriginal: true,
    isSold: true, // Marked as Sold for testing the sold overlay!
    collectionId: 'abstract-soul',
    description: 'A powerful abstract piece dominated by textured strokes of Signature Carmine Red, balanced by deep charcoal ink fields and soft white breathing room.',
    story: 'This piece was born out of intense isolation. By limiting my palette strictly to Carmine, Charcoal, and Soft White, I forced myself to focus purely on the energy of the stroke itself. The heavy impasto was applied using a stainless steel palette knife in rapid, passionate movements.',
    artistNotes: 'This work is pre-sold to a private collector in Singapore, but limited canvas prints are available to purchase.',
    image: getArtworkSvg('abstract', 'Crimson Solitude'),
    orientation: 'landscape',
    featured: true,
    theme: 'Abstract',
    limitedEditionSize: 25,
    printsAvailable: true,
    printPrice: 150,
    moodTags: ['Bold', 'Passionate', 'Minimalist', 'Brutalist'],
    handwrittenNote: "True strength isn't shouting in a crowd. It's standing alone, vibrant and unyielding, in absolute silence."
  },
  {
    id: 'golden-hour-tides',
    artistId: 'tanveen',
    title: 'Golden Hour Tides',
    year: '2025',
    medium: 'Acrylic and Fine Mica Dust on Canvas',
    size: '60 × 40 inches',
    price: 3200,
    isOriginal: true,
    isSold: false,
    collectionId: 'ocean-dreams',
    description: 'An expansive horizontal landscape focusing on the glowing sunset reflections on flat wet sands, shimmering with integrated gold mica particles.',
    story: 'I spent hours watching the tide recede during golden hour, leaving a glass-like sheet of water on the sand. This canvas uses ultra-fine mica dust to create a high-gloss horizontal band that mirrors that exact water-lens effect.',
    artistNotes: 'This is my largest canvas of 2025. It acts as an incredible statement centerpiece for a minimalist dining or living room.',
    image: getArtworkSvg('minimalist', 'Golden Hour Tides'),
    orientation: 'landscape',
    featured: false,
    theme: 'Seascape',
    printsAvailable: true,
    printPrice: 220,
    locationInspiration: 'Inani Beach Sandbar',
    moodTags: ['Harmonious', 'Serene', 'Spacious', 'Luminous'],
    handwrittenNote: "For a brief five minutes every evening, the sky and the earth become one single mirror. That is where I live."
  },
  {
    id: 'abstract-echoes',
    artistId: 'tanveen',
    title: 'Abstract Echoes',
    year: '2026',
    medium: 'Acrylic Ink and Pastel on Canvas Board',
    size: '24 × 24 inches',
    price: 950,
    isOriginal: true,
    isSold: false,
    collectionId: 'abstract-soul',
    description: 'An elegant, smaller-scale study of interlocking circles, raw graphite sketch lines, and subtle Columbia Blue overlays.',
    story: 'Painted while listening to minimalist piano compositions, this artwork explores visual rhythm and repetition. Each circle is hand-drawn and layered beneath subsequent washes of diluted acrylic ink.',
    artistNotes: 'An excellent piece to start your original art collection. Pairs beautifully with modern, dark-toned interior accents.',
    image: getArtworkSvg('minimalist', 'Abstract Echoes'),
    orientation: 'square',
    featured: false,
    theme: 'Abstract',
    printsAvailable: false,
    moodTags: ['Rhythmic', 'Minimalist', 'Intellectual', 'Calm']
  },
  {
    id: 'echoes-of-the-monsoon',
    artistId: 'tanveen',
    title: 'Echoes of the Monsoon',
    year: '2026',
    medium: 'Mixed Media, Natural Soil Pigment and Rainwater on Linen',
    size: '36 × 48 inches',
    price: 2100,
    isOriginal: true,
    isSold: false,
    collectionId: 'nature-spirit',
    description: 'An atmospheric, deeply evocative piece studying monsoon rain runs, crafted using natural pigments gathered from Sreemangal hills.',
    story: 'To capture the visceral experience of the heavy rainfall seasons, I exposed this fine linen canvas directly to the first monsoon shower of 2026. The rainwater washed through hand-crushed clay earth pigments and rich charcoal ink, drawing its own organic sediment lines across the texture.',
    artistNotes: 'Exhibited at the Dhaka Art Summit. Framed inside a high-end shadowbox of raw bleached maple. It is highly recommended to display this piece with minimal side-spotlighting to reveal the complex, delicate runs.',
    image: getArtworkSvg('monsoon', 'Echoes of the Monsoon'),
    orientation: 'portrait',
    featured: true,
    theme: 'Landscape',
    limitedEditionSize: 50,
    printsAvailable: true,
    printPrice: 170,
    locationInspiration: 'Sreemangal Highlands',
    moodTags: ['Ethereal', 'Tactile', 'Contemplative', 'Organic'],
    handwrittenNote: "The sky poured, and the canvas simply listened. We do not paint nature; we let nature leave its signature on our soul."
  }
];

export const INITIAL_JOURNAL: JournalPost[] = [
  {
    id: 'incorporating-sea-salt-texture',
    artistId: 'tanveen',
    title: 'Texture & Tide: Blending Sea Salt into Canvas Acrylics',
    excerpt: 'An inside look into my studio experiments with natural crystals, harvesting salt from Inani, and achieving a shimmering, tactile marine surface.',
    content: `
### The Tactile Imperative

For years, I felt frustrated by the flat surface of traditional acrylic paints. When you look at the ocean, you don't just see a color; you feel the dense, mineral weight of the water and the crystalline sparkle of dried salt on your skin. 

During my winter residency at Inani Beach, I decided to bridge this gap. I began harvesting raw sea salt directly from the tide pools. 

### The Studio Experiment

Using salt in paint is tricky. Salt is water-soluble; if you mix it directly with water-based acrylics, the crystals dissolve, leaving only a bumpy residue. To prevent this, I developed a multi-step encapsulation process:

1. **Harvesting & Air-Drying**: The salt must be fully sun-baked on the studio terrace to remove all residual moisture.
2. **Encapsulation**: I suspend the dry crystals in a high-viscosity, non-diluted *Acrylic Gloss Gel Medium*. This locks each grain in a protective, clear polymer shell before it touches any pigment.
3. **Layering**: I apply this salt-textured medium using a soft rubber scraper, layering it over base colors of deep navy and Payne’s gray.

### The Shimmer Effect

The results exceeded my expectations. When dry, the gel medium is completely transparent, leaving the individual crystalline facets exposed. As natural morning light moves across the room, these salt crystals refract the light dynamically—replicating the precise, fleeting shimmer of wet sand under the coastal sun.

You can see this technique fully realized in my latest work, **"Whisper of the Ocean"**.
    `,
    category: 'Painting Process',
    readingTime: '5 min read',
    date: 'June 24, 2026',
    image: getArtworkSvg('ocean', 'Texture & Tide'),
    tags: ['Studio Diary', 'Acrylic Techniques', 'Cox’s Bazar', 'Textured Art'],
    relatedArtworkIds: ['whisper-of-the-ocean']
  },
  {
    id: 'sreemangal-mist-journal',
    artistId: 'tanveen',
    title: 'Chasing the Canopy Fog: Sreemangal Forest Sketches',
    excerpt: 'Studio notes on the color palette of green fog, painting with natural earthen pigments, and finding silence in the tea garden hills.',
    content: `
### Forest Silence

There is a specific silence that only exists in the deep woods of Sreemangal at 5:00 AM. The air is cool, heavy, and smells of wet loam and tea leaves. The fog doesn't just block your vision; it cushions sound, enclosing you in a private sanctuary.

I spent ten days sketching under the canopy, carrying only a sketchbook, charcoal, and water flasks.

### Building the Earthen Palette

Back in my studio, I wanted to paint this experience without relying on synthetic tube greens. I collected soil samples from the forest floor and ground them into fine powder, combining them with a clear acrylic binder.

*   **Studio Mist (#F0FFF0)**: Used as the base overlay to capture the wet, visual density of the fog.
*   **Charcoal Ink (#1B1B1B)**: Ground charcoal applied with flat natural bristles to draw the ancient, wet trunks.
*   **Columbia Blue (#C4D8E2)**: Diluted heavily to represent the cool, ambient air trapped beneath the leaves.

By layering these custom glazes, I built **"Mist Over the Canopy"**. The painting is not merely a portrait of the forest; it literally contains the soil and charcoal of the forest itself.
    `,
    category: 'Travel',
    readingTime: '4 min read',
    date: 'May 12, 2026',
    image: getArtworkSvg('forest', 'Chasing Canopy Fog'),
    tags: ['Travel Diary', 'Natural Pigments', 'Sreemangal', 'Inspiration'],
    relatedArtworkIds: ['mist-over-the-canopy']
  },
  {
    id: 'authentic-living-spaces',
    artistId: 'tanveen',
    title: 'The Living Room Gallery: Choosing & Hanging Statement Art',
    excerpt: 'An artist’s guide for collectors on matching large-scale canvas art with minimalist interior layouts, lighting, and scaling rules.',
    content: `
### Art is the Room's Anchor

A common mistake collectors make is buying a beautiful painting, only to hang it in a corner where it competes with clutter. Art should never be an afterthought. It should be the anchor around which the room breathes.

Here are three rules I share with collectors when acquiring large pieces like **"Golden Hour Tides"**:

### 1. The 60% Scale Rule
If you are hanging an artwork above a sofa, console table, or headboard, the width of the canvas should be approximately **60% to 75%** of the furniture’s total width. Anything smaller feels lost; anything larger overwhelms the furniture.

### 2. Negative Space is Active Space
Just as I leave "breathing room" of white paint on my canvases, you must leave empty wall space around the painting. Allow at least **12 to 18 inches** of blank wall on all sides. This empty boundary acts as a silent frame, focusing the viewer's attention entirely on the art.

### 3. Let there be (Controlled) Light
Never hang original paintings under direct, harsh afternoon sunlight, as UV rays can damage pigment over decades. Instead, prefer indirect natural light or install a dedicated overhead LED spotlight with a warm (2700K) color temperature. This keeps the color transitions organic and soft.
    `,
    category: 'Collector Stories',
    readingTime: '6 min read',
    date: 'April 05, 2026',
    image: getArtworkSvg('minimalist', 'Hanging Statement Art'),
    tags: ['Art Collecting', 'Interior Design', 'Hanging Guides', 'Lighting'],
    relatedArtworkIds: ['golden-hour-tides']
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'timeline-1',
    artistId: 'tanveen',
    year: '2018',
    title: 'Finding the Escape',
    description: 'Walked away from a decade-long corporate graphic design career in Dhaka. Built a modest timber table, bought my first rolls of heavy cotton canvas, and committed entirely to the unpredictable world of fine art.',
    iconType: 'palette'
  },
  {
    id: 'timeline-2',
    year: '2020',
    title: 'First Solo Exhibition: "Beneath the surface"',
    description: 'Debuted 22 heavily textured seascapes at the Bengal Gallery. All works were painted with a custom sea-salt blend, capturing the attention of national collectors and art critics.',
    iconType: 'brush'
  },
  {
    id: 'timeline-3',
    year: '2022',
    title: 'Cox’s Bazar Coastal Residency',
    description: 'Spent three months living in a beachside bamboo studio, painting exclusively outdoors during sunrise and sunset to study the transient nature of reflection and coastal mist.',
    iconType: 'globe'
  },
  {
    id: 'timeline-4',
    year: '2024',
    title: 'International Collectors Circle',
    description: 'Selected for the Curated South Asian Art Forum in Singapore. Received acquisition requests from private galleries in New York, London, and Tokyo, expanding the brand internationally.',
    iconType: 'award'
  },
  {
    id: 'timeline-5',
    year: '2026',
    title: 'The Living Gallery Launch',
    description: 'Designed and launched "Tanveen’s Art Escape," a premium editorial-first digital space to directly share original artwork, studio stories, and signed certificates of authenticity with global collectors.',
    iconType: 'star'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    artistId: 'tanveen',
    collectorName: 'Sarah K.',
    location: 'Singapore',
    quote: 'The moment I hung "Whisper of the Ocean" in my dining room, the entire energy of the apartment shifted. The light catches the subtle salt-grains in the morning, making it feel alive. Truly a masterpiece.',
    artworkTitle: 'Whisper of the Ocean',
    image: getArtworkSvg('ocean', 'Sarah\'s Dining Room')
  },
  {
    id: 'test-2',
    collectorName: 'David & Mina L.',
    location: 'London, UK',
    quote: 'As interior designers, we are highly selective about art. Tanveen’s editorial landscapes offer an unparalleled depth of storytelling. The golden leaf detailing is magnificent under spotlighting.',
    artworkTitle: 'Mist Over the Canopy',
    image: getArtworkSvg('forest', 'David\'s Living Room')
  },
  {
    id: 'test-3',
    collectorName: 'Tanvir Rahman',
    location: 'Dhaka, Bangladesh',
    quote: 'I have collected three of Tanveen’s abstract studies. The emotional power of her Crimson brushstrokes is incredible. The buying experience, complete with the signed Certificate of Authenticity, is flawless.',
    artworkTitle: 'Crimson Solitude',
    image: getArtworkSvg('abstract', 'Tanvir\'s Study')
  }
];
