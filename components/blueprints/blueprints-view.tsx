"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, Edit, Plus, Save, X, Trash2 } from "lucide-react"
import type { ProcessBlueprint, BlueprintStage, StageName, Ability } from "./blueprint-types"
import { OBJECT_SCHEMAS, type ObjectKey } from "./object-schema"

// Slot generation helpers
type SlotOption = { key: string; label: string; base: ObjectKey; alias: string }

// Alias mapping for display and slot keys
function aliasForBase(obj: ObjectKey): string {
  switch (obj) {
    case "purchase_order":
      return "PO"
    case "goods_receipt":
      return "GRN"
    case "invoice":
      return "invoice"
    case "review_response":
      return "review_response"
    default:
      return obj
  }
}

// Map alias back to base object key (for suggestions/schema)
function baseForAlias(alias: string): ObjectKey | null {
  if (alias === "invoice") return "invoice"
  if (alias === "PO") return "purchase_order"
  if (alias === "GRN") return "goods_receipt"
  if (alias === "review_response") return "review_response"
  return null
}

// Build all slot options for current known objects
const BASE_OBJECTS: ObjectKey[] = ["invoice", "purchase_order", "goods_receipt", "review_response"]
function buildSlotOptions(): SlotOption[] {
  const out: SlotOption[] = []
  for (const base of BASE_OBJECTS) {
    const alias = aliasForBase(base)
    out.push(
      {
        key: `current_${alias}_obj`,
        label:
          base === "purchase_order"
            ? `Current PO object (current_${alias}_obj)`
            : base === "goods_receipt"
              ? `Current GRN object (current_${alias}_obj)`
              : `Current ${alias.replace("_", " ")} object (current_${alias}_obj)`,
        base,
        alias,
      },
      {
        key: `reference_${alias}_obj`,
        label:
          base === "purchase_order"
            ? `Reference PO object (reference_${alias}_obj)`
            : base === "goods_receipt"
              ? `Reference GRN object (reference_${alias}_obj)`
              : `Reference ${alias.replace("_", " ")} object (reference_${alias}_obj)`,
        base,
        alias,
      },
    )
  }
  return out
}
const SLOT_OPTIONS: SlotOption[] = buildSlotOptions()

// Derive base object from a slot key
function slotToBase(slot: string): ObjectKey | null {
  if (!slot.endsWith("_obj")) return null
  const trimmed = slot.slice(0, -4) // remove "_obj"
  const curPrefix = "current_"
  const refPrefix = "reference_"
  let alias = ""
  if (trimmed.startsWith(curPrefix)) alias = trimmed.slice(curPrefix.length)
  else if (trimmed.startsWith(refPrefix)) alias = trimmed.slice(refPrefix.length)
  else alias = trimmed
  return baseForAlias(alias)
}

const STAGE_OPTIONS: StageName[] = ["Intake", "Understand", "Prepare", "Decide", "Review", "Create", "Do", "Complete"]

const seededBlueprints: ProcessBlueprint[] = [
  {
    id: "bp-invoice-1",
    name: "Invoice Processing",
    description: "Invoice processing blueprint",
    // Store object slots instead of raw objects
    objects: [
      "current_invoice_obj",
      "current_PO_obj",
      "current_GRN_obj",
      "current_review_response_obj",
    ] as unknown as ObjectKey[], // TS cast for compatibility
    stages: [
      {
        id: "s-intake",
        name: "Intake",
        abilities: [{ id: "a1", name: "receive_invoice", inputs: [], instructions: "", outputs: [] }],
      },
      {
        id: "s-understand",
        name: "Understand",
        abilities: [
          { id: "a2", name: "Analyze Document Structure", inputs: [], instructions: "", outputs: [] },
          { id: "a3", name: "Extract Key Information", inputs: [], instructions: "", outputs: [] },
          { id: "a4", name: "Identify Document Type", inputs: [], instructions: "", outputs: [] },
        ],
      },
      {
        id: "s-prepare",
        name: "Prepare",
        abilities: [
          { id: "a5", name: "find_matching_po", inputs: [], instructions: "", outputs: [] },
          { id: "a6", name: "find_matching_grn", inputs: [], instructions: "", outputs: [] },
          { id: "a7", name: "load_tolerance_rules", inputs: [], instructions: "", outputs: [] },
        ],
      },
      {
        id: "s-decide",
        name: "Decide",
        abilities: [
          { id: "a8", name: "match_details", inputs: [], instructions: "", outputs: [] },
          { id: "a9", name: "apply_tolerance", inputs: [], instructions: "", outputs: [] },
          { id: "a10", name: "make_decision", inputs: [], instructions: "", outputs: [] },
        ],
      },
      {
        id: "s-review",
        name: "Review",
        abilities: [{ id: "a11", name: "manual_review", inputs: [], instructions: "", outputs: [] }],
      },
      {
        id: "s-create",
        name: "Create",
        abilities: [
          { id: "a12", name: "Generate Payment Voucher", inputs: [], instructions: "", outputs: [] },
          { id: "a13", name: "Create Journal Entry", inputs: [], instructions: "", outputs: [] },
        ],
      },
      {
        id: "s-do",
        name: "Do",
        abilities: [
          { id: "a14", name: "Execute Payment", inputs: [], instructions: "", outputs: [] },
          { id: "a15", name: "Send Notifications", inputs: [], instructions: "", outputs: [] },
        ],
      },
      {
        id: "s-complete",
        name: "Complete",
        abilities: [
          { id: "a16", name: "update_invoice_status", inputs: [], instructions: "", outputs: [] },
          { id: "a17", name: "archive_documents", inputs: [], instructions: "", outputs: [] },
        ],
      },
    ],
  },
  {
    id: "bp-cs-1",
    name: "Customer Support",
    description: "Customer support blueprint",
    objects: ["current_review_response_obj"] as unknown as ObjectKey[],
    stages: [
      {
        id: "cs-intake",
        name: "Intake",
        abilities: [{ id: "ca1", name: "Receive Customer Inquiry", inputs: [], instructions: "", outputs: [] }],
      },
      {
        id: "cs-understand",
        name: "Understand",
        abilities: [{ id: "ca2", name: "Analyze Inquiry Content", inputs: [], instructions: "", outputs: [] }],
      },
      {
        id: "cs-complete",
        name: "Complete",
        abilities: [{ id: "ca3", name: "Close Ticket", inputs: [], instructions: "", outputs: [] }],
      },
    ],
  },
]

type ModalMode = "create" | "edit"

export function BlueprintsView() {
  const [blueprints, setBlueprints] = useState<ProcessBlueprint[]>(seededBlueprints)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>("create")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [bpName, setBpName] = useState("")
  const [bpDescription, setBpDescription] = useState("")
  // Store selected object slots (strings)
  const [selectedObjects, setSelectedObjects] = useState<string[]>([])
  const [selectedStages, setSelectedStages] = useState<StageName[]>([])
  const [stageMap, setStageMap] = useState<Record<StageName, BlueprintStage>>({} as any)
  const [bpExpanded, setBpExpanded] = useState<Record<string, boolean>>({})
  const toggleBpExpanded = (id: string) => {
    setBpExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Search over slot options
  const [objQuery, setObjQuery] = useState("")
  const filteredSlotOptions = useMemo(() => {
    const q = objQuery.trim().toLowerCase()
    if (!q) return SLOT_OPTIONS
    return SLOT_OPTIONS.filter((o) => o.label.toLowerCase().includes(q) || o.key.toLowerCase().includes(q))
  }, [objQuery])

  const selectAllFiltered = () => {
    const keys = filteredSlotOptions.map((o) => o.key)
    setSelectedObjects((prev) => Array.from(new Set([...(prev || []), ...keys])))
  }

  const clearAllSelected = () => {
    setSelectedObjects([])
  }

  const openCreate = () => {
    setModalMode("create")
    setEditingId(null)
    setBpName("")
    setBpDescription("")
    setSelectedObjects([])
    setSelectedStages([])
    setStageMap({} as any)
    setShowModal(true)
  }

  const openEdit = (bp: ProcessBlueprint) => {
    setModalMode("edit")
    setEditingId(bp.id)
    setBpName(bp.name)
    setBpDescription(bp.description || "")
    // bp.objects now holds slots; cast to string[]
    setSelectedObjects((bp.objects as unknown as string[]) || [])
    setSelectedStages(bp.stages.map((s) => s.name))
    const map: Record<StageName, BlueprintStage> = {} as any
    bp.stages.forEach((s) => {
      map[s.name] = {
        id: s.id,
        name: s.name,
        abilities: [...s.abilities],
        expanded: true,
      }
    })
    setStageMap(map)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const toggleObject = (slotKey: string) => {
    setSelectedObjects((prev) => (prev.includes(slotKey) ? prev.filter((k) => k !== slotKey) : [...prev, slotKey]))
  }

  const toggleStage = (stage: StageName) => {
    setSelectedStages((prev) => {
      const exists = prev.includes(stage)
      const next = exists ? prev.filter((s) => s !== stage) : [...prev, stage]
      if (!exists && !stageMap[stage]) {
        setStageMap((sm) => ({
          ...sm,
          [stage]: {
            id: `stage-${stage.toLowerCase()}-${Date.now()}`,
            name: stage,
            abilities: [],
            expanded: true,
          },
        }))
      }
      return next
    })
  }

  // Build combined schema from selected slots by mapping to base objects
  const combinedSchema = useMemo(() => {
    const combined: Record<string, any> = {}
    const bases = new Set<ObjectKey>()
    for (const slot of selectedObjects) {
      const base = slotToBase(slot)
      if (base) bases.add(base)
    }
    for (const base of bases) {
      combined[base] = OBJECT_SCHEMAS[base]
    }
    return combined
  }, [selectedObjects])

  // Suggestions like Process Spine (dot-notation, nested)
  const generateSuggestions = (inputText: string): string[] => {
    if (!inputText) return []
    const suggestions: string[] = []

    // Object name matches (from combined schema derived from slots)
    Object.keys(combinedSchema).forEach((objName) => {
      if (objName.toLowerCase().includes(inputText.toLowerCase())) suggestions.push(objName)
    })

    // Dot path matches
    if (inputText.includes(".")) {
      const [objName, ...rest] = inputText.split(".")
      const base = objName as keyof typeof combinedSchema
      const currentPath = rest.join(".")
      const obj = combinedSchema[base]
      if (obj) {
        suggestions.push(...getNestedSuggestions(obj, currentPath, objName))
      }
    }

    return suggestions.slice(0, 8)
  }

  const getNestedSuggestions = (obj: any, path: string, prefix: string): string[] => {
    if (!path) return Object.keys(obj).map((k) => `${prefix}.${k}`)
    const parts = path.split(".")
    const currentKey = parts[0]
    const remaining = parts.slice(1).join(".")

    if (obj[currentKey]) {
      if (Array.isArray(obj[currentKey]) && obj[currentKey][0]) {
        return getNestedSuggestions(obj[currentKey][0], remaining, `${prefix}.${currentKey}[]`)
      } else if (typeof obj[currentKey] === "object") {
        return getNestedSuggestions(obj[currentKey], remaining, `${prefix}.${currentKey}`)
      }
    }
    return []
  }

  // Ability Editing (per stage)
  const addAbility = (stage: StageName) => {
    setStageMap((sm) => {
      const st = sm[stage]
      const newAbility: Ability = {
        id: `ab-${Date.now()}`,
        name: "New Ability",
        inputs: [],
        instructions: "",
        outputs: [],
      }
      return { ...sm, [stage]: { ...st, abilities: [...st.abilities, newAbility] } }
    })
  }

  const removeAbility = (stage: StageName, abilityId: string) => {
    setStageMap((sm) => {
      const st = sm[stage]
      return { ...sm, [stage]: { ...st, abilities: st.abilities.filter((a) => a.id !== abilityId) } }
    })
  }

  const updateAbility = (stage: StageName, abilityId: string, patch: Partial<Ability>) => {
    setStageMap((sm) => {
      const st = sm[stage]
      const updated = st.abilities.map((a) => (a.id === abilityId ? { ...a, ...patch } : a))
      return { ...sm, [stage]: { ...st, abilities: updated } }
    })
  }

  const addTag = (stage: StageName, abilityId: string, field: "inputs" | "outputs", value: string) => {
    if (!value.trim()) return
    updateAbility(stage, abilityId, {
      [field]: Array.from(
        new Set([...(stageMap[stage].abilities.find((a) => a.id === abilityId)?.[field] || []), value]),
      ),
    } as any)
  }

  const removeTag = (stage: StageName, abilityId: string, field: "inputs" | "outputs", idx: number) => {
    const ability = stageMap[stage].abilities.find((a) => a.id === abilityId)
    if (!ability) return
    const copy = [...(ability[field] as string[])]
    copy.splice(idx, 1)
    updateAbility(stage, abilityId, { [field]: copy } as any)
  }

  const toggleStageExpand = (stage: StageName) => {
    setStageMap((sm) => ({ ...sm, [stage]: { ...sm[stage], expanded: !sm[stage].expanded } }))
  }

  const handleSaveBlueprint = () => {
    if (!bpName.trim()) return

    const stages: BlueprintStage[] = selectedStages.map((s) => stageMap[s]).filter(Boolean) as BlueprintStage[]
    if (modalMode === "create") {
      const newBp: ProcessBlueprint = {
        id: `bp-${Date.now()}`,
        name: bpName.trim(),
        description: bpDescription.trim(),
        // Store slots into objects
        objects: selectedObjects as unknown as ObjectKey[],
        stages,
      }
      setBlueprints((prev) => [newBp, ...prev])
    } else if (modalMode === "edit" && editingId) {
      setBlueprints((prev) =>
        prev.map((bp) =>
          bp.id === editingId
            ? { ...bp, name: bpName.trim(), description: bpDescription.trim(), objects: selectedObjects as any, stages }
            : bp,
        ),
      )
    }
    setShowModal(false)
  }

  const abilityCount = (bp: ProcessBlueprint) => bp.stages.reduce((sum, s) => sum + s.abilities.length, 0)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Process Blue Prints</h2>
          <p className="text-gray-600 text-sm">Create, view, and edit process blue prints.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New Process Blue Print
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {blueprints.map((bp) => (
          <Card key={bp.id} className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleBpExpanded(bp.id)}
                      aria-expanded={!!bpExpanded[bp.id]}
                      aria-label={bpExpanded[bp.id] ? "Collapse details" : "Expand details"}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {bpExpanded[bp.id] ? (
                        <ChevronDown className="w-4 h-4 text-gray-700" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      )}
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{bp.name}</h3>
                  </div>
                  {bp.description && <p className="text-sm text-gray-600 mt-1">{bp.description}</p>}

                  {/* Show object slots instead of objects */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(bp.objects as unknown as string[]).map((slotKey) => {
                      const opt = SLOT_OPTIONS.find((o) => o.key === slotKey)
                      const label = opt ? opt.key : slotKey
                      return (
                        <Badge key={slotKey} variant="secondary" className="bg-gray-100 text-gray-700">
                          {label}
                        </Badge>
                      )
                    })}
                  </div>

                  <div className="mt-3 text-sm text-gray-700">
                    <span className="mr-4">Stages: {bp.stages.length}</span>
                    <span>Abilities: {abilityCount(bp)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => openEdit(bp)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* Stage-wise abilities listing (collapsed by default) */}
              {bpExpanded[bp.id] && (
                <div className="mt-4 space-y-3">
                  {bp.stages.map((stage) => (
                    <div key={stage.id} className="border rounded-md">
                      <div className="px-3 py-2 bg-gray-50 flex items-center justify-between">
                        <div className="font-medium text-gray-800 text-sm">{stage.name}</div>
                        <div className="text-xs text-gray-600">{stage.abilities.length} abilities</div>
                      </div>
                      {stage.abilities.length > 0 && (
                        <div className="px-3 py-2">
                          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {stage.abilities.map((ab) => (
                              <li key={ab.id}>{ab.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {stage.abilities.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No abilities</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
              <div className="font-semibold text-gray-800">
                {modalMode === "create" ? "New Process Blue Print" : "Edit Process Blue Print"}
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6">
              {/* Basic Info */}
              <section>
                <h4 className="font-medium text-gray-800 mb-3">Basic information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Name</label>
                    <Input value={bpName} onChange={(e) => setBpName(e.target.value)} placeholder="Blueprint name" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Description</label>
                    <Input
                      value={bpDescription}
                      onChange={(e) => setBpDescription(e.target.value)}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
              </section>

              {/* Object Slots */}
              <section>
                <h4 className="font-medium text-gray-800 mb-3">Object slots</h4>

                <div className="space-y-2 mb-3">
                  {/* Search */}
                  <Input
                    value={objQuery}
                    onChange={(e) => setObjQuery(e.target.value)}
                    placeholder="Search object slots..."
                    aria-label="Search object slots"
                  />

                  {/* Scrollable checkbox list */}
                  <div className="border rounded-md max-h-56 overflow-y-auto divide-y bg-white">
                    {filteredSlotOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">No object slots match your search.</div>
                    )}
                    {filteredSlotOptions.map((o) => {
                      const checked = selectedObjects.includes(o.key)
                      return (
                        <label
                          key={o.key}
                          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          <Checkbox checked={checked} onCheckedChange={() => toggleObject(o.key)} />
                          <span className="text-sm text-gray-800">{o.label}</span>
                          <span className="ml-auto text-xs text-gray-500">{o.key}</span>
                        </label>
                      )
                    })}
                  </div>

                  {/* Bulk actions */}
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={selectAllFiltered}
                      className="text-gray-600 hover:text-gray-800 underline"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={clearAllSelected}
                      className="text-gray-600 hover:text-gray-800 underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                {/* Selected summary */}
                {selectedObjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedObjects.map((slotKey) => (
                      <Badge key={slotKey} variant="secondary" className="bg-gray-100 text-gray-700">
                        {slotKey}
                      </Badge>
                    ))}
                  </div>
                )}
              </section>

              {/* Stages */}
              <section>
                <h4 className="font-medium text-gray-800 mb-3">Stages</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {STAGE_OPTIONS.map((stage) => {
                    const active = selectedStages.includes(stage)
                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => toggleStage(stage)}
                        className={`px-3 py-1.5 rounded-md text-sm border transition ${
                          active
                            ? "bg-orange-100 text-orange-800 border-orange-300"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {stage}
                      </button>
                    )
                  })}
                </div>

                {/* Stage Editors */}
                <div className="space-y-4">
                  {selectedStages.map((stage) => {
                    const st = stageMap[stage]
                    if (!st) return null
                    return (
                      <div key={st.id} className="border rounded-md overflow-hidden">
                        <div className="px-3 py-2 bg-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-gray-100"
                              onClick={() => toggleStageExpand(stage)}
                              title="Toggle"
                            >
                              {st.expanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-700" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-700" />
                              )}
                            </button>
                            <span className="font-medium text-gray-800 text-sm">{st.name}</span>
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                              {st.abilities.length} abilities
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => addAbility(stage)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add ability
                          </Button>
                        </div>

                        {st.expanded && (
                          <div className="p-3 space-y-3">
                            {st.abilities.length === 0 && (
                              <div className="text-sm text-gray-500">No abilities added yet.</div>
                            )}

                            {st.abilities.map((ab) => (
                              <div key={ab.id} className="border rounded-md p-3">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">Ability name</label>
                                    <Input
                                      value={ab.name}
                                      onChange={(e) => updateAbility(stage, ab.id, { name: e.target.value })}
                                      placeholder="Ability name"
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAbility(stage, ab.id)}
                                    className="text-red-600 hover:text-red-700"
                                    title="Remove ability"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Inputs */}
                                <DotNotationTags
                                  label="Inputs"
                                  value={ab.inputs}
                                  onAdd={(v) => addTag(stage, ab.id, "inputs", v)}
                                  onRemove={(idx) => removeTag(stage, ab.id, "inputs", idx)}
                                  getSuggestions={generateSuggestions}
                                  placeholder="Type object name (e.g., invoice.vendorId)"
                                />

                                {/* Instructions */}
                                <div className="mt-3">
                                  <label className="block text-xs text-gray-600 mb-1">Instructions</label>
                                  <Textarea
                                    value={ab.instructions}
                                    onChange={(e) => updateAbility(stage, ab.id, { instructions: e.target.value })}
                                    placeholder="Enter instructions for this ability..."
                                  />
                                </div>

                                {/* Outputs */}
                                <DotNotationTags
                                  label="Outputs"
                                  value={ab.outputs}
                                  onAdd={(v) => addTag(stage, ab.id, "outputs", v)}
                                  onRemove={(idx) => removeTag(stage, ab.id, "outputs", idx)}
                                  getSuggestions={generateSuggestions}
                                  placeholder="Type object name (e.g., invoice.status)"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t bg-white flex items-center justify-end gap-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleSaveBlueprint}
                disabled={!bpName.trim() || selectedObjects.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                {modalMode === "create" ? "Create Blue Print" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DotNotationTags({
  label,
  value,
  onAdd,
  onRemove,
  getSuggestions,
  placeholder,
}: {
  label: string
  value: string[]
  onAdd: (val: string) => void
  onRemove: (idx: number) => void
  getSuggestions: (q: string) => string[]
  placeholder?: string
}) {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const suggestions = useMemo(() => (text ? getSuggestions(text) : []), [text, getSuggestions])

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs text-gray-600">{label}</label>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((v, idx) => (
            <Badge key={`${v}-${idx}`} variant="secondary" className="bg-blue-50 text-blue-800 border border-blue-200">
              <span className="mr-1">{v}</span>
              <button
                type="button"
                className="ml-1 text-blue-700 hover:text-blue-900"
                onClick={() => onRemove(idx)}
                aria-label="Remove tag"
                title="Remove"
              >
                {"×"}
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || "Type to add..."}
        />
        {/* Suggestions */}
        {open && suggestions.length > 0 && (
          <div
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
            onMouseLeave={() => setOpen(false)}
          >
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                className="w-full text-left text-sm px-3 py-2 hover:bg-gray-50"
                onClick={() => {
                  onAdd(sug)
                  setText("")
                  setOpen(false)
                }}
              >
                {sug}
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (text.trim()) {
                onAdd(text.trim())
                setText("")
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
