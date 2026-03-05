import { BoardData } from './types';
import { EMPTY_BOARD } from './constants';

const GITHUB_API = 'https://api.github.com';

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'GoldAshuraGIT/merai-hq';
  if (!token) throw new Error('GITHUB_TOKEN not configured');
  return { token, repo };
}

export async function fetchBoard(): Promise<BoardData> {
  const { token, repo } = getConfig();
  const path = 'board.json';
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    cache: 'no-store',
  });

  if (res.status === 404) {
    return EMPTY_BOARD;
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  const board: BoardData = JSON.parse(content);

  return {
    ...board,
    workstreams: { ...EMPTY_BOARD.workstreams, ...board.workstreams },
  };
}

export async function saveBoard(board: BoardData): Promise<void> {
  const { token, repo } = getConfig();
  const path = 'board.json';
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}`;

  // Get current SHA if file exists
  let sha: string | undefined;
  const getRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    cache: 'no-store',
  });

  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
  }

  const content = Buffer.from(
    JSON.stringify(board, null, 2),
    'utf-8'
  ).toString('base64');

  const body: Record<string, string> = {
    message: `Update board — ${new Date().toISOString()}`,
    content,
  };

  if (sha) body.sha = sha;

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub save error: ${putRes.status} — ${err}`);
  }
}
