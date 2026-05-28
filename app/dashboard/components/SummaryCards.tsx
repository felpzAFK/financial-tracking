import localFont from "next/font/local";

const rugen = localFont({
  src: "../../../public/fonts/RugenExpanded.ttf",
  display: "swap",
});

interface SummaryCardsProps {
  receitas: number;
  despesas: number;
  saldo: number;
}

export default function SummaryCards({ receitas, despesas, saldo }: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
        <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2 group-hover:text-[#25b461] transition-colors uppercase">Entradas</h3>
        <div className={`text-2xl text-[#25b461] ${rugen.className}`}>R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
        <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2 group-hover:text-red-500 transition-colors uppercase">Saídas</h3>
        <div className={`text-2xl text-red-500 ${rugen.className}`}>R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-[#2c3e50]"></div>
        <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2 group-hover:text-[#2c3e50] transition-colors uppercase">Saldo Atual</h3>
        <div className={`text-3xl text-[#2c3e50] ${rugen.className}`}>R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
      </div>
    </section>
  );
}