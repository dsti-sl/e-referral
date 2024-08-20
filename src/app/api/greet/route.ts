// Example API route for fetching user data.
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get('name');

  // Fetch user data (placeholder logic)
  const message = { message: `Hello, ${username}!` };

  return NextResponse.json(message);
}
