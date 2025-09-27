import { NextResponse } from 'next/server'

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  // TODO: delete from DB here later
  return NextResponse.json({ ok: true, id, action: 'delete', status: 'deleted' })
}
