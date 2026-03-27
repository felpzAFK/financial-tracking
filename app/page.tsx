import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

const rugen = localFont({
  src: "../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333] font-sans">
      {/* HEADER / NAVBAR */}
      <header className="bg-[#2c3e50] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3 ml-5">
          <Image src="/porcocaze1.PNG" alt="Logo" width={40} height={40} className="rounded-md" />
          <div className={`text-2xl text-[#25b461] ${rugen.className}`}>Financial Tracking</div>
        </div>
        <nav className="space-x-6 mr-5 flex items-center">
          <Link href="#features" className="hover:text-[#25b461] transition hidden md:block">Recursos</Link>
          <Link href="/login" className="bg-[#25b461] hover:bg-[#1e914d] px-4 py-2 rounded-md font-bold transition-all active:scale-95 text-white">
            Entrar
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="pt-0">
        <section className="relative flex flex-col md:flex-row items-center justify-between px-10 py-20 overflow-hidden min-h-[80vh] bg-black">
          <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
        >
          <source src= "videos/fundo.mp4" type="video/mp4" />
        </video>

        {/* Pelicula branca semi-transparente pro texto n sumir no video*/}
        <div className="absolute inset-0 bg-white/40 z-0"></div>

          <div className="md:w-1/2 space-y-6 z-10 relative">
<h1 
  className={`text-5xl leading-tight text-[#2c3e50] tracking-wide ${rugen.className} 
  [text-shadow:_4px_4px_0_#25b461]`}
>
  Seu Futuro Financeiro em <span className="text-[#25b461] [text-shadow:_4px_4px_0_#2c3e50]">Ordem</span>
</h1>
            <p className="text-lg text-gray-600">
              Acompanhe seus gastos, defina metas e assuma o controle da sua vida financeira com simplicidade.
            </p>
            <Link href="/login" className="inline-block bg-[#2c3e50] text-white px-8 py-3 rounded-lg text-lg font-bold hover:shadow-lg transition-all active:scale-95">
              Começar Agora
            </Link>
          </div>

          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0 z-10 relative">
            <div className="relative w-80 h-80 bg-green-100 rounded-full flex items-center justify-center border-4 border-[#25b461] border-dashed overflow-hidden">
              <Image 
                src="/porcocaze1.PNG" 
                alt="Porquinho Financial Tracking" 
                width={320} 
                height={320} 
                className="object-contain p-4" 
                priority
              />
            </div>
          </div>
        </section>

        {/* RECURSOS */}
        <section id="features" className="py-20 px-[10%] bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-[#25b461] text-3xl mb-4 font-bold">📊</div>
            <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Controle Total</h3>
            <p className="text-gray-500">Categorize cada transação e saiba exatamente para onde vai o seu dinheiro todos os meses.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#25b461] text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-[#25b461] text-3xl mb-4 font-bold">🛡️</div>
            <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Segurança</h3>
            <p className="text-gray-500">Seus dados financeiros protegidos com tecnologia de ponta e criptografia avançada.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-[#25b461] text-3xl mb-4 font-bold">📈</div>
            <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Relatórios</h3>
            <p className="text-gray-500">Gráficos simples e intuitivos que ajudam você a entender seus hábitos e economizar mais.</p>
          </div>
        </section>
        {/* DASHBOARD PREVIEW */}
        <section className="py-20 px-[10%] bg-white text-center">
          <h2 className="text-3xl font-bold mb-10 text-[#2c3e50]">Interface Simples e Poderosa</h2>
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-2xl p-6 border border-gray-100 overflow-hidden">
             <div className="flex justify-between items-center mb-6 px-4">
                <div className={`text-xl text-green-600 ${rugen.className}`}>Saldo: R$ 5.420,00</div>
                <div className={`text-xl text-red-500 ${rugen.className}`}>Gastos: R$ 2.150,00</div>
             </div>
             <div className="bg-white h-48 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center italic text-gray-400">
                Visualize seus ganhos e gastos em tempo real
             </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contato" className="bg-[#2c3e50] text-white py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className={`text-xl mb-2 text-[#25b461] tracking-wider ${rugen.className}`}>Financial Tracking</p>
          <p className="text-gray-300 mb-6 italic">Seu futuro financeiro em ordem.</p>
          <div className="h-px bg-gray-700 w-full mb-6"></div>
          <p>&copy; 2026 Financial Tracking - Todos os direitos reservados.</p>
          <p className="text-sm text-gray-400 mt-2">Desenvolvido para 2º Avaliação de Web Coding </p>
        </div>
      </footer>
    </div>
  );
}