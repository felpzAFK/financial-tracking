"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState, useEffect } from "react";

const rugen = localFont({
  src: "../../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function RelatoriosPage() {
  // 👇 Estado para controlar a animação
  const [animarBarras, setAnimarBarras] = useState(false);

  // 👇 Dispara a animação logo após a tela montar
  useEffect(() => {
    // Um pequeno atraso de 100ms para dar tempo da transição de página terminar
    const timer = setTimeout(() => {
      setAnimarBarras(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const despesasPorCategoria = [
    { categoria: "Moradia", valor: 1600, cor: "bg-indigo-500", percentual: "45%" },
    { categoria: "Alimentação", valor: 650, cor: "bg-blue-500", percentual: "25%" },
    { categoria: "Transporte", valor: 300, cor: "bg-[#25b461]", percentual: "15%" },
    { categoria: "Lazer", valor: 200, cor: "bg-yellow-500", percentual: "10%" },
    { categoria: "Outros", valor: 100, cor: "bg-red-400", percentual: "5%" },
  ];

  const metasFinanceiras = [
    { titulo: "Reserva de Emergência", atual: 5420, meta: 10000, percentual: "54%", cor: "bg-[#25b461]" },
    { titulo: "Trocar de PC", atual: 1500, meta: 5000, percentual: "30%", cor: "bg-[#2c3e50]" },
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
          <Link href="/dashboard/historico" className="text-gray-300 hover:text-white transition font-medium">Histórico</Link>
          <Link href="/dashboard/relatorios" className="text-[#25b461] font-bold border-b-2 border-[#25b461] pb-1">Relatórios</Link>
        </nav>

        <div className="mr-2 md:mr-5 flex items-center gap-4">
          <Link href="/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white hidden sm:block">
            Voltar
          </Link>
          <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition text-sm text-white shadow-sm">
            Sair
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        
        {/* TÍTULO COM EFEITO 3D OFFSET */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className={`text-4xl text-[#2c3e50] tracking-wide ${rugen.className} [text-shadow:_3px_3px_0_#25b461]`}>
              Relatorios e Metas
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Acompanhe a distribuição dos seus gastos e o progresso dos seus objetivos.</p>
          </div>
          <button className="hidden md:block border-2 border-[#2c3e50] text-[#2c3e50] font-bold px-4 py-2 rounded-md hover:bg-[#2c3e50] hover:text-white transition active:scale-95 shadow-sm">
            Exportar PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SESSÃO 1: GRÁFICO DE DESPESAS */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <h2 className={`text-2xl text-[#2c3e50] mb-6 border-b border-gray-100 pb-4 ${rugen.className}`}>
              Despesas por Categoria
            </h2>
            
            <div className="space-y-5">
              {despesasPorCategoria.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                    <span>{item.categoria}</span>
                    <span>R$ {item.valor.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    {/* 👇 Aqui a mágica acontece: começa com 0% e vai para o percentual real */}
                    <div 
                      className={`${item.cor} h-3 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: animarBarras ? item.percentual : "0%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SESSÃO 2: METAS FINANCEIRAS */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <h2 className={`text-2xl text-[#2c3e50] mb-6 border-b border-gray-100 pb-4 ${rugen.className}`}>
              Metas Financeiras
            </h2>
            
            <div className="space-y-8">
              {metasFinanceiras.map((meta, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{meta.titulo}</h3>
                    <div className="text-right">
                      <span className="text-xl font-bold text-gray-800">R$ {meta.atual.toLocaleString('pt-BR')}</span>
                      <span className="text-sm text-gray-400 font-medium block">de R$ {meta.meta.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative border border-gray-200">
                    {/* 👇 Mágica aplicada nas metas também */}
                    <div 
                      className={`${meta.cor} h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                      style={{ width: animarBarras ? meta.percentual : "0%" }}
                    >
                      <span className="text-[10px] text-white font-bold whitespace-nowrap opacity-90">
                        {animarBarras ? meta.percentual : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full border-2 border-dashed border-gray-300 text-gray-500 font-bold py-3 rounded-lg hover:border-[#25b461] hover:text-[#25b461] transition active:scale-95 flex items-center justify-center gap-2">
              <span>+</span> Criar Nova Meta
            </button>
          </section>

        </div>

        {/* SESSÃO EXTRA: CARD DE ALERTA DE SAÚDE FINANCEIRA */}
        <section className="mt-8 bg-gradient-to-r from-[#2c3e50] to-[#1a252f] rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between border-l-4 border-[#25b461]">
          <div className="mb-4 md:mb-0">
            <h3 className={`text-white text-xl tracking-wide ${rugen.className}`}>Saude Financeira: Excelente</h3>
            <p className="text-gray-300 mt-1 text-sm">Você economizou 15% a mais este mês em comparação com o mês passado.</p>
          </div>
          <div className="text-right">
            <Link href="/dashboard/historico" className="bg-[#25b461] hover:bg-[#1e914d] text-white px-6 py-2.5 rounded-lg font-bold transition active:scale-95 shadow-md inline-block">
              Ver Histórico
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}