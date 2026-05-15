import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Template configurations
const TEMPLATES = {
  priceFocus: {
    name: 'Price Focus',
    description: 'Foto rumah besar + Harga bold di tengah',
    theme: 'luxury',
    colors: { primary: '#C9A84C', secondary: '#1a1a1a', accent: '#FFD700' },
    layout: 'center-hero'
  },
  urgencyBomb: {
    name: 'Urgency Bomb',
    description: 'Split screen (foto + text besar)',
    theme: 'alert',
    colors: { primary: '#EF4444', secondary: '#FBBF24', accent: '#DC2626' },
    layout: 'split'
  },
  socialProof: {
    name: 'Social Proof',
    description: 'Foto + testimoni overlay',
    theme: 'trust',
    colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
    layout: 'overlay'
  },
  minimalistModern: {
    name: 'Minimalist Modern',
    description: 'Clean, whitespace banyak',
    theme: 'modern',
    colors: { primary: '#1a1a1a', secondary: '#6b7280', accent: '#f3f4f6' },
    layout: 'clean'
  },
  emotionalStory: {
    name: 'Emotional Story',
    description: 'Family happy + property',
    theme: 'warm',
    colors: { primary: '#F97316', secondary: '#FB923C', accent: '#FED7AA' },
    layout: 'story'
  },
  investmentAngle: {
    name: 'Investment Angle',
    description: 'Grafik/chart + property',
    theme: 'money',
    colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
    layout: 'chart'
  },
  comparison: {
    name: 'Comparison',
    description: 'Before/After atau vs kompetitor',
    theme: 'contrast',
    colors: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#A78BFA' },
    layout: 'compare'
  },
  questionHook: {
    name: 'Question Hook',
    description: 'Pertanyaan besar + foto',
    theme: 'bold',
    colors: { primary: '#F43F5E', secondary: '#FB7185', accent: '#FDA4AF' },
    layout: 'question'
  },
  numberList: {
    name: 'Number List',
    description: '"5 Alasan Beli..." + foto',
    theme: 'educational',
    colors: { primary: '#06B6D4', secondary: '#0891B2', accent: '#67E8F9' },
    layout: 'list'
  },
  videoThumbnail: {
    name: 'Video Thumbnail Style',
    description: 'YouTube-style dengan play button',
    theme: 'video',
    colors: { primary: '#FF0000', secondary: '#DC2626', accent: '#FCA5A5' },
    layout: 'youtube'
  }
};

// Emotional triggers data
const EMOTIONAL_TRIGGERS = {
  urgency: [
    { icon: '⏰', text: '3 Unit Tersisa!', type: 'countdown' },
    { icon: '🔥', text: 'Selling Fast', type: 'badge' },
    { icon: '⚡', text: 'Flash Deal - Hari Ini Saja', type: 'alert' },
    { icon: '📅', text: 'Harga Naik Besok!', type: 'warning' },
    { icon: '💥', text: 'Diskon Berakhir Dalam 24 Jam', type: 'urgent' }
  ],
  fomo: [
    { icon: '👥', text: '12 orang sedang melihat', type: 'social' },
    { icon: '📊', text: '85% Terjual', type: 'progress' },
    { icon: '🏆', text: 'Most Wanted Property', type: 'badge' },
    { icon: '💰', text: 'Investment Gain 30%/tahun', type: 'stats' },
    { icon: '🎯', text: 'Strategis Dekat Tol/Sekolah', type: 'location' }
  ],
  scarcity: [
    { icon: '🏠', text: 'Hanya 2 Unit Tersisa!', type: 'limited' },
    { icon: '⭐', text: 'Last Chance!', type: 'final' },
    { icon: '💎', text: 'Exclusive Offer', type: 'exclusive' },
    { icon: '⏱️', text: 'Limited Time Only', type: 'timer' }
  ]
};

// Auto-generate headlines based on property data
function generateHeadlines(property, targetType) {
  const headlines = [];
  const { name, type, price, dp, cicilan, kt, km, location } = property;
  
  // Price-focused headlines
  headlines.push({
    text: `Rp ${parseInt(price.replace(/\./g, '') / 1000000).toLocaleString()}Jt! Rumah Impian`,
    type: 'price',
    score: 85
  });
  
  // DP-focused headlines
  headlines.push({
    text: `DP ${parseInt(dp.replace(/\./g, '') / 1000000).toLocaleString()}Jt Punya Rumah!`,
    type: 'dp',
    score: 90
  });
  
  // Cicilan-focused headlines
  headlines.push({
    text: `Cicilan ${parseInt(cicilan.replace(/\./g, '') / 100000).toLocaleString()}rb/bln = Kost!`,
    type: 'installment',
    score: 88
  });
  
  // Family-focused headlines
  if (targetType === 'Keluarga Muda' || targetType === 'Pasangan Baru') {
    headlines.push({
      text: `${kt}KT ${km}KM - Perfect untuk Keluarga!`,
      type: 'family',
      score: 82
    });
  }
  
  // Investment-focused headlines
  if (targetType === 'Investor') {
    headlines.push({
      text: 'ROI 30%/Tahun - Investasi Terbaik!',
      type: 'investment',
      score: 92
    });
  }
  
  // Location-focused headlines
  headlines.push({
    text: `Lokasi Strategis ${location.split(',')[0]}`,
    type: 'location',
    score: 78
  });
  
  return headlines.sort((a, b) => b.score - a.score);
}

// Generate color palette based on property type and target
function generateColorPalette(propertyType, targetAudience, emotion) {
  const palettes = {
    luxury: { primary: '#C9A84C', secondary: '#1a1a1a', accent: '#FFD700', text: '#FFFFFF' },
    family: { primary: '#F97316', secondary: '#FB923C', accent: '#FED7AA', text: '#1a1a1a' },
    modern: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA', text: '#FFFFFF' },
    trust: { primary: '#10B981', secondary: '#059669', accent: '#34D399', text: '#FFFFFF' },
    urgency: { primary: '#EF4444', secondary: '#DC2626', accent: '#FCA5A5', text: '#FFFFFF' },
    investment: { primary: '#059669', secondary: '#10B981', accent: '#34D399', text: '#FFFFFF' }
  };
  
  let basePalette = palettes.modern;
  
  if (propertyType.includes('Premium') || propertyType.includes('Luxury')) {
    basePalette = palettes.luxury;
  } else if (targetAudience.includes('Keluarga') || targetAudience.includes('Pasangan')) {
    basePalette = palettes.family;
  } else if (targetAudience.includes('Investor')) {
    basePalette = palettes.investment;
  }
  
  if (emotion === 'urgency') {
    basePalette = palettes.urgency;
  } else if (emotion === 'trust') {
    basePalette = palettes.trust;
  }
  
  return basePalette;
}

// Calculate AI Thumbnail Score
function calculateThumbnailScore(thumbnailData) {
  let score = 100;
  const issues = [];
  
  // Readability check (text contrast)
  if (thumbnailData.textElements && thumbnailData.textElements.length > 0) {
    const hasGoodContrast = thumbnailData.textElements.every(el => 
      el.fontSize >= 24 || el.isBold
    );
    if (!hasGoodContrast) {
      score -= 15;
      issues.push('Text readability could be improved');
    }
  }
  
  // Visual balance check
  if (thumbnailData.elementsCount > 8) {
    score -= 10;
    issues.push('Too many elements, consider simplifying');
  }
  
  // Mobile-first check
  if (thumbnailData.mainTextLength > 35) {
    score -= 15;
    issues.push('Main text too long for mobile viewing');
  }
  
  // Best practices compliance
  if (!thumbnailData.hasCallToAction) {
    score -= 10;
    issues.push('Missing clear call-to-action');
  }
  
  if (!thumbnailData.hasPriceHighlight) {
    score -= 5;
    issues.push('Consider highlighting price or key number');
  }
  
  // Platform optimization
  if (thumbnailData.aspectRatio !== '16:9' && thumbnailData.platform === 'YouTube') {
    score -= 10;
    issues.push('Aspect ratio not optimized for YouTube');
  }
  
  return {
    score: Math.max(0, score),
    grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D',
    issues,
    recommendations: [
      issues.length === 0 ? 'Perfect! Ready to convert!' : issues[0],
      'Add urgency element for better CTR',
      'Test with A/B testing for optimal results'
    ].slice(0, 3)
  };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Return templates and configurations
    return res.status(200).json({
      templates: TEMPLATES,
      emotionalTriggers: EMOTIONAL_TRIGGERS,
      aspectRatios: {
        youtube: { width: 1280, height: 720, ratio: '16:9' },
        instagram: { width: 1080, height: 1080, ratio: '1:1' },
        tiktok: { width: 1080, height: 1920, ratio: '9:16' },
        facebook: { width: 1200, height: 628, ratio: '1.91:1' }
      }
    });
  }
  
  if (req.method === 'POST') {
    try {
      const {
        property,
        template,
        headline,
        subheadline,
        cta,
        emotionalTriggers,
        colors,
        platform = 'youtube',
        showBadge,
        badgeText,
        housePhoto,
        reviewPhoto,
        reviewName,
        reviewQuote
      } = req.body;
      
      // Validate required fields
      if (!property) {
        return res.status(400).json({ error: 'Property data is required' });
      }
      
      const templateConfig = TEMPLATES[template] || TEMPLATES.priceFocus;
      const palette = colors || generateColorPalette(property.type, 'Umum', 'neutral');
      
      // Get dimensions based on platform
      const dimensions = {
        youtube: { width: 1280, height: 720 },
        instagram: { width: 1080, height: 1080 },
        tiktok: { width: 1080, height: 1920 },
        facebook: { width: 1200, height: 628 }
      }[platform] || { width: 1280, height: 720 };
      
      // Generate SVG thumbnail
      const svgContent = generateThumbnailSVG({
        property,
        template: templateConfig,
        headline: headline || generateHeadlines(property, 'Umum')[0]?.text,
        subheadline: subheadline || `DP ${property.dp} | Cicilan ${property.cicilan}`,
        cta: cta || 'SEKARANG!',
        emotionalTriggers: emotionalTriggers || [],
        colors: palette,
        dimensions,
        showBadge,
        badgeText,
        housePhoto,
        reviewName,
        reviewQuote
      });
      
      // Convert SVG to PNG using sharp
      const pngBuffer = await sharp(Buffer.from(svgContent))
        .png()
        .toBuffer();
      
      // Calculate AI score
      const aiScore = calculateThumbnailScore({
        textElements: [{ fontSize: 48, isBold: true }],
        elementsCount: 5,
        mainTextLength: headline?.length || 30,
        hasCallToAction: !!cta,
        hasPriceHighlight: true,
        aspectRatio: platform === 'youtube' ? '16:9' : 'other',
        platform
      });
      
      // Return as base64 for frontend display
      const base64 = pngBuffer.toString('base64');
      
      return res.status(200).json({
        success: true,
        thumbnail: `data:image/png;base64,${base64}`,
        aiScore,
        metadata: {
          template: templateConfig.name,
          platform,
          dimensions,
          generatedAt: new Date().toISOString()
        },
        suggestions: {
          headlines: generateHeadlines(property, 'Umum').slice(0, 3),
          colors: [
            generateColorPalette(property.type, 'Umum', 'urgency'),
            generateColorPalette(property.type, 'Umum', 'trust'),
            generateColorPalette(property.type, 'Investor', 'neutral')
          ]
        }
      });
      
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return res.status(500).json({ 
        error: 'Failed to generate thumbnail',
        details: error.message 
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

// Generate SVG thumbnail based on template
function generateThumbnailSVG(config) {
  const {
    property,
    template,
    headline,
    subheadline,
    cta,
    emotionalTriggers,
    colors,
    dimensions,
    showBadge,
    badgeText,
    housePhoto,
    reviewPhoto,
    reviewName,
    reviewQuote
  } = config;
  
  const { width, height } = dimensions;
  const { primary, secondary, accent, text } = colors;
  
  // Create gradient definitions
  const gradients = `
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${text};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.5"/>
      </filter>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;
  
  // Background
  let background = `<rect width="${width}" height="${height}" fill="url(#bgGradient)"/>`;
  
  // Template-specific layouts
  let content = '';
  
  switch (template.layout) {
    case 'center-hero':
      content = `
        ${housePhoto ? `<!-- House Photo -->
        <image x="${width * 0.1}" y="${height * 0.15}" width="${width * 0.8}" height="${height * 0.5}" 
               href="${housePhoto}" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round 8)"/>
        ` : `<!-- Hero Image Placeholder -->
        <rect x="${width * 0.1}" y="${height * 0.15}" width="${width * 0.8}" height="${height * 0.5}"
              fill="${secondary}" opacity="0.3" rx="8"/>
        <text x="${width/2}" y="${height * 0.4}" text-anchor="middle"
              fill="${text}" font-size="24" font-weight="bold" opacity="0.5">
          🏠 ${property.name}
        </text>`}
        
        <!-- Price Badge Center -->
        <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) * 0.15}"
                fill="${accent}" filter="url(#glow)"/>
        <text x="${width/2}" y="${height/2 - 15}" text-anchor="middle"
              fill="${secondary}" font-size="28" font-weight="bold">Rp</text>
        <text x="${width/2}" y="${height/2 + 25}" text-anchor="middle"
              fill="${secondary}" font-size="42" font-weight="bold">
          ${parseInt(property.price.replace(/\./g, '') / 1000000)}Jt
        </text>
        
        ${reviewPhoto ? `<!-- Review Avatar -->
        <circle cx="${width * 0.15}" cy="${height * 0.85}" r="35" fill="#fff" stroke="${accent}" stroke-width="3"/>
        <image x="${width * 0.15}" y="${height * 0.85}" width="60" height="60"
               href="${reviewPhoto}" preserveAspectRatio="xMidYMid slice" clip-path="circle(30)"/>
        <text x="${width * 0.22}" y="${height * 0.82}" fill="${text}" font-size="14" font-weight="bold">⭐⭐⭐⭐⭐</text>
        <text x="${width * 0.22}" y="${height * 0.87}" fill="${text}" font-size="12" font-style="italic">${reviewQuote.substring(0, 40)}</text>
        <text x="${width * 0.22}" y="${height * 0.91}" fill="${accent}" font-size="11">- ${reviewName}</text>
        ` : ''}
      `;
      break;
      
    case 'split':
      content = `
        <!-- Left Side - Image -->
        <rect x="0" y="0" width="${width/2}" height="${height}" fill="${secondary}"/>
        <text x="${width/4}" y="${height/2}" text-anchor="middle" 
              fill="${text}" font-size="20" opacity="0.5">🏠</text>
        
        <!-- Right Side - Text -->
        <rect x="${width/2}" y="0" width="${width/2}" height="${height}" fill="${primary}"/>
        <text x="${width * 0.75}" y="${height * 0.3}" text-anchor="middle" 
              fill="${text}" font-size="36" font-weight="bold">${headline.substring(0, 30)}</text>
        <text x="${width * 0.75}" y="${height * 0.5}" text-anchor="middle" 
              fill="${accent}" font-size="48" font-weight="bold" filter="url(#glow)">
          ${subheadline.substring(0, 25)}
        </text>
      `;
      break;
      
    case 'overlay':
      content = `
        <!-- Full Background Image Placeholder -->
        ${housePhoto ? `<image width="${width}" height="${height}" href="${housePhoto}" preserveAspectRatio="xMidYMid slice"/>
        <rect width="${width}" height="${height}" fill="${secondary}" opacity="0.6"/>` : 
        `<rect width="${width}" height="${height}" fill="${secondary}" opacity="0.8"/>
        <text x="${width/2}" y="${height/2}" text-anchor="middle" fill="${text}" font-size="48" opacity="0.3">🏠</text>`}
        
        <!-- Review Card -->
        <rect x="${width * 0.1}" y="${height * 0.55}" width="${width * 0.8}" height="${height * 0.35}"
              fill="${primary}" rx="12" filter="url(#shadow)"/>
        ${reviewPhoto ? `<circle cx="${width * 0.2}" cy="${height * 0.68}" r="25" fill="#fff"/>
        <image x="${width * 0.2}" y="${height * 0.68}" width="45" height="45"
               href="${reviewPhoto}" preserveAspectRatio="xMidYMid slice" clip-path="circle(22)"/>
        ` : ''}
        <text x="${width * 0.28}" y="${height * 0.65}" fill="${text}" font-size="18" font-weight="bold">⭐⭐⭐⭐⭐</text>
        <text x="${width * 0.28}" y="${height * 0.72}" fill="${text}" font-size="14" font-style="italic">${reviewQuote ? reviewQuote.substring(0, 35) : '"Best investment ever!"'}</text>
        <text x="${width * 0.28}" y="${height * 0.8}" fill="${accent}" font-size="13">- ${reviewName || 'Happy Buyer'}</text>
        
        <!-- Main Headline -->
        <text x="${width/2}" y="${height * 0.35}" text-anchor="middle"
              fill="${text}" font-size="42" font-weight="bold" filter="url(#shadow)">
          ${headline.substring(0, 35)}
        </text>
      `;
      break;
      
    case 'youtube':
      content = `
        <!-- Background -->
        <rect width="${width}" height="${height}" fill="${secondary}"/>
        
        <!-- Play Button -->
        <circle cx="${width/2}" cy="${height/2}" r="60" fill="${primary}" opacity="0.9" filter="url(#glow)"/>
        <polygon points="${width/2 - 20},${height/2 - 35} ${width/2 - 20},${height/2 + 35} ${width/2 + 30},${height/2}" 
                 fill="${text}"/>
        
        <!-- Headline Top -->
        <text x="${width/2}" y="${height * 0.25}" text-anchor="middle" 
              fill="${text}" font-size="38" font-weight="bold">${headline.substring(0, 40)}</text>
        
        <!-- Subheadline Bottom -->
        <text x="${width/2}" y="${height * 0.75}" text-anchor="middle" 
              fill="${accent}" font-size="32" font-weight="bold">${subheadline.substring(0, 30)}</text>
      `;
      break;
      
    default:
      content = `
        <!-- Default Layout -->
        <rect x="${width * 0.05}" y="${height * 0.1}" width="${width * 0.9}" height="${height * 0.45}" 
              fill="${secondary}" opacity="0.5" rx="8"/>
        <text x="${width/2}" y="${height * 0.35}" text-anchor="middle" 
              fill="${text}" font-size="48" font-weight="bold" filter="url(#shadow)">
          ${headline.substring(0, 45)}
        </text>
        <text x="${width/2}" y="${height * 0.55}" text-anchor="middle" 
              fill="${accent}" font-size="36" font-weight="bold">
          ${subheadline.substring(0, 35)}
        </text>
      `;
  }
  
  // Add CTA button
  const ctaY = height * 0.85;
  const ctaWidth = 280;
  const ctaHeight = 70;
  const ctaX = (width - ctaWidth) / 2;
  
  const ctaButton = `
    <rect x="${ctaX}" y="${ctaY}" width="${ctaWidth}" height="${ctaHeight}" 
          fill="${accent}" rx="35" filter="url(#shadow)"/>
    <text x="${width/2}" y="${ctaY + 45}" text-anchor="middle" 
          fill="${secondary}" font-size="32" font-weight="bold">${cta}</text>
  `;
  
  // Add badges if enabled
  let badges = '';
  if (showBadge && badgeText) {
    badges = `
      <rect x="${width * 0.05}" y="${height * 0.05}" width="180" height="60" 
            fill="#EF4444" rx="8" transform="rotate(-5 ${width * 0.05 + 90} ${height * 0.05 + 30})"/>
      <text x="${width * 0.05 + 90}" y="${height * 0.05 + 40}" text-anchor="middle" 
            fill="white" font-size="20" font-weight="bold">${badgeText}</text>
    `;
  }
  
  // Add emotional triggers
  let triggers = '';
  if (emotionalTriggers && emotionalTriggers.length > 0) {
    emotionalTriggers.slice(0, 2).forEach((trigger, index) => {
      const triggerX = width - 220 - (index * 20);
      const triggerY = height * 0.1 + (index * 70);
      triggers += `
        <rect x="${triggerX}" y="${triggerY}" width="200" height="55" 
              fill="${primary}" opacity="0.9" rx="28"/>
        <text x="${triggerX + 100}" y="${triggerY + 35}" text-anchor="middle" 
              fill="${text}" font-size="18" font-weight="600">
          ${trigger.icon} ${trigger.text.substring(0, 25)}
        </text>
      `;
    });
  }
  
  // Assemble final SVG
  return `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
         xmlns="http://www.w3.org/2000/svg">
      ${gradients}
      ${background}
      ${content}
      ${badges}
      ${triggers}
      ${ctaButton}
    </svg>`;
}
