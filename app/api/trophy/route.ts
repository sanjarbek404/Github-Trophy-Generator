import { NextResponse } from 'next/server';
import { fetchGitHubStats } from '@/lib/github-api';
import { generateTrophySvg } from '@/lib/svg-generator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const theme = searchParams.get('theme') as 'light' | 'dark' | null;

  if (!username) {
    return new NextResponse('Username is required', { status: 400 });
  }

  try {
    const stats = await fetchGitHubStats(username);
    const svgString = generateTrophySvg(stats, theme || 'dark');

    return new NextResponse(svgString, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating SVG:', error);
    return new NextResponse('Error generating SVG', { status: 500 });
  }
}
