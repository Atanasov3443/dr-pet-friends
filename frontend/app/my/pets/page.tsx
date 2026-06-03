"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useRef, useState } from "react"
import { PawPrint, Plus, Pencil, Trash2, AlertCircle, Camera, Upload } from "lucide-react"

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

const GRADIENTS = [
  "bg-gradient-to-br from-[#1083BD] to-[#0D67F7]",
  "bg-gradient-to-br from-[#EF3988] to-[#d42f77]",
  "bg-gradient-to-br from-[#10B83D] to-[#0a8c2e]",
  "bg-gradient-to-br from-[#F97316] to-[#ea6c0a]",
  "bg-gradient-to-br from-[#8B5CF6] to-[#7c3aed]",
  "bg-gradient-to-br from-[#06B6D4] to-[#0891b2]",
]

function petGradient(name: string) {
  const idx = name.charCodeAt(0) % GRADIENTS.length
  return GRADIENTS[idx]
}

const COLORS1 = ["#1083BD","#EF3988","#10B83D","#F97316","#8B5CF6","#06B6D4"]
const COLORS2 = ["#0D67F7","#d42f77","#0a8c2e","#ea6c0a","#7c3aed","#0891b2"]

function petColor1(name: string) { return COLORS1[name.charCodeAt(0) % COLORS1.length] }
function petColor2(name: string) { return COLORS2[name.charCodeAt(0) % COLORS2.length] }

const SPECIES_LABELS: Record<string, string> = {
  DOG: "Куче", CAT: "Котка", BIRD: "Птица",
  RABBIT: "Заек", EXOTIC: "Екзотично", OTHER: "Любимец"
}

function petTypeLabel(species: string, breed: string | null) {
  if (breed && breed.trim() && species === "OTHER") {
    return breed.split(" ")[0].slice(0, 8)
  }
  return SPECIES_LABELS[species] ?? "Любимец"
}

type PetData = { id?: string; name: string; species: string; gender: string; breed: string; birthDate: string; weight: string; notes: string; image?: string }

function PetForm({ initial, onSave, onCancel }: {
  initial: PetData
  onSave: (data: PetData) => Promise<string | null>
  onCancel: () => void
}) {
  const [gender, setGender] = useState(initial.gender || "")
  const [image,      setImage]      = useState(initial.image   || "")
  const [uploading,  setUploading]  = useState(false)
  const [error,      setError]      = useState("")
  const [saving,     setSaving]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("image", file)
    try {
      const res = await fetch(`/api/proxy/api/upload/image?folder=pets`, { method: "POST", body: fd, credentials: "include" })
      const data = await res.json()
      if (data.url) setImage(data.url)
      else setError(data.error ?? "Upload failed")
    } catch {
      setError("Upload failed")
    } finally {
      setUploading(false)
    }
  }

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
      species:   "OTHER",
      gender,
      breed:     (fd.get("breed")     as string) || "",
      weight:    (fd.get("weight")    as string) || "",
      birthDate: (fd.get("birthDate") as string) || "",
      notes:     (fd.get("notes")     as string) || "",
      image,
    })
    setSaving(false)
    if (err) setError(err)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-4">{initial.id ? "Редактирай любимец" : "Нов любимец"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mb-4">

          {/* Photo upload */}
          <div className="col-span-2 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {image
                ? <img src={image} alt="" className="w-full h-full object-cover" />
                : <PawPrint className="w-7 h-7 text-gray-300" />
              }
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-60">
                {uploading ? <><Upload className="w-3 h-3 animate-pulse" /> Качва...</> : <><Camera className="w-3 h-3" /> Качи снимка</>}
              </button>
              {image && (
                <button type="button" onClick={() => setImage("")}
                  className="ml-2 text-xs text-red-400 hover:text-red-600">
                  Премахни
                </button>
              )}
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Вид / Порода</label>
            <input
              name="breed"
              type="text"
              defaultValue={initial.breed}
              placeholder="Куче, котка, заек..."
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
      const res  = await fetch(apiUrl("/api/my/pets"), { credentials: "include" })
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
        ? await fetch(apiUrl("/api/my/pets"), { credentials: "include", method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        : await fetch(apiUrl("/api/my/pets"), { credentials: "include", method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        return data.error ?? "Грешка при запазване"
      }
      const saved = await res.json()
      setShowForm(false)
      setEditing(null)
      // Update state without full reload
      if (form.id) {
        setPets(prev => prev.map(p => p.id === form.id ? saved : p))
      } else {
        setPets(prev => [...prev, saved])
      }
      return null
    } catch {
      return "Сървърна грешка. Опитай отново."
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Изтрий любимеца?")) return
    const res = await fetch(apiUrl("/api/my/pets"), { credentials: "include", method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    if (res.ok) {
      setPets(prev => prev.filter(p => p.id !== id))
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? "Грешка при изтриване")
    }
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
                    image:     p.image     ?? "",
                  }}
                  onSave={save}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-[#1083BD]/20 transition-all overflow-hidden">
                  <div className="flex items-center gap-4 p-5">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl shrink-0 overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex flex-col items-center justify-center gap-1 ${petGradient(p.name)}`}>
                          <span className="text-white font-black text-sm leading-tight text-center px-1 capitalize">
                            {petTypeLabel(p.species, p.breed)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-gray-900 text-base">
                          {p.name}
                        </p>
                        {p.gender === "MALE"   && <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-medium">♂ Мъжко</span>}
                        {p.gender === "FEMALE" && <span className="text-xs bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full font-medium">♀ Женско</span>}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.breed && (
                          <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{p.breed}</span>
                        )}
                        {p.weight != null && (
                          <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full">⚖️ {p.weight} кг</span>
                        )}
                        {p.birthDate && (
                          <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            🎂 {new Date(p.birthDate).toLocaleDateString("bg-BG", { day:"numeric", month:"long", year:"numeric" })}
                          </span>
                        )}
                      </div>

                      {p.notes && <p className="text-xs text-gray-400 mt-2 italic">💬 {p.notes}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => { setEditing(p); setShowForm(false) }}
                        className="w-8 h-8 rounded-xl bg-[#1083BD]/10 hover:bg-[#1083BD]/20 flex items-center justify-center transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-[#1083BD]" />
                      </button>
                      <button onClick={() => remove(p.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
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
