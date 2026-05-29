'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import localFont from 'next/font/local'

const rugen = localFont({
  src: '../../public/fonts/RugenExpanded.ttf',
  display: 'swap',
})

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert('Erro ao entrar: ' + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center font-sans px-4">
      <div className="bg-white p-10 rounded-[10px] shadow-2xl w-full max-w-[400px] border border-[#eee]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/porcocaze1.PNG" alt="Logo" width={60} height={60} className="rounded-md" />
          </div>
          <h2 className={`text-[1.8rem] text-[#2c3e50] tracking-wide ${rugen.className}`}>Bem-vindo</h2>
          <p className="text-gray-500 text-sm mt-1">Acesse sua conta financeira</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full p-3 border border-[#ddd] rounded-[5px] focus:outline-none focus:border-[#25b461] transition-all text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border border-[#ddd] rounded-[5px] focus:outline-none focus:border-[#25b461] transition-all text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#25b461] hover:bg-[#1e914d] text-white py-3 rounded-[5px] font-bold text-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4">
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#eee]" />
            <span className="text-sm text-gray-400">ou</span>
            <div className="flex-1 h-px bg-[#eee]" />
          </div>

          {/* Botão Google agora é onClick, não form action */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-[#ddd] py-3 rounded-[5px] font-semibold text-[#2c3e50] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <img src="/google-icon.svg" alt="" width={18} height={18} />
            Continuar com Google
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ainda não tem conta? <Link href="/cadastro" className="text-[#25b461] font-bold hover:underline transition-colors">Cadastre-se</Link></p>
          <Link href="/" className="inline-block mt-4 text-[#2c3e50] hover:text-[#25b461] transition-colors">← Voltar para a Home</Link>
        </div>
      </div>
    </div>
  )
}