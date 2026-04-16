import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (username !== 'joao' || password !== '123') {
    return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
  }

  const cookieStore = await cookies()  // ← await aqui

  cookieStore.set('finance_user_name', username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  cookieStore.set('theme_preference', 'light', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}