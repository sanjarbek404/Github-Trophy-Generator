export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  commits: number;
  prs: number;
  issues: number;
  stars: number;
  followers: number;
  repos: number;
  topRepo: {
    name: string;
    stars: number;
  };
  languages: { name: string; color: string; percentage: number }[];
}

export const calculateTrophyLevel = (value: number, thresholds: number[]): number => {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) return i + 1;
  }
  return 0;
};

export const getTrophyColor = (level: number): string => {
  const colors = [
    '#94a3b8', // Level 0: Slate
    '#4ade80', // Level 1: Green
    '#60a5fa', // Level 2: Blue
    '#a855f7', // Level 3: Purple
    '#f59e0b', // Level 4: Amber
    '#ef4444', // Level 5: Red
  ];
  return colors[level] || colors[0];
};

export const getTrophyName = (level: number): string => {
  const names = ['Novice', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  return names[level] || names[0];
};
