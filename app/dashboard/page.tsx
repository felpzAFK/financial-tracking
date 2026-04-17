"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const rugen = localFont({
  src: "../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function DashboardInterno() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valorInput, setValorInput] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  
  const [descricaoInput, setDescricaoInput] = useState("");
  const [tipoInput, setTipoInput] = useState("despesa");
  const [dataInput, setDataInput] = useState(new Date().toISOString().split('T')[0]);

  const totalReceitas = transacoes
    .filter((t: any) => t.tipo === 'receita')
    .reduce((acc: number, t: any) => acc + Number(t.valor), 0);

  const totalDespesas = transacoes
    .filter((t: any) => t.tipo === 'despesa')
    .reduce((acc: number, t: any) => acc + Number(t.valor), 0);

  const saldoAtual = totalReceitas - totalDespesas;
  
  const salvarNovaTransacao = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userIdFinal = user?.id || 'e217e6c8-f132-40f5-81fe-b72bb00849ea';

      if (!valorInput) return alert("Digite um valor!");

      const valorNumerico = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));

      const { error } = await supabase.from('transactions').insert([{
        description: descricaoInput || "Nova Transação",
        amount: valorNumerico,
        type: tipoInput,
        user_id: userIdFinal,
        date: dataInput
      }]);

      if (error) throw error;

      setIsModalOpen(false);
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar! Verifique a conexão.");
    }
  };

  useEffect(() => {
    const buscarDadosReais = async () => {
      try {
        setACarregar(true);
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Lógica do Nome
        if (user) {
          const { data: profile } = await supabase.from('users').select('username').eq('id', user.id).single();
          setNomeUsuario(profile?.username || user.email?.split('@')[0] || "Usuário");
        } else {
          const cookieValue = document.cookie.split('; ').find(row => row.startsWith('finance_user_name='))?.split('=')[1];
          if (cookieValue) {
            const emailDecodificado = decodeURIComponent(cookieValue);
            setNomeUsuario(emailDecodificado.split('@')[0]);
          } else {
            setNomeUsuario("Usuário");
          }
        }

        // 2. Busca de Transações com Filtro Inteligente (Opção B)
        let query = supabase.from('transactions').select('*');

        if (user?.id) {
          // Se o professor criar conta, vê só o dele
          query = query.eq('user_id', user.id);
        } else {
          // Se for o login do Felipe (via API), usa o ID fixo para não dar erro
          query = query.eq('user_id', 'e217e6c8-f132-40f5-81fe-b72bb00849ea');
        }

        const { data, error } = await query.order('date', { ascending: false });

        if (error) throw error;

        if (data) {
          const formatadas = data.map((t: any) => ({
            id: t.id,
            descricao: t.description,
            valor: t.amount,
            tipo: t.type,
            data: new Date(t.date).toLocaleDateString('pt-BR')
          }));
          setTransacoes(formatadas);
        }
      } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
      } finally {
        setACarregar(false);
      }
    };

    buscarDadosReais();
  }, []);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") { setValorInput(""); return; }
    value = (Number(value) / 100).toFixed(2) + "";
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    setValorInput(value);
  };

  const lidarComSair = async () => {
    await supabase.auth.signOut();
    document.cookie = "finance_user_name=; Max-Age=0; path=/;";
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
          <span className="text-sm text-gray-300 hidden sm:block">Olá, <strong className="text-white">{nomeUsuario}</strong></span>
          <button onClick={lidarComSair} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white shadow-sm">Sair</button>
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2 group-hover:text-[#25b461] transition-colors uppercase">Entradas</h3>
            <div className={`text-2xl text-[#25b461] ${rugen.className}`}>R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2 group-hover:text-red-500 transition-colors uppercase">Saídas</h3>
            <div className={`text-2xl text-red-500 ${rugen.className}`}>R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#2c3e50]"></div>
            <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2 group-hover:text-[#2c3e50] transition-colors uppercase">Saldo Atual</h3>
            <div className={`text-3xl text-[#2c3e50] ${rugen.className}`}>R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Últimas Transações</h2>
            <button onClick={() => setIsModalOpen(true)} className="md:hidden bg-[#25b461] text-white p-2 rounded-md text-sm font-bold active:scale-95 transition-transform">+ Nova</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase font-semibold bg-white border-b border-gray-100">
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {aCarregar ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold animate-pulse">A puxar dados do servidor... ⏳</td></tr>
                ) : transacoes.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold">Nenhuma transação encontrada.</td></tr>
                ) : (
                  transacoes.map((item: any) => (
                    <tr key={item.id} className="hover:bg-green-50/30 transition-colors group">
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.data}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.descricao}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.tipo === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${item.tipo === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
                        {item.tipo === 'receita' ? '+' : '-'} R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-[#2c3e50]">Nova Transação</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition font-bold text-xl">✕</button>
            </div>
            <div className="p-6">
              <form className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                  <input type="text" value={descricaoInput} onChange={(e) => setDescricaoInput(e.target.value)} placeholder="Ex: Conta de Luz" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Valor (R$)</label>
                  <input type="text" value={valorInput} onChange={handleValorChange} placeholder="0,00" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                    <select value={tipoInput} onChange={(e) => setTipoInput(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition bg-white">
                      <option value="despesa">Saída (Despesa)</option>
                      <option value="receita">Entrada (Receita)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                    <input type="date" value={dataInput} onChange={(e) => setDataInput(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition text-gray-600" />
                  </div>
                </div>
                <button type="button" onClick={salvarNovaTransacao} className="w-full bg-[#25b461] hover:bg-[#1e914d] text-white font-bold py-3 rounded-lg mt-2 transition active:scale-[0.98]">Salvar Transação</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}