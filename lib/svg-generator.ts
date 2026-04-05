import { GitHubStats, calculateTrophyLevel, getTrophyColor, getTrophyName } from './github-types';

export function generateTrophySvg(stats: GitHubStats, theme: 'light' | 'dark' = 'dark'): string {
  const bgColor = theme === 'dark' ? '#0d1117' : '#ffffff';
  const textColor = theme === 'dark' ? '#c9d1d9' : '#24292f';
  const borderColor = theme === 'dark' ? '#30363d' : '#d0d7de';
  const cardBg = theme === 'dark' ? '#161b22' : '#f6f8fa';

  const trophies = [
    { title: 'Commits', value: stats.commits, level: calculateTrophyLevel(stats.commits, [100, 500, 1000, 2000, 5000]) },
    { title: 'Stars', value: stats.stars, level: calculateTrophyLevel(stats.stars, [10, 50, 100, 500, 1000]) },
    { title: 'Pull Requests', value: stats.prs, level: calculateTrophyLevel(stats.prs, [10, 50, 100, 200, 500]) },
    { title: 'Issues', value: stats.issues, level: calculateTrophyLevel(stats.issues, [10, 25, 50, 100, 200]) },
    { title: 'Repositories', value: stats.repos, level: calculateTrophyLevel(stats.repos, [5, 15, 30, 50, 100]) },
    { title: 'Followers', value: stats.followers, level: calculateTrophyLevel(stats.followers, [10, 50, 100, 500, 1000]) },
  ];

  const trophiesSvg = trophies.map((t, i) => {
    const x = (i % 3) * 250;
    const y = Math.floor(i / 3) * 140;
    const color = getTrophyColor(t.level);
    const progressWidth = (t.level / 5) * 125;
    const delay = i * 0.15;

    return `
      <g transform="translate(${x}, ${y})">
        <g class="card" style="--hover-color: ${color}; animation-delay: ${delay}s;">
          <rect width="230" height="120" rx="12" fill="${cardBg}" stroke="${borderColor}" stroke-width="1" class="card-bg" />
          
          <!-- Decorative Background Shape -->
          <path d="M150 0 Q230 0 230 60 L230 120 Q230 120 150 120 L230 120 Z" fill="${color}" opacity="0.05" />
          <circle cx="200" cy="90" r="40" fill="${color}" opacity="0.05" />
          
          <text x="20" y="35" font-size="14" font-weight="600" class="text-secondary">${t.title}</text>
          <text x="20" y="72" font-size="30" font-weight="800" class="text-primary">${t.value}</text>
          
          <!-- Level Badge -->
          <rect x="20" y="88" width="54" height="20" rx="10" fill="${color}" opacity="0.15" />
          <text x="47" y="102" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">LVL ${t.level}</text>
          
          <!-- Progress Bar Background -->
          <rect x="85" y="95" width="125" height="6" rx="3" fill="${borderColor}" />
          
          <!-- Animated Progress Bar -->
          <rect x="85" y="95" width="0" height="6" rx="3" fill="${color}">
            <animate attributeName="width" from="0" to="${progressWidth}" dur="1.2s" begin="${delay + 0.3}s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0;1" />
          </rect>
        </g>
      </g>
    `;
  }).join('');

  const languagesSvg = stats.languages.map((lang, i) => `
    <g transform="translate(${i * 100}, 0)">
      <circle cx="5" cy="-4" r="4" fill="${lang.color}" />
      <text x="15" y="0" font-size="12" font-weight="500" class="text-primary">${lang.name}</text>
      <text x="15" y="15" font-size="10" class="text-secondary">${lang.percentage}%</text>
    </g>
  `).join('');

  return `
    <svg width="800" height="460" viewBox="0 0 800 460" fill="none" xmlns="http://www.w3.org/2000/svg" style="font-family: system-ui, -apple-system, sans-serif;">
      <style>
        .card { 
          opacity: 0; 
          animation: fadeSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .card-bg { 
          transition: all 0.3s ease; 
        }
        .card:hover .card-bg { 
          stroke: var(--hover-color); 
          stroke-width: 1.5;
        }
        .card:hover { 
          transform: translateY(-4px); 
        }
        @keyframes fadeSlideIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .text-primary { fill: ${textColor}; }
        .text-secondary { fill: ${theme === 'dark' ? '#8b949e' : '#57606a'}; }
      </style>
      
      <rect width="800" height="460" rx="16" fill="${bgColor}" stroke="${borderColor}" stroke-width="1" />
      
      <!-- Header -->
      <g transform="translate(35, 35)">
        <clipPath id="avatarClip">
          <circle cx="30" cy="30" r="30" />
        </clipPath>
        <image href="${stats.avatarUrl}" x="0" y="0" width="60" height="60" clip-path="url(#avatarClip)" />
        <circle cx="30" cy="30" r="30" fill="none" stroke="${borderColor}" stroke-width="2" />
        
        <text x="75" y="25" font-size="24" font-weight="bold" class="text-primary">${stats.name}</text>
        <text x="75" y="45" font-size="14" class="text-secondary">@${stats.username}</text>
        
        <g transform="translate(530, 10)">
          <text x="160" y="15" font-size="11" text-anchor="end" class="text-secondary" style="text-transform: uppercase; letter-spacing: 1.5px;">Top Language</text>
          <circle cx="100" cy="30" r="6" fill="${stats.languages[0]?.color || '#8b8b8b'}" />
          <text x="115" y="35" font-size="16" font-weight="bold" class="text-primary">${stats.languages[0]?.name || 'Unknown'}</text>
        </g>
      </g>
      
      <!-- Trophies Grid -->
      <g transform="translate(35, 115)">
        ${trophiesSvg}
      </g>
      
      <!-- Footer -->
      <g transform="translate(35, 410)">
        <line x1="0" y1="0" x2="730" y2="0" stroke="${borderColor}" stroke-width="1" />
        <g transform="translate(0, 25)">
          ${languagesSvg}
        </g>
        <text x="730" y="25" font-size="11" text-anchor="end" class="text-secondary" font-style="italic">Generated by GitHub Trophy Generator</text>
      </g>
    </svg>
  `;
}
