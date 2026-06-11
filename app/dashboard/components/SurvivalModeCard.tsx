"use client";

import { useEffect, useState } from "react";

interface Props {
  saldo: number;
}

export default function SurvivalModeCard({ saldo }: Props) {
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
       setMontado(true);
    }
    return () => { isMounted = false; };
  }, []);

  if (!montado) return null;

  const hoje = new Date();
  const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  const diasRestantes = diasNoMes - hoje.getDate() + 1; 

  const orcamentoDiario = saldo / diasRestantes;

  let status = '';
  let corBg = '';
  let corBorda = '';
  let corTexto = '';
  let icone = '';
  let mensagem = '';
  let barraProgressoCor = '';

  if (orcamentoDiario >= 50) {
    status = 'Ritmo Confortável';
    corBg = 'bg-emerald-50 dark:bg-emerald-900/20';
    corBorda = 'border-emerald-500';
    corTexto = 'text-emerald-700 dark:text-emerald-400';
    icone = '✅';
    mensagem = 'O seu planeamento está equilibrado. Margem segura para os próximos dias.';
    barraProgressoCor = 'bg-emerald-500';
  } else if (orcamentoDiario > 0 && orcamentoDiario < 50) {
    status = 'Atenção ao Orçamento';
    corBg = 'bg-amber-50 dark:bg-amber-900/20';
    corBorda = 'border-amber-500';
    corTexto = 'text-amber-700 dark:text-amber-400';
    icone = '⚠️';
    mensagem = 'A sua margem diária está a diminuir. Recomenda-se evitar gastos variáveis.';
    barraProgressoCor = 'bg-amber-500';
  } else {
    status = 'Estado Crítico';
    corBg = 'bg-red-50 dark:bg-red-900/20';
    corBorda = 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    corTexto = 'text-red-700 dark:text-red-400';
    icone = '🚨';
    mensagem = 'Orçamento esgotado para a meta diária. Contenha despesas imediatamente.';
    barraProgressoCor = 'bg-red-600 animate-pulse';
  }

  const percentualVida = Math.min(Math.max((orcamentoDiario / 100) * 100, 5), 100);

  return (
    <section className={`p-6 rounded-2xl border-2 transition-all duration-300 mb-6 ${corBg} ${corBorda}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icone}</span>
            <h2 className={`text-lg font-black uppercase tracking-wider ${corTexto}`} style={{ fontFamily: 'Brigends' }}>
              Modo Sobrevivência
            </h2>
          </div>
          <h3 className={`text-xl font-bold mb-1 ${corTexto}`}>{status}</h3>
          <p className="text-sm font-medium opacity-80 dark:opacity-90">{mensagem}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/10 min-w-[200px] text-center">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
            Meta de Gasto Diário
          </p>
          <p className={`text-3xl font-black ${corTexto}`}>
            R$ {Math.max(0, orcamentoDiario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            para os próximos {diasRestantes} dias
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
          <span>R$ 0 (Crítico)</span>
          <span>R$ 100+ (Confortável)</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${barraProgressoCor}`} 
            style={{ width: `${saldo <= 0 ? 100 : percentualVida}%` }} 
          ></div>
        </div>
      </div>
    </section>
  );
}