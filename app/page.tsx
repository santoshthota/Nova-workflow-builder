"use client"

import { useState } from "react"
import {
  FileText,
  Cog,
  Brain,
  Eye,
  CheckCircle,
  Plus,
  Lightbulb,
  Wrench,
  MessageSquare,
  Mail,
  Search,
  UserCheck,
  Zap,
  Archive,
  Trash2,
} from "lucide-react"

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
        icon: Cog,
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
  "customer-support": {
    name: "Customer Support",
    description: "Customer Support Solution",
    stages: {
      intake: {
        id: "intake",
        name: "Intake",
        icon: MessageSquare,
        color: "bg-blue-600",
        connectionType: "source",
        abilities: ["Receive Customer Inquiry", "Capture Channel Context", "Extract Attachments"],
      },
      understand: {
        id: "understand",
        name: "Understand",
        icon: Search,
        color: "bg-cyan-600",
        connectionType: "default",
        abilities: [
          "Identify Customer",
          "Analyze Inquiry Content",
          "Detect Language & Tone",
          "Categorize Issue",
          "Assess Customer History",
        ],
      },
      prepare: {
        id: "prepare",
        name: "Prepare",
        icon: Cog,
        color: "bg-orange-600",
        connectionType: "default",
        abilities: [
          "Create Support Ticket",
          "Set Priority & SLA",
          "Search Knowledge Base",
          "Check Known Issues",
          "Prepare Response Templates",
        ],
      },
      decide: {
        id: "decide",
        name: "Decide",
        icon: Brain,
        color: "bg-purple-600",
        connectionType: "default",
        abilities: [
          "Evaluate Self-Service Options",
          "Determine Routing",
          "Check Automation Eligibility",
          "Assess Escalation Need",
        ],
      },
      review: {
        id: "review",
        name: "Review",
        icon: UserCheck,
        color: "bg-yellow-600",
        connectionType: "default",
        abilities: ["Agent Assignment", "Expert Review", "Quality Check", "Escalation Review"],
      },
      create: {
        id: "create",
        name: "Create",
        icon: Mail,
        color: "bg-indigo-600",
        connectionType: "default",
        abilities: [
          "Compose Response",
          "Generate Solution Steps",
          "Create Follow-up Tasks",
          "Document Resolution",
          "Prepare Satisfaction Survey",
        ],
      },
      do: {
        id: "do",
        name: "Do",
        icon: Zap,
        color: "bg-red-600",
        connectionType: "default",
        abilities: ["Send Response", "Execute Solution", "Update Customer Systems", "Trigger Workflows", "Send Survey"],
      },
      complete: {
        id: "complete",
        name: "Complete",
        icon: Archive,
        color: "bg-green-600",
        connectionType: "target",
        abilities: [
          "Close Ticket",
          "Calculate Metrics",
          "Update Knowledge Base",
          "Analyze Patterns",
          "Archive Interaction",
        ],
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
    selectedProcess: "customer-support",
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

// Add after PRE_POPULATED_SPINES
const PRE_POPULATED_BLUEPRINTS = {
  "bp-1": {
    id: "bp-1",
    name: "Invoice processing 2-way blueprint",
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
  "bp-2": {
    id: "bp-2",
    name: "Invoice processing 3-way blueprint",
    selectedProcess: "invoice-processing",
    nodes: [
      {
        id: "intake-1",
        type: "intake",
        position: { x: 100, y: 200 },
        abilities: ["receive_invoice"],
        objectInputs: ["invoice_new", "purchase_order", "goods_receipt"],
        objectOutputs: [],
        isDefault: true,
      },
      {
        id: "understand-1",
        type: "understand",
        position: { x: 280, y: 200 },
        abilities: ["Analyze Document Structure", "Extract Key Information", "Identify Document Type"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "prepare-1",
        type: "prepare",
        position: { x: 460, y: 200 },
        abilities: ["find_matching_po", "find_matching_grn", "load_tolerance_rules"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "decide-1",
        type: "decide",
        position: { x: 640, y: 200 },
        abilities: ["match_details", "apply_tolerance", "make_decision"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "review-1",
        type: "review",
        position: { x: 460, y: 350 },
        abilities: ["manual_review"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "create-1",
        type: "create",
        position: { x: 820, y: 200 },
        abilities: ["Generate Payment Voucher", "Create Journal Entry"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "do-1",
        type: "do",
        position: { x: 1000, y: 200 },
        abilities: ["Execute Payment", "Send Notifications"],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      },
      {
        id: "complete-1",
        type: "complete",
        position: { x: 1180, y: 200 },
        abilities: ["update_invoice_status", "notify_stakeholders", "archive_documents"],
        objectInputs: [],
        objectOutputs: ["review_response", "approval_status", "audit_trail"],
        isDefault: true,
      },
    ],
    connections: [
      { id: "intake-1-understand-1", from: "intake-1", to: "understand-1" },
      { id: "understand-1-prepare-1", from: "understand-1", to: "prepare-1" },
      { id: "prepare-1-decide-1", from: "prepare-1", to: "decide-1" },
      { id: "decide-1-review-1", from: "decide-1", to: "review-1" },
      { id: "review-1-create-1", from: "review-1", to: "create-1" },
      { id: "create-1-do-1", from: "create-1", to: "do-1" },
      { id: "do-1-complete-1", from: "do-1", to: "complete-1" },
    ],
  },
}

// Ability data for both processes
const ABILITY_DATA = {
  receive_invoice: {
    inputs: [],
    instructions:
      "Acquire invoice from configured data source (S3, Email, API, etc).\nValidate basic structure and required fields are present.",
    outputs: ["invoice"],
  },
  "Analyze Document Structure": {
    inputs: ["invoice"],
    instructions:
      "Analyze the invoice structure to identify sections:\nheader, line items, totals, tax information, payment terms.",
    outputs: ["invoice.documentStructure", "invoice.hasValidFormat", "invoice.structureAnomalies"],
  },
  "Extract Key Information": {
    inputs: ["invoice"],
    instructions:
      "Extract critical business information from invoice:\nvendor details, amounts, dates, payment terms, tax info.",
    outputs: ["invoice.paymentTerms", "invoice.taxRate", "invoice.discountAmount", "invoice.netAmount"],
  },
  find_matching_po: {
    inputs: ["invoice.vendorId", "invoice.invoiceDate", "invoice.totalAmount", "invoice.poReference"],
    instructions: "Search for matching Purchase Order using vendor ID,\ndates, amounts, and reference numbers.",
    outputs: ["purchase_order"],
  },
  manual_review: {
    inputs: [
      "approval_status.decision",
      "approval_status.reason",
      "invoice.invoiceNumber",
      "invoice.vendorName",
      "invoice.totalAmount",
      "invoice.matchingResult.discrepancies",
    ],
    instructions: "Create review request for human decision when\nauto-approval is not possible.",
    outputs: ["review_request", "human_review_response"],
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

const ABILITY_RECOMMENDATIONS = {
  "invoice-processing": {
    understand: [
      "Apply OCR for scanned documents",
      "Detect invoice language automatically",
      "Extract tax information",
      "Identify invoice currency",
    ],
    prepare: [
      "Validate vendor master data",
      "Check purchase order status",
      "Verify goods receipt completeness",
      "Load goods receipt completeness",
      "Load company-specific business rules",
    ],
    decide: [
      "Apply three-way matching logic",
      "Calculate tolerance variances",
      "Flag exceptions for review",
      "Auto-approve within tolerance",
    ],
  },
  "customer-support": {
    understand: [
      "Apply sentiment analysis to inquiry",
      "Extract product/service references",
      "Identify customer tier and history",
      "Detect issue complexity level",
    ],
    prepare: [
      "Load customer interaction history",
      "Check service status and outages",
      "Prepare personalized templates",
      "Set escalation thresholds",
    ],
  },
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
  "customer-support": {
    intake: {
      input: { customerEmail: "customer@example.com", inquiry: "Product not working", channel: "email" },
      output: { ticketId: "TKT-2024-001", customerId: "CUST-001", priority: "medium", category: "technical" },
    },
    understand: {
      input: { customerData: "profile_info", inquiryText: "analyzed_content" },
      output: { intent: "product_issue", sentiment: "frustrated", category: "technical_support", confidence: 0.92 },
    },
    prepare: {
      input: { customerProfile: "tier_gold", issueCategory: "technical" },
      output: { assignedTeam: "technical_support", sla: "4_hours", knowledgeArticles: "found_3_articles" },
    },
    decide: {
      input: { issueComplexity: "medium", customerTier: "gold" },
      output: { routing: "senior_agent", automation: "not_eligible", escalation: "standard" },
    },
    review: {
      input: { agentAssignment: "agent_123", issueDetails: "technical_problem" },
      output: { agentResponse: "solution_provided", qualityCheck: "passed", approved: true },
    },
    create: {
      input: { solution: "restart_device", customerPrefs: "email_preferred" },
      output: { responseMessage: "personalized_email", followUp: "scheduled_24h", survey: "prepared" },
    },
    do: {
      input: { responseReady: "email_composed", deliveryChannel: "email" },
      output: { messageSent: "delivered", customerNotified: true, systemsUpdated: "complete" },
    },
    complete: {
      input: { ticketResolved: true, customerFeedback: "satisfied" },
      output: { ticketClosed: true, metrics: "calculated", knowledgeUpdated: true, archived: "complete" },
    },
  },
}

// Custom ability objects with sample data
const CUSTOM_ABILITY_OBJECTS = {
  Invoice_new: {
    fieldCount: 15,
    isEmpty: false,
    isPopulated: true,
    sampleData: {
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
      language: "en",
    },
  },
  Purchase_order: { fieldCount: 0, isEmpty: true, isPopulated: false },
  Goods_receipt: { fieldCount: 0, isEmpty: true, isPopulated: false },
  Review_request: { fieldCount: 0, isEmpty: true, isPopulated: false },
  Review_response: { fieldCount: 0, isEmpty: true, isPopulated: false },
  Notify_vendor: { fieldCount: 0, isEmpty: true, isPopulated: false },
  Approval_status: { fieldCount: 0, isEmpty: true, isPopulated: false },
  Archive_docs: { fieldCount: 0, isEmpty: true, isPopulated: false },
}

export default function ProcessSpine() {
  // Global left sidebar tab
  const [activeLeftTab, setActiveLeftTab] = useState<"process-blueprint" | "process-spine" | "jobs">(
    "process-blueprint",
  )

  // Add after the existing activeLeftTab state
  const [activeBlueprintTab, setActiveBlueprintTab] = useState<"list" | "flow">("list")
  const [blueprintStep, setBlueprintStep] = useState<"pick" | "scratch" | "template">("pick")
  const [blueprintChoice, setBlueprintChoice] = useState<"scratch" | "template">("")
  const [templateBlueprintChoice, setTemplateBlueprintChoice] = useState<string>("")

  // Blueprint-specific states
  const [blueprints] = useState<
    Array<{ id: string; name: string; stages: number; abilities: number; lastModified: string }>
  >([
    { id: "bp-1", name: "Invoice processing 2-way blueprint", stages: 6, abilities: 15, lastModified: "2025-07-01" },
    { id: "bp-2", name: "Invoice processing 3-way blueprint", stages: 9, abilities: 23, lastModified: "2025-07-02" },
  ])

  const [viewingBlueprintId, setViewingBlueprintId] = useState<string | null>(null)
  const [viewingBlueprintName, setViewingBlueprintName] = useState<string>("")

  // Blueprint flow builder states (duplicate of spine states)
  const [blueprintSelectedProcess, setBlueprintSelectedProcess] = useState("invoice-processing")
  const [blueprintNodes, setBlueprintNodes] = useState([
    {
      id: "intake-1",
      type: "intake",
      position: { x: 300, y: 200 },
      abilities: ["receive_invoice"],
      objectInputs: [],
      objectOutputs: [],
      isDefault: true,
    },
    {
      id: "complete-1",
      type: "complete",
      position: { x: 800, y: 200 },
      abilities: [],
      objectInputs: [],
      objectOutputs: [],
      isDefault: true,
    },
  ])
  const [blueprintConnections, setBlueprintConnections] = useState<any[]>([])
  const [blueprintSelectedStage, setBlueprintSelectedStage] = useState<string | null>(null)
  const [blueprintAbilityPanelPosition, setBlueprintAbilityPanelPosition] = useState({ x: 0, y: 0 })
  const [blueprintShowASFPanel, setBlueprintShowASFPanel] = useState(true)
  const [blueprintShowTestResults, setBlueprintShowTestResults] = useState(false)
  const [blueprintIsTestRunning, setBlueprintIsTestRunning] = useState(false)
  const [blueprintTestResults, setBlueprintTestResults] = useState<any[]>([])
  const [blueprintCurrentTestStage, setBlueprintCurrentTestStage] = useState<string | null>(null)
  const [blueprintTestCompleted, setBlueprintTestCompleted] = useState(false)
  const [blueprintTestRunSuccessful, setBlueprintTestRunSuccessful] = useState(false)
  const [blueprintIsSaving, setBlueprintIsSaving] = useState(false)
  const [blueprintSaveSuccess, setBlueprintSaveSuccess] = useState(false)
  const [blueprintExpandedResults, setBlueprintExpandedResults] = useState<Record<string, boolean>>({})
  const [blueprintDraggedStage, setBlueprintDraggedStage] = useState<string | null>(null)
  const [blueprintDraggingNode, setBlueprintDraggingNode] = useState<string | null>(null)
  const [blueprintDragOffset, setBlueprintDragOffset] = useState({ x: 0, y: 0 })
  const [blueprintConnectingFrom, setBlueprintConnectingFrom] = useState<string | null>(null)
  const [blueprintConnectionPreview, setBlueprintConnectionPreview] = useState<{ x: number; y: number } | null>(null)
  const [blueprintHoveredNode, setBlueprintHoveredNode] = useState<string | null>(null)
  const [blueprintZoom, setBlueprintZoom] = useState(1)
  const [blueprintPanOffset, setBlueprintPanOffset] = useState({ x: 0, y: 0 })
  const [blueprintIsPanning, setBlueprintIsPanning] = useState(false)
  const [blueprintPanStart, setBlueprintPanStart] = useState({ x: 0, y: 0 })

  // Jobs tab states
  const [activeJobsTab, setActiveJobsTab] = useState<"test" | "live">("test")
  const [showCreateTestJobModal, setShowCreateTestJobModal] = useState(false)
  const [showCreateLiveJobModal, setShowCreateLiveJobModal] = useState(false)
  const [showViewLogsModal, setShowViewLogsModal] = useState(false)
  const [selectedJobLogs, setSelectedJobLogs] = useState<any>(null)

  // Test job form states
  const [testJobName, setTestJobName] = useState("")
  const [testJobType, setTestJobType] = useState<"File" | "JSON">("File")
  const [testJobDataSource, setTestJobDataSource] = useState<"Use Sample Data" | "Add Own Data">("Use Sample Data")
  const [testJobCustomData, setTestJobCustomData] = useState("")
  const [testJobFile, setTestJobFile] = useState<File | null>(null)
  const [testJobObjectConnectorMap, setTestJobObjectConnectorMap] = useState<Record<string, string>>({})

  // Live job form states
  const [liveJobName, setLiveJobName] = useState("")
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

  // Handle viewing a spine
  const [viewingSpineId, setViewingSpineId] = useState<string | null>(null)
  const [viewingSpineName, setViewingSpineName] = useState<string>("")
  const [selectedProcess, setSelectedProcess] = useState<string>("invoice-processing")
  const [nodes, setNodes] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [spineView, setSpineView] = useState<"list" | "flow">("list")
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const [testCompleted, setTestCompleted] = useState<boolean>(false)
  const [testRunSuccessful, setTestRunSuccessful] = useState<boolean>(false)

  const handleViewSpine = (spineId: string) => {
    const spineData = PRE_POPULATED_SPINES[spineId]
    if (spineData) {
      setViewingSpineId(spineId)
      setViewingSpineName(spineData.name)
      setSelectedProcess(spineData.selectedProcess)
      setNodes(spineData.nodes)
      setConnections(spineData.connections)
      setSpineView("flow")
      setBlueprintStep("scratch") // Show the flow builder
    }
  }

  // Handle back to spines list
  const handleBackToSpinesList = () => {
    setSpineView("list")
    setViewingSpineId(null)
    setViewingSpineName("")
    setBlueprintStep("pick")
    // Reset flow builder state
    setSelectedStage(null)
    setTestResults([])
    setTestCompleted(false)
    setTestRunSuccessful(false)
  }

  // Add after handleBackToSpinesList function
  const handleViewBlueprint = (blueprintId: string) => {
    const blueprintData = PRE_POPULATED_BLUEPRINTS[blueprintId]
    if (blueprintData) {
      setViewingBlueprintId(blueprintId)
      setViewingBlueprintName(blueprintData.name)
      setBlueprintSelectedProcess(blueprintData.selectedProcess)
      setBlueprintNodes(blueprintData.nodes)
      setBlueprintConnections(blueprintData.connections)
      setActiveBlueprintTab("flow")
      setBlueprintStep("scratch")
    }
  }

  const handleBackToBlueprintsList = () => {
    setActiveBlueprintTab("list")
    setViewingBlueprintId(null)
    setViewingBlueprintName("")
    setBlueprintStep("pick")
    setBlueprintSelectedStage(null)
    setBlueprintTestResults([])
    setBlueprintTestCompleted(false)
    setBlueprintTestRunSuccessful(false)
  }

  const handleAddNewBlueprint = () => {
    setActiveBlueprintTab("flow")
    setBlueprintStep("pick")
    setBlueprintChoice("")
    setTemplateBlueprintChoice("")
  }

  const handleViewLogs = (job: any) => {
    setSelectedJobLogs(job)
    setShowViewLogsModal(true)
  }

  const handleDeleteTestJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this test job?")) {
      // In a real app, this would delete from the backend
      console.log("Deleting test job:", jobId)
    }
  }

  const handleCreateTestJob = () => {
    // Validation
    if (!testJobName.trim()) {
      alert("Please enter a test job name")
      return
    }

    // Create test job logic here
    console.log("Creating test job:", {
      name: testJobName,
      type: testJobType,
      dataSource: testJobDataSource,
      customData: testJobCustomData,
      file: testJobFile,
      objectConnectorMap: testJobObjectConnectorMap,
    })

    // Reset form and close modal
    setTestJobName("")
    setTestJobType("File")
    setTestJobDataSource("Use Sample Data")
    setTestJobCustomData("")
    setTestJobFile(null)
    setTestJobObjectConnectorMap({})
    setShowCreateTestJobModal(false)
  }

  const handleCreateLiveJob = () => {
    // Validation
    if (!liveJobName.trim()) {
      alert("Please enter a live job name")
      return
    }

    // Create live job logic here
    console.log("Creating live job:", {
      name: liveJobName,
      situation: liveJobSituation,
      objectConnectorMap: liveJobObjectConnectorMap,
    })

    // Reset form and close modal
    setLiveJobName("")
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
              activeLeftTab === "process-spine"
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveLeftTab("process-spine")}
          >
            <Cog className={`w-4 h-4 ${activeLeftTab === "process-spine" ? "text-orange-700" : "text-gray-500"}`} />
            <span>Process Spine</span>
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

        {/* Other tabs content would go here */}
        {activeLeftTab === "process-blueprint" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Process Blueprint</h3>
              <p className="text-gray-600">Process Blueprint content will be implemented here</p>
            </div>
          </div>
        )}

        {activeLeftTab === "process-spine" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Process Spine</h3>
              <p className="text-gray-600">Process Spine content will be implemented here</p>
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

              {/* Load Sample Situation */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Load Sample Situation</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Object</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value="Invoice"
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

              {/* Dynamic Data Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Data</h4>
                {testJobDataSource === "Use Sample Data" ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">Sample Invoice Data:</p>
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                      {JSON.stringify(SAMPLE_INVOICE_JSON, null, 2)}
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

              {/* Object-Connector-Map */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Object-Connector-Map</h4>
                <div className="space-y-3">
                  {OBJECT_INPUTS_OPTIONS.map((objectName) => (
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
                  ))}
                </div>
              </div>
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

              {/* Add Situation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Situation</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={liveJobSituation}
                  onChange={(e) => setLiveJobSituation(e.target.value)}
                >
                  <option value="">Select situation</option>
                  {AVAILABLE_SITUATIONS.map((situation) => (
                    <option key={situation} value={situation}>
                      {situation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Object-Connector-Map */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Object-Connector-Map</h4>
                <div className="space-y-3">
                  {OBJECT_INPUTS_OPTIONS.map((objectName) => (
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
                  ))}
                </div>
              </div>
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
    </div>
  )
}
