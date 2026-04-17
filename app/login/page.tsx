"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

const rugen = localFont({
  src: "../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🟢 AQUI ESTÁ O SEGREDO: Enviamos 'username' como 'email' para a API entender
        body: JSON.stringify({ email: username, password }),
      });

      if (resposta.ok) {
        // Se o login deu certo, vai para o dashboard que criamos
        router.push("/dashboard");
      } else {
        const dados = await resposta.json();
        setErro(dados.error || "Usuário ou senha inválidos.");
      }
    } catch (err) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="flex flex-col items-center mb-8">
          <Image src="/porcocaze1.PNG" alt="Logo" width={70} height={70} className="rounded-xl shadow-sm mb-4" />
          <h1 className={`text-3xl text-[#2c3e50] tracking-wide text-center ${rugen.className}`}>
            Financial Tracking
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">Controle seu futuro financeiro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#2c3e50] mb-1">Usuário (E-mail)</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu e-mail" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition bg-gray-50 focus:bg-white text-gray-900 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2c3e50] mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition bg-gray-50 focus:bg-white text-gray-900 font-medium"
              required
            />
          </div>

          {erro && (
            <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-lg text-center border border-red-100">
              {erro}
            </div>
          )}

          <button 
            type="submit" 
            disabled={carregando}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all active:scale-95 shadow-md flex justify-center items-center gap-2
              ${carregando ? "bg-gray-400 cursor-not-allowed" : "bg-[#25b461] hover:bg-[#1e914d]"}`}
          >
            {carregando ? (
              <span className="animate-pulse">Autenticando...</span>
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
          <p>Ainda não tem conta? <Link href="/cadastro" className="text-[#25b461] font-bold hover:underline transition-colors">Cadastre-se</Link></p>
          <Link href="/" className="inline-block mt-4 text-gray-400 hover:text-[#25b461] font-medium transition-colors">← Voltar para a Home</Link>
        </div>
      </div>
    </div>
  );
}