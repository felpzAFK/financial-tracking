"use client";

import { useState, useEffect } from "react";
import localFont from "next/font/local";

const brigends = localFont({
  src: "../../../public/fonts/Brigends.otf",
  display: "swap",
});

interface Props {
  saldo: number;
  gastosTotais: number;
  transacoes: any[];
}

export default function ConselheiroIA({
  saldo,
  gastosTotais,
  transacoes,
}: Props) {
  const [conselho, setConselho] = useState<string | null>(null);
  const [aCarregar, setACarregar] = useState(false);
  const [personalidade, setPersonalidade] = useState("rigoroso");

  useEffect(() => {
    const saved = localStorage.getItem("conselheiro_persona") || "rigoroso";
    setPersonalidade(saved);
  }, []);

  const pedirConselho = async () => {
    setACarregar(true);
    try {
      const currentPersona = localStorage.getItem("conselheiro_persona") || "rigoroso";
      setPersonalidade(currentPersona);

      const resposta = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saldo,
          gastosTotais,
          transacoes: transacoes.slice(0, 10),
          personalidade: currentPersona, 
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || "Erro desconhecido na API.");
      }

      if (dados.conselho) {
        setConselho(dados.conselho);
      }
    } catch (erro: any) {
      console.error(erro);

      setConselho(
        erro.message ||
          "A ligação com o Conselheiro caiu. Vai ter de refletir sozinho sobre as suas compras hoje!",
      );
    } finally {
      setACarregar(false);
    }
  };

  return (
    <div className="bg-slate-900 dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 text-white relative overflow-hidden border border-[#334155] dark:border-gray-700">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#25b461]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h2
            className={`text-2xl text-[#25b461] tracking-wide mb-3 flex items-center gap-3 ${brigends.className}`}
          >
            Conselheiro IA
            <span className="text-[10px] font-sans tracking-widest bg-white/10 px-2 py-1 rounded-md text-gray-400 uppercase">
              {personalidade}
            </span>
          </h2>
          {conselho ? (
            <p className="text-gray-200 italic font-medium leading-relaxed border-l-4 border-[#25b461] pl-4 py-1">
              &quot;{conselho}&quot;
            </p>
          ) : (
            <p className="text-gray-400 text-sm font-medium">
              Quer saber o que a Inteligência Artificial pensa dos seus hábitos
              financeiros deste mês? Peça uma opinião!
            </p>
          )}
        </div>

        <button
          onClick={pedirConselho}
          disabled={aCarregar || transacoes.length === 0}
          className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md flex-shrink-0 flex items-center justify-center gap-2 min-w-[220px]
            ${aCarregar || transacoes.length === 0 ? "bg-gray-700 cursor-not-allowed text-gray-400" : "bg-[#25b461] hover:bg-[#1e914d] text-white active:scale-95"}`}
        >
          {aCarregar ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>A analisar...</span>
            </>
          ) : (
            <span>
              🧠 {conselho ? "Pedir nova opinião" : "Analisar Finanças"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}