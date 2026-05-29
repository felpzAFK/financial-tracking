"use client";

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  receipt_url?: string | null;
}

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
<<<<<<< HEAD
import { useState } from "react";
import { signOut } from './actions';
=======
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import SummaryCards from "./components/SummaryCards";
import TransactionTable from "./components/TransactionTable";
import TransactionModal from "./components/TransactionModal";
>>>>>>> main

const rugen = localFont({
  src: "../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function DashboardInterno() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [aCarregar, setACarregar] = useState(true);

  // Cálculos do resumo
  const totalReceitas = transacoes
    .filter((t: Transacao) => t.tipo === 'receita')
    .reduce((acc: number, t: Transacao) => acc + Number(t.valor), 0);

  const totalDespesas = transacoes
    .filter((t: Transacao) => t.tipo === 'despesa')
    .reduce((acc: number, t: Transacao) => acc + Number(t.valor), 0);
    
  const saldoAtual = totalReceitas - totalDespesas;

  // Busca os dados do Supabase (A mesma lógica robusta que já estava funcionando)
  useEffect(() => {
    const buscarDadosReais = async () => {
      try {
        setACarregar(true);
        const { data: { user } } = await supabase.auth.getUser();

        const cookieId = document.cookie.split('; ').find(row => row.startsWith('finance_user_id='))?.split('=')[1];
        const userIdFinal = user?.id || cookieId;

        if (user) {
          const { data: profile } = await supabase.from('users').select('username').eq('id', user.id).single();
          setNomeUsuario(profile?.username || user.email?.split('@')[0] || "Usuário");
        } else {
          const cookieNome = document.cookie.split('; ').find(row => row.startsWith('finance_user_name='))?.split('=')[1];
          setNomeUsuario(cookieNome ? decodeURIComponent(cookieNome).split('@')[0] : "Usuário");
        }

        if (userIdFinal) {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userIdFinal)
            .order('date', { ascending: false });

          if (error) throw error;

          if (data) {
            const formatadas = data.map((t: { id: number; date: string; description: string; amount: number; type: 'receita' | 'despesa'; receipt_url?: string | null }) => {
              const dataPura = t.date.split('T')[0]; 
              const [ano, mes, dia] = dataPura.split('-');
              return {
                id: t.id,
                descricao: t.description,
                valor: t.amount,
                tipo: t.type,
                data: `${dia}/${mes}/${ano}`,
                receipt_url: t.receipt_url
              };
            });
            setTransacoes(formatadas);
          }
        }
      } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
      } finally {
        setACarregar(false);
      }
    };

    buscarDadosReais();
  }, []);

  const lidarComSair = async () => {
    await supabase.auth.signOut();
    document.cookie = "finance_user_name=; Max-Age=0; path=/;";
    document.cookie = "finance_user_id=; Max-Age=0; path=/;";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-gray-800 relative">
      <header className="bg-[#2c3e50] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3 ml-2 md:ml-5">
          <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md" />
          <div className={`text-xl text-[#25b461] hidden md:block ${rugen.className}`}>Financial Tracking</div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="text-[#25b461] font-bold border-b-2 border-[#25b461] pb-1">Painel</Link>
          <Link href="/dashboard/historico" className="text-gray-300 hover:text-white transition font-medium">Histórico</Link>
          <Link href="/dashboard/relatorios" className="text-gray-300 hover:text-white transition font-medium">Relatórios</Link>
        </nav>

        <div className="mr-2 md:mr-5 flex items-center gap-4">
<<<<<<< HEAD
          <span className="text-sm text-gray-300 hidden sm:block">Olá, <strong className="text-white">{userName}</strong></span>
          <form action={signOut}>
           <button type="submit" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white shadow-sm">
           Sair
          </button>
           </form>
=======
          <span className="text-sm text-gray-300 hidden sm:block">Olá, <strong className="text-white">{nomeUsuario}</strong></span>
          <button onClick={lidarComSair} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white shadow-sm">Sair</button>
>>>>>>> main
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className={`text-3xl text-[#2c3e50] tracking-wide ${rugen.className}`}>Bem-vindo de volta, {nomeUsuario}</h1>
            <p className="text-gray-500 mt-1">Aqui está o resumo das suas finanças deste mês.</p>
          </div>
          
          <div className="hidden md:flex gap-3">
            <Link href="/dashboard/relatorios" className="bg-white border-2 border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white px-5 py-2.5 rounded-lg font-bold transition-all duration-200 active:scale-95 shadow-sm flex items-center gap-2">📊 Ver Relatórios</Link>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#25b461] hover:bg-[#1e914d] text-white px-5 py-2.5 rounded-lg font-bold transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2"><span>+</span> Nova Transação</button>
          </div>
        </div>

        {/* Aqui injetamos os componentes que você criou! */}
        <SummaryCards receitas={totalReceitas} despesas={totalDespesas} saldo={saldoAtual} />
        
        <TransactionTable 
          transacoes={transacoes} 
          aCarregar={aCarregar} 
          onOpenModal={() => setIsModalOpen(true)} 
        />

      </main>

      {/* O Modal de Nova Transação agora vive no próprio arquivo dele */}
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}