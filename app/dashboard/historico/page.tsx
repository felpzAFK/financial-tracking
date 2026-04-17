"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState } from "react";

const rugen = localFont({
  src: "../../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function HistoricoPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados para popular a tabela larga
  const transacoes = [
    { id: 1, desc: "Salário Empresa X", cat: "Renda", data: "10/04/2026", valor: 4500.00, tipo: "receita" },
    { id: 2, desc: "Supermercado Líder", cat: "Alimentação", data: "11/04/2026", valor: 350.20, tipo: "despesa" },
    { id: 3, desc: "Posto Shell", cat: "Transporte", data: "12/04/2026", valor: 150.00, tipo: "despesa" },
    { id: 4, desc: "Assinatura Netflix", cat: "Lazer", data: "13/04/2026", valor: 55.90, tipo: "despesa" },
    { id: 5, desc: "Freelance Design", cat: "Renda Extra", data: "14/04/2026", valor: 800.00, tipo: "receita" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-gray-800">
      
{/* HEADER REUTILIZADO COM MENU */}
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
        
        {/* TÍTULO COM EFEITO 3D OFFSET */}
        <div className="mb-8">
          <h1 className={`text-4xl text-[#2c3e50] tracking-wide ${rugen.className} [text-shadow:_3px_3px_0_#25b461]`}>
            Historico Detalhado
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Consulte e filtre todas as suas movimentações financeiras.</p>
        </div>

        {/* BARRA DE FERRAMENTAS (BUSCA E FILTROS) */}
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
          <div className="flex gap-2 w-full md:w-auto">
            <select className="flex-1 md:flex-none p-2.5 border border-gray-200 rounded-lg bg-white text-sm font-bold text-gray-600 focus:outline-none focus:border-[#25b461]">
              <option>Todos os Tipos</option>
              <option>Entradas</option>
              <option>Saídas</option>
            </select>
            <select className="flex-1 md:flex-none p-2.5 border border-gray-200 rounded-lg bg-white text-sm font-bold text-gray-600 focus:outline-none focus:border-[#25b461]">
              <option>Últimos 30 dias</option>
              <option>Abril / 2026</option>
              <option>Março / 2026</option>
            </select>
          </div>
        </section>

        {/* TABELA COMPLETA */}
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
                {transacoes.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.data}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.desc}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {item.cat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                      <span className={item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                        {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* PAGINAÇÃO SIMULADA */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Mostrando 5 de 42 transações</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-md text-sm font-bold text-gray-400 cursor-not-allowed bg-white">Anterior</button>
              <button className="px-4 py-2 border border-[#25b461] rounded-md text-sm font-bold text-[#25b461] hover:bg-[#25b461] hover:text-white transition bg-white">Próxima</button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}