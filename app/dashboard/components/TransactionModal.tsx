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
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  
  const [expenseIntent, setExpenseIntent] = useState<'survival' | 'well_being' | 'dopamine'>('survival');

  const [mostrarAlertaImpulso, setMostrarAlertaImpulso] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDataTransacao(new Date().toISOString().split('T')[0]);
      setMostrarAlertaImpulso(false); // Reseta o alerta ao abrir
      getCategories().then(setCategorias).catch(console.error);
    }
  }, [isOpen]);

  const categoriasFiltradas = categorias.filter(
    (cat) => cat.type === tipo || cat.type === "ambos"
  );

  useEffect(() => {
    if (categoriasFiltradas.length > 0) {
      setCategoriaId(categoriasFiltradas[0].id);
    }
  }, [tipo, categorias]);

  if (!isOpen) return null;

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") { setValor(""); return; }
    value = (Number(value) / 100).toFixed(2) + "";
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    setValor(value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('comprovantes')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage.from('comprovantes').getPublicUrl(fileName);
    setReceiptUrl(urlData.publicUrl);
  } catch (err) {
    console.error("Erro no upload:", err);
    alert("Falha ao subir comprovante.");
  } finally {
    setUploading(false);
  }
};

  const tentarSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'));

    const alertaAtivo = localStorage.getItem("alerta_impulso") !== "false";

    if (alertaAtivo && tipo === 'despesa' && expenseIntent === 'dopamine' && valorNumerico > 50) {
      setMostrarAlertaImpulso(true);
      return; 
    }

    executarSalvamento(valorNumerico);
  };

  const executarSalvamento = async (valorFormatado: number) => {
    try {
      setAGuardar(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;



      const { error } = await supabase.from('transactions').insert([{
        description: descricao || "Nova Transação",
        amount: valorFormatado,
        type: tipo,
        user_id: user.id,
        date: dataTransacao,
        receipt_url: receiptUrl,
        category_id: categoriaId || null, 
        expense_intent: tipo === 'despesa' ? expenseIntent : null,
        is_dopamine: tipo === 'despesa' ? (expenseIntent === 'dopamine') : false
      }]);

      if (error) throw error;
      
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao guardar a transação!");
    } finally {
      setAGuardar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <style>{`
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-pop { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="animate-modal-pop bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors max-h-[95vh] overflow-y-auto relative">
        {mostrarAlertaImpulso ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="text-6xl mb-6 animate-bounce">🚨</div>
            <h2 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-wide">Alerta de Impulso!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 font-medium text-lg">
              Tem certeza absoluta? Você está prestes a gastar <span className="font-bold text-red-500">R$ {valor}</span> por puro impulso. Se esperar 24h, essa vontade passa!
            </p>
            
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={() => setMostrarAlertaImpulso(false)} 
                className="w-full bg-[#2c3e50] hover:bg-[#1a252f] dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Pausar e Pensar Melhor 🛡️
              </button>
              <button 
                onClick={() => executarSalvamento(parseFloat(valor.replace(/\./g, '').replace(',', '.')))} 
                disabled={aGuardar}
                className="w-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold py-3 rounded-xl transition-all hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-[0.98]"
              >
                {aGuardar ? 'Gravando...' : 'Gastar mesmo assim 💸'}
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO NORMAL */
          <>
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-[#2c3e50] dark:text-white">Nova Transação</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition font-bold text-xl">✕</button>
            </div>

            <div className="p-6">
              <form onSubmit={tentarSalvar} className="flex flex-col gap-4">
                
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
                    <input type="text" required value={valor} onChange={handleValorChange} placeholder="0,00" className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm font-bold text-right" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Descrição</label>
                  <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Conta de Luz..." className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Categoria</label>
                  <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm">
                    {categoriasFiltradas.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Comprovante</label>
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {uploading && <p className="text-xs text-blue-500 mt-1">A subir...</p>}
                  {receiptUrl && <p className="text-xs text-green-500 mt-1">✅ Comprovante pronto!</p>}
                </div>

                {tipo === 'despesa' && (
                  <div className="pt-3 border-t border-gray-100 dark:border-slate-700 mt-1">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-400 mb-3 uppercase tracking-widest text-center">
                      Intenção do Gasto
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => setExpenseIntent('survival')}
                        className={`flex-1 p-2 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                          expenseIntent === 'survival' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm scale-102' 
                            : 'border-gray-100 dark:border-slate-700 bg-transparent text-gray-400'
                        }`}
                      >
                        <span className="text-base">🛒</span> Necessidade
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpenseIntent('well_being')}
                        className={`flex-1 p-2 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                          expenseIntent === 'well_being' 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 shadow-sm scale-102' 
                            : 'border-gray-100 dark:border-slate-700 bg-transparent text-gray-400'
                        }`}
                      >
                        <span className="text-base">🌱</span> Qualidade de Vida
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpenseIntent('dopamine')}
                        className={`flex-1 p-2 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                          expenseIntent === 'dopamine' 
                            ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 shadow-sm scale-102' 
                            : 'border-gray-100 dark:border-slate-700 bg-transparent text-gray-400'
                        }`}
                      >
                        <span className="text-base">⚡</span> Impulso
                      </button>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={aGuardar} className="w-full text-white font-bold py-3 rounded-xl mt-2 bg-[#25b461] hover:bg-[#1e914d] active:scale-[0.98] transition shadow-lg hover:shadow-green-500/20">
                  {aGuardar ? 'A guardar transação... ⏳' : 'Guardar Transação'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}