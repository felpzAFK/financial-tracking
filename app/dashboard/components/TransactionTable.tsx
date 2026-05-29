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
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Últimas Transações</h2>
        <button onClick={onOpenModal} className="md:hidden bg-[#25b461] text-white p-2 rounded-md text-sm font-bold active:scale-95 transition-transform">+ Nova</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs uppercase font-semibold bg-white border-b border-gray-100">
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {aCarregar ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold animate-pulse">A puxar dados do servidor... ⏳</td></tr>
            ) : transacoes.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold">Nenhuma transação encontrada.</td></tr>
            ) : (
              transacoes.map((item: Transacao) => (
                <tr key={item.id} className="hover:bg-green-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.data}</td>
                  <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-800">{item.descricao}</div>
                      {item.receipt_url && (
                        <a 
                          href={item.receipt_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-[#25b461] hover:text-[#1e914d] hover:underline flex items-center gap-1 mt-1 font-semibold"
                        >
                          🔗 Ver Comprovante
                        </a>
                      )}
                    </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.tipo === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${item.tipo === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
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