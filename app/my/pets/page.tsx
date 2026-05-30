"use client"

import { useEffect, useState } from "react"
import { PawPrint, Plus, Pencil, Trash2, AlertCircle } from "lucide-react"

const SPECIES = [
  { v: "DOG",    l: "🐕 Куче"      },
  { v: "CAT",    l: "🐈 Котка"     },
  { v: "BIRD",   l: "🦜 Птица"     },
  { v: "RABBIT", l: "🐇 Заек"      },
  { v: "EXOTIC", l: "🦎 Екзотично" },
  { v: "OTHER",  l: "🐾 Друго"     },
]

const GENDER = [
  { v: "MALE",   l: "♂ Мъжко" },
  { v: "FEMALE", l: "♀ Женско" },
]

const EMOJI: Record<string, string> = { DOG:"🐕", CAT:"🐈", BIRD:"🦜", RABBIT:"🐇", EXOTIC:"🦎", OTHER:"🐾" }

const empty = { name: "", species: "DOG", gender: "", breed: "", birthDate: "", weight: "", notes: "" }

function PetForm({ initial, onSave, onCancel, loading }: {
  initial: typeof empty
  onSave: (data: typeof empty) => Promise<string | null>
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm]   = useState(initial)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Името на любимеца е задължително"); return }
    setSaving(true)
    setError("")
    const err = await onSave(form)
    setSaving(false)
    if (err) setError(err)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-4">{initial.name ? "Редактирай любимец" : "Нов любимец"}</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Name */}
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Име *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Рекс, Мица..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1083BD]/30 focus:border-[#1083BD] transition-colors"
          />
        </div>

        {/* Species */}
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Вид</label>
          <div className="grid grid-cols-3 gap-1.5">
            {SPECIES.map(s => (
              <button key={s.v} type="button" onClick={() => set("species", s.v)}
                className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                  form.species === s.v
                    ? "bg-[#1083BD] text-white border-[#1083BD]"
                    : "border-gray-200 text-gray-600 hover:border-[#1083BD]/40 hover:bg-[#1083BD]/5"
                }`}>
                {s.l}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Пол</label>
          <div className="grid grid-cols-2 gap-1.5">
            {GENDER.map(g => (
              <button key={g.v} type="button" onClick={() => set("gender", form.gender === g.v ? "" : g.v)}
                className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                  form.gender === g.v
                    ? "bg-[#EF3988] text-white border-[#EF3988]"
                    : "border-gray-200 text-gray-600 hover:border-[#EF3988]/40 hover:bg-[#EF3988]/5"
                }`}>
                {g.l}
              </button>
            ))}
          </div>
        </div>

        {/* Breed */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Порода</label>
          <input
            type="text"
            value={form.breed}
            onChange={e => set("breed", e.target.value)}
            placeholder="Лабрадор..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1083BD]/30 focus:border-[#1083BD] transition-colors"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Тегло (кг)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.weight}
            onChange={e => set("weight", e.target.value)}
            placeholder="5.2"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1083BD]/30 focus:border-[#1083BD] transition-colors"
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Рожден ден</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={e => set("birthDate", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1083BD]/30 focus:border-[#1083BD] transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Бележки</label>
          <input
            type="text"
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
            placeholder="Алергии, хронични болести..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1083BD]/30 focus:border-[#1083BD] transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Отказ
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="flex-1 py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-bold disabled:opacity-60 hover:bg-[#0d6fa0] transition-colors">
          {saving ? "Запазва..." : "Запази"}
        </button>
      </div>
    </div>
  )
}

export default function MyPetsPage() {
  const [pets, setPets]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<any>(null)

  const load = async () => {
    const res  = await fetch("/api/my/pets")
    const data = await res.json()
    setPets(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async (form: typeof empty): Promise<string | null> => {
    try {
      const res = editing
        ? await fetch("/api/my/pets", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editing.id }) })
        : await fetch("/api/my/pets", { method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })

      if (!res.ok) {
        const data = await res.json()
        return data.error ?? "Грешка при запазване"
      }

      setShowForm(false)
      setEditing(null)
      await load()
      return null
    } catch {
      return "Сървърна грешка. Опитай отново."
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Изтрий любимеца?")) return
    await fetch("/api/my/pets", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Моите любимци</h1>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#EF3988] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#d42f77] transition-colors">
            <Plus className="w-4 h-4" /> Добави
          </button>
        )}
      </div>

      {showForm && !editing && (
        <div className="mb-4">
          <PetForm initial={empty} onSave={save} onCancel={() => setShowForm(false)} loading={false} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Зарежда...</div>
      ) : pets.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <PawPrint className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 mb-3">Нямаш добавени любимци</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#EF3988] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#d42f77] transition-colors">
            <Plus className="w-4 h-4" /> Добави любимец
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((p: any) => (
            <div key={p.id}>
              {editing?.id === p.id ? (
                <PetForm
                  initial={{
                    name:      p.name,
                    species:   p.species,
                    gender:    p.gender   ?? "",
                    breed:     p.breed    ?? "",
                    birthDate: p.birthDate ? p.birthDate.slice(0, 10) : "",
                    weight:    p.weight != null ? String(p.weight) : "",
                    notes:     p.notes    ?? "",
                  }}
                  onSave={save}
                  onCancel={() => setEditing(null)}
                  loading={false}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1083BD]/10 flex items-center justify-center text-2xl shrink-0">
                    {EMOJI[p.species] ?? "🐾"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      {p.name}
                      {p.gender === "MALE"   && <span className="ml-1.5 text-blue-400 text-sm">♂</span>}
                      {p.gender === "FEMALE" && <span className="ml-1.5 text-pink-400 text-sm">♀</span>}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                      {p.breed    && <span>{p.breed}</span>}
                      {p.weight != null && <span>{p.weight} кг</span>}
                      {p.birthDate && <span>Роден: {new Date(p.birthDate).toLocaleDateString("bg-BG")}</span>}
                    </div>
                    {p.notes && <p className="text-xs text-gray-500 mt-1 italic">{p.notes}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditing(p); setShowForm(false) }}
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
