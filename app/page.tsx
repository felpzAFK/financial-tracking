"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState, useCallback } from "react";
// import CookieConsent from "@/app/dashboard/components/CookieConsent";

const brigends = localFont({
  src: "../public/fonts/Brigends.otf",
  display: "swap",
});

const rugen = localFont({
  src: "../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

const superMabroz = localFont({
  src: "../public/fonts/SuperMabroz-G3YVP.otf",
  display: "swap",
});

export default function LandingPage() {
  const [contadorCliques, setContadorCliques] = useState(0);
  const [mostrarCreditos, setMostrarCreditos] = useState(false);
  const [porcos, setPorcos] = useState<{ id: number; x: number; y: number; tx: string; ty: string; rot: string }[]>([]);

  const CLIQUES_NECESSARIOS = 15;

  const lidarComCliqueLogo = useCallback((e: React.MouseEvent) => {
    const audio = new Audio("/minecraft-pig-death.mp3");
    audio.play().catch((err) => console.log("O navegador bloqueou o áudio:", err));

    const novosCliques = contadorCliques + 1;
    setContadorCliques(novosCliques);

    const QUANTIDADE_POR_CLIQUE = 6;
    const novosPorcos = Array.from({ length: QUANTIDADE_POR_CLIQUE }).map(() => {
      const angulo = Math.random() * Math.PI * 2;
      const forcaExplosao = 100 + Math.random() * 200; 

      return {
        id: Math.random(), 
        x: e.clientX,
        y: e.clientY,
        tx: `${Math.cos(angulo) * forcaExplosao}px`, 
        ty: `${Math.sin(angulo) * forcaExplosao}px`, 
        rot: `${(Math.random() - 0.5) * 720}deg`,    
      };
    });
    
    setPorcos((prev) => [...prev, ...novosPorcos]);

    const idsParaRemover = novosPorcos.map(p => p.id);
    setTimeout(() => {
      setPorcos((prev) => prev.filter((p) => !idsParaRemover.includes(p.id)));
    }, 1000);

    if (novosCliques === CLIQUES_NECESSARIOS) {
      setMostrarCreditos(true);
      setContadorCliques(0); 
    }
  }, [contadorCliques]);

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333] font-sans scroll-smooth relative">
      
      {/* HEADER / NAVBAR */}
      <header className="bg-[#2c3e50] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg border-b border-white/10 transition-all select-none">
        
        <div 
          className="flex items-center gap-3 ml-2 md:ml-5 group cursor-pointer relative"
          onClick={lidarComCliqueLogo}
          title="Não clique muitas vezes..."
        >
          <div className="relative overflow-hidden rounded-md">
            <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md transition-transform group-hover:scale-110 duration-300" />
          </div>
          <div className={`text-xl md:text-2xl text-[#25b461] ${brigends.className} group-hover:text-white transition-colors`}>Financial Tracking</div>
        </div>

        <nav className="space-x-8 mr-2 md:mr-5 flex items-center">
          <Link href="#features" className="hover:text-[#25b461] font-medium transition hidden md:block text-sm uppercase tracking-wider">Recursos</Link>
          <Link href="#ia" className="hover:text-[#25b461] font-medium transition hidden md:block text-sm uppercase tracking-wider">Inteligência Artificial</Link>
          <Link href="/login" className="bg-[#25b461] hover:bg-[#1e914d] px-6 py-2.5 rounded-lg font-bold transition-all active:scale-95 text-white shadow-md hover:shadow-green-500/20">
            Acessar Painel
          </Link>
        </nav>
      </header>

      {/* RENDERIZA OS PORQUINHOS EXPLODINDO */}
      {porcos.map((porco) => (
        <div
          key={porco.id}
          className="fixed pointer-events-none z-[100] animate-explode-pig text-3xl drop-shadow-md"
          style={{
            left: porco.x - 20,
            top: porco.y - 20,
            '--tx': porco.tx,
            '--ty': porco.ty,
            '--rot': porco.rot,
          } as React.CSSProperties}
        >
          🐷
        </div>
      ))}

      {/* MODAL DE CRÉDITOS GOOFY AHH */}
      {mostrarCreditos && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-1 rounded-3xl shadow-[0_0_100px_rgba(236,72,153,0.5)] max-w-2xl w-full max-h-[90vh] overflow-y-auto transform rotate-1 hover:rotate-0 transition-transform relative custom-scrollbar">
            
            <div className="absolute inset-0 opacity-20 text-6xl flex flex-wrap justify-around items-center overflow-hidden pointer-events-none mix-blend-overlay">
              <span className="animate-spin-slow">💰</span>
              <span className="animate-bounce">🗿</span>
              <span className="animate-pulse">💀</span>
              <span className="animate-spin-slow">🐽</span>
            </div>

            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[22px] text-center relative z-10 border-4 border-dashed border-pink-400">
              <button 
                onClick={() => setMostrarCreditos(false)}
                className="absolute top-2 right-4 text-3xl hover:scale-125 transition-transform"
              >
                ❌
              </button>

              <h2 className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-6 ${superMabroz.className} animate-pulse`}>
                CREDITOS BRABOS UwU
              </h2>
              
              <div className="space-y-6 text-lg font-bold text-gray-700">
                <div className="bg-gray-100 p-4 rounded-xl border-2 border-gray-200 transform -rotate-1 hover:rotate-1 transition-transform">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Mestre do Código & Gambiarras</p>
                  <p className={`text-3xl text-blue-600 ${superMabroz.className}`}>@felpz.xyz 💻</p>
                  <p className="text-xs font-normal mt-1 italic">&quot;serio pq eu sempre lidero os trabalhos? vsf vocês&quot;</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border-2 border-gray-200 transform rotate-1 hover:-rotate-1 transition-transform">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">O Mascote Oficial</p>
                  <p className={`text-3xl text-pink-500 ${superMabroz.className}`}>Porco Caze 🐷</p>
                  <p className="text-xs font-normal mt-1 italic">&quot;Nosso querido cazé fazendo a boa, guardando o seu dinheiro (ele existe irl e fizemos homenagem a ele)&quot;</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border-2 border-gray-200 transform -rotate-1 hover:rotate-1 transition-transform">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Guardião do Banco de Dados & Segurança</p>
                  <p className={`text-3xl text-indigo-600 ${superMabroz.className}`}>David (darkm0on) 🛡️</p>
                  <p className="text-xs font-normal mt-1 italic">&quot;Obrigado Marcelo Hely&quot;</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border-2 border-gray-200 transform rotate-1 hover:-rotate-1 transition-transform">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Menção Honrosa</p>
                  <p className={`text-xl text-green-600 `}>shotout para LiamVoid, que virou quase um mentor pra mim, e ajudou a fazer esse site bem melhor 🍷🗿</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border-2 border-gray-200 transform -rotate-1 hover:rotate-1 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">E um salve especial para...</p>
                  <p className={`text-4xl text-orange-500 ${superMabroz.className} animate-pulse`}>VOCE! 🫵</p>
                  <p className="text-xs font-normal mt-1 italic">&quot;Obrigado por acessar o nosso site e clicar na logo igual a um psicopata &lt;3&quot;</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-4 border-dotted border-gray-300 flex flex-col items-center">
                <p className="text-sm font-black text-gray-400 animate-bounce mb-4">
                  blud rlly thought he found a secret 💀😭
                </p>
                <Image
                  src="/touhou-cirno.gif"
                  alt="Cirno Dançando"
                  width={128}
                  height={128}
                  className="rounded-xl shadow-lg border-2 border-purple-300 mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESTO DO SITE */}
      <main className="pt-0">
        <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-[10%] py-20 overflow-hidden min-h-[85vh] bg-black">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-luminosity">
            <source src="videos/fundo.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0"></div>

          <div className="md:w-1/2 space-y-8 z-10 relative">
            <div className="inline-block bg-[#25b461]/20 border border-[#25b461]/50 px-4 py-1.5 rounded-full text-[#25b461] font-bold text-xs uppercase tracking-widest mb-2 backdrop-blur-sm">
              ✨ A sua nova vida financeira começa aqui ✨
            </div>
            <h1 className={`text-5xl md:text-6xl leading-tight text-white tracking-wide ${rugen.className}`}>
              Seu Futuro Financeiro em <span className="text-[#25b461] relative inline-block">
                Ordem
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#25b461]/40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg font-medium leading-relaxed">
              Acompanhe os seus gastos, enfrente os impulsos com a nossa IA e assuma o controle da sua vida financeira com uma interface desenhada para resultados reais.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="inline-block bg-[#25b461] hover:bg-[#1e914d] text-white px-8 py-3.5 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(37,180,97,0.3)] hover:shadow-[0_0_30px_rgba(37,180,97,0.5)] transition-all active:scale-95">
                Começar Agora!
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center mt-16 md:mt-0 z-10 relative">
            <div className="absolute inset-0 bg-[#25b461]/20 blur-[100px] rounded-full"></div>
            <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-[#1a252f] to-[#2c3e50] rounded-full flex items-center justify-center border-4 border-[#25b461]/30 shadow-2xl overflow-hidden animate-[float_6s_ease-in-out_infinite]">
              <Image 
                src="/porcocaze1.PNG" 
                alt="Porquinho Financial Tracking" 
                width={380} 
                height={380} 
                className="object-contain p-6 hover:scale-110 transition-transform duration-500" 
                priority
              />
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-[10%] bg-white grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#25b461] to-transparent opacity-20"></div>
          
          <div className="bg-gray-50 p-10 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-3 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center text-[#25b461] text-3xl mb-6 group-hover:scale-110 transition-transform shadow-sm">📊</div>
            <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Controle Total</h3>
            <p className="text-gray-500 leading-relaxed">Categorize cada transação e saiba exatamente para onde vai o seu dinheiro todos os meses, sem planilhas complexas.</p>
          </div>
          
          <div className="bg-white p-10 rounded-2xl shadow-lg border-b-4 border-[#25b461] text-center hover:-translate-y-3 transition-all duration-300 relative transform md:-translate-y-4">
            <div className="absolute -top-4 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full animate-bounce shadow-sm">Destaque</div>
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-[#2c3e50] text-3xl mb-6 shadow-sm">🛡️</div>
            <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Segurança Avançada</h3>
            <p className="text-gray-500 leading-relaxed">Os seus dados financeiros estão protegidos com tecnologia Auth de ponta, garantindo privacidade absoluta.</p>
          </div>
          
          <div className="bg-gray-50 p-10 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-3 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center text-[#25b461] text-3xl mb-6 group-hover:scale-110 transition-transform shadow-sm">📈</div>
            <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Relatórios Visuais</h3>
            <p className="text-gray-500 leading-relaxed">Gráficos simples e intuitivos que ajudam a entender os seus hábitos de consumo e a planear o seu crescimento.</p>
          </div>
        </section>

        <section id="ia" className="py-24 px-[10%] bg-[#2c3e50] text-white relative overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#25b461]/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="md:w-1/2 space-y-6">
              <h2 className={`text-4xl text-white tracking-wide ${brigends.className}`}>Muito mais que uma planilha</h2>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">
                Transformamos as finanças numa experiência envolvente. Com a nossa tecnologia, o sistema adapta-se aos seus hábitos e ajuda-o a dominar os gastos impulsivos.
              </p>
              
              <ul className="space-y-6 mt-8">
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl text-2xl shadow-inner">🧠</div>
                  <div>
                    <h4 className="font-bold text-lg text-[#25b461]">Conselheiro IA Personalizado</h4>
                    <p className="text-gray-400 text-sm mt-1">Um assistente virtual que analisa o seu saldo e dá conselhos diretos para evitar que fique no vermelho.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl text-2xl shadow-inner">🚨</div>
                  <div>
                    <h4 className="font-bold text-lg text-[#25b461]">Alerta Anti-Dopamina</h4>
                    <p className="text-gray-400 text-sm mt-1">O sistema deteta gastos por impulso e pede confirmação extra, ajudando a quebrar o ciclo de consumismo.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl text-2xl shadow-inner">🌡️</div>
                  <div>
                    <h4 className="font-bold text-lg text-[#25b461]">Termômetro do Orçamento</h4>
                    <p className="text-gray-400 text-sm mt-1">Cálculo matemático diário para saber exatamente quanto pode gastar até ao fim do mês.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2 w-full">
              <div className="bg-slate-800/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl transform md:rotate-2 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-[#25b461]/20">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl bg-white/5 p-3 rounded-xl">🤖</div>
                    <div>
                      <p className="text-[#25b461] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25b461] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#25b461]"></span></span>
                        Análise de Dados IA
                      </p>
                      <p className="text-sm font-medium mt-2 text-gray-300 leading-relaxed">
                        &ldquo;Alerta analítico: Notei que grande parte do seu capital foi alocado em despesas de impulso hoje. Recomenda-se a suspensão imediata de despesas variáveis.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-[10%] bg-gray-50 text-center">
          <div className="inline-block bg-[#2c3e50] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Dashboard</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#2c3e50]">Interface Simples e Poderosa</h2>
          
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2 border-b border-gray-100 pb-4">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Saldo Total</p>
                <div className={`text-3xl md:text-4xl text-green-600 ${rugen.className}`}>R$ 5.420,00</div>
              </div>
              <div className="text-left md:text-right mt-4 md:mt-0">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Gastos do Mês</p>
                <div className={`text-2xl md:text-3xl text-red-500 ${rugen.className}`}>R$ 2.150,00</div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-6 flex flex-col justify-end h-64 border border-gray-200 relative overflow-hidden">
                <p className="absolute top-4 left-4 text-xs font-bold text-gray-400 uppercase">Fluxo de Caixa</p>
                <div className="flex justify-between items-end h-full w-full gap-3 pt-8">
                  <div className="w-full bg-red-400 rounded-t-lg h-[30%] animate-[pulse_3s_ease-in-out_infinite] shadow-sm"></div>
                  <div className="w-full bg-green-400 rounded-t-lg h-[60%] animate-[pulse_3s_ease-in-out_infinite_0.2s] shadow-sm"></div>
                  <div className="w-full bg-red-400 rounded-t-lg h-[45%] animate-[pulse_3s_ease-in-out_infinite_0.4s] shadow-sm"></div>
                  <div className="w-full bg-green-400 rounded-t-lg h-[80%] animate-[pulse_3s_ease-in-out_infinite_0.6s] shadow-sm"></div>
                  <div className="w-full bg-green-400 rounded-t-lg h-[100%] animate-[pulse_3s_ease-in-out_infinite_0.8s] shadow-sm"></div>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center">
                <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-2 rounded-lg text-xl">🍔</div>
                    <div>
                      <span className="font-bold text-gray-800 block">iFood Madrugada</span>
                      <span className="text-xs text-gray-400 font-medium">Impulso</span>
                    </div>
                  </div>
                  <span className="text-red-500 font-bold">- R$ 45,00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-2 rounded-lg text-xl">💻</div>
                    <div>
                      <span className="font-bold text-gray-800 block">Projeto Freelance</span>
                      <span className="text-xs text-gray-400 font-medium">Receita</span>
                    </div>
                  </div>
                  <span className="text-green-500 font-bold">+ R$ 1.200,00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg text-xl">🎮</div>
                    <div>
                      <span className="font-bold text-gray-800 block">Jogos da Steam</span>
                      <span className="text-xs text-gray-400 font-medium">Qualidade de Vida</span>
                    </div>
                  </div>
                  <span className="text-red-500 font-bold">- R$ 120,00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 text-center bg-[#25b461] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">Pronto para assumir o controle do seu dinheiro?</h2>
            <p className="text-green-100 mb-10 text-lg">Junte-se à plataforma e transforme a maneira como gere as suas finanças hoje mesmo.</p>
            <Link href="/login" className="inline-block bg-white text-[#2c3e50] px-10 py-4 rounded-xl text-lg font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
              Crie sua conta gratuitamente!
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contato" className="bg-[#1a252f] text-white py-12 text-center border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/porcocaze1.PNG" alt="Logo" width={30} height={30} className="rounded-md opacity-50 grayscale" />
            <p className={`text-2xl text-gray-400 tracking-wider ${brigends.className}`}>Financial Tracking</p>
          </div>
          <p className="text-gray-500 mb-8 italic">O seu futuro financeiro em ordem.</p>
          <div className="h-px bg-gray-800 w-full mb-8"></div>
          <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} Financial Tracking - Todos os direitos reservados.</p>
          <p className="text-xs text-gray-600 mt-3 font-bold tracking-widest uppercase">Desenvolvido para 2º Avaliação de Web Coding</p>
        </div>
      </footer>

      {/* ESTILOS DA EXPLOSÃO DO PORQUINHO & SCROLLBAR */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes explodePig {
          0% { transform: translate(0, 0) scale(0.5) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(var(--rot)); opacity: 0; }
        }
        .animate-explode-pig {
          animation: explodePig 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.8);
        }
      `}} />
    </div>
  );
}