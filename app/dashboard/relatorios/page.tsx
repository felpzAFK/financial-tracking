"use client";

import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import Sidebar from "../components/Sidebar";
import ProfileModal from "../components/ProfileModal";

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

interface DadosIntencao {
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
  const [dadosIntencao, setDadosIntencao] = useState<DadosIntencao[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState("Utilizador");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { theme } = useTheme();
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
          .order('date', { ascending: true });

        if (error) throw error;

        if (data) {
          const receitasMes: Record<string, number> = {};
          const despesasMes: Record<string, number> = {};
          const despesasCategoria: Record<string, { value: number, color: string }> = {};
          
          // Agrupador para a Gamificação
          const intencaoGastos: Record<string, { value: number, color: string, label: string }> = {
            survival: { value: 0, color: '#3b82f6', label: '🛒 Necessidade' },
            well_being: { value: 0, color: '#10b981', label: '🌱 Qualidade de vida' },
            dopamine: { value: 0, color: '#a855f7', label: '⚡ Impulso' }
          };

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

              // Processa Intenção do Gasto (Gamificação)
              if (t.expense_intent && intencaoGastos[t.expense_intent]) {
                intencaoGastos[t.expense_intent].value += t.amount;
              }
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

          const formatadoIntencao = Object.values(intencaoGastos)
            .filter(i => i.value > 0)
            .map(i => ({ name: i.label, value: i.value, fill: i.color }));

          setDadosMensais(formatadoMensal);
          setDadosDespesas(formatadoDespesas);
          setDadosIntencao(formatadoIntencao);
        }
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
      } finally {
        setACarregar(false);
      }
    }

    carregarRelatorios();
  }, [supabase]);

  const lidarComSair = async () => {
    await supabase.auth.signOut();
    document.cookie = "finance_user_name=; Max-Age=0; path=/;";
    document.cookie = "finance_user_id=; Max-Age=0; path=/;";
    window.location.href = "/login";
  };

  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const totalDopamina = dadosIntencao.find(d => d.name.includes('Impulso'))?.value || 0;
  const totalIntencoes = dadosIntencao.reduce((acc, curr) => acc + curr.value, 0);
  const percentagemDopamina = totalIntencoes > 0 ? Math.round((totalDopamina / totalIntencoes) * 100) : 0;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar 
        nomeUsuario={nomeUsuario} 
        avatarUrl={avatarUrl}
        onOpenProfileModal={() => setIsProfileModalOpen(true)} 
        onLogout={lidarComSair}/>
      <div className="flex-1 min-w-0 pb-12">
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h1 className={`text-4xl text-[#2c3e50] dark:text-white tracking-wide ${brigends.className} [text-shadow:_3px_3px_0_#25b461] dark:[text-shadow:_2px_2px_0_#1e914d]`}>
                Visão Geral
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Analise a saúde das suas finanças com gráficos baseados em dados reais.</p>
            </div>
            {percentagemDopamina > 0 && (
              <div className="mt-4 md:mt-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa de Dopamina</p>
                  <p className={`text-xl font-black ${percentagemDopamina > 30 ? 'text-red-500' : 'text-purple-500'}`}>
                    {percentagemDopamina}% <span className="text-sm font-medium text-gray-500">dos gastos</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {aCarregar ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#25b461]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors lg:col-span-2">
                <h2 className="text-lg font-bold text-[#2c3e50] dark:text-white mb-6">Receitas vs. Despesas (Evolução)</h2>
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
                    <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">Sem dados suficientes.</div>
                  )}
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <h2 className="text-lg font-bold text-[#2c3e50] dark:text-white mb-6">Maiores Despesas (Categorias)</h2>
                <div className="h-80 w-full">
                  {dadosDespesas.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosDespesas}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dadosDespesas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: unknown) => `R$ ${Number(value || 0).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }} />
                        <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ color: textColor, paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">Ainda não registou despesas.</div>
                  )}
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-5 text-9xl pointer-events-none">⚡</div>
                <h2 className="text-lg font-bold text-[#2c3e50] dark:text-white mb-6">Índice de Dopamina (Gamificação)</h2>
                <div className="h-80 w-full">
                  {dadosIntencao.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosIntencao}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dadosIntencao.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: unknown) => `R$ ${Number(value || 0).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }} />
                        <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ color: textColor, paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">Registe gastos para ver o seu perfil.</div>
                  )}
                </div>
              </section>

            </div>
          )}
        </main>
      </div>

      {/* Modal de perfil */}
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