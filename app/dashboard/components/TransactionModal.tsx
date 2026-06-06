"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { getCategories } from "@/lib/categories";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
  const [dataTransacao, setDataTransacao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [aGuardar, setAGuardar] = useState(false);

  // Inicializa data de hoje e carrega categorias ao abrir
  useEffect(() => {
    if (isOpen) {
      setDataTransacao(new Date().toISOString().split('T')[0]);
      getCategories().then(setCategorias).catch(console.error);
    }
  }, [isOpen]);

  // Filtra categorias pelo tipo
  const categoriasFiltradas = categorias.filter(
    (cat) => cat.type === tipo || cat.type === "ambos"
  );

  // Seleciona categoria automaticamente ao mudar o tipo
  useEffect(() => {
    if (categoriasFiltradas.length > 0) {
      setCategoriaId(categoriasFiltradas[0].id);
    }
  }, [tipo, categorias]);

  if (!isOpen) return null;

  // Formatação Decimal
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") { setValor(""); return; }
    value = (Number(value) / 100).toFixed(2) + "";
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    setValor(value);
  };

  const salvarNovaTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAGuardar(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
      let receiptUrl = null;

      if (ficheiro) {
        const fileExt = ficheiro.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('comprovantes').upload(fileName, ficheiro);
        if (uploadError) throw uploadError;
        const { data: res } = supabase.storage.from('comprovantes').getPublicUrl(fileName);
        receiptUrl = res.publicUrl;
      }

      const { error } = await supabase.from('transactions').insert([{
        description: descricao || "Nova Transação",
        amount: valorNumerico,
        type: tipo,
        user_id: user.id,
        date: dataTransacao,
        receipt_url: receiptUrl,
        category_id: categoriaId || null, 
      }]);

      if (error) throw error;
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao guardar transação!");
    } finally {
      setAGuardar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* CSS da Animação de Entrada */}
      <style>{`
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-pop { animation: modalPop 0.3s ease-out forwards; }
      `}</style>

      <div className="animate-modal-pop bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-[#2c3e50] dark:text-white">Nova Transação</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition font-bold text-xl">✕</button>
        </div>

        <div className="p-6">
          <form onSubmit={salvarNovaTransacao} className="flex flex-col gap-4">
            
            {/* Toggle Animado Receita/Despesa */}
            <div className="relative flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl h-12">
              <div 
                className={`absolute top-1 bottom-1 w-[48%] rounded-lg transition-all duration-300 ease-out shadow-sm ${
                  tipo === 'receita' ? 'left-[51%] bg-green-500' : 'left-1 bg-red-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setTipo('despesa')}
                className={`relative z-10 flex-1 font-bold transition-colors duration-300 ${tipo === 'despesa' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                ⬇️ Despesa
              </button>
              <button
                type="button"
                onClick={() => setTipo('receita')}
                className={`relative z-10 flex-1 font-bold transition-colors duration-300 ${tipo === 'receita' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                ⬆️ Receita
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Data</label>
                <input type="date" required value={dataTransacao} onChange={(e) => setDataTransacao(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Valor (R$)</label>
                <input type="text" value={valor} onChange={handleValorChange} placeholder="0,00" className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm font-bold text-right" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Descrição</label>
              <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Conta da Luz" className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Categoria</label>
              <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm">
                <option value="">Selecionar categoria...</option>
                {categoriasFiltradas.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={aGuardar} className="w-full text-white font-bold py-3 rounded-lg mt-2 bg-[#25b461] hover:bg-[#1e914d] active:scale-[0.98] transition">
              {aGuardar ? 'Guardando... ⏳' : 'Guardar Transação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}