"use client"

import { useState } from "react"
import { FileText, Brain, Eye, CheckCircle, Plus, Lightbulb, Wrench, Trash2, RotateCcw } from "lucide-react"

// Process configurations
const PROCESS_CONFIGS = {
  "invoice-processing": {
    name: "Invoice Processing",
    description: "Invoice Processing Solution",
    stages: {
      intake: {
        id: "intake",
        name: "Intake",
        icon: FileText,
        color: "bg-blue-600",
        connectionType: "source",
        abilities: ["receive_invoice"],
      },
      understand: {
        id: "understand",
        name: "Understand",
        icon: Lightbulb,
        color: "bg-cyan-600",
        connectionType: "default",
        abilities: [
          "Analyze Document Structure",
          "Extract Key Information",
          "Identify Document Type",
          "Parse Metadata",
          "Classify Content",
          "Detect Language",
        ],
      },
      prepare: {
        id: "prepare",
        name: "Prepare",
        icon: Eye,
        color: "bg-orange-600",
        connectionType: "default",
        abilities: ["find_matching_po", "find_matching_grn", "load_tolerance_rules"],
      },
      decide: {
        id: "decide",
        name: "Decide",
        icon: Brain,
        color: "bg-purple-600",
        connectionType: "default",
        abilities: ["match_details", "apply_tolerance", "make_decision"],
      },
      review: {
        id: "review",
        name: "Review",
        icon: Eye,
        color: "bg-yellow-600",
        connectionType: "default",
        abilities: ["manual_review"],
      },
      create: {
        id: "create",
        name: "Create",
        icon: Plus,
        color: "bg-indigo-600",
        connectionType: "default",
        abilities: [
          "Generate Payment Voucher",
          "Create Journal Entry",
          "Generate Tax Records",
          "Create Audit Trail",
          "Generate Reports",
          "Create Notifications",
        ],
      },
      do: {
        id: "do",
        name: "Do",
        icon: Wrench,
        color: "bg-red-600",
        connectionType: "default",
        abilities: [
          "Execute Payment",
          "Send Notifications",
          "Update Systems",
          "Trigger Workflows",
          "Log Activities",
          "Sync Data",
        ],
      },
      complete: {
        id: "complete",
        name: "Complete",
        icon: CheckCircle,
        color: "bg-green-600",
        connectionType: "target",
        abilities: ["update_invoice_status", "notify_stakeholders", "archive_documents"],
      },
    },
    availableStages: ["understand", "prepare", "decide", "review", "create", "do"],
  },
}

// Pre-populated spine data
const PRE_POPULATED_SPINES = {
  "sp-1": {
    id: "sp-1",
    name: "Invoice processing 2-way spine",
    selectedProcess: "invoice-processing",
    nodes: [
      {
        id: "intake-1",
        type: "intake",
        position: { x: 100, y: 200 },
        abilities: ["receive_invoice"],
        objectInputs: ["invoice_new", "purchase_order"],
        objectOutputs: [],
        isDefault: true,
      },
      {
        id: "understand-1",
        type: "understand",
        position: { x: 300, y: 200 },
        abilities: ["Analyze Document Structure", "Extract Key Information"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "prepare-1",
        type: "prepare",
        position: { x: 500, y: 200 },
        abilities: ["find_matching_po", "load_tolerance_rules"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "decide-1",
        type: "decide",
        position: { x: 700, y: 200 },
        abilities: ["match_details", "apply_tolerance"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "review-1",
        type: "review",
        position: { x: 500, y: 350 },
        abilities: ["manual_review"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "complete-1",
        type: "complete",
        position: { x: 900, y: 200 },
        abilities: ["update_invoice_status", "archive_documents"],
        objectInputs: [],
        objectOutputs: ["review_response", "approval_status"],
        isDefault: true,
      },
    ],
    connections: [
      { id: "intake-1-understand-1", from: "intake-1", to: "understand-1" },
      { id: "understand-1-prepare-1", from: "understand-1", to: "prepare-1" },
      { id: "prepare-1-decide-1", from: "prepare-1", to: "decide-1" },
      { id: "decide-1-review-1", from: "decide-1", to: "review-1" },
      { id: "review-1-complete-1", from: "review-1", to: "complete-1" },
    ],
  },
  "sp-2": {
    id: "sp-2",
    name: "Customer support baseline spine",
    selectedProcess: "invoice-processing",
    nodes: [
      {
        id: "intake-1",
        type: "intake",
        position: { x: 200, y: 200 },
        abilities: ["Receive Customer Inquiry"],
        objectInputs: ["customer_inquiry"],
        objectOutputs: [],
        isDefault: true,
      },
      {
        id: "understand-1",
        type: "understand",
        position: { x: 450, y: 200 },
        abilities: ["Analyze Inquiry Content", "Categorize Issue"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "complete-1",
        type: "complete",
        position: { x: 700, y: 200 },
        abilities: ["Close Ticket"],
        objectInputs: [],
        objectOutputs: ["resolution_record"],
        isDefault: true,
      },
    ],
    connections: [
      { id: "intake-1-understand-1", from: "intake-1", to: "understand-1" },
      { id: "understand-1-complete-1", from: "understand-1", to: "complete-1" },
    ],
  },
}

// Object Input/Output definitions
const OBJECT_INPUTS = {
  intake: [
    "invoice_new",
    "purchase_order",
    "goods_receipt",
    "review_request",
    "customer_inquiry",
    "support_ticket",
    "agent_response",
  ],
}

const OBJECT_OUTPUTS = {
  complete: [
    "review_response",
    "approval_status",
    "notify_message",
    "archive_docs",
    "process_complete",
    "audit_trail",
    "resolution_record",
    "customer_feedback",
  ],
}

const SAMPLE_DATA = {
  "invoice-processing": {
    intake: {
      input: { rawDocument: "invoice.pdf", documentType: "invoice" },
      output: { invoiceNumber: "INV-2024-001", vendorId: "VEN-001", amount: 1500.0, currency: "USD" },
    },
    understand: {
      input: { documentData: "raw_invoice_data", metadata: "extracted_info" },
      output: { structuredData: "analyzed_content", documentType: "invoice", confidence: 0.98 },
    },
    prepare: {
      input: { structuredData: "analyzed_content", referenceData: "po_grn_data" },
      output: { validatedInvoice: "validated_data", matchingResults: "po_grn_matched", validationStatus: "passed" },
    },
    decide: {
      input: { validatedData: "prepared_data", businessRules: "tolerance_rules" },
      output: { decision: "approved", confidence: 0.95, exceptions: [], autoApproved: true },
    },
    review: {
      input: { decision: "pending_review", exceptions: "flagged_items" },
      output: { reviewStatus: "approved", reviewerComments: "All checks passed", finalDecision: "approved" },
    },
    create: {
      input: { approvedData: "review_output", templates: "payment_templates" },
      output: { paymentVoucher: "PV-2024-001", journalEntry: "JE-2024-001", records: "created" },
    },
    do: {
      input: { createdRecords: "payment_voucher", executionPlan: "workflow_steps" },
      output: { executionStatus: "completed", notifications: "sent", systemUpdates: "applied" },
    },
    complete: {
      input: { executionResults: "final_data", archivalData: "complete_records" },
      output: { status: "completed", archived: true, notifications: "sent", dashboardUpdated: true },
    },
  },
}

export default function ProcessSpine() {
  // Global left sidebar tab
  const [activeLeftTab, setActiveLeftTab] = useState<"process-blueprint" | "jobs">("process-blueprint")

  // Process Blueprint states
  const [showCreateBlueprintModal, setShowCreateBlueprintModal] = useState(false)
  const [blueprintName, setBlueprintName] = useState("")
  const [blueprintObjectInputs, setBlueprintObjectInputs] = useState([{ type: "", customName: "" }])
  const [blueprintsList, setBlueprintsList] = useState([
    {
      id: "bp-1",
      name: "Invoice 2-way matching",
      objectInputs: ["Invoice", "Purchase Order"],
      createdDate: "2024-01-15",
      status: "Active",
    },
    {
      id: "bp-2",
      name: "Invoice 3-way matching",
      objectInputs: ["Invoice", "Purchase Order", "Receipt"],
      createdDate: "2024-01-14",
      status: "Active",
    },
    {
      id: "bp-3",
      name: "Customer Support",
      objectInputs: ["Customer Query", "Customer History"],
      createdDate: "2024-01-13",
      status: "Active",
    },
    {
      id: "bp-4",
      name: "Payment Processing",
      objectInputs: ["Payment Request", "Account Info"],
      createdDate: "2024-01-12",
      status: "Active",
    },
  ])

  const OBJECT_TYPE_OPTIONS = [
    "Invoice",
    "Purchase Order",
    "Customer Query",
    "Payment Request",
    "Contract",
    "Receipt",
    "Customer History",
    "Account Info",
    "Vendor Info",
    "Product Catalog",
  ]

  // Blueprint handlers
  const handleViewBlueprint = (blueprintId: string) => {
    console.log("Viewing blueprint:", blueprintId)
    // TODO: Implement view functionality
  }

  const handleCopyBlueprint = (blueprintId: string) => {
    const blueprint = blueprintsList.find((bp) => bp.id === blueprintId)
    if (blueprint) {
      const newBlueprint = {
        ...blueprint,
        id: `bp-${Date.now()}`,
        name: `${blueprint.name} (Copy)`,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setBlueprintsList((prev) => [newBlueprint, ...prev])
    }
  }

  const handleDeleteBlueprint = (blueprintId: string) => {
    if (window.confirm("Are you sure you want to delete this blueprint?")) {
      setBlueprintsList((prev) => prev.filter((bp) => bp.id !== blueprintId))
    }
  }

  const handleAddObjectInput = () => {
    setBlueprintObjectInputs((prev) => [...prev, { type: "", customName: "" }])
  }

  const handleRemoveObjectInput = (index: number) => {
    if (blueprintObjectInputs.length > 1) {
      setBlueprintObjectInputs((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleObjectInputChange = (index: number, field: "type" | "customName", value: string) => {
    setBlueprintObjectInputs((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const handleCreateBlueprint = () => {
    if (!blueprintName.trim()) {
      alert("Please enter a blueprint name")
      return
    }

    const validInputs = blueprintObjectInputs.filter((input) => input.type.trim())
    if (validInputs.length === 0) {
      alert("Please add at least one object input")
      return
    }

    const objectInputNames = validInputs.map((input) => input.customName.trim() || input.type)

    const newBlueprint = {
      id: `bp-${Date.now()}`,
      name: blueprintName.trim(),
      objectInputs: objectInputNames,
      createdDate: new Date().toISOString().split("T")[0],
      status: "Active",
    }

    setBlueprintsList((prev) => [newBlueprint, ...prev])

    // Reset form
    setBlueprintName("")
    setBlueprintObjectInputs([{ type: "", customName: "" }])
    setShowCreateBlueprintModal(false)
  }

  // Jobs tab states
  const [activeJobsTab, setActiveJobsTab] = useState<"test" | "live">("test")
  const [showCreateTestJobModal, setShowCreateTestJobModal] = useState(false)
  const [showCreateLiveJobModal, setShowCreateLiveJobModal] = useState(false)
  const [showViewLogsModal, setShowViewLogsModal] = useState(false)
  const [selectedJobLogs, setSelectedJobLogs] = useState<any>(null)
  const [retryingJobs, setRetryingJobs] = useState<Set<string>>(new Set())

  // Test job form states
  const [testJobName, setTestJobName] = useState("")
  const [testJobSpine, setTestJobSpine] = useState("")
  const [testJobType, setTestJobType] = useState<"File" | "JSON">("File")
  const [testJobDataSource, setTestJobDataSource] = useState<"Use Sample Data" | "Add Own Data">("Use Sample Data")
  const [testJobCustomData, setTestJobCustomData] = useState("")
  const [testJobFile, setTestJobFile] = useState<File | null>(null)
  const [testJobObjectConnectorMap, setTestJobObjectConnectorMap] = useState<Record<string, string>>({})

  // Live job form states
  const [liveJobName, setLiveJobName] = useState("")
  const [liveJobSpine, setLiveJobSpine] = useState("")
  const [liveJobSituation, setLiveJobSituation] = useState("")
  const [liveJobObjectConnectorMap, setLiveJobObjectConnectorMap] = useState<Record<string, string>>({})

  // Sample data
  const [testJobs] = useState([
    {
      id: "tj-1",
      name: "Invoice Processing Test 1",
      spine: "Invoice processing 2-way spine",
      status: "completed" as const,
      createdAt: "2024-01-15",
      logs: [
        {
          stage: "Intake",
          input: { invoiceFile: "invoice_001.pdf", documentType: "invoice" },
          output: { invoiceId: "INV-2024-001", vendorId: "VEN-001", amount: 1500.0 },
        },
        {
          stage: "Understand",
          input: { invoiceId: "INV-2024-001", documentData: "extracted_content" },
          output: { structuredData: "analyzed_invoice", confidence: 0.95, documentType: "standard_invoice" },
        },
        {
          stage: "Complete",
          input: { processedInvoice: "final_data", approvalStatus: "approved" },
          output: { status: "completed", archived: true, notificationsSent: true },
        },
      ],
    },
    {
      id: "tj-2",
      name: "Invoice Processing Test 2",
      spine: "Invoice processing 3-way spine",
      status: "running" as const,
      createdAt: "2024-01-16",
      logs: [
        {
          stage: "Intake",
          input: { invoiceFile: "invoice_002.pdf", documentType: "invoice" },
          output: { invoiceId: "INV-2024-002", vendorId: "VEN-002", amount: 2500.0 },
        },
      ],
    },
    {
      id: "tj-3",
      name: "Customer Support Test",
      spine: "Customer support baseline spine",
      status: "failed" as const,
      createdAt: "2024-01-14",
      logs: [
        {
          stage: "Intake",
          input: { customerEmail: "customer@example.com", inquiry: "Product issue" },
          output: { error: "Failed to process customer inquiry", errorCode: "CS_001" },
        },
      ],
    },
  ])

  const [liveJobs, setLiveJobs] = useState([
    {
      id: "lj-1",
      name: "Production Invoice Processing",
      spine: "Invoice processing 2-way spine",
      status: "running" as const,
      active: true,
      createdAt: "2024-01-10",
      logs: [
        {
          stage: "Intake",
          input: { situation: "AWS S3 Invoice", connector: "s3-prod-bucket" },
          output: { invoicesProcessed: 45, successRate: 0.98 },
        },
      ],
    },
    {
      id: "lj-2",
      name: "Failed Customer Support Job",
      spine: "Customer support baseline spine",
      status: "failed" as const,
      active: false,
      createdAt: "2024-01-12",
      logs: [
        {
          stage: "Intake",
          input: { situation: "Email Customer Query", connector: "email-connector" },
          output: { error: "Connection timeout", errorCode: "CONN_001" },
        },
      ],
    },
  ])

  const SAMPLE_INVOICE_JSON = {
    invoiceId: "INV-2024-001",
    invoiceNumber: "INV-2024-001",
    vendorId: "VEN-001",
    vendorName: "Acme Corp",
    totalAmount: 1500.0,
    invoiceDate: "2024-01-15",
    dueDate: "2024-02-15",
    documentType: "Standard Invoice",
    poReference: "PO-2024-456",
    lineItems: [
      {
        description: "Office Supplies",
        amount: 750.0,
        quantity: 10,
        glCode: "GL-5001",
      },
      {
        description: "Software License",
        amount: 750.0,
        quantity: 1,
        glCode: "GL-6001",
      },
    ],
    paymentTerms: "Net 30",
    taxRate: 0.08,
    discountAmount: 0,
    netAmount: 1500.0,
  }

  const SAMPLE_CUSTOMER_QUERY_JSON = {
    queryId: "CQ-2024-001",
    customerId: "CUST-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    queryType: "Product Issue",
    priority: "Medium",
    subject: "Product not working as expected",
    description:
      "I purchased your product last week and it's not functioning properly. The device keeps shutting down randomly.",
    channel: "Email",
    timestamp: "2024-01-15T10:30:00Z",
    customerTier: "Gold",
    previousTickets: 2,
    productInfo: {
      productId: "PROD-123",
      productName: "Smart Device Pro",
      purchaseDate: "2024-01-08",
      warrantyStatus: "Active",
    },
    attachments: [
      {
        fileName: "error_screenshot.png",
        fileSize: "2.5MB",
        fileType: "image",
      },
    ],
  }

  const INVOICE_OBJECT_OPTIONS = [
    "PO object",
    "Goods receipt",
    "Notify vendor",
    "Review request",
    "Approval status",
    "Archive docs",
  ]

  const CUSTOMER_SUPPORT_OBJECT_OPTIONS = [
    "Customer history",
    "Agent request",
    "Agent response",
    "Create ticket",
    "Update ticket",
  ]

  const INVOICE_SITUATIONS = ["AWS S3 Invoice", "Email Invoice Processing", "API Invoice Intake", "SFTP Invoice Upload"]

  const CUSTOMER_SUPPORT_SITUATIONS = [
    "Email Customer Query",
    "Chat Customer Query",
    "Phone Customer Query",
    "Web Form Customer Query",
  ]

  const OBJECT_INPUTS_OPTIONS = [
    "PO object",
    "Goods receipt",
    "Notify vendor",
    "Review request",
    "Approval status",
    "Archive docs",
  ]

  const CONNECTOR_OPTIONS = [
    "AWS S3 PO",
    "Slack Message",
    "MS-365 Email",
    "ERP System",
    "Database Connection",
    "API Webhook",
    "SFTP Server",
  ]

  const AVAILABLE_SITUATIONS = [
    "AWS S3 Invoice",
    "Email Invoice Processing",
    "API Invoice Intake",
    "SFTP Invoice Upload",
  ]

  // Jobs handlers
  const handleViewLogs = (job: any) => {
    setSelectedJobLogs(job)
    setShowViewLogsModal(true)
  }

  const handleDeleteTestJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this test job?")) {
      console.log("Deleting test job:", jobId)
    }
  }

  const handleCreateTestJob = () => {
    if (!testJobName.trim() || !testJobSpine) {
      alert("Please enter a test job name and select a process spine")
      return
    }

    console.log("Creating test job:", {
      name: testJobName,
      spine: testJobSpine,
      type: testJobType,
      dataSource: testJobDataSource,
      customData: testJobCustomData,
      file: testJobFile,
      objectConnectorMap: testJobObjectConnectorMap,
    })

    setTestJobName("")
    setTestJobSpine("")
    setTestJobType("File")
    setTestJobDataSource("Use Sample Data")
    setTestJobCustomData("")
    setTestJobFile(null)
    setTestJobObjectConnectorMap({})
    setShowCreateTestJobModal(false)
  }

  const handleCreateLiveJob = () => {
    if (!liveJobName.trim() || !liveJobSpine) {
      alert("Please enter a live job name and select a process spine")
      return
    }

    console.log("Creating live job:", {
      name: liveJobName,
      spine: liveJobSpine,
      situation: liveJobSituation,
      objectConnectorMap: liveJobObjectConnectorMap,
    })

    setLiveJobName("")
    setLiveJobSpine("")
    setLiveJobSituation("")
    setLiveJobObjectConnectorMap({})
    setShowCreateLiveJobModal(false)
  }

  const handleToggleLiveJobActive = (jobId: string) => {
    setLiveJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, active: !job.active } : job)))
  }

  const handleDeleteLiveJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this live job?")) {
      setLiveJobs((prev) => prev.filter((job) => job.id !== jobId))
    }
  }

  const handleRetryLiveJob = async (jobId: string) => {
    setRetryingJobs((prev) => new Set(prev).add(jobId))

    try {
      // Simulate retry process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update job status to running after successful retry
      setLiveJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: "running" as const,
                active: true,
                logs: [
                  ...job.logs,
                  {
                    stage: "Retry",
                    input: { retryAttempt: 1, timestamp: new Date().toISOString() },
                    output: { status: "retry_successful", message: "Job restarted successfully" },
                  },
                ],
              }
            : job,
        ),
      )

      console.log("Job retried successfully:", jobId)
    } catch (error) {
      console.error("Failed to retry job:", error)
      // Optionally show error message to user
    } finally {
      setRetryingJobs((prev) => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  return (
    <div className="h-screen w-full bg-gray-100 flex overflow-hidden">
      {/* Global Left Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-14 border-b border-gray-200 px-4 flex items-center">
          <span className="text-base font-semibold text-gray-800">Navigation</span>
        </div>
        <nav className="flex-1 p-2 space-y-1" aria-label="Global">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
              activeLeftTab === "process-blueprint"
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveLeftTab("process-blueprint")}
          >
            <FileText
              className={`w-4 h-4 ${activeLeftTab === "process-blueprint" ? "text-orange-700" : "text-gray-500"}`}
            />
            <span>Process Blueprint</span>
          </button>
          <button
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
              activeLeftTab === "jobs"
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveLeftTab("jobs")}
          >
            <Brain className={`w-4 h-4 ${activeLeftTab === "jobs" ? "text-orange-700" : "text-gray-500"}`} />
            <span>Jobs</span>
          </button>
        </nav>
        <div className="p-3 border-t text-xs text-gray-500">v1.0</div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {activeLeftTab === "process-blueprint" && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Process Blueprints</h2>
                <p className="text-gray-600 text-sm">Create and manage process blueprints.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                  onClick={() => setShowCreateBlueprintModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  New Process Blueprint
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blueprint Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Object Inputs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blueprintsList.map((blueprint) => (
                        <tr key={blueprint.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {blueprint.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {blueprint.objectInputs.map((obj, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                                >
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blueprint.createdDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {blueprint.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              className="text-orange-600 hover:text-orange-900"
                              onClick={() => handleViewBlueprint(blueprint.id)}
                            >
                              View
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 p-1"
                              onClick={() => handleCopyBlueprint(blueprint.id)}
                              title="Copy blueprint"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 p-1"
                              onClick={() => handleDeleteBlueprint(blueprint.id)}
                              title="Delete blueprint"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeLeftTab === "jobs" && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Jobs</h2>
                <p className="text-gray-600 text-sm">Manage test and live jobs.</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeJobsTab === "test"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveJobsTab("test")}
                >
                  Test Jobs
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeJobsTab === "live"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveJobsTab("live")}
                >
                  Live Jobs
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {activeJobsTab === "test" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Test Jobs</h3>
                    <button
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                      onClick={() => setShowCreateTestJobModal(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Create Test Job
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Job Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Spine
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {testJobs.map((job) => (
                            <tr key={job.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {job.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.spine}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    job.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : job.status === "running"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.createdAt}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  className="text-orange-600 hover:text-orange-900"
                                  onClick={() => handleViewLogs(job)}
                                >
                                  View Logs
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900 p-1"
                                  onClick={() => handleDeleteTestJob(job.id)}
                                  title="Delete job"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeJobsTab === "live" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Live Jobs</h3>
                    <button
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                      onClick={() => setShowCreateLiveJobModal(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Create Live Job
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Job Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Spine
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Active
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {liveJobs.map((job) => (
                            <tr key={job.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {job.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.spine}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    job.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : job.status === "running"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                                    job.active ? "bg-orange-600" : "bg-gray-200"
                                  }`}
                                  onClick={() => handleToggleLiveJobActive(job.id)}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      job.active ? "translate-x-6" : "translate-x-1"
                                    }`}
                                  />
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.createdAt}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  className="text-orange-600 hover:text-orange-900"
                                  onClick={() => handleViewLogs(job)}
                                >
                                  View Logs
                                </button>
                                {job.status === "failed" && (
                                  <button
                                    className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                                    onClick={() => handleRetryLiveJob(job.id)}
                                    disabled={retryingJobs.has(job.id)}
                                    title="Retry job"
                                  >
                                    {retryingJobs.has(job.id) ? (
                                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <RotateCcw className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                                <button
                                  className="text-red-600 hover:text-red-900 p-1"
                                  onClick={() => handleDeleteLiveJob(job.id)}
                                  title="Delete job"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Test Job Modal */}
      {showCreateTestJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create Test Job</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowCreateTestJobModal(false)}>
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Test Job Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Job Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={testJobName}
                  onChange={(e) => setTestJobName(e.target.value)}
                  placeholder="Enter test job name"
                />
              </div>

              {/* Select Process Spine */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Process Spine</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={testJobSpine}
                  onChange={(e) => setTestJobSpine(e.target.value)}
                >
                  <option value="">Select process spine</option>
                  <option value="invoice-2way">Invoice 2way matching</option>
                  <option value="customer-support">Customer support</option>
                </select>
              </div>

              {/* Load Sample Situation - Only show if spine is selected */}
              {testJobSpine && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Load Sample Situation</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Object</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        value={testJobSpine === "invoice-2way" ? "Invoice" : "Customer query"}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Type</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={testJobType}
                        onChange={(e) => setTestJobType(e.target.value as "File" | "JSON")}
                      >
                        <option value="File">File</option>
                        <option value="JSON">JSON</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Data</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={testJobDataSource}
                        onChange={(e) => setTestJobDataSource(e.target.value as "Use Sample Data" | "Add Own Data")}
                      >
                        <option value="Use Sample Data">Use Sample Data</option>
                        <option value="Add Own Data">Add Own Data</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Data Section - Only show if spine is selected */}
              {testJobSpine && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Data</h4>
                  {testJobDataSource === "Use Sample Data" ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        Sample {testJobSpine === "invoice-2way" ? "Invoice" : "Customer Query"} Data:
                      </p>
                      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                        {JSON.stringify(
                          testJobSpine === "invoice-2way" ? SAMPLE_INVOICE_JSON : SAMPLE_CUSTOMER_QUERY_JSON,
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  ) : testJobType === "File" ? (
                    <div>
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onChange={(e) => setTestJobFile(e.target.files?.[0] || null)}
                        accept=".pdf,.json,.xml,.csv"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JSON, XML, CSV</p>
                    </div>
                  ) : (
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows={6}
                      value={testJobCustomData}
                      onChange={(e) => setTestJobCustomData(e.target.value)}
                      placeholder="Enter JSON data..."
                    />
                  )}
                </div>
              )}

              {/* Object-Connector-Map - Only show if spine is selected */}
              {testJobSpine && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Object-Connector-Map</h4>
                  <div className="space-y-3">
                    {(testJobSpine === "invoice-2way" ? INVOICE_OBJECT_OPTIONS : CUSTOMER_SUPPORT_OBJECT_OPTIONS).map(
                      (objectName) => (
                        <div key={objectName} className="grid grid-cols-2 gap-4 items-center">
                          <div className="text-sm text-gray-700">{objectName}</div>
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={testJobObjectConnectorMap[objectName] || ""}
                            onChange={(e) =>
                              setTestJobObjectConnectorMap((prev) => ({
                                ...prev,
                                [objectName]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select connector</option>
                            {CONNECTOR_OPTIONS.map((connector) => (
                              <option key={connector} value={connector}>
                                {connector}
                              </option>
                            ))}
                          </select>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowCreateTestJobModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                onClick={handleCreateTestJob}
                disabled={!testJobName.trim() || !testJobSpine}
              >
                Create Test Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Live Job Modal */}
      {showCreateLiveJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create Live Job</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowCreateLiveJobModal(false)}>
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Live Job Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live Job Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={liveJobName}
                  onChange={(e) => setLiveJobName(e.target.value)}
                  placeholder="Enter live job name"
                />
              </div>

              {/* Select Process Spine */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Process Spine</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={liveJobSpine}
                  onChange={(e) => setLiveJobSpine(e.target.value)}
                >
                  <option value="">Select process spine</option>
                  <option value="invoice-2way">Invoice 2way matching</option>
                  <option value="customer-support">Customer support</option>
                </select>
              </div>

              {/* Add Situation - Only show if spine is selected */}
              {liveJobSpine && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Situation</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={liveJobSituation}
                    onChange={(e) => setLiveJobSituation(e.target.value)}
                  >
                    <option value="">Select situation</option>
                    {(liveJobSpine === "invoice-2way" ? INVOICE_SITUATIONS : CUSTOMER_SUPPORT_SITUATIONS).map(
                      (situation) => (
                        <option key={situation} value={situation}>
                          {situation}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}

              {/* Object-Connector-Map - Only show if spine is selected */}
              {liveJobSpine && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Object-Connector-Map</h4>
                  <div className="space-y-3">
                    {(liveJobSpine === "invoice-2way" ? INVOICE_OBJECT_OPTIONS : CUSTOMER_SUPPORT_OBJECT_OPTIONS).map(
                      (objectName) => (
                        <div key={objectName} className="grid grid-cols-2 gap-4 items-center">
                          <div className="text-sm text-gray-700">{objectName}</div>
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={liveJobObjectConnectorMap[objectName] || ""}
                            onChange={(e) =>
                              setLiveJobObjectConnectorMap((prev) => ({
                                ...prev,
                                [objectName]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select connector</option>
                            {CONNECTOR_OPTIONS.map((connector) => (
                              <option key={connector} value={connector}>
                                {connector}
                              </option>
                            ))}
                          </select>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowCreateLiveJobModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                onClick={handleCreateLiveJob}
                disabled={!liveJobName.trim() || !liveJobSpine}
              >
                Create Live Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Logs Modal */}
      {showViewLogsModal && selectedJobLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Job Logs - {selectedJobLogs.name}</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowViewLogsModal(false)}>
                ×
              </button>
            </div>

            <div className="space-y-4">
              {selectedJobLogs.logs.map((log: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">{log.stage}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Input</h5>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Output</h5>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={() => setShowViewLogsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Blueprint Modal */}
      {showCreateBlueprintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">New Process Blueprint</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowCreateBlueprintModal(false)}>
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Blueprint Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blueprint Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={blueprintName}
                  onChange={(e) => setBlueprintName(e.target.value)}
                  placeholder="Enter blueprint name"
                />
              </div>

              {/* Add Object Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Object Inputs</label>
                <div className="space-y-3">
                  {blueprintObjectInputs.map((input, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={input.type}
                        onChange={(e) => handleObjectInputChange(index, "type", e.target.value)}
                      >
                        <option value="">Select object type</option>
                        {OBJECT_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={input.customName}
                        onChange={(e) => handleObjectInputChange(index, "customName", e.target.value)}
                        placeholder="Custom name (optional)"
                      />
                      {index === blueprintObjectInputs.length - 1 ? (
                        <button
                          type="button"
                          className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md"
                          onClick={handleAddObjectInput}
                          title="Add object input"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                          onClick={() => handleRemoveObjectInput(index)}
                          title="Remove object input"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowCreateBlueprintModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                onClick={handleCreateBlueprint}
              >
                Create Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
