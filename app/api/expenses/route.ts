import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('finance_user_name')?.value

  console.log('Cookie encontrado:', userName)

  if (!userName) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, username, email')
    .or(`email.eq.${userName},username.eq.${userName}`)
    .single()

  console.log('Usuário encontrado:', user)
  console.log('Erro do usuário:', userError)

  if (userError || !user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const { data: transactions, error: transactionError } = await supabase
    .from('transactions')
    .select('id, description, amount, type, date')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  console.log('Transações:', transactions)
  console.log('Erro transações:', transactionError)

  if (transactionError) {
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 })
  }

  return NextResponse.json({
    user: user.username ?? user.email,
    transactions,
  })
}