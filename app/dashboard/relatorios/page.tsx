"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const rugen = localFont({
  src: "../../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

const CORES_PIZZA = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

interface DadosMensais {
  mes: string;
  receitas: number;
  despesas: number;
}

interface DadosDespesas {
  name: string;
  value: number;
}

export default function RelatoriosPage() {
  // 2. APLICAMOS AS INTERFACES AQUI
  const [dadosMensais, setDadosMensais] = useState<DadosMensais[]>([]);
  const [dadosDespesas, setDadosDespesas] = useState<DadosDespesas[]>([]);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    async function carregarRelatorios() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const cookieId = document.cookie.split('; ').find(row => row.startsWith('finance_user_id='))?.split('=')[1];
        const userIdFinal = user?.id || cookieId || 'e217e6c8-f132-40f5-81fe-b72bb00849ea';

        const { data, error } = await supabase
          .from('transactions')
          .select('amount, type, date, description')
          .eq('user_id', userIdFinal);

        if (error) throw error;

        if (data) {
          const mesesAgrupados: Record<string, DadosMensais> = {};
          
          data.forEach(t => {
            const dataObj = new Date(t.date);
            const nomeMes = dataObj.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
            const ano = dataObj.getFullYear().toString().slice(-2);
            const labelMes = `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}/${ano}`;

            if (!mesesAgrupados[labelMes]) {
              mesesAgrupados[labelMes] = { mes: labelMes, receitas: 0, despesas: 0 };
            }

            if (t.type === 'receita') {
              mesesAgrupados[labelMes].receitas += t.amount;
            } else {
              mesesAgrupados[labelMes].despesas += t.amount;
            }
          });

          setDadosMensais(Object.values(mesesAgrupados));

          const despesas = data.filter(t => t.type === 'despesa');
          const despesasAgrupadas: Record<string, number> = {};

          despesas.forEach(d => {
            if (!despesasAgrupadas[d.description]) despesasAgrupadas[d.description] = 0;
            despesasAgrupadas[d.description] += d.amount;
          });

          const topDespesas: DadosDespesas[] = Object.keys(despesasAgrupadas)
            .map(chave => ({ name: chave, value: despesasAgrupadas[chave] }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

          setDadosDespesas(topDespesas);
        }
      } catch (erro) {
        console.error("Erro ao carregar relatórios:", erro);
      } finally {
        setACarregar(false);
      }
    }

    carregarRelatorios();
  }, []);

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
          <Link href="/dashboard/historico" className="text-gray-300 hover:text-white transition font-medium">Histórico</Link>
          <Link href="/dashboard/relatorios" className="text-[#25b461] font-bold border-b-2 border-[#25b461] pb-1">Relatórios</Link>
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
            Visao Geral
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Analise a saúde das suas finanças com gráficos baseados em dados reais.</p>
        </div>

        {aCarregar ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#25b461]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#2c3e50] mb-6">Receitas vs. Despesas (Evolução)</h2>
              <div className="h-80 w-full">
                {dadosMensais.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosMensais} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
                      <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="receitas" name="Receitas" fill="#25b461" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">Sem dados suficientes.</div>
                )}
              </div>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#2c3e50] mb-6">As Suas Maiores Despesas</h2>
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
                          <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: unknown) => `R$ ${Number(value || 0).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">Ainda não registou despesas.</div>
                )}
              </div>
            </section>

          </div>
        )}
      </main>

    </div>
  );
}