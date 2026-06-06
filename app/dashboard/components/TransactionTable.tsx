interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  receipt_url?: string | null;
}

interface TransactionTableProps {
  transacoes: Transacao[];
  aCarregar: boolean;
  onOpenModal: () => void;
}

export default function TransactionTable({ transacoes, aCarregar, onOpenModal }: TransactionTableProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
      <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Últimas Transações</h2>
        <button onClick={onOpenModal} className="md:hidden bg-[#25b461] text-white p-2 rounded-md text-sm font-bold active:scale-95 transition-transform">+ Nova</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-200 border-b border-gray-100 dark:border-slate-600">
              <th className="px-6 py-4 font-bold">Data</th>
              <th className="px-6 py-4 font-bold">Descrição</th>
              <th className="px-6 py-4 font-bold">Tipo</th>
              <th className="px-6 py-4 font-bold text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
            {aCarregar ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300 font-bold animate-pulse">A puxar dados do servidor... ⏳</td></tr>
            ) : transacoes.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300 font-bold">Nenhuma transação encontrada.</td></tr>
            ) : (
              transacoes.map((item: Transacao) => (
                <tr key={item.id} className="hover:bg-green-50/30 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 font-medium">{item.data}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800 dark:text-white">{item.descricao}</div>
                    {item.receipt_url && (
                      <a 
                        href={item.receipt_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-[#25b461] dark:text-[#2ecc71] hover:underline flex items-center gap-1 mt-1 font-semibold"
                      >
                        🔗 Ver Comprovante
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.tipo === 'receita' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                      {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${item.tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {item.tipo === 'receita' ? '+' : '-'} R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}