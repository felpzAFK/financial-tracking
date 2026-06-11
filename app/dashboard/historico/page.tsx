"use client";

import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import Sidebar from "../components/Sidebar";
import ProfileModal from "../components/ProfileModal";

const brigends = localFont({
  src: "../../../public/fonts/Brigends.otf",
  display: "swap",
});

interface TransacaoHistorico {
  id: string;
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  receipt_url?: string | null;
  cor: string;
}

export default function HistoricoPage() {
  const [transacoes, setTransacoes] = useState<TransacaoHistorico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [aCarregar, setACarregar] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const [mounted, setMounted] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Utilizador");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setMounted(true);
    }
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    async function buscarHistorico() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setACarregar(false);
          return;
        }
        const userIdFinal = user.id;

        // Busca o nome do usuário para a Sidebar
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', user.id)
          .single();
        setNomeUsuario(profile?.display_name || user.email?.split('@')[0] || "Utilizador");
        setAvatarUrl(profile?.avatar_url || null);

        const { data: categoriasData } = await supabase.from('categories').select('*');

        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userIdFinal)
          .order('date', { ascending: false });

        if (error) throw error;

        if (data) {
          const formatadas = data.map((t: any) => {
            const dataPura = t.date.split('T')[0];
            const [ano, mes, dia] = dataPura.split('-');
            
            const cat = categoriasData?.find((c: any) => c.id === t.category_id);
            const nomeCategoria = cat ? `${cat.icon} ${cat.name}` : "Geral";
            const corCategoria = cat ? cat.color : "#9ca3af";

            return {
              id: t.id,
              descricao: t.description,
              categoria: nomeCategoria,
              cor: corCategoria,
              valor: t.amount,
              tipo: t.type,
              data: `${dia}/${mes}/${ano}`,
              receipt_url: t.receipt_url,
            };
          });
          setTransacoes(formatadas);
        }
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
      } finally {
        setACarregar(false);
      }
    }

    buscarHistorico();
  }, [supabase]);

  const transacoesFiltradas = transacoes.filter((t) => 
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina);
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;
  const transacoesDaPagina = transacoesFiltradas.slice(indexInicio, indexFim);

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm]);

  const lidarComSair = async () => {
    await supabase.auth.signOut();
    document.cookie = "finance_user_name=; Max-Age=0; path=/;";
    document.cookie = "finance_user_id=; Max-Age=0; path=/;";
    window.location.href = "/login";
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#0f172a] font-sans text-gray-800 dark:text-gray-100 flex flex-col lg:flex-row transition-colors duration-300">
      
      <Sidebar 
        nomeUsuario={nomeUsuario} 
        avatarUrl={avatarUrl}
        onOpenProfileModal={() => setIsProfileModalOpen(true)} 
        onLogout={lidarComSair} 
      />

      <div className="flex-1 min-w-0 pb-12">
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-4xl text-[#2c3e50] dark:text-white tracking-wide ${brigends.className} [text-shadow:_3px_3px_0_#25b461] dark:[text-shadow:_2px_2px_0_#1e914d]`}>
              Histórico Detalhado
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Consulte e filtre todas as suas movimentações financeiras reais.</p>
          </div>
          
          <section className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4 items-center transition-colors">
            <div className="relative w-full md:w-1/2">
              <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">🔍</span>
              <input 
                type="text" 
                placeholder="Buscar por descrição..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#25b461] dark:focus:border-[#25b461] text-gray-900 dark:text-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-600">
                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 dark:text-gray-300">Data</th>
                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 dark:text-gray-300">Descrição</th>
                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 dark:text-gray-300">Categoria</th>
                    <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 dark:text-gray-300 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                  {aCarregar ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400 animate-pulse font-medium">A carregar histórico...</td>
                    </tr>
                  ) : transacoesDaPagina.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium">Nenhuma transação encontrada.</td>
                    </tr>
                  ) : (
                    transacoesDaPagina.map((item) => (
                      <tr key={item.id} className="hover:bg-green-50/30 dark:hover:bg-slate-700/50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">{item.data}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-800 dark:text-white">{item.descricao}</div>
                          {item.receipt_url && (
                            <a 
                              href={item.receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-[#25b461] dark:text-[#2ecc71] hover:underline flex items-center gap-1 mt-1 font-semibold"
                            >
                              🔗 Ver Comprovante
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            style={{ backgroundColor: `${item.cor}20`, color: item.cor }} 
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent dark:border-opacity-30"
                          >
                            {item.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right">
                          <span className={item.tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center transition-colors">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Mostrando {transacoesFiltradas.length === 0 ? 0 : indexInicio + 1} a {Math.min(indexFim, transacoesFiltradas.length)} de {transacoesFiltradas.length} transações
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={irParaPaginaAnterior}
                  disabled={paginaAtual === 1}
                  className={`px-4 py-2 border rounded-md text-sm font-bold transition ${paginaAtual === 1 ? 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : 'border-[#25b461] text-[#25b461] hover:bg-[#25b461] hover:text-white bg-white dark:bg-slate-800 dark:hover:bg-[#25b461]'}`}
                >
                  Anterior
                </button>
                <button 
                  onClick={irParaProximaPagina}
                  disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                  className={`px-4 py-2 border rounded-md text-sm font-bold transition ${paginaAtual === totalPaginas || totalPaginas === 0 ? 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : 'border-[#25b461] text-[#25b461] hover:bg-[#25b461] hover:text-white bg-white dark:bg-slate-800 dark:hover:bg-[#25b461]'}`}
                >
                  Próxima
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentName={nomeUsuario} 
        currentAvatar={avatarUrl}
        onSave={(novoNome, novoAvatar) => {
          setNomeUsuario(novoNome);
          if (novoAvatar !== undefined) setAvatarUrl(novoAvatar);
        }} 
      />
    </div>
  );
}