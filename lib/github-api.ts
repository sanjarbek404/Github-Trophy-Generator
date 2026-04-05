import { GitHubStats } from './github-types';

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const headers: Record<string, string> = process.env.GITHUB_TOKEN 
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } 
    : {};

  const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  if (!userRes.ok) throw new Error('User not found');
  const userData = await userRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
  const reposData = await reposRes.json();

  let totalStars = 0;
  let topRepo = { name: '', stars: 0 };
  const langMap: Record<string, number> = {};

  if (Array.isArray(reposData)) {
    reposData.forEach((repo: any) => {
      totalStars += repo.stargazers_count;
      if (repo.stargazers_count > topRepo.stars) {
        topRepo = { name: repo.name, stars: repo.stargazers_count };
      }
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });
  }

  const totalLangs = Object.values(langMap).reduce((a, b) => a + b, 0);
  const languages = Object.entries(langMap)
    .map(([name, count]) => ({
      name,
      color: getLangColor(name),
      percentage: Math.round((count / totalLangs) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // Fetch avatar and convert to base64
  let avatarBase64 = '';
  try {
    const avatarRes = await fetch(userData.avatar_url);
    const arrayBuffer = await avatarRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = avatarRes.headers.get('content-type') || 'image/jpeg';
    avatarBase64 = `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (e) {
    console.error('Failed to fetch avatar', e);
  }

  // Fetch exact stats using GitHub Search API
  let exactCommits = 0;
  let exactPrs = 0;
  let exactIssues = 0;

  try {
    const [commitsRes, prsRes, issuesRes] = await Promise.all([
      fetch(`https://api.github.com/search/commits?q=author:${username}`, { 
        headers: { ...headers, Accept: 'application/vnd.github.cloak-preview+json' } 
      }),
      fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`, { headers }),
      fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`, { headers })
    ]);

    if (commitsRes.ok) {
      const commitsData = await commitsRes.json();
      exactCommits = commitsData.total_count || 0;
    }
    if (prsRes.ok) {
      const prsData = await prsRes.json();
      exactPrs = prsData.total_count || 0;
    }
    if (issuesRes.ok) {
      const issuesData = await issuesRes.json();
      exactIssues = issuesData.total_count || 0;
    }
  } catch (e) {
    console.error('Failed to fetch exact stats from Search API', e);
  }

  return {
    username: userData.login,
    name: userData.name || userData.login,
    avatarUrl: avatarBase64 || userData.avatar_url,
    commits: exactCommits,
    prs: exactPrs,
    issues: exactIssues,
    stars: totalStars,
    followers: userData.followers,
    repos: userData.public_repos,
    topRepo,
    languages,
  };
}

function getLangColor(lang: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    React: '#61dafb',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Dart: '#00B4AB',
    Swift: '#F05138',
  };
  return colors[lang] || '#8b8b8b';
}
