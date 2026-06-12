"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {

    const consentimento = localStorage.getItem("cookie_consent");
    if (!consentimento) {
      setMostrar(true); 
    }
  }, []);

  const aceitarCookies = () => {
    localStorage.setItem("cookie_consent", "aceito");
    setMostrar(false);
  };

  const recusarCookies = () => {
    localStorage.setItem("cookie_consent", "recusado");
    setMostrar(false);
  };

  if (!mostrar) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6 pointer-events-none flex justify-center animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
            <span className="text-2xl">🍪</span>
            <h3 className="text-lg font-bold text-[#2c3e50] dark:text-white">Nós valorizamos a sua privacidade</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            O Financial Tracking utiliza cookies essenciais para garantir que consegue fazer o login com segurança e guardar as suas configurações. Não usamos cookies de publicidade. Pode ler mais na nossa <Link href="#" className="text-[#25b461] hover:underline">Política de Privacidade</Link>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={recusarCookies}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Apenas Essenciais
          </button>
          <button 
            onClick={aceitarCookies}
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#25b461] hover:bg-[#1e914d] shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all"
          >
            Aceitar Todos
          </button>
        </div>
        
      </div>
    </div>
  );
}