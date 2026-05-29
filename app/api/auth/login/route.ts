import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  console.log('Tentando login com:', email)

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  console.log('Resposta do Supabase:')
  console.log('data:', JSON.stringify(data))
  console.log('error:', JSON.stringify(error))

  if (!error && data.user) {
    const cookieStore = await cookies()

// Em app/api/auth/login/route.ts
cookieStore.set('finance_user_name', data.user.email!, {
  httpOnly: false, // 🟢 Alterar de true para false para o Dashboard conseguir ler
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24,
  path: '/',
})

// No arquivo app/api/auth/login/route.ts
cookieStore.set('finance_user_id', data.user.id, {
  httpOnly: false, // 🟢 Importante: false para o Dashboard conseguir ler
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24,
  path: '/',
});

    cookieStore.set('theme_preference', 'light', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return NextResponse.json({ ok: true, user: data.user.email })
  }

  if (email === 'joao' && password === '123') {
    const cookieStore = await cookies()

    cookieStore.set('finance_user_name', 'joao', {
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

    return NextResponse.json({ ok: true, user: 'joao' })
  }

  return NextResponse.json(
    { error: 'Credenciais inválidas no Supabase e no Mock.' },
    { status: 401 }
  )
}