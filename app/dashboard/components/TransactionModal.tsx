import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
  const [descricaoInput, setDescricaoInput] = useState("");
  const [valorInput, setValorInput] = useState("");
  const [tipoInput, setTipoInput] = useState("despesa");
  const [dataInput, setDataInput] = useState(new Date().toISOString().split('T')[0]);
  const [categoriaInput, setCategoriaInput] = useState("");
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [aGuardar, setAGuardar] = useState(false);

  // Carrega as categorias quando o modal abre
  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategorias).catch(console.error);
    }
  }, [isOpen]);

  // Filtra categorias pelo tipo selecionado
  const categoriasFiltradas = categorias.filter(
    (cat) => cat.type === tipoInput || cat.type === "ambos"
  );

  if (!isOpen) return null;

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") { setValorInput(""); return; }
    value = (Number(value) / 100).toFixed(2) + "";
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    setValorInput(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFicheiro(e.target.files[0]);
    }
  };

  const salvarNovaTransacao = async () => {
    try {
      setAGuardar(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const cookieId = document.cookie.split('; ').find(row => row.startsWith('finance_user_id='))?.split('=')[1];
      const userIdFinal = user?.id || cookieId || 'e217e6c8-f132-40f5-81fe-b72bb00849ea';

      if (!valorInput) {
        alert("Digita um valor!");
        setAGuardar(false);
        return;
      }

      const valorNumerico = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));
      let receiptUrl = null;

      if (ficheiro) {
        const fileExt = ficheiro.name.split('.').pop();
        const fileName = `${userIdFinal}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('comprovantes')
          .upload(fileName, ficheiro);

        if (uploadError) throw uploadError;

        const { data: res } = supabase.storage
          .from('comprovantes')
          .getPublicUrl(fileName);

        receiptUrl = res.publicUrl;
      }

      const { error } = await supabase.from('transactions').insert([{
        description: descricaoInput || "Nova Transação",
        amount: valorNumerico,
        type: tipoInput,
        user_id: userIdFinal,
        date: dataInput,
        receipt_url: receiptUrl,
        category_id: categoriaInput || null,  // novo campo
      }]);

      if (error) throw error;

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao guardar a transação! Verifica a ligação.");
    } finally {
      setAGuardar(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-[#2c3e50]">Nova Transação</h2>
          <button onClick={onClose} disabled={aGuardar} className="text-gray-400 hover:text-red-500 transition font-bold text-xl">✕</button>
        </div>
        <div className="p-6">
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
              <input type="text" value={descricaoInput} onChange={(e) => setDescricaoInput(e.target.value)} placeholder="Ex: Conta da Luz" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Valor (R$)</label>
              <input type="text" value={valorInput} onChange={handleValorChange} placeholder="0,00" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Comprovativo (Opcional)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                <select
                  value={tipoInput}
                  onChange={(e) => { setTipoInput(e.target.value); setCategoriaInput(""); }}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition bg-white"
                >
                  <option value="despesa">Saída (Despesa)</option>
                  <option value="receita">Entrada (Receita)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                <input type="date" value={dataInput} onChange={(e) => setDataInput(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition text-gray-600" />
              </div>
            </div>

            {/* Novo campo: Categoria */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
              <select
                value={categoriaInput}
                onChange={(e) => setCategoriaInput(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#25b461] transition bg-white"
              >
                <option value="">Selecionar categoria...</option>
                {categoriasFiltradas.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={salvarNovaTransacao}
              disabled={aGuardar}
              className={`w-full text-white font-bold py-3 rounded-lg mt-2 transition active:scale-[0.98] ${aGuardar ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25b461] hover:bg-[#1e914d]'}`}
            >
              {aGuardar ? 'A guardar e enviar ficheiro... ⏳' : 'Guardar Transação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}