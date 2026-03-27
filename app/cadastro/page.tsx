"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import localFont from "next/font/local";

const rugen = localFont({
  src: "../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      alert("Erro: " + error.message);
      setLoading(false);
    } else {
      router.push("/cadastro/sucesso"); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center font-sans px-4">
      <div className="bg-white p-10 rounded-[10px] shadow-2xl w-full max-w-[400px] border border-[#eee]">
        <h2 className={`text-[1.8rem] text-[#2c3e50] text-center mb-6 tracking-wide ${rugen.className}`}>Criar Conta</h2>
        <form onSubmit={handleCadastro} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">E-mail</label>
            <input 
              type="email" placeholder="seu@email.com" required
              className="w-full p-3 border border-[#ddd] rounded-[5px] focus:outline-none focus:border-[#25b461] transition-all text-gray-900"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Senha</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full p-3 border border-[#ddd] rounded-[5px] focus:outline-none focus:border-[#25b461] transition-all text-gray-900"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#25b461] hover:bg-[#1e914d] text-white py-3 rounded-[5px] font-bold shadow-md transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <Link href="/login" className="block text-center mt-6 text-[#2c3e50] hover:text-[#25b461] transition-colors text-sm">
          Já tem conta? Voltar para o Login
        </Link>
      </div>
    </div>
  );
}