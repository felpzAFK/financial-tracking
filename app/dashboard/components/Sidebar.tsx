"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import localFont from "next/font/local";

const brigends = localFont({
  src: "../../../public/fonts/Brigends.otf",
  display: "swap",
});

interface SidebarProps {
  nomeUsuario: string;
  avatarUrl?: string | null; 
  onOpenProfileModal: () => void;
  onLogout: () => void;
}

export default function Sidebar({ nomeUsuario, avatarUrl, onOpenProfileModal, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) setMounted(true);
    return () => { isMounted = false; };
  }, []);

  const links = [
    { name: "Painel Principal", href: "/dashboard", icon: "📊" },
    { name: "Histórico Detalhado", href: "/dashboard/historico", icon: "📜" },
    { name: "Relatórios & Gráficos", href: "/dashboard/relatorios", icon: "📈" },
    { name: "Configurações", href: "/dashboard/configuracoes", icon: "⚙️" }, // NOVO LINK AQUI
  ];
  
  const inicialNome = nomeUsuario ? nomeUsuario.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header className="lg:hidden bg-[#2c3e50] dark:bg-[#1e293b] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-40 w-full">
        <div className="flex items-center gap-3">
          <Image src="/porcocaze1.PNG" alt="Logo" width={35} height={35} className="rounded-md" />
          <span className={`text-lg text-[#25b461] ${brigends.className}`}>FT</span>
        </div>
        <button onClick={() => setIsOpenMobile(!isOpenMobile)} className="text-white focus:outline-none text-2xl">
          {isOpenMobile ? "✕" : "☰"}
        </button>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2c3e50] dark:bg-[#1e293b] text-white p-6 flex flex-col justify-between shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:h-screen
        ${isOpenMobile ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 border-b border-gray-700/50 pb-4">
            <Image src="/porcocaze1.PNG" alt="Logo" width={42} height={42} className="rounded-md" />
            <div className={`text-lg text-[#25b461] tracking-wider leading-none ${brigends.className}`}>
               Financial<br /><span className="text-white text-xs tracking-widest">Tracking</span>
            </div>
          </div>

          <div className="bg-slate-700/30 dark:bg-slate-900/40 p-4 rounded-xl border border-white/5 flex items-center gap-3">
            <div
              onClick={onOpenProfileModal}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#25b461] to-emerald-400 flex items-center justify-center font-black text-white text-lg shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all select-none overflow-hidden relative"
              title="Clique aqui para editar o perfil">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="44px" />
              ) : (
                inicialNome
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Perfil</p>
              <h4 onClick={onOpenProfileModal} className="text-sm font-bold truncate text-white hover:text-[#25b461] cursor-pointer transition-colors">{nomeUsuario}</h4>
            </div>
          </div>

          <nav id="tour-sidebar" className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-1">Navegação</p>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpenMobile(false)}
                  className={`flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 gap-3 group ${
                    isActive 
                    ? "bg-[#25b461] text-white shadow-md shadow-green-600/10 scale-102" 
                    : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span> {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex flex-col gap-4 border-t border-gray-700/50 pt-4">
          <div className="bg-slate-800/60 dark:bg-slate-900/60 p-3 rounded-xl border border-white/5 mb-2">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
              <span>Nível de Poupança</span>
              <span className="text-[#25b461]">LVL 4</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#25b461] h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/20 hover:border-transparent active:scale-[0.98]"
          >
            🚪 Sair da Conta
          </button>
        </div>
      </aside>
      
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}
    </>
  );
}