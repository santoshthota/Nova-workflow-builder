"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pause, Play, Plus, Trash2 } from "lucide-react"
import type { ProcessItem, ProcessStatus } from "./types"
import { CONNECTOR_OPTIONS, SPINE_OPTIONS, getObjectsForSpine, getSpineName } from "./spine-registry"

function formatDateYYYYMMDD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function ProcessListView() {
  const [processes, setProcesses] = useState<ProcessItem[]>([
    {
      id: "proc-1",
      name: "AA Invoice Processing",
      spine: "Invoice Automation",
      status: "Running",
      lastModified: "2024-07-16",
      objectMappings: [
        { objectName: "invoice", connector: "S3" },
        { objectName: "purchase_order", connector: "ERP" },
        { objectName: "goods_receipt", connector: "MS-365" },
        { objectName: "review_response", connector: "Slack" },
      ],
    },
  ])

  const [showCreate, setShowCreate] = useState(false)

  const toggleStatus = (id: string) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next: ProcessStatus = p.status === "Running" ? "Paused" : "Running"
          return { ...p, status: next, lastModified: formatDateYYYYMMDD(new Date()) }
        }
        return p
      }),
    )
  }

  const deleteProcess = (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this process?")
    if (!ok) return
    setProcesses((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCreateSubmit = (payload: {
    name: string
    spineId: string
    mappings: { objectName: string; connector: string }[]
  }) => {
    const newItem: ProcessItem = {
      id: `proc-${Date.now()}`,
      name: payload.name.trim(),
      spine: getSpineName(payload.spineId),
      status: "Running",
      lastModified: formatDateYYYYMMDD(new Date()),
      objectMappings: payload.mappings,
    }
    setProcesses((prev) => [newItem, ...prev])
    setShowCreate(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Processes</h2>
          <p className="text-gray-600 text-sm">Manage and monitor your processes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create new process
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4">
        <Card className="bg-white">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Process Name</TableHead>
                    <TableHead className="min-w-[200px]">Spine</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Last Modified</TableHead>
                    <TableHead className="min-w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processes.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                      <TableCell className="text-gray-700">{p.spine}</TableCell>
                      <TableCell>
                        <Badge
                          variant={p.status === "Running" ? "secondary" : "outline"}
                          className={p.status === "Running" ? "bg-green-100 text-green-800" : "text-gray-700"}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">{p.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatus(p.id)}
                            aria-label={p.status === "Running" ? "Pause process" : "Resume process"}
                            className="hover:bg-gray-50"
                          >
                            {p.status === "Running" ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProcess(p.id)}
                            aria-label="Delete process"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {processes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="py-8 text-center text-sm text-gray-600">No processes yet.</div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      {showCreate && <CreateProcessModal onClose={() => setShowCreate(false)} onSubmit={handleCreateSubmit} />}
    </div>
  )
}

function CreateProcessModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (payload: { name: string; spineId: string; mappings: { objectName: string; connector: string }[] }) => void
}) {
  function aliasForObjectName(obj: string) {
    switch (obj) {
      case "purchase_order":
        return "PO"
      case "goods_receipt":
        return "GRN"
      // Keep review_response lowercase per example, invoice lowercase, others default to their raw name
      case "review_response":
        return "review_response"
      case "invoice":
        return "invoice"
      default:
        return obj // fallback: use provided name
    }
  }

  function displayForConnector(connector: string, objAlias: string) {
    if (connector === "S3") return "s3"
    if (connector === "Slack") return "slack"
    if (connector === "Email") return "email"
    if (connector === "API") return "api"
    if (connector === "Database") return "database"
    if (connector === "Webhook") return "webhook"
    if (connector === "ERP") {
      return " ERP"
    }
    if (connector === "MS-365") {
      return "MS 365"
    }
    return connector
  }

  function combinedOptionLabel(obj: string, connector: string) {
    const alias = aliasForObjectName(obj)
    const connectorDisplay = displayForConnector(connector, alias)
    return `${alias}-${connectorDisplay}`
  }

  // New: derive slot options per object using its alias
  function objectSlotOptions(obj: string) {
    const alias = aliasForObjectName(obj)
    return [`current_${alias}_obj`, `reference_${alias}_obj`]
  }

  function connectionSlotOptions(obj: string) {
    const alias = aliasForObjectName(obj)
    return [`incoming_${alias}_con`, `outgoing_${alias}_con`]
  }

  const [name, setName] = useState("")
  const [trigger, setTrigger] = useState("")
  const [spineId, setSpineId] = useState<string>("")
  const [mappings, setMappings] = useState<
    Record<string, { connector?: string; objectSlot?: string; connectionSlot?: string }>
  >({})

  const spineObjects = useMemo(() => getObjectsForSpine(spineId), [spineId])

  const handleConnectorChange = (obj: string, connector: string) => {
    setMappings((prev) => ({
      ...prev,
      [obj]: {
        connector,
        // Reset slots when connector changes
        objectSlot: undefined,
        connectionSlot: undefined,
      },
    }))
  }

  const handleObjectSlotChange = (obj: string, slot: string) => {
    setMappings((prev) => ({
      ...prev,
      [obj]: {
        ...prev[obj],
        objectSlot: slot,
      },
    }))
  }

  const handleConnectionSlotChange = (obj: string, slot: string) => {
    setMappings((prev) => ({
      ...prev,
      [obj]: {
        ...prev[obj],
        connectionSlot: slot,
      },
    }))
  }

  const canSave = name.trim().length > 0 && spineId

  const handleSave = () => {
    if (!canSave) return
    // Per instructions, do not modify payload shape; slots are UI-only here
    const result = spineObjects.map((obj) => ({
      objectName: obj,
      connector: mappings[obj]?.connector || "",
    }))
    onSubmit({ name, spineId, mappings: result })
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="absolute inset-x-0 top-[8%] mx-auto w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
          <div className="font-semibold text-gray-800">Create new process</div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-5 space-y-6">
          {/* Process Name */}
          <section>
            <label className="block text-sm text-gray-700 mb-1">Process name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., AA Invoice Processing" />
          </section>

          {/* Choose Trigger */}
          <section>
            <label className="block text-sm text-gray-700 mb-1">Choose trigger</label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Incoming_invoice-S3-trig">Incoming_invoice-S3-trig</SelectItem>
                <SelectItem value="Outgoing_invoice-S3-trig">Outgoing_invoice-S3-trig</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-gray-500">Example triggers shown for convenience.</p>
          </section>

          {/* Spine Selection */}
          <section>
            <label className="block text-sm text-gray-700 mb-1">Choose Process Spine</label>
            <Select value={spineId} onValueChange={setSpineId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a process spine" />
              </SelectTrigger>
              <SelectContent>
                {SPINE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-gray-500">Example: "Invoice processing 2-way spine"</p>
          </section>

          {/* Object Mappings */}
          {spineObjects.length > 0 && (
            <section>
              <div className="font-medium text-gray-800 mb-2">Map objects to connectors</div>
              <div className="space-y-4">
                {spineObjects.map((obj) => {
                  const selectedConnector = mappings[obj]?.connector || ""
                  const selectedObjectSlot = mappings[obj]?.objectSlot || ""
                  const selectedConnectionSlot = mappings[obj]?.connectionSlot || ""
                  const objLabel =
                    obj === "purchase_order" ? "Purchase order" : obj === "goods_receipt" ? "Goods receipt" : obj

                  return (
                    <div key={obj} className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                        <div className="text-sm text-gray-800">{objLabel}</div>
                        <Select value={selectedConnector} onValueChange={(val) => handleConnectorChange(obj, val)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select connector (e.g., invoice-s3, PO- ERP, GRN-MS 365)" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONNECTOR_OPTIONS.map((c) => {
                              const label = combinedOptionLabel(obj, c)
                              return (
                                <SelectItem key={`${obj}-${c}`} value={label}>
                                  {label}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Slot Selectors: appear after connector chosen */}
                      {selectedConnector && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Object Slot */}
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Object slot</label>
                            <Select
                              value={selectedObjectSlot}
                              onValueChange={(val) => handleObjectSlotChange(obj, val)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select object slot (e.g., current_invoice_obj)" />
                              </SelectTrigger>
                              <SelectContent>
                                {objectSlotOptions(obj).map((opt) => (
                                  <SelectItem key={`${obj}-obj-slot-${opt}`} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Connection Slot */}
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Connection slot</label>
                            <Select
                              value={selectedConnectionSlot}
                              onValueChange={(val) => handleConnectionSlotChange(obj, val)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select connection slot (e.g., incoming_invoice_con)" />
                              </SelectTrigger>
                              <SelectContent>
                                {connectionSlotOptions(obj).map((opt) => (
                                  <SelectItem key={`${obj}-con-slot-${opt}`} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Example mappings: invoice-s3, PO- ERP, GRN-MS 365, review_response-slack
              </p>
            </section>
          )}
        </div>

        <div className="px-5 py-3 border-t bg-white flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSave} disabled={!canSave}>
            Create process
          </Button>
        </div>
      </div>
    </div>
  )
}
