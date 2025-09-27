import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  console.log(`Presale ${id} deleted`)

  // TODO: integrate with DB later
  return NextResponse.json({ success: true, id, status: 'deleted' })
}
