"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState } from "react";

const rugen = localFont({
  src: "../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function DashboardInterno() {
  const userName = "alanzoka"; 
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-gray-800 relative">
      
      {/* HEADER INTERNO */}
      <header className="bg-[#2c3e50] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3 ml-2 md:ml-5">
          <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md" />
          <div className={`text-xl text-[#25b461] hidden md:block ${rugen.className}`}>
            Financial Tracking
          </div>
        </div>
        <div className="mr-2 md:mr-5 flex items-center gap-4">
          <span className="text-sm text-gray-300 hidden sm:block">Olá, <strong className="text-white">{userName}</strong></span>
          <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white shadow-sm">
            Sair
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        
        {/* BOAS-VINDAS E HEADER DA PAGE */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className={`text-3xl text-[#2c3e50] tracking-wide ${rugen.className}`}>
              Bem-vindo de volta, {userName} 
            </h1>
            <p className="text-gray-500 mt-1">Aqui está o resumo das suas finanças deste mês.</p>
          </div>
          {/* BOTÃO NOVA TRANSAÇÃO (TOPO) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex bg-[#25b461] hover:bg-[#1e914d] active:scale-95 transition-transform duration-200 text-white px-5 py-2.5 rounded-lg font-bold shadow-md items-center gap-2"
          >
            <span>+</span> Nova Transação
          </button>
        </div>

        {/* CARDS DE RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Entradas</h3>
            <p className={`text-3xl text-green-600 ${rugen.className}`}>R$ 4.500,00</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Saídas</h3>
            <p className={`text-3xl text-red-500 ${rugen.className}`}>R$ 1.850,00</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Saldo Atual</h3>
            <p className={`text-3xl text-[#2c3e50] ${rugen.className}`}>R$ 2.650,00</p>
          </div>
        </section>

        {/* TABELA DE TRANSAÇÕES */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Últimas Transações</h2>
             {/* BOTÃO NOVA TRANSAÇÃO (MOBILE) */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="md:hidden bg-[#25b461] text-white p-2 rounded-md text-sm font-bold active:scale-95 transition-transform"
            >
              + Nova
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase font-semibold bg-white border-b border-gray-100">
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">Salário da Empresa</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Receita</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">10/04/2026</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">+ R$ 4.500,00</td>
                </tr>
                <tr className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">Conta de Luz</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Despesa</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">12/04/2026</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-500 text-right">- R$ 250,00</td>
                </tr>
                <tr className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">Aluguel</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Despesa</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">15/04/2026</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-500 text-right">- R$ 1.600,00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <button className="text-[#25b461] hover:text-[#1e914d] text-sm font-bold hover:underline">
              Ver todo o histórico
            </button>
          </div>
        </section>
      </main>

      {/* MODAL DE NOVA TRANSAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 anima-fundo">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden anima-modal">
            
            {/* Cabeçalho do Modal */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-[#2c3e50]">Nova Transação</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition font-bold text-xl"
              >
                ✕
              </button>
            </div>
            
            {/* Formulário */}
            <div className="p-6">
              <form className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                  <input type="text" placeholder="Ex: Conta de Luz" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Valor (R$)</label>
                  <input type="number" placeholder="0,00" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition bg-white">
                      <option value="despesa">Saída (Despesa)</option>
                      <option value="receita">Entrada (Receita)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                    <input type="date" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition text-gray-600" />
                  </div>
                </div>

                <button 
                  type="button"
                  className="w-full bg-[#25b461] hover:bg-[#1e914d] text-white font-bold py-3 rounded-lg mt-2 transition active:scale-[0.98]"
                >
                  Salvar Transação
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}