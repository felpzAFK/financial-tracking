"use client";

import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useTheme } from "next-themes";
import Sidebar from "../components/Sidebar";
import ProfileModal from "../components/ProfileModal";

const brigends = localFont({
  src: "../../../public/fonts/Brigends.otf",
  display: "swap",
});

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Utilizador");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Estados reais para as configurações
  const [alertaImpulso, setAlertaImpulso] = useState(true);
  const [conselheiroPersonalidade, setConselheiroPersonalidade] = useState("rigoroso");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setMounted(true);
      
      const savedPersona = localStorage.getItem("conselheiro_persona") || "rigoroso";
      setConselheiroPersonalidade(savedPersona);
      
      const savedAlerta = localStorage.getItem("alerta_impulso");
      if (savedAlerta !== null) {
        setAlertaImpulso(savedAlerta === "true");
      }
    }
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    async function carregarPerfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmailUsuario(user.email || "");
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', user.id)
          .single();
        setNomeUsuario(profile?.display_name || user.email?.split('@')[0] || "Utilizador");
        setAvatarUrl(profile?.avatar_url || null);
      }
    }
    carregarPerfil();
  }, [supabase]);

  const lidarComSair = async () => {
    await supabase.auth.signOut();
    document.cookie = "finance_user_name=; Max-Age=0; path=/;";
    document.cookie = "finance_user_id=; Max-Age=0; path=/;";
    window.location.href = "/login";
  };

  const mudarPersonalidade = (tipo: string) => {
    setConselheiroPersonalidade(tipo);
    localStorage.setItem("conselheiro_persona", tipo);
  };

  const toggleAlerta = () => {
    const novoEstado = !alertaImpulso;
    setAlertaImpulso(novoEstado);
    localStorage.setItem("alerta_impulso", String(novoEstado));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#0f172a] font-sans text-gray-800 dark:text-gray-100 flex flex-col lg:flex-row transition-colors duration-300">
      
      <Sidebar 
        nomeUsuario={nomeUsuario} 
        avatarUrl={avatarUrl}
        onOpenProfileModal={() => setIsProfileModalOpen(true)} 
        onLogout={lidarComSair} 
      />

      <div className="flex-1 min-w-0 pb-12">
        <main className="p-4 md:p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-4xl text-[#2c3e50] dark:text-white tracking-wide ${brigends.className} [text-shadow:_3px_3px_0_#25b461] dark:[text-shadow:_2px_2px_0_#1e914d]`}>
              Configurações
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Personaliza a tua experiência e ajusta as preferências da tua conta.</p>
          </div>
          
          <div className="space-y-6">
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                <span className="text-2xl">🎨</span>
                <h2 className="text-xl font-bold text-[#2c3e50] dark:text-white">Aparência</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">Tema da Interface</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Altera entre o modo claro e escuro para melhor conforto visual.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    ☀️ Claro
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    🌙 Escuro
                  </button>
                </div>
              </div>
            </section>
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                <span className="text-2xl">👤</span>
                <h2 className="text-xl font-bold text-[#2c3e50] dark:text-white">Dados do Perfil</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome de Exibição</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      disabled 
                      value={nomeUsuario} 
                      className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-l-lg text-gray-500 dark:text-gray-400 font-medium"
                    />
                    <button 
                      onClick={() => setIsProfileModalOpen(true)}
                      className="bg-[#2c3e50] dark:bg-slate-700 hover:bg-[#1a252f] text-white px-4 py-3 rounded-r-lg font-bold transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">E-mail de Acesso</label>
                  <input 
                    type="text" 
                    disabled 
                    value={emailUsuario} 
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 dark:text-gray-400 font-medium"
                  />
                </div>
              </div>
            </section>
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                <span className="text-2xl">🎮</span>
                <h2 className="text-xl font-bold text-[#2c3e50] dark:text-white">Gamificação & IA</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      Alerta de Impulso 🚨
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Exige confirmação extra ao registar gastos de Dopamina altos.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={alertaImpulso} 
                      onChange={toggleAlerta} 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#25b461]"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700/50">
                  <p className="font-bold text-gray-800 dark:text-gray-200 mb-3">Personalidade do Conselheiro IA</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button 
                      onClick={() => mudarPersonalidade('amigavel')}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${conselheiroPersonalidade === 'amigavel' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400'}`}
                    >
                      🤝 Amigável
                    </button>
                    <button 
                      onClick={() => mudarPersonalidade('rigoroso')}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${conselheiroPersonalidade === 'rigoroso' ? 'border-[#25b461] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400'}`}
                    >
                      🪖 Sargento Rigoroso
                    </button>
                    <button 
                      onClick={() => mudarPersonalidade('frio')}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${conselheiroPersonalidade === 'frio' ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400'}`}
                    >
                      🧊 Frio & Calculista
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
      
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