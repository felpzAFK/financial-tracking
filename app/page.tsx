import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HEADER / NAVBAR */}
      <header className="bg-[#2c3e50] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-2xl font-bold text-[#25b461] ml-5">Financial Tracking</div>
        <nav className="space-x-6 mr-5">
          <Link href="/login" className="bg-[#25b461] hover:bg-[#1e914d] px-4 py-2 rounded-md font-semibold transition">
            Entrar
          </Link>
        </nav>
      </header>

      {/* HERO SECTION (A PARTE PRINCIPAL) */}
      <main className="pt-20">
        <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-white">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              Seu Futuro Financeiro em <span className="text-[#25b461]">Ordem</span>
            </h1>
            <p className="text-lg text-gray-600">
              Acompanhe seus gastos, defina metas e assuma o controle da sua vida financeira com simplicidade.
            </p>
            <button className="bg-[#2c3e50] text-white px-8 py-3 rounded-lg text-lg font-bold hover:shadow-lg transition">
              Começar Agora
            </button>
          </div>

          {/* ESPAÇO PARA A IMAGEM DO PORQUINHO */}
          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
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

        {/* FEATURES (RECURSOS) */}
        <section className="bg-gray-100 py-20 px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-bold mb-4">Controle Total</h3>
            <p className="text-gray-500">Visualize cada centavo que entra e sai da sua conta.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border-t-4 border-[#25b461]">
            <h3 className="text-xl font-bold mb-4">Segurança</h3>
            <p className="text-gray-500">Seus dados protegidos com criptografia de ponta.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-bold mb-4">Relatórios</h3>
            <p className="text-gray-500">Gráficos simples para você entender seus hábitos.</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#2c3e50] text-white py-10 text-center">
        <p>&copy; 2026 Financial Tracking - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}