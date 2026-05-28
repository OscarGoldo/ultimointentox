'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Expense } from '@/lib/types'
import { formatCurrency, formatDateShort } from '@/lib/utils'

const CATEGORIES = [
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'suministros', label: 'Suministros' },
  { value: 'personal', label: 'Personal' },
  { value: 'equipos', label: 'Equipos' },
  { value: 'publicidad', label: 'Publicidad' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otros', label: 'Otros' },
]

const CAT_COLORS: Record<string, string> = {
  alquiler: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
  servicios: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  suministros: 'bg-teal-400/20 text-teal-300 border-teal-400/30',
  personal: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
  equipos: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30',
  publicidad: 'bg-pink-400/20 text-pink-300 border-pink-400/30',
  mantenimiento: 'bg-orange-400/20 text-orange-300 border-orange-400/30',
  otros: 'bg-slate-600/40 text-slate-300 border-slate-500/30',
}

interface FormState {
  date: string
  amount: string
  category: string
  description: string
}

function makeEmptyForm(): FormState {
  return {
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    category: 'otros',
    description: '',
  }
}

function ExpenseForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  loading,
  isEdit,
}: {
  form: FormState
  onChange: (f: FormState) => void
  onSubmit: () => void
  onCancel: () => void
  loading: boolean
  isEdit: boolean
}) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 space-y-3 border border-slate-700">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Monto *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={e => onChange({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Fecha *</label>
          <input
            type="date"
            value={form.date}
            onChange={e => onChange({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-[#f06292] text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs mb-1 block">Categoría</label>
        <select
          value={form.category}
          onChange={e => onChange({ ...form, category: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-[#f06292] text-sm"
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-slate-400 text-xs mb-1 block">Descripción</label>
        <input
          type="text"
          placeholder="Ej: Pago de luz julio"
          value={form.description}
          onChange={e => onChange({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={loading || !form.amount || !form.date}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f06292] text-white text-xs font-medium hover:bg-[#e91e8c] disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
          {isEdit ? 'Guardar cambios' : 'Agregar gasto'}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs hover:text-white transition-colors"
        >
          <X size={11} />
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function ExpensesSection({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(makeEmptyForm())
  const [loading, setLoading] = useState(false)

  function startAdd() {
    setForm(makeEmptyForm())
    setEditingId(null)
    setAdding(true)
  }

  function startEdit(e: Expense) {
    setForm({ date: e.date, amount: String(e.amount), category: e.category, description: e.description || '' })
    setEditingId(e.id)
    setAdding(false)
  }

  function cancelForm() {
    setAdding(false)
    setEditingId(null)
    setForm(makeEmptyForm())
  }

  async function handleAdd() {
    setLoading(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: form.date, amount: parseFloat(form.amount), category: form.category, description: form.description || null }),
      })
      if (!res.ok) throw new Error()
      const expense = await res.json()
      setExpenses(prev => [expense, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
      cancelForm()
      toast.success('Gasto agregado')
    } catch {
      toast.error('Error al agregar gasto')
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit() {
    if (!editingId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/expenses/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: form.date, amount: parseFloat(form.amount), category: form.category, description: form.description || null }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setExpenses(prev => prev.map(e => e.id === editingId ? updated : e).sort((a, b) => b.date.localeCompare(a.date)))
      cancelForm()
      toast.success('Gasto actualizado')
    } catch {
      toast.error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      setExpenses(prev => prev.filter(e => e.id !== id))
      toast.success('Gasto eliminado')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-semibold text-sm">Gastos</h2>
          {expenses.length > 0 && (
            <p className="text-slate-500 text-xs mt-0.5">Total: {formatCurrency(total)}</p>
          )}
        </div>
        {!adding && !editingId && (
          <button
            onClick={startAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f06292]/20 border border-[#f06292]/40 text-[#f06292] text-xs font-medium hover:bg-[#f06292]/30 transition-colors"
          >
            <Plus size={13} />
            Agregar
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4">
          <ExpenseForm form={form} onChange={setForm} onSubmit={handleAdd} onCancel={cancelForm} loading={loading} isEdit={false} />
        </div>
      )}

      {expenses.length === 0 && !adding ? (
        <div className="py-10 text-center">
          <p className="text-slate-600 text-sm">Sin gastos registrados</p>
          <button onClick={startAdd} className="text-[#f06292] text-xs mt-2 hover:underline">
            Agregar primer gasto
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map(expense =>
            editingId === expense.id ? (
              <ExpenseForm
                key={expense.id}
                form={form}
                onChange={setForm}
                onSubmit={handleEdit}
                onCancel={cancelForm}
                loading={loading}
                isEdit
              />
            ) : (
              <div key={expense.id} className="flex items-center gap-3 bg-slate-900 rounded-xl px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium flex-shrink-0 ${CAT_COLORS[expense.category] || CAT_COLORS.otros}`}>
                      {CATEGORIES.find(c => c.value === expense.category)?.label ?? expense.category}
                    </span>
                    {expense.description && (
                      <span className="text-slate-400 text-xs truncate">{expense.description}</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">{formatDateShort(expense.date)}</p>
                </div>
                <p className="text-red-400 text-sm font-semibold flex-shrink-0">{formatCurrency(expense.amount)}</p>
                <div className="flex gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => startEdit(expense)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
