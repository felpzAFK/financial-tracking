'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface ProfileModalProps {
    isOpen: boolean;
        onClose: () => void;
        currentName: string;
        onSave: (newName: string) => void;
    }

export default function ProfileModal({ isOpen, onClose, currentName, onSave }: ProfileModalProps) {
    const [novoNome, setNovoNome] = useState(currentName)
    const [aGuardar, setAGuardar] = useState(false)

    const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )


    useEffect(() => {
    if (isOpen) {
        setNovoNome(currentName)
    }
    }, [isOpen, currentName])

    if (!isOpen) return null

    const lidarComSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoNome.trim()) {
        alert('O nome não pode estar vazio!')
        return
    }

    try {
        setAGuardar(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('Sessão inválida!')
            return
        }

        const { error } = await supabase
        .from('profiles')
        .update({ display_name: novoNome.trim() })
        .eq('id', user.id)

        if (error) throw error

        onSave(novoNome.trim())
        onClose()
        } catch (err) {
        console.error('Erro ao atualizar perfil:', err)
        alert('Erro ao atualizar o nome. Tente novamente.')
        } finally {
        setAGuardar(false)
        }
    }

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 max-w-md w-full rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 transition-all">
        <h3 className="text-xl font-bold text-[#2c3e50] dark:text-white mb-4">
            Personalizar Perfil
        </h3>
        
        <form onSubmit={lidarComSalvar} className="space-y-4">
            <div>
            <label className="block text-sm font-bold text-[#2c3e50] dark:text-gray-200 mb-2">
                Como deseja ser chamado?
            </label>
            <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Digite o seu nome ou apelido"
                maxLength={30}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#25b461] transition bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white font-medium"
                required
            />
            </div>

            <div className="flex gap-3 justify-end pt-2">
            <button
                type="button"
                onClick={onClose}
                disabled={aGuardar}
                className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={aGuardar}
                className={`px-5 py-2 text-sm font-bold text-white rounded-lg transition-all active:scale-95 shadow-md
                ${aGuardar ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25b461] hover:bg-[#1e914d]'}`}
            >
                {aGuardar ? 'A guardar...' : 'Salvar Alterações'}
            </button>
            </div>
        </form>
        </div>
    </div>
    )
}