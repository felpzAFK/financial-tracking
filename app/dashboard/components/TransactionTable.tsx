import { createBrowserClient } from '@supabase/ssr';

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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const lidarComEliminacao = async (id: number) => {
    const confirmar = confirm("Tem a certeza de que deseja apagar esta transação? O saldo será atualizado.");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      window.location.reload();
    } catch (err) {
      console.error("Erro ao eliminar transação:", err);
      alert("Não foi possível apagar a transação. Tente novamente.");
    }
  };

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
              <th className="px-6 py-4 font-bold text-right">Valor & Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
            {aCarregar ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300 font-bold animate-pulse">A puxar dados do servidor... ⏳</td></tr>
            ) : transacoes.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300 font-bold">Nenhuma transação encontrada.</td></tr>
            ) : (
              transacoes.map((item: Transacao) => {
                // Agora o console.log vive dentro de chavetas, é seguro aqui
                console.log("Debugando Transação:", item.descricao, "URL:", item.receipt_url);
                
                return (
                  <tr key={item.id} className="hover:bg-green-50/30 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 font-medium">{item.data}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-800 dark:text-white">{item.descricao}</span>
                        {item.receipt_url ? (
                          <a 
                            href={item.receipt_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 text-[11px] font-bold text-[#25b461] dark:text-[#2ecc71] hover:underline hover:text-[#1e914d] transition-colors"
                            title="Ver comprovante"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                            </svg>
                            Ver comprovante
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.tipo === 'receita' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                        {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <span className={`font-bold ${item.tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                          {item.tipo === 'receita' ? '+' : '-'} R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          onClick={() => lidarComEliminacao(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all active:scale-90 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Apagar transação"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}