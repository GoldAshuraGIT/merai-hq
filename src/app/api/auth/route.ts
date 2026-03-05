import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const boardPassword = process.env.BOARD_PASSWORD;

    if (!boardPassword) {
      return NextResponse.json(
        { error: 'BOARD_PASSWORD not configured' },
        { status: 500 }
      );
    }

    if (password === boardPassword) {
      return NextResponse.json({ ok: true, token: boardPassword });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
