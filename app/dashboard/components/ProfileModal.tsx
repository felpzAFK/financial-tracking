"use client";

import { useState, useRef, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import Image from "next/image";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatar?: string | null;
  onSave: (novoNome: string, novoAvatar?: string) => void;
}

export default function ProfileModal({ isOpen, onClose, currentName, currentAvatar, onSave }: ProfileModalProps) {
  const [nome, setNome] = useState(currentName);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatar || null);
  const [file, setFile] = useState<File | null>(null);
  const [aGuardar, setAGuardar] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Atualiza os estados se as props mudarem
  useEffect(() => {
    if (isOpen) {
      setNome(currentName);
      setAvatarPreview(currentAvatar || null);
      setFile(null);
    }
  }, [isOpen, currentName, currentAvatar]);

  if (!isOpen) return null;

  // Lidar com a seleção da imagem no computador
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Cria um link temporário para mostrar a foto no modal antes de guardar
      setAvatarPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAGuardar(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      let avatarUrl = currentAvatar; // Mantém a antiga por defeito

      // Se o utilizador escolheu uma nova imagem
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        // Faz upload pro bucket
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Pega o URL público
        const { data: res } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = res.publicUrl;
      }

      // Atualiza a tabela profiles com o novo nome e nova foto
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          display_name: nome,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      // Envia os dados de volta para a página atualizar a UI na hr
      onSave(nome, avatarUrl || undefined);
      onClose();

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Houve um erro ao atualizar o perfil. Verifica se o bucket 'avatars' é público.");
    } finally {
      setAGuardar(false);
    }
  };

  const inicialNome = nome ? nome.charAt(0).toUpperCase() : "U";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
        
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-[#2c3e50] dark:text-white">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition font-bold">✕</button>
        </div>

        <form onSubmit={handleSave} className="p-6">
          
          <div className="flex flex-col items-center mb-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#25b461] to-emerald-400 flex items-center justify-center font-black text-white text-3xl shadow-lg cursor-pointer group overflow-hidden ring-4 ring-white dark:ring-slate-800"
              title="Clique para alterar a foto"
            >
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
              ) : (
                inicialNome
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-sm">📷</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">Clica na imagem para alterar</p>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Nome de Exibição
            </label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required
              className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#25b461] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={aGuardar}
            className="w-full bg-[#25b461] hover:bg-[#1e914d] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            {aGuardar ? "A guardar... ⏳" : "Guardar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}