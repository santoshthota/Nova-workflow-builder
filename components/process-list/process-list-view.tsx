"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pause, Play, Plus, Trash2 } from "lucide-react"
import type { JobItem, JobStatus } from "./types"
import { SPINE_OPTIONS, getObjectsForSpine, getSpineName } from "./spine-registry"

function formatDateYYYYMMDD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function ProcessListView() {
  const [jobs, setJobs] = useState<JobItem[]>([
    {
      id: "job-1",
      name: "AA Invoice Processing Job",
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
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const next: JobStatus = j.status === "Running" ? "Paused" : "Running"
          return { ...j, status: next, lastModified: formatDateYYYYMMDD(new Date()) }
        }
        return j
      }),
    )
  }

  const deleteProcess = (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this job?")
    if (!ok) return
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  const handleCreateSubmit = (payload: {
    name: string
    spineId: string
    mappings: { objectName: string; connector: string }[]
  }) => {
    const newItem: JobItem = {
      id: `job-${Date.now()}`,
      name: payload.name.trim(),
      spine: getSpineName(payload.spineId),
      status: "Running",
      lastModified: formatDateYYYYMMDD(new Date()),
      objectMappings: payload.mappings,
    }
    setJobs((prev) => [newItem, ...prev])
    setShowCreate(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Jobs</h2>
          <p className="text-gray-600 text-sm">Manage and monitor your jobs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create new job
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
                    <TableHead className="min-w-[200px]">Job Name</TableHead>
                    <TableHead className="min-w-[200px]">Spine</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Last Modified</TableHead>
                    <TableHead className="min-w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium text-gray-900">{j.name}</TableCell>
                      <TableCell className="text-gray-700">{j.spine}</TableCell>
                      <TableCell>
                        <Badge
                          variant={j.status === "Running" ? "secondary" : "outline"}
                          className={j.status === "Running" ? "bg-green-100 text-green-800" : "text-gray-700"}
                        >
                          {j.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">{j.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatus(j.id)}
                            aria-label={j.status === "Running" ? "Pause job" : "Resume job"}
                            className="hover:bg-gray-50"
                          >
                            {j.status === "Running" ? (
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
                            onClick={() => deleteProcess(j.id)}
                            aria-label="Delete job"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {jobs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="py-8 text-center text-sm text-gray-600">No jobs yet.</div>
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
      case "review_response":
        return "review_response"
      case "invoice":
        return "invoice"
      default:
        return obj
    }
  }

  const [name, setName] = useState("")
  const [situation, setSituation] = useState("")
  const [spineId, setSpineId] = useState<string>("")
  const [mappings, setMappings] = useState<
    Record<string, { connector?: string; objectSlot?: string; connectionSlot?: string }>
  >({})

  const spineObjects = useMemo(() => getObjectsForSpine(spineId), [spineId])

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
        className="absolute inset-x-0 top-[8%] mx-auto w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[80vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
          <div className="font-semibold text-gray-800">Create new job</div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Job Name */}
          <section>
            <label className="block text-sm text-gray-700 mb-1">Job name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., AA Invoice Processing Job"
            />
          </section>

          {/* Choose Situation */}
          <section>
            <label className="block text-sm text-gray-700 mb-1">Choose situation</label>
            <Select value={situation} onValueChange={setSituation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Incoming_invoice-S3-situation">Incoming_invoice-S3-situation</SelectItem>
                <SelectItem value="Outgoing_invoice-S3-situation">Outgoing_invoice-S3-situation</SelectItem>
              </SelectContent>
            </Select>
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
          </section>

          {/* Object Slot to Connection Slot Mapping */}
          {spineObjects.length > 0 && (
            <section>
              <div className="font-medium text-gray-800 mb-3">Map object slots to connection slots</div>

              {/* Column Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <div className="text-sm font-medium text-gray-600">Object Slots</div>
                <div className="text-sm font-medium text-gray-600">Connection Slots</div>
              </div>

              <div className="space-y-4">
                {spineObjects.map((obj) => {
                  const selectedConnectionSlot = mappings[obj]?.connectionSlot || ""

                  // Generate object slot name
                  const objectSlotName =
                    obj === "invoice"
                      ? "invoice_new"
                      : obj === "purchase_order"
                        ? "PO_new"
                        : obj === "goods_receipt"
                          ? "GRN_new"
                          : obj === "review_response"
                            ? "review_response_new"
                            : `${obj}_new`

                  return (
                    <div key={obj} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                      <div className="text-sm text-gray-800">{objectSlotName}</div>
                      <Select
                        value={selectedConnectionSlot}
                        onValueChange={(val) => handleConnectionSlotChange(obj, val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select connection slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Invoice_s3_con">Invoice_s3_con</SelectItem>
                          <SelectItem value="PO_MS365_con">PO_MS365_con</SelectItem>
                          <SelectItem value="GRN_ERP_con">GRN_ERP_con</SelectItem>
                          <SelectItem value="Review_slack_con">Review_slack_con</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        <div className="px-5 py-3 border-t bg-white flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSave} disabled={!canSave}>
            Create job
          </Button>
        </div>
      </div>
    </div>
  )
}
