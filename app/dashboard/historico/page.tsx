"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const rugen = localFont({
  src: "../../../public/fonts/RugenExpanded.ttf",
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
}

export default function HistoricoPage() {
  const [transacoes, setTransacoes] = useState<TransacaoHistorico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [aCarregar, setACarregar] = useState(true);

  // Estados da Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  useEffect(() => {
    async function buscarHistorico() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const cookieId = document.cookie.split('; ').find(row => row.startsWith('finance_user_id='))?.split('=')[1];
        const userIdFinal = user?.id || cookieId || 'e217e6c8-f132-40f5-81fe-b72bb00849ea';

        // Busca as transações reais ordenadas da mais recente para a mais antiga
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
            return {
              id: t.id,
              descricao: t.description,
              categoria: "Geral", // Categoria fixa até o BD ser atualizado
              valor: t.amount,
              tipo: t.type,
              data: `${dia}/${mes}/${ano}`,
              receipt_url: t.receipt_url
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

  // 1. Lógica do Filtro de Pesquisa
  const transacoesFiltradas = transacoes.filter((t) => 
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Lógica da Paginação
  const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina);
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;
  const transacoesDaPagina = transacoesFiltradas.slice(indexInicio, indexFim);

  // Funções de navegação
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
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-gray-800">
      
      <header className="bg-[#2c3e50] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3 ml-2 md:ml-5">
          <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md" />
          <div className={`text-xl text-[#25b461] hidden md:block ${rugen.className}`}>
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
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-4xl text-[#2c3e50] tracking-wide ${rugen.className} [text-shadow:_3px_3px_0_#25b461]`}>
            Historico Detalhado
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Consulte e filtre todas as suas movimentações financeiras reais.</p>
        </div>

        {/* 1. BARRA DE PESQUISA FUNCIONAL */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/2">
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por descrição..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* TABELA DE HISTÓRICO */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400">Data</th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400">Descrição</th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400">Categoria</th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {aCarregar ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">A carregar histórico...</td>
                  </tr>
                ) : transacoesDaPagina.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">Nenhuma transação encontrada.</td>
                  </tr>
                ) : (
                  transacoesDaPagina.map((item) => (
                    <tr key={item.id} className="hover:bg-green-50/30 transition-colors group">
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.data}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800">{item.descricao}</div>
                        {item.receipt_url && (
                          <a 
                            href={item.receipt_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-[#25b461] hover:text-[#1e914d] hover:underline flex items-center gap-1 mt-1 font-semibold"
                          >
                            🔗 Ver Comprovante
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                        <span className={item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                          {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* 2. PAGINAÇÃO REAL E DINÂMICA */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">
              Mostrando {transacoesFiltradas.length === 0 ? 0 : indexInicio + 1} a {Math.min(indexFim, transacoesFiltradas.length)} de {transacoesFiltradas.length} transações
            </span>
            <div className="flex gap-2">
              <button 
                onClick={irParaPaginaAnterior}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 border rounded-md text-sm font-bold transition ${paginaAtual === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-[#25b461] text-[#25b461] hover:bg-[#25b461] hover:text-white bg-white'}`}
              >
                Anterior
              </button>
              <button 
                onClick={irParaProximaPagina}
                disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                className={`px-4 py-2 border rounded-md text-sm font-bold transition ${paginaAtual === totalPaginas || totalPaginas === 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-[#25b461] text-[#25b461] hover:bg-[#25b461] hover:text-white bg-white'}`}
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