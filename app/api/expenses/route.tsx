import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()

  const userName = cookieStore.get('finance_user_name')?.value

  if (!userName) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const expenses = [
    { descricao: 'Aluguel', valor: 1500 },
    { descricao: 'Mercado', valor: 300 },
    { descricao: 'Internet', valor: 100 },
  ]

  return NextResponse.json({
    user: userName,
    expenses,
  })
}