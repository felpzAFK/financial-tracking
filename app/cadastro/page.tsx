"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

const handleCadastro = async (e: React.FormEvent) => {
  e.preventDefault();
  const { error } = await supabase.auth.signUp({ email, password });
  
  if (error) {
    alert("Erro: " + error.message);
  } else {
    // EM VEZ DE IR PARA O LOGIN DIRETO, VAI PARA A TELA DE BEM-VINDO
    router.push("/cadastro/sucesso"); 
  }
};

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center font-sans px-4">
      <div className="bg-white p-10 rounded-[10px] shadow-2xl w-full max-w-[400px] border border-[#eee]">
        <h2 className="text-[1.8rem] font-bold text-[#2c3e50] text-center mb-6">Criar Conta</h2>
        <form onSubmit={handleCadastro} className="space-y-5">
          <input 
            type="email" placeholder="E-mail" required
            className="w-full p-3 border border-[#ddd] rounded-[5px] text-gray-900"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Senha" required
            className="w-full p-3 border border-[#ddd] rounded-[5px] text-gray-900"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-[#25b461] text-white py-3 rounded-[5px] font-bold">
            Cadastrar
          </button>
        </form>
        <Link href="/login" className="block text-center mt-6 text-[#2c3e50] hover:underline text-sm">
          Já tem conta? Voltar para o Login
        </Link>
      </div>
    </div>
  );
}