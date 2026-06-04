import { supabase } from './supabase'

// Buscar todas as categorias disponíveis
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}