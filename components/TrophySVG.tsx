import React from 'react';
import { GitHubStats, calculateTrophyLevel, getTrophyColor, getTrophyName } from '@/lib/github-types';

interface TrophySVGProps {
  stats: GitHubStats;
  theme?: 'light' | 'dark';
}

export const TrophySVG = ({ stats, theme = 'dark' }: TrophySVGProps) => {
  const bgColor = theme === 'dark' ? '#0d1117' : '#ffffff';
  const textColor = theme === 'dark' ? '#c9d1d9' : '#24292f';
  const borderColor = theme === 'dark' ? '#30363d' : '#d0d7de';
  const cardBg = theme === 'dark' ? '#161b22' : '#f6f8fa';

  const trophies = [
    { title: 'Commits', value: stats.commits, level: calculateTrophyLevel(stats.commits, [100, 500, 1000, 2000, 5000]) },
    { title: 'Stars', value: stats.stars, level: calculateTrophyLevel(stats.stars, [10, 50, 100, 500, 1000]) },
    { title: 'PRs', value: stats.prs, level: calculateTrophyLevel(stats.prs, [10, 50, 100, 200, 500]) },
    { title: 'Issues', value: stats.issues, level: calculateTrophyLevel(stats.issues, [10, 25, 50, 100, 200]) },
  ];

  return (
    <svg
      width="800"
      height="320"
      viewBox="0 0 800 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <style>
        {`
          .card { transition: transform 0.3s ease; }
          .card:hover { transform: translateY(-5px); }
          .progress-bar { animation: fillBar 1.5s ease-out forwards; }
          @keyframes fillBar { from { width: 0; } }
          .text-primary { fill: ${textColor}; }
          .text-secondary { fill: ${theme === 'dark' ? '#8b949e' : '#57606a'}; }
        `}
      </style>

      {/* Background */}
      <rect width="800" height="320" rx="12" fill={bgColor} stroke={borderColor} strokeWidth="1" />

      {/* Header */}
      <g transform="translate(30, 30)">
        {/* Avatar Placeholder (SVG doesn't load external images easily without base64, so we use a circle or try image) */}
        <clipPath id="avatarClip">
          <circle cx="30" cy="30" r="30" />
        </clipPath>
        <image href={stats.avatarUrl} x="0" y="0" width="60" height="60" clipPath="url(#avatarClip)" />
        <circle cx="30" cy="30" r="30" fill="none" stroke={borderColor} strokeWidth="2" />
        
        <text x="75" y="25" fontSize="22" fontWeight="bold" className="text-primary">{stats.name}</text>
        <text x="75" y="45" fontSize="14" className="text-secondary">@{stats.username}</text>

        {/* Top Repo */}
        <g transform="translate(550, 10)">
          <text x="160" y="15" fontSize="12" textAnchor="end" className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Top Language</text>
          <circle cx="100" cy="30" r="6" fill={stats.languages[0]?.color || '#8b8b8b'} />
          <text x="115" y="35" fontSize="16" fontWeight="bold" className="text-primary">{stats.languages[0]?.name || 'Unknown'}</text>
        </g>
      </g>

      {/* Trophies Grid */}
      <g transform="translate(30, 110)">
        {trophies.map((t, i) => {
          const x = (i % 4) * 190;
          const color = getTrophyColor(t.level);
          const levelName = getTrophyName(t.level);
          const progressWidth = (t.level / 5) * 140;

          return (
            <g key={i} transform={`translate(${x}, 0)`} className="card">
              <rect width="170" height="120" rx="8" fill={cardBg} stroke={borderColor} strokeWidth="1" />
              
              {/* Icon Background */}
              <path d="M120 0 Q170 0 170 50 L170 120 Q170 120 120 120 L170 120 Z" fill={color} opacity="0.05" />
              
              <text x="15" y="30" fontSize="14" fontWeight="500" className="text-secondary">{t.title}</text>
              
              <text x="15" y="65" fontSize="28" fontWeight="bold" className="text-primary">{t.value}</text>
              
              {/* Level Badge */}
              <rect x="15" y="75" width="60" height="20" rx="10" fill={color} opacity="0.2" />
              <text x="45" y="89" fontSize="10" fontWeight="bold" fill={color} textAnchor="middle">LVL {t.level}</text>

              {/* Progress Bar */}
              <rect x="15" y="105" width="140" height="4" rx="2" fill={borderColor} />
              <rect x="15" y="105" width={progressWidth} height="4" rx="2" fill={color} className="progress-bar" />
            </g>
          );
        })}
      </g>

      {/* Footer / Languages */}
      <g transform="translate(30, 270)">
        <line x1="0" y1="0" x2="740" y2="0" stroke={borderColor} strokeWidth="1" />
        <g transform="translate(0, 25)">
          {stats.languages.map((lang, i) => (
            <g key={i} transform={`translate(${i * 100}, 0)`}>
              <circle cx="5" cy="-4" r="4" fill={lang.color} />
              <text x="15" y="0" fontSize="12" fontWeight="500" className="text-primary">{lang.name}</text>
              <text x="15" y="15" fontSize="10" className="text-secondary">{lang.percentage}%</text>
            </g>
          ))}
        </g>
        <text x="740" y="25" fontSize="10" textAnchor="end" className="text-secondary" fontStyle="italic">Generated by GitHub Trophy Generator</text>
      </g>
    </svg>
  );
};
