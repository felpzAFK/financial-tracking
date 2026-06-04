import { supabase } from './supabase'

// busca as transacoes do user
export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      categories (
        id,
        name,
        icon,
        color
      )
    `)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

// salvar nova transação
export async function createTransaction(transaction: {
  description: string
  amount: number
  type: string
  date: string
  category_id: string
}) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: user?.id,
    })
    .select()

  if (error) throw error
  return data
}

// deletar transação
export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
}