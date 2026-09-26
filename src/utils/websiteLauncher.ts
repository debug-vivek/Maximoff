// Universal Web Launcher & Popular Websites Registry for Maximoff AI
// Enables opening any popular website (Spotify, Amazon, YouTube, Netflix, Reddit, GitHub, etc.)
// and handles browser popup blocker fallbacks seamlessly.

export interface PopularWebsite {
  id: string;
  name: string;
  category: 'Music & Audio' | 'Shopping & Retail' | 'Streaming & Video' | 'Social & Comms' | 'Developer & Tech' | 'Google Services' | 'AI & Tools' | 'News & Knowledge' | 'Productivity';
  canonicalUrl: string;
  searchUrlTemplate?: string;
  description: string;
  aliases: string[];
  badge?: string;
  colorHex?: string;
}

export const POPULAR_WEBSITES: PopularWebsite[] = [
  // Music & Audio
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Music & Audio',
    canonicalUrl: 'https://open.spotify.com',
    searchUrlTemplate: 'https://open.spotify.com/search/{query}',
    description: 'Digital music, podcast, and streaming platform',
    aliases: ['spotify', 'spotify.com', 'open.spotify.com', 'spot'],
    colorHex: '#1db954',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    category: 'Music & Audio',
    canonicalUrl: 'https://soundcloud.com',
    searchUrlTemplate: 'https://soundcloud.com/search?q={query}',
    description: 'Global online audio distribution and music sharing',
    aliases: ['soundcloud', 'sound cloud', 'soundcloud.com'],
    colorHex: '#ff5500',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    category: 'Music & Audio',
    canonicalUrl: 'https://music.apple.com',
    description: 'Music and video streaming service by Apple',
    aliases: ['apple music', 'applemusic', 'music.apple.com'],
    colorHex: '#fa243c',
  },

  // Shopping & Retail
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Shopping & Retail',
    canonicalUrl: 'https://www.amazon.com',
    searchUrlTemplate: 'https://www.amazon.com/s?k={query}',
    description: 'Global online retail, cloud services, and marketplace',
    aliases: ['amazon', 'amazon.com', 'amzn', 'amazon shopping', 'shop amazon'],
    colorHex: '#ff9900',
  },
  {
    id: 'ebay',
    name: 'eBay',
    category: 'Shopping & Retail',
    canonicalUrl: 'https://www.ebay.com',
    searchUrlTemplate: 'https://www.ebay.com/sch/i.html?_nkw={query}',
    description: 'Global consumer-to-consumer and business e-commerce auction',
    aliases: ['ebay', 'ebay.com'],
    colorHex: '#e53238',
  },
  {
    id: 'walmart',
    name: 'Walmart',
    category: 'Shopping & Retail',
    canonicalUrl: 'https://www.walmart.com',
    searchUrlTemplate: 'https://www.walmart.com/search?q={query}',
    description: 'Department store and e-commerce hypermarket',
    aliases: ['walmart', 'walmart.com'],
    colorHex: '#0071dc',
  },
  {
    id: 'target',
    name: 'Target',
    category: 'Shopping & Retail',
    canonicalUrl: 'https://www.target.com',
    searchUrlTemplate: 'https://www.target.com/s?searchTerm={query}',
    description: 'American retail corporation and online catalog',
    aliases: ['target', 'target.com'],
    colorHex: '#cc0000',
  },
  {
    id: 'bestbuy',
    name: 'Best Buy',
    category: 'Shopping & Retail',
    canonicalUrl: 'https://www.bestbuy.com',
    searchUrlTemplate: 'https://www.bestbuy.com/site/searchpage.jsp?st={query}',
    description: 'Consumer electronics, computers, and appliances',
    aliases: ['best buy', 'bestbuy', 'bestbuy.com'],
    colorHex: '#ffe000',
  },
  {
    id: 'etsy',
    name: 'Etsy',
    category: 'Shopping & Retail',
    canonicalUrl: 'https://www.etsy.com',
    searchUrlTemplate: 'https://www.etsy.com/search?q={query}',
    description: 'Handmade, vintage items, and craft supplies',
    aliases: ['etsy', 'etsy.com'],
    colorHex: '#f1641e',
  },

  // Streaming & Video
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Streaming & Video',
    canonicalUrl: 'https://www.youtube.com',
    searchUrlTemplate: 'https://www.youtube.com/results?search_query={query}',
    description: 'Online video sharing and social media platform',
    aliases: ['youtube', 'yt', 'youtube.com', 'you tube'],
    colorHex: '#ff0000',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Streaming & Video',
    canonicalUrl: 'https://www.netflix.com',
    description: 'Subscription video-on-demand streaming service',
    aliases: ['netflix', 'netflix.com'],
    colorHex: '#e50914',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'Streaming & Video',
    canonicalUrl: 'https://www.twitch.tv',
    searchUrlTemplate: 'https://www.twitch.tv/search?term={query}',
    description: 'Live streaming service for gamers and creators',
    aliases: ['twitch', 'twitch.tv', 'twitch tv'],
    colorHex: '#9146ff',
  },
  {
    id: 'disneyplus',
    name: 'Disney+',
    category: 'Streaming & Video',
    canonicalUrl: 'https://www.disneyplus.com',
    description: 'Disney, Pixar, Marvel, Star Wars, and NatGeo streaming',
    aliases: ['disney', 'disney+', 'disney plus', 'disneyplus.com'],
    colorHex: '#113ccf',
  },
  {
    id: 'hulu',
    name: 'Hulu',
    category: 'Streaming & Video',
    canonicalUrl: 'https://www.hulu.com',
    description: 'Television shows, films, and original programming',
    aliases: ['hulu', 'hulu.com'],
    colorHex: '#1ce783',
  },
  {
    id: 'max',
    name: 'Max (HBO)',
    category: 'Streaming & Video',
    canonicalUrl: 'https://www.max.com',
    description: 'HBO, Warner Bros, Discovery streaming platform',
    aliases: ['max', 'hbo', 'hbo max', 'max.com'],
    colorHex: '#002be7',
  },

  // Google Ecosystem
  {
    id: 'google',
    name: 'Google Search',
    category: 'Google Services',
    canonicalUrl: 'https://www.google.com',
    searchUrlTemplate: 'https://www.google.com/search?q={query}',
    description: 'World leading web search engine and information index',
    aliases: ['google', 'google.com', 'google search'],
    colorHex: '#4285f4',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Google Services',
    canonicalUrl: 'https://mail.google.com',
    description: 'Secure, smart webmail client by Google',
    aliases: ['gmail', 'google mail', 'mail.google.com'],
    colorHex: '#ea4335',
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    category: 'Google Services',
    canonicalUrl: 'https://maps.google.com',
    searchUrlTemplate: 'https://www.google.com/maps/search/{query}',
    description: 'Satellite imagery, aerial photography, and street maps',
    aliases: ['google maps', 'maps', 'maps.google.com', 'gmaps'],
    colorHex: '#34a853',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'Google Services',
    canonicalUrl: 'https://drive.google.com',
    description: 'Cloud file storage and synchronization service',
    aliases: ['google drive', 'drive', 'drive.google.com', 'gdrive'],
    colorHex: '#fbbc05',
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    category: 'Google Services',
    canonicalUrl: 'https://docs.google.com',
    description: 'Collaborative real-time cloud document editor',
    aliases: ['google docs', 'docs', 'docs.google.com', 'gdocs'],
    colorHex: '#4285f4',
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    category: 'Google Services',
    canonicalUrl: 'https://sheets.google.com',
    description: 'Cloud spreadsheets and data calculations',
    aliases: ['google sheets', 'sheets', 'sheets.google.com'],
    colorHex: '#0f9d58',
  },
  {
    id: 'chrome-store',
    name: 'Chrome Web Store',
    category: 'Google Services',
    canonicalUrl: 'https://chromewebstore.google.com',
    description: 'Extensions, themes, and apps for Google Chrome',
    aliases: ['chrome web store', 'chrome store', 'chrome extensions', 'chromewebstore.google.com'],
    colorHex: '#4285f4',
  },

  // Social & Comms
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'Social & Comms',
    canonicalUrl: 'https://www.reddit.com',
    searchUrlTemplate: 'https://www.reddit.com/search/?q={query}',
    description: 'Network of communities where people dive into interests',
    aliases: ['reddit', 'reddit.com'],
    colorHex: '#ff4500',
  },
  {
    id: 'x-twitter',
    name: 'X (formerly Twitter)',
    category: 'Social & Comms',
    canonicalUrl: 'https://x.com',
    searchUrlTemplate: 'https://x.com/search?q={query}',
    description: 'Real-time news, commentary, and public discourse',
    aliases: ['x', 'twitter', 'x.com', 'twitter.com'],
    colorHex: '#ffffff',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Social & Comms',
    canonicalUrl: 'https://discord.com/app',
    description: 'Voice, video, and text communication service',
    aliases: ['discord', 'discord.com', 'discord app'],
    colorHex: '#5865f2',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Web',
    category: 'Social & Comms',
    canonicalUrl: 'https://web.whatsapp.com',
    description: 'Fast, simple, secure messaging and calling',
    aliases: ['whatsapp', 'whatsapp web', 'web.whatsapp.com'],
    colorHex: '#25d366',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social & Comms',
    canonicalUrl: 'https://www.instagram.com',
    description: 'Photo and video sharing social networking service',
    aliases: ['instagram', 'insta', 'instagram.com', 'ig'],
    colorHex: '#e1306c',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Social & Comms',
    canonicalUrl: 'https://www.linkedin.com',
    description: 'Professional networking and career community',
    aliases: ['linkedin', 'linkedin.com'],
    colorHex: '#0a66c2',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social & Comms',
    canonicalUrl: 'https://www.facebook.com',
    description: 'Connect with friends, family, and shared communities',
    aliases: ['facebook', 'fb', 'facebook.com'],
    colorHex: '#1877f2',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'Social & Comms',
    canonicalUrl: 'https://www.pinterest.com',
    searchUrlTemplate: 'https://www.pinterest.com/search/pins/?q={query}',
    description: 'Visual discovery engine for recipes, home, and style',
    aliases: ['pinterest', 'pinterest.com'],
    colorHex: '#bd081c',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Social & Comms',
    canonicalUrl: 'https://www.tiktok.com',
    description: 'Short-form mobile video platform',
    aliases: ['tiktok', 'tik tok', 'tiktok.com'],
    colorHex: '#000000',
  },

  // Developer & Tech
  {
    id: 'github',
    name: 'GitHub',
    category: 'Developer & Tech',
    canonicalUrl: 'https://github.com',
    searchUrlTemplate: 'https://github.com/search?q={query}',
    description: 'Developer platform for code hosting, review, and CI/CD',
    aliases: ['github', 'github.com', 'git hub'],
    colorHex: '#2dba4e',
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    category: 'Developer & Tech',
    canonicalUrl: 'https://stackoverflow.com',
    searchUrlTemplate: 'https://stackoverflow.com/search?q={query}',
    description: 'Q&A community for professional and enthusiast programmers',
    aliases: ['stack overflow', 'stackoverflow', 'stackoverflow.com', 'stack'],
    colorHex: '#f48024',
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'Developer & Tech',
    canonicalUrl: 'https://www.figma.com',
    description: 'Collaborative interface design and prototyping tool',
    aliases: ['figma', 'figma.com'],
    colorHex: '#f24e1e',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Developer & Tech',
    canonicalUrl: 'https://vercel.com',
    description: 'Frontend cloud platform for static & Serverless apps',
    aliases: ['vercel', 'vercel.com'],
    colorHex: '#000000',
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'Developer & Tech',
    canonicalUrl: 'https://www.apple.com',
    description: 'Hardware, software, and services ecosystem',
    aliases: ['apple', 'apple.com'],
    colorHex: '#a2aaad',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    category: 'Developer & Tech',
    canonicalUrl: 'https://www.microsoft.com',
    description: 'Technology corporation, Windows, Azure, and Surface',
    aliases: ['microsoft', 'microsoft.com', 'msft'],
    colorHex: '#00a4ef',
  },

  // AI & Tools
  {
    id: 'chatgpt',
    name: 'ChatGPT / OpenAI',
    category: 'AI & Tools',
    canonicalUrl: 'https://chatgpt.com',
    description: 'Conversational artificial intelligence by OpenAI',
    aliases: ['chatgpt', 'chat gpt', 'openai', 'chat.openai.com', 'chatgpt.com'],
    colorHex: '#10a37f',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'AI & Tools',
    canonicalUrl: 'https://gemini.google.com',
    description: 'Direct generative AI assistant by Google',
    aliases: ['gemini', 'google gemini', 'gemini.google.com', 'bard'],
    colorHex: '#1a73e8',
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    category: 'AI & Tools',
    canonicalUrl: 'https://claude.ai',
    description: 'Next-generation AI assistant by Anthropic',
    aliases: ['claude', 'claude.ai', 'anthropic'],
    colorHex: '#d97757',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    category: 'AI & Tools',
    canonicalUrl: 'https://www.perplexity.ai',
    description: 'AI conversational search and answer engine',
    aliases: ['perplexity', 'perplexity.ai'],
    colorHex: '#20b2aa',
  },

  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    category: 'Productivity',
    canonicalUrl: 'https://www.notion.so',
    description: 'Connected workspace for wiki, docs, and projects',
    aliases: ['notion', 'notion.so'],
    colorHex: '#000000',
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'Productivity',
    canonicalUrl: 'https://www.canva.com',
    description: 'Visual communications and graphic design platform',
    aliases: ['canva', 'canva.com'],
    colorHex: '#7d2ae8',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Productivity',
    canonicalUrl: 'https://slack.com',
    description: 'Productivity platform for teams and organizations',
    aliases: ['slack', 'slack.com'],
    colorHex: '#4a154b',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Productivity',
    canonicalUrl: 'https://www.dropbox.com',
    description: 'Cloud file hosting and collaboration',
    aliases: ['dropbox', 'dropbox.com'],
    colorHex: '#0061ff',
  },

  // News & Knowledge
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    category: 'News & Knowledge',
    canonicalUrl: 'https://www.wikipedia.org',
    searchUrlTemplate: 'https://en.wikipedia.org/wiki/Special:Search?search={query}',
    description: 'The free encyclopedia that anyone can edit',
    aliases: ['wikipedia', 'wiki', 'wikipedia.org', 'en.wikipedia.org'],
    colorHex: '#636466',
  },
  {
    id: 'bbc',
    name: 'BBC News',
    category: 'News & Knowledge',
    canonicalUrl: 'https://www.bbc.com/news',
    description: 'Breaking world news, sport, and analysis',
    aliases: ['bbc', 'bbc news', 'bbc.com'],
    colorHex: '#bb1919',
  },
  {
    id: 'cnn',
    name: 'CNN',
    category: 'News & Knowledge',
    canonicalUrl: 'https://www.cnn.com',
    description: 'American cable news and global reporting',
    aliases: ['cnn', 'cnn.com'],
    colorHex: '#cc0000',
  },
  {
    id: 'nytimes',
    name: 'The New York Times',
    category: 'News & Knowledge',
    canonicalUrl: 'https://www.nytimes.com',
    description: 'In-depth global news, investigative reporting, and culture',
    aliases: ['nyt', 'nytimes', 'new york times', 'nytimes.com'],
    colorHex: '#000000',
  },
];

export interface WebsiteLaunchResult {
  isMatch: boolean;
  name: string;
  url: string;
  siteId?: string;
  category?: string;
  isPopularPreset: boolean;
  searchTerm?: string;
  confirmationMessage: string;
  actionTag: string;
  buttonLabel: string;
}

/**
 * Universal Intent Parser for opening any website or URL
 * Recognizes commands like:
 * - "open spotify" / "open spotify daft punk"
 * - "open amazon" / "open amazon laptop stand"
 * - "open netflix"
 * - "open youtube"
 * - "launch github"
 * - "go to reddit"
 * - "open https://example.com"
 * - "open anywebsite.com"
 * - "open <brand>"
 */
export function resolveWebsiteLaunch(inputQuery: string): WebsiteLaunchResult | null {
  if (!inputQuery) return null;
  const raw = inputQuery.trim();
  const lower = raw.toLowerCase();

  // Strip conversational prefixes
  let cleaned = lower
    .replace(/^(hey\s+)?maximoff[,:\s]*/i, '')
    .replace(/^(please\s+|can\s+you\s+|could\s+you\s+|i\s+command\s+you\s+to\s+)/i, '')
    .trim();

  // Check if intent is a launch command
  const launchPrefixRegex = /^(open|launch|go\s+to|visit|browse|navigate\s+to|access|start|run)\s+/i;
  const hasLaunchPrefix = launchPrefixRegex.test(cleaned);

  // If starts with launch prefix, strip it to get the target
  let target = cleaned;
  if (hasLaunchPrefix) {
    target = cleaned.replace(launchPrefixRegex, '').trim();
  } else {
    // If no prefix, check if it's explicitly a direct site name (e.g. "spotify", "amazon.com", "open spotify")
    const isDirectDomain = /^[a-z0-9-]+(\.[a-z]{2,})+(\/.*)?$/i.test(target);
    const matchesPresetExact = POPULAR_WEBSITES.some((s) => s.aliases.includes(target));
    if (!isDirectDomain && !matchesPresetExact) {
      // Check if it starts with "play on [site]" or "shop on [site]"
      if (/^(play\s+(on\s+)?|shop\s+(on\s+)?|listen\s+(to\s+)?)/i.test(cleaned)) {
        target = cleaned.replace(/^(play\s+(on\s+)?|shop\s+(on\s+)?|listen\s+(to\s+)?)/i.test(cleaned) ? /^(play\s+(on\s+)?|shop\s+(on\s+)?|listen\s+(to\s+)?)/i : '', '').trim();
      } else {
        return null;
      }
    }
  }

  if (!target) return null;

  // Check if target is a raw URL
  if (/^https?:\/\//i.test(target)) {
    const domainName = target.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0];
    return {
      isMatch: true,
      name: domainName,
      url: target,
      isPopularPreset: false,
      confirmationMessage: `Opening external portal ${domainName} in a new window, Sir.`,
      actionTag: `UPLINK: ${domainName.toUpperCase()}`,
      buttonLabel: `Launch ${domainName} ↗`,
    };
  }

  // Check if target has a top-level domain e.g. "coursera.org" or "spotify.com"
  if (/^[a-z0-9-]+(\.[a-z]{2,})+(\/.*)?$/i.test(target)) {
    const fullUrl = `https://${target}`;
    const domainName = target.split('/')[0];
    // Check if this domain matches any popular site
    const matched = POPULAR_WEBSITES.find((s) => s.aliases.some((a) => a === target || a === domainName));
    return {
      isMatch: true,
      name: matched ? matched.name : domainName,
      url: fullUrl,
      siteId: matched?.id,
      category: matched?.category,
      isPopularPreset: !!matched,
      confirmationMessage: `Opening ${matched ? matched.name : domainName} directly in a new window, Sir.`,
      actionTag: `TASK EXECUTED: ${matched ? matched.name.toUpperCase() : domainName.toUpperCase()} LAUNCHED`,
      buttonLabel: `Launch ${matched ? matched.name : domainName} ↗`,
    };
  }

  // Check against our registry of popular websites
  // Target could have a search parameter, e.g. "spotify daft punk" or "amazon gaming laptop"
  let matchedSite: PopularWebsite | undefined;
  let remainingQuery = '';

  for (const site of POPULAR_WEBSITES) {
    for (const alias of site.aliases) {
      if (target === alias) {
        matchedSite = site;
        remainingQuery = '';
        break;
      }
      if (target.startsWith(alias + ' ')) {
        matchedSite = site;
        remainingQuery = target.slice(alias.length).trim();
        break;
      }
    }
    if (matchedSite) break;
  }

  if (matchedSite) {
    let finalUrl = matchedSite.canonicalUrl;
    let desc = `Opening ${matchedSite.name} for you now, Sir. You can access the direct portal link below.`;

    if (remainingQuery && matchedSite.searchUrlTemplate) {
      finalUrl = matchedSite.searchUrlTemplate.replace('{query}', encodeURIComponent(remainingQuery));
      desc = `Accessing ${matchedSite.name} and searching for "${remainingQuery}", Sir.`;
    }

    return {
      isMatch: true,
      name: matchedSite.name,
      url: finalUrl,
      siteId: matchedSite.id,
      category: matchedSite.category,
      isPopularPreset: true,
      searchTerm: remainingQuery || undefined,
      confirmationMessage: desc,
      actionTag: `TASK EXECUTED: ${matchedSite.name.toUpperCase()} LAUNCHED`,
      buttonLabel: remainingQuery
        ? `Launch ${matchedSite.name} ("${remainingQuery}") ↗`
        : `Launch ${matchedSite.name} in New Window ↗`,
    };
  }

  // If the command had an explicit launch verb like "open [something]", resolve dynamically!
  if (hasLaunchPrefix) {
    // Single word brand e.g. "open bestbuy" or "open tesla" or "open airbnb"
    const singleWord = target.split(/\s+/)[0];
    const rest = target.slice(singleWord.length).trim();

    // Common brand domain pattern: https://www.[brand].com
    const guessUrl = `https://www.${singleWord}.com${rest ? `/search?q=${encodeURIComponent(rest)}` : ''}`;
    const capitalized = singleWord.charAt(0).toUpperCase() + singleWord.slice(1);

    return {
      isMatch: true,
      name: capitalized,
      url: guessUrl,
      isPopularPreset: false,
      confirmationMessage: `Executing web navigation to ${capitalized} (${guessUrl}), Sir.`,
      actionTag: `TASK EXECUTED: ${capitalized.toUpperCase()} LAUNCHED`,
      buttonLabel: `Launch ${capitalized} ↗`,
    };
  }

  return null;
}

/**
 * Universal browser-safe URL launcher with multi-tier popup fallback
 */
export function openExternalUrlSafely(url: string): { opened: boolean; reason?: string } {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win && !win.closed) {
      return { opened: true };
    }

    // Secondary fallback: programmatic anchor click
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return { opened: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn('Popup launch blocked or restricted:', errorMessage);
    // Tertiary attempt
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return { opened: true };
    } catch {
      return { opened: false, reason: 'Browser popup blocker restricted direct script launch.' };
    }
  }
}
