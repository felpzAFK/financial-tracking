"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useTheme } from 'next-themes';

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

  // Estados da Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function buscarHistorico() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setACarregar(false);
          return;
        }
        const userIdFinal = user.id;

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
  }, []);

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

  // Resetar a página para 1 sempre que o usuário digitar algo na pesquisa
  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#0f172a] font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      <header className="bg-[#2c3e50] dark:bg-[#1e293b] text-white p-4 flex justify-between items-center shadow-md dark:shadow-gray-900/50 sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center gap-3 ml-2 md:ml-5">
          <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md" />
          <div className={`text-xl text-[#25b461] hidden md:block ${brigends.className}`}>
            Financial Tracking
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition font-medium">Painel</Link>
          <Link href="/dashboard/historico" className="text-[#25b461] font-bold border-b-2 border-[#25b461] pb-1">Histórico</Link>
          <Link href="/dashboard/relatorios" className="text-gray-300 hover:text-white transition font-medium">Relatórios</Link>
        </nav>

        <div className="mr-2 md:mr-5 flex items-center gap-4">
          <Link href="/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white hidden sm:block">
            Voltar
          </Link>
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
  );
}