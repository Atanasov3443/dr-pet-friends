"use client"

import { useEffect, useState } from "react"
import { Save, ChevronDown, ChevronUp, Image, Type } from "lucide-react"

type FieldDef = { key: string; label: string; type: "text" | "textarea" | "image" }
type Section  = { title: string; color: string; fields: FieldDef[] }

const SECTIONS: Section[] = [
  {
    title: "Hero секция — слайдове",
    color: "bg-blue-50 border-blue-200",
    fields: [
      { key: "hero.slide.1.image",       label: "Слайд 1 — Снимка (URL)",    type: "image"   },
      { key: "hero.slide.1.subtitle",    label: "Слайд 1 — Заглавие",        type: "text"    },
      { key: "hero.slide.1.description", label: "Слайд 1 — Описание",        type: "textarea"},
      { key: "hero.slide.2.image",       label: "Слайд 2 — Снимка (URL)",    type: "image"   },
      { key: "hero.slide.2.subtitle",    label: "Слайд 2 — Заглавие",        type: "text"    },
      { key: "hero.slide.2.description", label: "Слайд 2 — Описание",        type: "textarea"},
      { key: "hero.slide.3.image",       label: "Слайд 3 — Снимка (URL)",    type: "image"   },
      { key: "hero.slide.3.subtitle",    label: "Слайд 3 — Заглавие",        type: "text"    },
      { key: "hero.slide.3.description", label: "Слайд 3 — Описание",        type: "textarea"},
      { key: "hero.slide.4.image",       label: "Слайд 4 — Снимка (URL)",    type: "image"   },
      { key: "hero.slide.4.subtitle",    label: "Слайд 4 — Заглавие",        type: "text"    },
      { key: "hero.slide.4.description", label: "Слайд 4 — Описание",        type: "textarea"},
    ],
  },
  {
    title: "Как работи",
    color: "bg-purple-50 border-purple-200",
    fields: [
      { key: "howitworks.badge",         label: "Бадж",           type: "text"    },
      { key: "howitworks.title",         label: "Заглавие",       type: "text"    },
      { key: "howitworks.subtitle",      label: "Подзаглавие",    type: "text"    },
      { key: "howitworks.step.1.title",  label: "Стъпка 1 — Заглавие", type: "text" },
      { key: "howitworks.step.1.text",   label: "Стъпка 1 — Текст",    type: "textarea" },
      { key: "howitworks.step.2.title",  label: "Стъпка 2 — Заглавие", type: "text" },
      { key: "howitworks.step.2.text",   label: "Стъпка 2 — Текст",    type: "textarea" },
      { key: "howitworks.step.3.title",  label: "Стъпка 3 — Заглавие", type: "text" },
      { key: "howitworks.step.3.text",   label: "Стъпка 3 — Текст",    type: "textarea" },
    ],
  },
  {
    title: "Спешна помощ",
    color: "bg-pink-50 border-pink-200",
    fields: [
      { key: "emergency.label",       label: "Горен бадж текст",       type: "text"     },
      { key: "emergency.card1.title", label: "Карта 1 — Заглавие",     type: "text"     },
      { key: "emergency.card1.text",  label: "Карта 1 — Описание",     type: "textarea" },
      { key: "emergency.card2.title", label: "Карта 2 — Заглавие",     type: "text"     },
      { key: "emergency.card2.text",  label: "Карта 2 — Описание",     type: "textarea" },
    ],
  },
  {
    title: "За ветеринари / партньори",
    color: "bg-rose-50 border-rose-200",
    fields: [
      { key: "forvets.badge",         label: "Бадж",                  type: "text"     },
      { key: "forvets.title",         label: "Заглавие",              type: "text"     },
      { key: "forvets.subtitle",      label: "Подзаглавие",           type: "textarea" },
      { key: "forvets.stat.1.value",  label: "Статистика 1 — Число",  type: "text"     },
      { key: "forvets.stat.1.label",  label: "Статистика 1 — Етикет", type: "text"     },
      { key: "forvets.stat.2.value",  label: "Статистика 2 — Число",  type: "text"     },
      { key: "forvets.stat.2.label",  label: "Статистика 2 — Етикет", type: "text"     },
      { key: "forvets.stat.3.value",  label: "Статистика 3 — Число",  type: "text"     },
      { key: "forvets.stat.3.label",  label: "Статистика 3 — Етикет", type: "text"     },
      { key: "forvets.stat.4.value",  label: "Статистика 4 — Число",  type: "text"     },
      { key: "forvets.stat.4.label",  label: "Статистика 4 — Етикет", type: "text"     },
    ],
  },
  {
    title: "Чести въпроси (FAQ)",
    color: "bg-yellow-50 border-yellow-200",
    fields: [
      { key: "faq.title",    label: "Заглавие",    type: "text"     },
      { key: "faq.subtitle", label: "Подзаглавие", type: "textarea" },
    ],
  },
  {
    title: "Футър",
    color: "bg-gray-50 border-gray-200",
    fields: [
      { key: "footer.tagline", label: "Tagline",  type: "text" },
      { key: "footer.email",   label: "Имейл",    type: "text" },
      { key: "footer.phone",   label: "Телефон",  type: "text" },
      { key: "footer.address", label: "Адрес",    type: "text" },
    ],
  },
  {
    title: "Сайт мета",
    color: "bg-green-50 border-green-200",
    fields: [
      { key: "site.name",        label: "Име на сайта",  type: "text"     },
      { key: "site.description", label: "Описание",      type: "textarea" },
    ],
  },
]

type Entry = { value: string; saving: boolean; saved: boolean }
type State = Record<string, Entry>

export default function ContentPage() {
  const [state, setState]       = useState<State>({})
  const [loading, setLoading]   = useState(true)
  const [open, setOpen]         = useState<Record<string, boolean>>({ "Hero секция — слайдове": true })

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then((rows: {key:string;value:string}[]) => {
        const dbMap = Object.fromEntries(rows.map(r => [r.key, r.value]))
        const allKeys = SECTIONS.flatMap(s => s.fields.map(f => f.key))
        const initial: State = {}
        allKeys.forEach(key => { initial[key] = { value: dbMap[key] ?? "", saving: false, saved: false } })
        setState(initial)
        setLoading(false)
      })
  }, [])

  const update = (key: string, value: string) => {
    setState(s => ({ ...s, [key]: { ...s[key], value, saved: false } }))
  }

  const save = async (key: string) => {
    setState(s => ({ ...s, [key]: { ...s[key], saving: true } }))
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: state[key]?.value ?? "" }),
    })
    setState(s => ({ ...s, [key]: { ...s[key], saving: false, saved: true } }))
  }

  const saveSection = async (section: Section) => {
    for (const field of section.fields) {
      await save(field.key)
    }
  }

  const toggle = (title: string) => setOpen(o => ({ ...o, [title]: !o[title] }))

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Съдържание на сайта</h1>
        <p className="text-gray-500 text-sm mt-1">Редактирай текстове и снимки по секции</p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {SECTIONS.map(section => (
          <div key={section.title} className={`rounded-2xl border ${section.color} overflow-hidden`}>
            <button
              onClick={() => toggle(section.title)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-black/5 transition-colors">
              <span className="font-semibold text-gray-900">{section.title}</span>
              <div className="flex items-center gap-3">
                {open[section.title] && (
                  <button
                    onClick={e => { e.stopPropagation(); saveSection(section) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-lg text-xs font-medium transition-colors">
                    <Save className="w-3.5 h-3.5" /> Запази секцията
                  </button>
                )}
                {open[section.title] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {open[section.title] && (
              <div className="px-6 pb-6 bg-white space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {field.type === "image"
                        ? <Image className="w-3 h-3 text-gray-400" />
                        : <Type  className="w-3 h-3 text-gray-400" />}
                      <label className="text-xs font-semibold text-gray-600">{field.label}</label>
                      <span className="text-xs text-gray-300 font-mono ml-auto">{field.key}</span>
                    </div>

                    <div className="flex gap-2 items-start">
                      <div className="flex-1">
                        {field.type === "textarea" ? (
                          <textarea
                            value={state[field.key]?.value ?? ""}
                            onChange={e => update(field.key, e.target.value)}
                            rows={2}
                            placeholder={`Дефолт: вижте lib/content.ts`}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] resize-none" />
                        ) : (
                          <input
                            value={state[field.key]?.value ?? ""}
                            onChange={e => update(field.key, e.target.value)}
                            placeholder={field.type === "image" ? "https://... или /local-image.jpg" : "Въведи текст..."}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
                        )}
                        {field.type === "image" && state[field.key]?.value && (
                          <div className="mt-2">
                            <img src={state[field.key].value} alt=""
                              className="h-20 rounded-xl object-cover border border-gray-100"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => save(field.key)}
                        disabled={state[field.key]?.saving}
                        className={`shrink-0 px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors ${
                          state[field.key]?.saved
                            ? "bg-green-50 text-green-700"
                            : "bg-[#1083BD] hover:bg-[#0d6fa0] text-white"
                        } disabled:opacity-50`}>
                        <Save className="w-3.5 h-3.5" />
                        {state[field.key]?.saving ? "..." : state[field.key]?.saved ? "✓" : "Запази"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
