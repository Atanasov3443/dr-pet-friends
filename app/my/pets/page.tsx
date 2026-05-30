"use client"

import { useEffect, useRef, useState } from "react"
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
  { v: "MALE",   l: "♂ Мъжко"  },
  { v: "FEMALE", l: "♀ Женско" },
]

const EMOJI: Record<string, string> = { DOG:"🐕", CAT:"🐈", BIRD:"🦜", RABBIT:"🐇", EXOTIC:"🦎", OTHER:"🐾" }

type PetData = { id?: string; name: string; species: string; gender: string; breed: string; birthDate: string; weight: string; notes: string }

function PetForm({ initial, onSave, onCancel }: {
  initial: PetData
  onSave: (data: PetData) => Promise<string | null>
  onCancel: () => void
}) {
  const [species, setSpecies] = useState(initial.species || "DOG")
  const [gender,  setGender]  = useState(initial.gender  || "")
  const [error,   setError]   = useState("")
  const [saving,  setSaving]  = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = (fd.get("name") as string || "").trim()
    if (!name) { setError("Името на любимеца е задължително"); return }
    setSaving(true)
    setError("")
    const err = await onSave({
      id:        initial.id,
      name,
      species,
      gender,
      breed:     (fd.get("breed")     as string) || "",
      weight:    (fd.get("weight")    as string) || "",
      birthDate: (fd.get("birthDate") as string) || "",
      notes:     (fd.get("notes")     as string) || "",
    })
    setSaving(false)
    if (err) setError(err)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-4">{initial.id ? "Редактирай любимец" : "Нов любимец"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mb-4">

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Име *</label>
            <input
              name="name"
              type="text"
              defaultValue={initial.name}
              placeholder="Рекс, Мица..."
              autoComplete="off"
              style={{ color: "#111827" }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1083BD] focus:ring-2 focus:ring-[#1083BD]/20"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Вид</label>
            <div className="grid grid-cols-3 gap-1.5">
              {SPECIES.map(s => (
                <button key={s.v} type="button" onClick={() => setSpecies(s.v)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                    species === s.v ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-700 hover:border-[#1083BD]/40"
                  }`}>
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Пол</label>
            <div className="grid grid-cols-2 gap-1.5">
              {GENDER.map(g => (
                <button key={g.v} type="button" onClick={() => setGender(gender === g.v ? "" : g.v)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                    gender === g.v ? "bg-[#EF3988] text-white border-[#EF3988]" : "border-gray-200 text-gray-700 hover:border-[#EF3988]/40"
                  }`}>
                  {g.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Порода</label>
            <input
              name="breed"
              type="text"
              defaultValue={initial.breed}
              placeholder="Лабрадор..."
              autoComplete="off"
              style={{ color: "#111827" }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1083BD] focus:ring-2 focus:ring-[#1083BD]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Тегло (кг)</label>
            <input
              name="weight"
              type="number"
              min="0"
              step="0.1"
              defaultValue={initial.weight}
              placeholder="5.2"
              style={{ color: "#111827" }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1083BD] focus:ring-2 focus:ring-[#1083BD]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Рожден ден</label>
            <input
              name="birthDate"
              type="date"
              defaultValue={initial.birthDate}
              style={{ color: "#111827" }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1083BD] focus:ring-2 focus:ring-[#1083BD]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Бележки</label>
            <input
              name="notes"
              type="text"
              defaultValue={initial.notes}
              placeholder="Алергии, хронични болести..."
              autoComplete="off"
              style={{ color: "#111827" }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1083BD] focus:ring-2 focus:ring-[#1083BD]/20"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={onCancel}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Отказ
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-bold disabled:opacity-60 hover:bg-[#0d6fa0] transition-colors">
            {saving ? "Запазва..." : "Запази"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function MyPetsPage() {
  const [pets,     setPets]     = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<any>(null)

  const load = async () => {
    try {
      const res  = await fetch("/api/my/pets")
      const data = await res.json()
      setPets(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const save = async (form: PetData): Promise<string | null> => {
    try {
      const res = form.id
        ? await fetch("/api/my/pets", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        : await fetch("/api/my/pets", { method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
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

  const emptyForm: PetData = { name: "", species: "DOG", gender: "", breed: "", birthDate: "", weight: "", notes: "" }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Моите любимци</h1>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#EF3988] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#d42f77] transition-colors">
            <Plus className="w-4 h-4" /> Добави
          </button>
        )}
      </div>

      {showForm && !editing && (
        <div className="mb-4">
          <PetForm
            key="new"
            initial={emptyForm}
            onSave={save}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Зарежда...</div>
      ) : pets.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <PawPrint className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 mb-3">Нямаш добавени любимци</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#EF3988] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#d42f77]">
            <Plus className="w-4 h-4" /> Добави любимец
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((p: any) => (
            <div key={p.id}>
              {editing?.id === p.id ? (
                <PetForm
                  key={p.id}
                  initial={{
                    id:        p.id,
                    name:      p.name      ?? "",
                    species:   p.species   ?? "DOG",
                    gender:    p.gender    ?? "",
                    breed:     p.breed     ?? "",
                    birthDate: p.birthDate ? p.birthDate.slice(0, 10) : "",
                    weight:    p.weight != null ? String(p.weight) : "",
                    notes:     p.notes     ?? "",
                  }}
                  onSave={save}
                  onCancel={() => setEditing(null)}
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
                    <div className="flex flex-wrap gap-x-3 text-xs text-gray-400 mt-0.5">
                      {p.breed && <span>{p.breed}</span>}
                      {p.weight != null && <span>{p.weight} кг</span>}
                      {p.birthDate && <span>Роден: {new Date(p.birthDate).toLocaleDateString("bg-BG")}</span>}
                    </div>
                    {p.notes && <p className="text-xs text-gray-500 mt-1 italic">{p.notes}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditing(p); setShowForm(false) }}
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button onClick={() => remove(p.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100">
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
