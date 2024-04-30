import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const room = searchParams.get('room');
  const shard = searchParams.get('shard');
  try {
    const response = await fetch(`https://screeps.com/api/game/room-terrain?encoded=1&room=${room}&shard=${shard}`);
    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Error fetching data from Screeps API' }, { status: 500 });
  }
}
