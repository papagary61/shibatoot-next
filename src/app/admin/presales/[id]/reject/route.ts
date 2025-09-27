import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  console.log(`Presale ${id} rejected`)

  // TODO: integrate with DB later
  return NextResponse.json({ success: true, id, status: 'rejected' })
}
