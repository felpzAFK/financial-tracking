import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()

  const userName = cookieStore.get('finance_user_name')?.value

  if (!userName) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const expenses = [
    { id: 1, descricao: 'Aluguel', valor: 1500, tipo: 'despesa', data: '16/04/2026' },
    { id: 2, descricao: 'Salário', valor: 5000, tipo: 'receita', data: '15/04/2026' },
  ]

  return NextResponse.json({
    user: userName,
    expenses,
  })
}