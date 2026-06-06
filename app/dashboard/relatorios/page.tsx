"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from 'next-themes';

const brigends = localFont({
  src: "../../../public/fonts/Brigends.otf",
  display: "swap",
});

interface DadosMensais {
  mes: string;
  receitas: number;
  despesas: number;
}

interface DadosDespesas {
  name: string;
  value: number;
  fill: string;
}

export default function RelatoriosPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [dadosMensais, setDadosMensais] = useState<DadosMensais[]>([]);
  const [dadosDespesas, setDadosDespesas] = useState<DadosDespesas[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function carregarRelatorios() {
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
          .order('date', { ascending: true });

        if (error) throw error;

        if (data) {
          const receitasMes: Record<string, number> = {};
          const despesasMes: Record<string, number> = {};
          const despesasCategoria: Record<string, { value: number, color: string }> = {};

          data.forEach((t: any) => {
            const dataPura = t.date.split('T')[0];
            const [ano, mes] = dataPura.split('-');
            const mesAno = `${mes}/${ano}`; 

            if (t.type === 'receita') {
              receitasMes[mesAno] = (receitasMes[mesAno] || 0) + t.amount;
            } else if (t.type === 'despesa') {
              despesasMes[mesAno] = (despesasMes[mesAno] || 0) + t.amount;
              const cat = categoriasData?.find((c: any) => c.id === t.category_id);
              const nomeCategoria = cat ? `${cat.icon} ${cat.name}` : "Geral";
              const corCategoria = cat ? cat.color : "#9ca3af";
              if (!despesasCategoria[nomeCategoria]) {
                despesasCategoria[nomeCategoria] = { value: 0, color: corCategoria };
              }
              despesasCategoria[nomeCategoria].value += t.amount;
            }
          });

          const mesesUnicos = Array.from(new Set([...Object.keys(receitasMes), ...Object.keys(despesasMes)])).sort();
          const formatadoMensal = mesesUnicos.map(mes => ({
            mes,
            receitas: receitasMes[mes] || 0,
            despesas: despesasMes[mes] || 0
          }));

            const formatadoDespesas = Object.entries(despesasCategoria)
            .map(([name, infos]) => ({ name, value: infos.value, fill: infos.color }))
            .sort((a, b) => b.value - a.value);

          setDadosMensais(formatadoMensal);
          setDadosDespesas(formatadoDespesas);
        }
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
      } finally {
        setACarregar(false);
      }
    }

    carregarRelatorios();
  }, [supabase]);

  // Define as cores dos eixos baseadas no tema
  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      <header className="bg-[#2c3e50] dark:bg-[#1e293b] text-white p-4 flex justify-between items-center shadow-md dark:shadow-gray-900/50 sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center gap-3 ml-2 md:ml-5">
          <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md" />
          <div className={`text-xl text-[#25b461] hidden md:block ${brigends.className}`}>
            Financial Tracking
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition font-medium">Painel</Link>
          <Link href="/dashboard/historico" className="text-gray-300 hover:text-white transition font-medium">Histórico</Link>
          <Link href="/dashboard/relatorios" className="text-[#25b461] font-bold border-b-2 border-[#25b461] pb-1">Relatórios</Link>
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
            Visão Geral
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Analise a saúde das suas finanças com gráficos baseados em dados reais.</p>
        </div>

        {aCarregar ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#25b461]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-lg font-bold text-[#2c3e50] dark:text-white mb-6">Receitas vs. Despesas</h2>
              <div className="h-80 w-full">
                {dadosMensais.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosMensais} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: textColor }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor }} dx={-10} />
                      <Tooltip cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', color: textColor }} />
                      <Bar dataKey="receitas" name="Receitas" fill="#25b461" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Sem dados suficientes.</div>
                )}
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-lg font-bold text-[#2c3e50] dark:text-white mb-6">Maiores Despesas</h2>
              <div className="h-80 w-full">
                {dadosDespesas.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosDespesas}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dadosDespesas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: unknown) => `R$ ${Number(value || 0).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }} />
                      <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ color: textColor }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Ainda não registou despesas.</div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}