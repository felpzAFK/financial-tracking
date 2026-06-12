"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';

export default function TutorialBoasVindas() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const tutorialConcluido = localStorage.getItem("tutorial_concluido");
    if (!tutorialConcluido) {
      setIsVisible(true);
    }
  }, []);

  const steps = [
    {
      title: "🎉 Bem-vindo(a) ao Financial Tracking. Seu Controle Financeiro!",
      content: (
        <p className="text-gray-600 dark:text-gray-300">
          Estamos muito felizes em ter você por aqui. Vamos fazer um tour rápido para você aprender a usar a plataforma e dominar as suas finanças.
        </p>
      ),
      targetId: null, // Fica centrado
    },
    {
      title: "👤 Como podemos te chamar?",
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-gray-600 dark:text-gray-300">
            Para deixar tudo mais com a sua cara, insira seu nome (depois, nas Configurações, pode colocar a sua foto!).
          </p>
          <input
            type="text"
            placeholder="Digite seu nome..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25b461] dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
      ),
      targetId: null,
    },
    {
      title: "🧭 A sua Barra de Navegação",
      content: (
        <p className="text-gray-600 dark:text-gray-300">
          Aqui à esquerda (ou no menu superior do telemóvel), encontra o acesso aos seus <strong>Relatórios</strong> visuais e ao <strong>Histórico</strong> completo das transações.
        </p>
      ),
      targetId: "tour-sidebar", 
    },
    {
      title: "💸 Adicionar Transações",
      content: (
        <p className="text-gray-600 dark:text-gray-300">
          No seu Painel Principal, verá o botão <strong>Nova Transação</strong>. Use-o sempre que o dinheiro entrar ou sair. Anotar na hora é o segredo do sucesso!
        </p>
      ),
      targetId: "tour-nova-transacao", 
    },
    {
      title: "Pronto para Começar! 🚀",
      content: (
        <p className="text-gray-600 dark:text-gray-300">
          Você está oficialmente pronto. Se o seu nível de Dopamina subir, o Conselheiro IA estará aqui para ajudar!
        </p>
      ),
      targetId: null,
    }
  ];


  useEffect(() => {
    if (!isVisible) return;
    
    const updateRect = () => {
      const currentTarget = steps[step].targetId;
      if (currentTarget) {
        const el = document.getElementById(currentTarget);
        if (el) {
          setTargetRect(el.getBoundingClientRect());
        } else {
          setTargetRect(null); 
        }
      } else {
        setTargetRect(null);
      }
    };

    updateRect();

    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isVisible]);

  const concluirTutorial = async () => {
    setIsSaving(true);
    localStorage.setItem("tutorial_concluido", "true");

    try {
      if (nome.trim()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            display_name: nome,
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error("Erro ao guardar nome no tutorial:", error);
    }

    setIsVisible(false);
    if (nome.trim()) {
      window.location.reload();
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      concluirTutorial();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* CAMADA DO HOLOFOTE (SPOTLIGHT) */}
      {targetRect ? (
        <div
          className="fixed z-[60] border-4 border-[#25b461] rounded-2xl transition-all duration-500 ease-in-out pointer-events-none"
          style={{
            top: targetRect.top - 10,
            left: targetRect.left - 10,
            width: targetRect.width + 20,
            height: targetRect.height + 20,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)', 
          }}
        />
      ) : (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-all duration-500" />
      )}

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 pointer-events-auto transform transition-all animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-slate-700">
          
          <button 
            onClick={concluirTutorial}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-slate-700 p-2 rounded-full"
            title="Pular tutorial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>

          <div className="flex gap-2 mb-2 mt-2">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
                  index <= step ? "bg-[#25b461]" : "bg-gray-100 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          <div className="min-h-[140px]">
            <h2 className="text-2xl font-black mb-4 text-[#2c3e50] dark:text-white">
              {steps[step].title}
            </h2>
            <div className="text-lg leading-relaxed">
              {steps[step].content}
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-100 dark:border-slate-700">
            <button
              onClick={prevStep}
              disabled={step === 0 || isSaving}
              className={`px-5 py-2.5 font-bold rounded-xl transition-colors ${
                step === 0 || isSaving
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" 
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
              }`}
            >
              Voltar
            </button>
            
            <button
              onClick={nextStep}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#25b461] hover:bg-[#1e914d] text-white font-bold rounded-xl transition-transform active:scale-95 shadow-md flex items-center gap-2"
            >
              {isSaving ? (
                <>Salvando... ⏳</>
              ) : step === steps.length - 1 ? (
                "Começar a usar! 🎉"
              ) : (
                "Próximo ➡️"
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}