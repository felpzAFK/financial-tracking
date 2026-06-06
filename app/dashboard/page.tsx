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
import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import SummaryCards from "./components/SummaryCards";
import TransactionTable from "./components/TransactionTable";
import TransactionModal from "./components/TransactionModal";
import { useTheme } from 'next-themes'
import ProfileModal from "./components/ProfileModal";
import ConselheiroIA from "./components/ConselheiroIA";

const brigends = localFont({
  src: "../../public/fonts/Brigends.otf",
  display: "swap",
});

export default function DashboardInterno() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalReceitas = transacoes
    .filter((t: Transacao) => t.tipo === 'receita')
    .reduce((acc: number, t: Transacao) => acc + Number(t.valor), 0);

  const totalDespesas = transacoes
    .filter((t: Transacao) => t.tipo === 'despesa')
    .reduce((acc: number, t: Transacao) => acc + Number(t.valor), 0);
    
  const saldoAtual = totalReceitas - totalDespesas;

  useEffect(() => {
    const buscarDadosReais = async () => {
      try {
        setACarregar(true);
        const { data: { user } } = await supabase.auth.getUser();

        const cookieId = document.cookie.split('; ').find(row => row.startsWith('finance_user_id='))?.split('=')[1];
        const userIdFinal = user?.id || cookieId;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user.id)
            .single();
          setNomeUsuario(profile?.display_name || user.email?.split('@')[0] || "Utilizador");
        } else {
          const cookieNome = document.cookie.split('; ').find(row => row.startsWith('finance_user_name='))?.split('=')[1];
          setNomeUsuario(cookieNome ? decodeURIComponent(cookieNome).split('@')[0] : "Utilizador");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lidarComSair = async () => {
    await supabase.auth.signOut();
    document.cookie = "finance_user_name=; Max-Age=0; path=/;";
    document.cookie = "finance_user_id=; Max-Age=0; path=/;";
    window.location.href = "/login";
  };

  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 relative transition-colors duration-300">
      <header className="bg-[#2c3e50] dark:bg-[#1e293b] text-white p-4 flex justify-between items-center shadow-md dark:shadow-gray-900/50 sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center gap-3 ml-2 md:ml-5">
          <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md" />
          <div className={`text-xl text-[#25b461] hidden md:block ${brigends.className}`}>Financial Tracking</div>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="text-[#25b461] font-bold border-b-2 border-[#25b461] pb-1">Painel</Link>
          <Link href="/dashboard/historico" className="text-gray-300 hover:text-white transition font-medium">Histórico</Link>
          <Link href="/dashboard/relatorios" className="text-gray-300 hover:text-white transition font-medium">Relatórios</Link>
        </nav>
        <div className="mr-2 md:mr-5 flex items-center gap-4">
          <span className="text-sm text-gray-300 hidden sm:block">
            Olá,{' '}
            <strong 
              onClick={() => setIsProfileModalOpen(true)} 
              className="text-white hover:text-[#25b461] cursor-pointer underline decoration-dotted decoration-[#25b461] underline-offset-4 transition-colors"
              title="Clique para editar o perfil"
            >
              {nomeUsuario}
            </strong>
          </span>
          <button onClick={lidarComSair} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white shadow-sm">Sair</button>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-200 transition-colors"
            aria-label="Alternar Tema"
          >
            {!mounted ? (
              <div className="w-5 h-5"></div>
            ) : theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.312 4.312l1.591 1.591M16.5 16.5l1.591 1.591M21 12h-2.25M5.25 12H3m4.312 7.688l1.591-1.591M16.5 7.5l1.591-1.591M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className={`text-3xl text-[#2c3e50] dark:text-gray-300 tracking-wide ${brigends.className}`}>Bem-vindo de volta, {nomeUsuario}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Aqui está o resumo das suas finanças deste mês.</p>
          </div>
          
          <div className="hidden md:flex gap-3">
            <Link href="/dashboard/relatorios" className="bg-white dark:bg-gray-800 border-2 border-[#2c3e50] dark:border-gray-600 text-[#2c3e50] dark:text-gray-200 hover:bg-[#2c3e50] dark:hover:bg-gray-700 hover:text-white px-5 py-2.5 rounded-lg font-bold transition-all duration-200 active:scale-95 shadow-sm flex items-center gap-2">📊 Ver Relatórios</Link>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#25b461] hover:bg-[#1e914d] text-white px-5 py-2.5 rounded-lg font-bold transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2"><span>+</span> Nova Transação</button>
          </div>
        </div>
        
        <ConselheiroIA 
          saldo={saldoAtual} 
          gastosTotais={totalDespesas} 
          transacoes={transacoes} 
        />
        
        <SummaryCards receitas={totalReceitas} despesas={totalDespesas} saldo={saldoAtual} />
        
        <TransactionTable 
          transacoes={transacoes} 
          aCarregar={aCarregar} 
          onOpenModal={() => setIsModalOpen(true)} 
        />
      </main>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentName={nomeUsuario} 
        onSave={(novoNome) => setNomeUsuario(novoNome)} 
      />
    </div>
  );
}