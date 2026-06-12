"use client";

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  receipt_url?: string | null;
}

import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import SummaryCards from "./components/SummaryCards";
import TransactionTable from "./components/TransactionTable";
import TransactionModal from "./components/TransactionModal";
import ProfileModal from "./components/ProfileModal";
import ConselheiroIA from "./components/ConselheiroIA";
import SurvivalModeCard from "./components/SurvivalModeCard";
import Sidebar from "./components/Sidebar";
import TutorialBoasVindas from "./components/TutorialBoasVindas";
import CookieConsent from "@/app/dashboard/components/CookieConsent";

const brigends = localFont({
  src: "../../public/fonts/Brigends.otf",
  display: "swap",
});

export default function DashboardInterno() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Utilizador");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
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
            .select('display_name, avatar_url')
            .eq('id', user.id)
            .single();
          setNomeUsuario(profile?.display_name || user.email?.split('@')[0] || "Utilizador");
          setAvatarUrl(profile?.avatar_url || null);
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
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar 
        nomeUsuario={nomeUsuario} 
        avatarUrl={avatarUrl}
        onOpenProfileModal={() => setIsProfileModalOpen(true)} 
        onLogout={lidarComSair}/>
      <div className="flex-1 min-w-0">
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className={`text-3xl text-[#2c3e50] dark:text-gray-300 tracking-wide ${brigends.className}`}>Bem-vindo de volta, {nomeUsuario}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Aqui está o resumo das suas finanças deste mês.</p>
            </div>
            
            <div className="hidden md:flex gap-3">
              <button 
                id="tour-nova-transacao" 
                onClick={() => setIsModalOpen(true)} 
                className="bg-[#25b461] hover:bg-[#1e914d] text-white px-5 py-2.5 rounded-lg font-bold transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2"
              >
                <span>+</span> Nova Transação
              </button>
            </div>
          </div>

          <ConselheiroIA 
            saldo={saldoAtual} 
            gastosTotais={totalDespesas} 
            transacoes={transacoes}/>
          
          <SummaryCards receitas={totalReceitas} despesas={totalDespesas} saldo={saldoAtual} />

          <TutorialBoasVindas />
          
          <TransactionTable 
            transacoes={transacoes} 
            aCarregar={aCarregar} 
            onOpenModal={() => setIsModalOpen(true)}/>

          <SurvivalModeCard saldo={saldoAtual} />
        </main>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
              <CookieConsent />
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentName={nomeUsuario} 
        currentAvatar={avatarUrl}
        onSave={(novoNome, novoAvatar) => {
          setNomeUsuario(novoNome);
          if (novoAvatar !== undefined) setAvatarUrl(novoAvatar);
        }}/>
    </div>
  );
}