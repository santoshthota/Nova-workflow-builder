"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import {
  Play,
  Save,
  FileText,
  Cog,
  Brain,
  Eye,
  CheckCircle,
  Check,
  Loader2,
  Plus,
  Lightbulb,
  Wrench,
  X,
  Trash2,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  AlertCircle,
  Settings,
  MessageSquare,
  Mail,
  Search,
  UserCheck,
  Zap,
  Archive,
  MapIcon as Sitemap,
  ChevronLeft,
  Briefcase,
} from "lucide-react"
import { ProcessListView } from "@/components/process-list/process-list-view"
import { EnhancedAbilityConfig } from "@/components/enhanced-ability-config"

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

  // Selection gate for Process Spine
  const [spineView, setSpineView] = useState<"list" | "flow">("list")
  const [templateChoice, setTemplateChoice] = useState<string>("")

  const [spines] = useState<
    Array<{ id: string; name: string; stages: number; abilities: number; lastModified: string }>
  >([
    { id: "sp-1", name: "Invoice processing 2-way spine", stages: 8, abilities: 17, lastModified: "2025-07-01" },
    { id: "sp-2", name: "Customer support baseline spine", stages: 3, abilities: 3, lastModified: "2025-07-02" },
  ])

  // Viewing spine states
  const [viewingSpineId, setViewingSpineId] = useState<string | null>(null)
  const [viewingSpineName, setViewingSpineName] = useState<string>("")

  // Reset selection when navigating back to Process Spine
  useEffect(() => {
    if (activeLeftTab === "process-blueprint") {
      setBlueprintStep("pick")
      setBlueprintChoice("")
      setTemplateChoice("")
      setSpineView("list")
      setViewingSpineId(null)
      setViewingSpineName("")
    }
  }, [activeLeftTab])

  const [selectedProcess, setSelectedProcess] = useState("invoice-processing")
  const [nodes, setNodes] = useState([
    {
      id: "intake-1",
      type: "intake",
      position: { x: 300, y: 200 },
      abilities: selectedProcess === "invoice-processing" ? ["receive_invoice"] : ["Receive Customer Inquiry"],
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
  const [connections, setConnections] = useState<any[]>([])
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [abilityPanelPosition, setAbilityPanelPosition] = useState({ x: 0, y: 0 })
  const [showASFPanel, setShowASFPanel] = useState(true)
  const [showTestResults, setShowTestResults] = useState(false)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [currentTestStage, setCurrentTestStage] = useState<string | null>(null)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testRunSuccessful, setTestRunSuccessful] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({})
  const [draggedStage, setDraggedStage] = useState<string | null>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [connectionPreview, setConnectionPreview] = useState<{ x: number; y: number } | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // Custom ability states
  const [showCustomAbilityModal, setShowCustomAbilityModal] = useState(false)
  const [customAbilityStage, setCustomAbilityStage] = useState<string | null>(null)
  const [customAbilityText, setCustomAbilityText] = useState("")
  const [isCreatingAbility, setIsCreatingAbility] = useState(false)
  const [abilityValidationResult, setAbilityValidationResult] = useState<{ success: boolean; message: string } | null>(
    null,
  )

  // Ability configuration states
  const [showAbilityConfig, setShowAbilityConfig] = useState(false)
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null)
  const [abilityInputs, setAbilityInputs] = useState<string[]>([])
  const [abilityOutputs, setAbilityOutputs] = useState<string[]>([])
  const [abilityInstructions, setAbilityInstructions] = useState("")
  const [currentInputValue, setCurrentInputValue] = useState("")
  const [currentOutputValue, setCurrentOutputValue] = useState("")

  // Object input/output selection states
  const [showObjectSelectionModal, setShowObjectSelectionModal] = useState(false)
  const [objectSelectionType, setObjectSelectionType] = useState<"inputs" | "outputs">("inputs")
  const [objectSelectionStage, setObjectSelectionStage] = useState<string | null>(null)

  // Add New Abilities Modal states
  const [showAddAbilitiesModal, setShowAddAbilitiesModal] = useState(false)
  const [addAbilitiesStage, setAddAbilitiesStage] = useState<string | null>(null)

  // Drag and drop for abilities
  const [draggedAbilityIndex, setDraggedAbilityIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const [expandedCustomObjects, setExpandedCustomObjects] = useState<Record<string, boolean>>({})

  // Test & Add functionality states
  const [hoveredObjectItem, setHoveredObjectItem] = useState<string | null>(null)
  const [hoveredAbilityItem, setHoveredAbilityItem] = useState<string | null>(null)
  const [testingObjectItem, setTestingObjectItem] = useState<string | null>(null)
  const [testingAbilityItem, setTestingAbilityItem] = useState<string | null>(null)
  const [objectTestResults, setObjectTestResults] = useState<Record<string, { success: boolean; message: string }>>({})
  const [abilityTestResults, setAbilityTestResults] = useState<Record<string, { success: boolean; message: string }>>(
    {},
  )

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const abilityPanelRef = useRef<HTMLDivElement | null>(null)

  // Get current process configuration
  const currentConfig = PROCESS_CONFIGS[selectedProcess]
  const STAGE_DEFINITIONS = currentConfig.stages as any
  const AVAILABLE_STAGES = currentConfig.availableStages as string[]
  const OBJECT_STRUCTURE = currentConfig.objectStructure as any

  // Handle viewing a spine
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

  // Handle process change (UI removed; keep logic for internal resets if needed)
  const handleProcessChange = (newProcess: string) => {
    setSelectedProcess(newProcess)

    const defaultIntakeAbility =
      newProcess === "invoice-processing" ? ["receive_invoice"] : ["Receive Customer Inquiry"]

    setNodes([
      {
        id: "intake-1",
        type: "intake",
        position: { x: 300, y: 200 },
        abilities: defaultIntakeAbility,
        objectInputs: [], // Add this
        objectOutputs: [], // Add this
        isDefault: true,
      },
      {
        id: "complete-1",
        type: "complete",
        position: { x: 800, y: 200 },
        abilities: [],
        objectInputs: [], // Add this
        objectOutputs: [], // Add this
        isDefault: true,
      },
    ])

    setConnections([])
    setSelectedStage(null)
    setTestResults([])
    setTestCompleted(false)
    setTestRunSuccessful(false)
  }

  const handleObjectToggle = (nodeId: string, objectName: string, type: "inputs" | "outputs") => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const field = type === "inputs" ? "objectInputs" : "objectOutputs"
          const currentList = node[field] || []
          const updatedList = currentList.includes(objectName)
            ? currentList.filter((obj: string) => obj !== objectName)
            : [...currentList, objectName]
          return { ...node, [field]: updatedList }
        }
        return node
      }),
    )
  }

  const handleAddObjectClick = (nodeId: string, type: "inputs" | "outputs") => {
    setObjectSelectionStage(nodeId)
    setObjectSelectionType(type)
    setShowObjectSelectionModal(true)
  }

  // Test & Add functionality for objects
  const handleTestAndAddObject = async (objectName: string) => {
    setTestingObjectItem(objectName)

    // Simulate test with delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate test result (90% success rate)
    const testSuccess = Math.random() > 0.1
    const testResult = {
      success: testSuccess,
      message: testSuccess
        ? `${objectName} validated successfully and ready to add!`
        : `${objectName} validation failed. Please check configuration.`,
    }

    setObjectTestResults((prev) => ({ ...prev, [objectName]: testResult }))
    setTestingObjectItem(null)

    // If test successful, add the object
    if (testSuccess && objectSelectionStage) {
      handleObjectSelection(objectName)
    }

    // Clear test result after 3 seconds
    setTimeout(() => {
      setObjectTestResults((prev) => {
        const newResults = { ...prev }
        delete newResults[objectName]
        return newResults
      })
    }, 3000)
  }

  const handleObjectSelection = (objectName: string) => {
    if (objectSelectionStage) {
      // Fix: Use the node ID directly and update the correct field
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === objectSelectionStage) {
            const field = objectSelectionType === "inputs" ? "objectInputs" : "objectOutputs"
            const currentList = node[field] || []
            const updatedList = currentList.includes(objectName)
              ? currentList.filter((obj: string) => obj !== objectName)
              : [...currentList, objectName]
            return { ...node, [field]: updatedList }
          }
          return node
        }),
      )
    }
    setShowObjectSelectionModal(false)
    setObjectSelectionStage(null)
  }

  const handleAddAbilitiesClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      setAddAbilitiesStage(node.type) // Keep for modal content
      // Fix: Also store the actual node ID for updates
      setSelectedStage(nodeId) // This ensures we update the right node
      setShowAddAbilitiesModal(true)
    }
  }

  // Test & Add functionality for abilities
  const handleTestAndAddAbility = async (ability: string) => {
    setTestingAbilityItem(ability)

    // Simulate test with delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate test result (85% success rate)
    const testSuccess = Math.random() > 0.15
    const testResult = {
      success: testSuccess,
      message: testSuccess
        ? `${ability} tested successfully and ready to add!`
        : `${ability} test failed. Please review ability configuration.`,
    }

    setAbilityTestResults((prev) => ({ ...prev, [ability]: testResult }))
    setTestingAbilityItem(null)

    // If test successful, add the ability
    if (testSuccess) {
      handleAbilitySelection(ability)
    }

    // Clear test result after 3 seconds
    setTimeout(() => {
      setAbilityTestResults((prev) => {
        const newResults = { ...prev }
        delete newResults[ability]
        return newResults
      })
    }, 3000)
  }

  const handleAbilitySelection = (ability: string) => {
    // Fix: Use selectedStage which now contains the correct node ID
    if (selectedStage) {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === selectedStage) {
            const abilities = [...(node.abilities || []), ability]
            return { ...node, abilities }
          }
          return node
        }),
      )
    }
    setShowAddAbilitiesModal(false)
    setAddAbilitiesStage(null)
  }

  const handleCustomAbilityFromModal = () => {
    setShowAddAbilitiesModal(false)
    if (selectedStage) {
      const node = nodes.find((n) => n.id === selectedStage)
      if (node) {
        setCustomAbilityStage(node.type)
        setCustomAbilityText("")
        setAbilityInputs([])
        setAbilityOutputs([])
        setAbilityInstructions("")
        setCurrentInputValue("")
        setCurrentOutputValue("")
        setAbilityValidationResult(null)
        setShowCustomAbilityModal(true)
      }
    }
  }

  const handleEditAbility = (ability: string) => {
    handleAbilityClick(ability)
  }

  const handleRemoveAbility = (nodeId: string, abilityIndex: number) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const abilities = [...(node.abilities || [])]
          abilities.splice(abilityIndex, 1)
          return { ...node, abilities }
        }
        return node
      }),
    )
  }

  const handleAbilityDragStart = (e: React.DragEvent, index: number) => {
    setDraggedAbilityIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleAbilityDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleAbilityDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverIndex(null)
  }

  const handleAbilityDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedAbilityIndex === null || !selectedStage || draggedAbilityIndex === dropIndex) {
      setDraggedAbilityIndex(null)
      setDragOverIndex(null)
      return
    }

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === selectedStage) {
          const abilities = [...(node.abilities || [])]
          const draggedAbility = abilities[draggedAbilityIndex]
          abilities.splice(draggedAbilityIndex, 1)
          abilities.splice(dropIndex, 0, draggedAbility)
          return { ...node, abilities }
        }
        return node
      }),
    )

    setDraggedAbilityIndex(null)
    setDragOverIndex(null)
  }

  // Debug: Log connections whenever they change
  useEffect(() => {
    console.log("Connections updated:", connections)
  }, [connections])

  // Hide notifications after 3 seconds
  useEffect(() => {
    if (testCompleted) {
      const timer = setTimeout(() => setTestCompleted(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [testCompleted])

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  // Hide validation result after 3 seconds
  useEffect(() => {
    if (abilityValidationResult) {
      const timer = setTimeout(() => setAbilityValidationResult(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [abilityValidationResult])

  // Generate suggestions based on input text
  const [outputSuggestions, setOutputSuggestions] = useState<string[]>([])
  const [inputSuggestions, setInputSuggestions] = useState<string[]>([])

  const generateSuggestions = (inputText: string, isOutput = false) => {
    if (!inputText) return []

    const suggestions: string[] = []
    const lowerInput = inputText.toLowerCase()

    // Check for object matches
    Object.keys(OBJECT_STRUCTURE).forEach((objName) => {
      if (objName.toLowerCase().includes(lowerInput)) {
        suggestions.push(objName)
      }
    })

    // If input contains a dot, suggest nested properties
    if (inputText.includes(".")) {
      const parts = inputText.split(".")
      const objName = parts[0]
      const currentPath = parts.slice(1).join(".")

      if (OBJECT_STRUCTURE[objName]) {
        const nestedSuggestions = getNestedSuggestions(OBJECT_STRUCTURE[objName], currentPath, objName)
        suggestions.push(...nestedSuggestions)
      }
    }

    return suggestions.slice(0, 5)
  }

  const getNestedSuggestions = (obj: any, path: string, prefix: string): string[] => {
    if (!path) {
      // Return all first-level properties
      return Object.keys(obj).map((key) => `${prefix}.${key}`)
    }

    const pathParts = path.split(".")
    const currentKey = pathParts[0]
    const remainingPath = pathParts.slice(1).join(".")

    if (obj[currentKey]) {
      if (Array.isArray(obj[currentKey]) && obj[currentKey][0]) {
        // Handle array properties
        return getNestedSuggestions(obj[currentKey][0], remainingPath, `${prefix}.${currentKey}[]`)
      } else if (typeof obj[currentKey] === "object") {
        // Handle nested objects
        return getNestedSuggestions(obj[currentKey], remainingPath, `${prefix}.${currentKey}`)
      }
    }

    return []
  }

  const handleInputChange = (value: string, isOutput = false) => {
    if (isOutput) {
      setCurrentOutputValue(value)
      setOutputSuggestions(generateSuggestions(value, true))
    } else {
      setCurrentInputValue(value)
      setInputSuggestions(generateSuggestions(value, false))
    }
  }

  const handleSuggestionClick = (suggestion: string, isOutput = false) => {
    if (isOutput) {
      setAbilityOutputs([...abilityOutputs, suggestion])
      setCurrentOutputValue("")
      setOutputSuggestions([])
    } else {
      setAbilityInputs([...abilityInputs, suggestion])
      setCurrentInputValue("")
      setInputSuggestions([])
    }
  }

  const removeInput = (index: number) => {
    setAbilityInputs(abilityInputs.filter((_, i) => i !== index))
  }

  const removeOutput = (index: number) => {
    setAbilityOutputs(abilityOutputs.filter((_, i) => i !== index))
  }

  const handleAbilityClick = (ability: string) => {
    const abilityData = ABILITY_DATA[ability]
    if (abilityData) {
      setSelectedAbility(ability)
      // Lock inputs to 'Atlas' for the special intake ability
      if (ability === "receive_invoice") {
        setAbilityInputs(["Atlas"])
      } else {
        setAbilityInputs([...abilityData.inputs])
      }
      setAbilityOutputs([...abilityData.outputs])
      setAbilityInstructions(abilityData.instructions)
      setCurrentInputValue("")
      setCurrentOutputValue("")
      setShowAbilityConfig(true)
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, stageType: string) => {
    setDraggedStage(stageType)
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (!draggedStage) return

      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (event.clientX - rect.left - panOffset.x) / zoom - 75
      const y = (event.clientY - rect.top - panOffset.y) / zoom - 40

      const newNode = {
        id: `${draggedStage}-${Date.now()}`,
        type: draggedStage,
        position: { x: Math.max(0, x), y: Math.max(0, y) },
        abilities: [],
        objectInputs: [],
        objectOutputs: [],
        isDefault: false,
      }

      setNodes((prev) => [...prev, newNode])
      setDraggedStage(null)
    },
    [draggedStage, panOffset, zoom],
  )

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    // Don't start dragging if we're clicking on a connection handle
    if ((e.target as HTMLElement).closest(".connection-handle")) {
      return
    }

    const node = nodes.find((n) => n.id === nodeId)!
    const rect = canvasRef.current!.getBoundingClientRect()
    const offsetX = (e.clientX - rect.left - panOffset.x) / zoom - node.position.x
    const offsetY = (e.clientY - rect.top - panOffset.y) / zoom - node.position.y

    setDraggingNode(nodeId)
    setDragOffset({ x: offsetX, y: offsetY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingNode) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left - panOffset.x) / zoom - dragOffset.x
      const y = (e.clientY - rect.top - panOffset.y) / zoom - dragOffset.y

      setNodes((prev) =>
        prev.map((node) =>
          node.id === draggingNode ? { ...node, position: { x: Math.max(0, x), y: Math.max(0, y) } } : node,
        ),
      )
    } else if (isPanning) {
      const deltaX = e.clientX - panStart.x
      const deltaY = e.clientY - panStart.y
      setPanOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))
      setPanStart({ x: e.clientX, y: e.clientY })
    } else if (connectingFrom) {
      // Update connection preview
      const rect = canvasRef.current!.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      setConnectionPreview({ x: mouseX, y: mouseY })
    }
  }

  const handleMouseUp = () => {
    setDraggingNode(null)
    setDragOffset({ x: 0, y: 0 })
    setIsPanning(false)
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest(".canvas-background")) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      setSelectedStage(null)

      // Cancel connection if clicking on canvas
      if (connectingFrom) {
        setConnectingFrom(null)
        setConnectionPreview(null)
      }
    }
  }

  const handleNodeClick = (node: any, event: React.MouseEvent) => {
    event.stopPropagation()
    if (draggingNode) return

    setSelectedStage(node.id)
    setAbilityPanelPosition({
      x: node.position.x * zoom + panOffset.x,
      y: (node.position.y + 120) * zoom + panOffset.y,
    })
  }

  // Handle output connection start
  const handleOutputClick = (nodeId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (connectingFrom === nodeId) {
      // Cancel connection if clicking same output
      setConnectingFrom(null)
      setConnectionPreview(null)
    } else {
      // Start new connection
      setConnectingFrom(nodeId)
      setConnectionPreview(null)
    }
  }

  // Handle input connection end
  const handleInputClick = (nodeId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (connectingFrom && connectingFrom !== nodeId) {
      const fromNode = nodes.find((n) => n.id === connectingFrom)
      const toNode = nodes.find((n) => n.id === nodeId)

      if (fromNode && toNode) {
        const fromDef = STAGE_DEFINITIONS[fromNode.type]
        const toDef = STAGE_DEFINITIONS[toNode.type]

        // Check if connection is valid
        if (fromDef.connectionType !== "target" && toDef.connectionType !== "source") {
          const newConnection = {
            id: `${connectingFrom}-${nodeId}`,
            from: connectingFrom,
            to: nodeId,
          }

          setConnections((prev) => {
            // Remove any existing connection from the same source to the same target
            const filtered = prev.filter((c) => !(c.from === connectingFrom && c.to === nodeId))
            return [...filtered, newConnection]
          })
        }
      }

      // Reset connection state
      setConnectingFrom(null)
      setConnectionPreview(null)
    }
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setConnections((prev) => prev.filter((conn) => conn.from !== nodeId && conn.to !== nodeId))
    if (selectedStage === nodeId) {
      setSelectedStage(null)
    }
  }

  const validateAbility = (ability: string, stage: string) => {
    if (ability.length > 100) {
      return { valid: false, reason: "Ability must be less than 100 characters" }
    }

    // Check for inappropriate content (basic check)
    const inappropriateWords = ["delete", "destroy", "hack", "break"]
    if (inappropriateWords.some((word) => ability.toLowerCase().includes(word))) {
      return { valid: false, reason: "Ability contains inappropriate actions" }
    }

    // Check if ability already exists
    const existingAbilities = STAGE_DEFINITIONS[stage].abilities
    if ((existingAbilities as string[]).some((existing: string) => existing.toLowerCase() === ability.toLowerCase())) {
      return { valid: false, reason: "This ability already exists for this stage" }
    }

    return { valid: true }
  }

  const handleCreateCustomAbility = async () => {
    if (!customAbilityText.trim() || !customAbilityStage) return

    setIsCreatingAbility(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const validation = validateAbility(customAbilityText.trim(), customAbilityStage)

    if (validation.valid) {
      // Add the custom ability to the stage definition
      STAGE_DEFINITIONS[customAbilityStage].abilities.push(customAbilityText.trim())

      // Also add it to the current selected node
      if (selectedStage) {
        setNodes((prev) =>
          prev.map((node) => {
            if (node.id === selectedStage) {
              const abilities = [...(node.abilities || []), customAbilityText.trim()]
              return { ...node, abilities }
            }
            return node
          }),
        )
      }

      setAbilityValidationResult({
        success: true,
        message: "Successfully created custom ability!",
      })

      // Close modal after 1.5 seconds
      setTimeout(() => {
        setShowCustomAbilityModal(false)
        setCustomAbilityText("")
        setCustomAbilityStage(null)
        setAbilityInputs([])
        setAbilityOutputs([])
        setAbilityInstructions("")
        setCurrentInputValue("")
        setCurrentOutputValue("")
        setAbilityValidationResult(null)
      }, 1500)
    } else {
      setAbilityValidationResult({
        success: false,
        message: `Invalid ability: ${validation.reason}`,
      })
    }

    setIsCreatingAbility(false)
  }

  const handleTestRun = async () => {
    setIsTestRunning(true)
    setTestResults([])
    setCurrentTestStage(null)
    setTestCompleted(false)
    setTestRunSuccessful(false)
    setShowTestResults(true)

    const sortedNodes = [...nodes].sort((a, b) => a.position.x - b.position.x)

    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i]
      setCurrentTestStage(node.id)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const stageData = (SAMPLE_DATA as any)[selectedProcess][node.type]
      setTestResults((prev) => [
        ...prev,
        {
          id: node.id,
          name: STAGE_DEFINITIONS[node.type].name,
          abilities: node.abilities || [],
          input: stageData.input,
          output: stageData.output,
        },
      ])
    }

    setCurrentTestStage(null)
    setIsTestRunning(false)
    setTestCompleted(true)
    setTestRunSuccessful(true)
  }

  const handleSaveSpine = async () => {
    if (!testRunSuccessful) return

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSaving(false)
    setSaveSuccess(true)
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5))
  const handleResetView = () => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const toggleResultExpansion = (resultId: string) => {
    setExpandedResults((prev) => ({
      ...prev,
      [resultId]: !prev[resultId],
    }))
  }

  // Fixed connection path calculation - no zoom/pan applied here
  const getConnectionPath = (from: string, to: string) => {
    const fromNode = nodes.find((n) => n.id === from)
    const toNode = nodes.find((n) => n.id === to)

    if (!fromNode || !toNode) return ""

    const fromX = fromNode.position.x + 144 // Right edge of from node
    const fromY = fromNode.position.y + 50 // Middle of from node
    const toX = toNode.position.x // Left edge of to node
    const toY = toNode.position.y + 50 // Middle of to node

    const midX = (fromX + toX) / 2
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
  }

  const getConnectionPreviewPath = () => {
    if (!connectingFrom || !connectionPreview) return ""

    const fromNode = nodes.find((n) => n.id === connectingFrom)
    if (!fromNode) return ""

    // From node position in transformed space
    const fromX = fromNode.position.x + 144
    const fromY = fromNode.position.y + 50

    // Mouse position needs to be converted back to transformed space
    const toX = (connectionPreview.x - panOffset.x) / zoom
    const toY = (connectionPreview.y - panOffset.y) / zoom

    const midX = (fromX + toX) / 2
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
  }

  const handleAddNewSpine = () => {
    setSpineView("flow")
    setBlueprintStep("pick")
    setBlueprintChoice("")
    setTemplateChoice("")
  }

  const renderCustomSampleDataFields = (data: any, parentPath = "", level = 0) => {
    return Object.entries(data).map(([key, value]) => {
      const fieldPath = parentPath ? `${parentPath}.${key}` : key
      const fullPath = `Invoice_new.${fieldPath}`

      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
        return (
          <div key={key} className={`ml-${level * 4}`}>
            <div className="text-sm font-medium text-gray-700 mb-1">{key}[]:</div>
            <div className="ml-4 border-l-2 border-gray-200 pl-3">
              {renderCustomSampleDataFields(value[0], `${fieldPath}[0]`, level + 1)}
            </div>
          </div>
        )
      } else if (typeof value === "object" && value !== null) {
        return (
          <div key={key} className={`ml-${level * 4}`}>
            <div className="text-sm font-medium text-gray-700 mb-1">{key}:</div>
            <div className="ml-4 border-l-2 border-gray-200 pl-3">
              {renderCustomSampleDataFields(value, fieldPath, level + 1)}
            </div>
          </div>
        )
      } else {
        return (
          <div
            key={key}
            className={`ml-${level * 4} flex items-center justify-between py-1 hover:bg-gray-50 rounded px-2 cursor-pointer group`}
            onClick={() => {
              const textarea = document.getElementById("custom-instructions-textarea") as HTMLTextAreaElement
              if (textarea) {
                const start = textarea.selectionStart
                const end = textarea.selectionEnd
                const beforeCursor = abilityInstructions.substring(0, start)
                const afterCursor = abilityInstructions.substring(end)
                const newInstructions = beforeCursor + `$${fullPath}` + afterCursor
                setAbilityInstructions(newInstructions)

                setTimeout(() => {
                  textarea.focus()
                  textarea.setSelectionRange(start + fullPath.length + 1, start + fullPath.length + 1)
                }, 0)
              }
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{key}:</span>
              <span className="text-sm font-mono text-blue-600">
                {typeof value === "string" ? `"${value}"` : String(value)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-600 hover:text-orange-800"
              onClick={(e) => {
                e.stopPropagation()
                const textarea = document.getElementById("custom-instructions-textarea") as HTMLTextAreaElement
                if (textarea) {
                  const start = textarea.selectionStart
                  const end = textarea.selectionEnd
                  const beforeCursor = abilityInstructions.substring(0, start)
                  const afterCursor = abilityInstructions.substring(end)
                  const newInstructions = beforeCursor + `$${fullPath}` + afterCursor
                  setAbilityInstructions(newInstructions)

                  setTimeout(() => {
                    textarea.focus()
                    textarea.setSelectionRange(start + fullPath.length + 1, start + fullPath.length + 1)
                  }, 0)
                }
              }}
            >
              Insert
            </Button>
          </div>
        )
      }
    })
  }

  // Selection gate view
  const renderSelectionGate = () => {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-xl">
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select process blue print</h2>
              <p className="text-sm text-gray-600 mt-1">Choose how you want to start building your process spine.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Choose Process Blueprint</label>
                <Select
                  value={templateChoice}
                  onValueChange={(blueprintId) => {
                    setTemplateChoice(blueprintId)
                    handleBlueprintSelection(blueprintId)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blueprint..." />
                  </SelectTrigger>
                  <SelectContent>
                    {blueprints.map((blueprint) => (
                      <SelectItem key={blueprint.id} value={blueprint.id}>
                        {blueprint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTemplateChoice("")
                    setNodes([
                      {
                        id: "intake-1",
                        type: "intake",
                        position: { x: 300, y: 200 },
                        abilities:
                          selectedProcess === "invoice-processing" ? ["receive_invoice"] : ["Receive Customer Inquiry"],
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
                    setConnections([])
                  }}
                >
                  Reset
                </Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => {
                    setBlueprintStep("scratch")
                  }}
                  disabled={!templateChoice}
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleBlueprintSelection = (blueprintId: string) => {
    const blueprintData = PRE_POPULATED_BLUEPRINTS[blueprintId]
    if (blueprintData) {
      setSelectedProcess(blueprintData.selectedProcess)
      setNodes(blueprintData.nodes)
      setConnections(blueprintData.connections)
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
            <Sitemap className={`w-4 h-4 ${activeLeftTab === "process-spine" ? "text-orange-700" : "text-gray-500"}`} />
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
            <Briefcase className={`w-4 h-4 ${activeLeftTab === "jobs" ? "text-orange-700" : "text-gray-500"}`} />
            <span>Jobs</span>
          </button>
        </nav>
        <div className="p-3 border-t text-xs text-gray-500">v1.0</div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {activeLeftTab === "process-spine" && (
          <>
            {spineView === "list" ? (
              <div className="flex-1 flex flex-col bg-gray-50">
                {/* List Header */}
                <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Process Spines</h1>
                    <p className="text-gray-600 text-sm">Browse existing process spines.</p>
                  </div>
                  <div>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleAddNewSpine}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add new process spine
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <div className="p-4">
                  <Card className="bg-white">
                    <CardContent className="p-0">
                      <div className="w-full overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[260px]">Spine Name</TableHead>
                              <TableHead className="min-w-[120px]">Stages</TableHead>
                              <TableHead className="min-w-[140px]">Abilities</TableHead>
                              <TableHead className="min-w-[160px]">Last Modified</TableHead>
                              <TableHead className="min-w-[120px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {spines.map((s) => (
                              <TableRow key={s.id}>
                                <TableCell className="font-medium text-gray-900">{s.name}</TableCell>
                                <TableCell className="text-gray-700">{s.stages}</TableCell>
                                <TableCell className="text-gray-700">{s.abilities}</TableCell>
                                <TableCell className="text-gray-700">{s.lastModified}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewSpine(s.id)}
                                    className="hover:bg-orange-50 hover:border-orange-300"
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {spines.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5}>
                                  <div className="py-8 text-center text-sm text-gray-600">No process spines yet.</div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <>
                {/* Selection Gate */}
                {blueprintStep === "pick" && renderSelectionGate()}

                {/* Scratch: render builder */}
                {blueprintStep === "scratch" && (
                  <>
                    {/* Notifications */}
                    {testCompleted && (
                      <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Test run successful!
                      </div>
                    )}

                    {saveSuccess && (
                      <div className="fixed top-4 right-4 z-50 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Process Spine saved successfully!
                      </div>
                    )}

                    {/* Ability Validation Result */}
                    {abilityValidationResult && (
                      <div
                        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                          abilityValidationResult.success ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}
                      >
                        {abilityValidationResult.success ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                        {abilityValidationResult.message}
                      </div>
                    )}

                    {/* Connection Instructions */}
                    {connectingFrom && (
                      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          Click on a blue input handle to complete the connection
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className="bg-white border-b border-gray-300 p-4 flex justify-between items-center relative z-10 shadow-sm">
                      <div className="flex items-center gap-4">
                        {/* Breadcrumb Navigation */}
                        {viewingSpineId && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <button
                              onClick={handleBackToSpinesList}
                              className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Process Spines
                            </button>
                            <span>›</span>
                            <span className="text-gray-800 font-medium">{viewingSpineName}</span>
                          </div>
                        )}
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800">
                            {viewingSpineId ? viewingSpineName : "Process Spine"}
                          </h1>
                          <p className="text-gray-600">{currentConfig.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleTestRun}
                          disabled={isTestRunning}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isTestRunning ? "Testing..." : "Test Run"}
                        </Button>
                        <Button
                          onClick={handleSaveSpine}
                          disabled={isSaving || !testRunSuccessful}
                          variant="outline"
                          className={`border-orange-600 text-orange-600 hover:bg-orange-50 ${
                            !testRunSuccessful ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {isSaving ? "Saving..." : "Save Spine"}
                        </Button>
                      </div>
                    </div>

                    {/* Builder Area */}
                    <div className="relative h-[calc(100vh-56px)]">
                      {/* ASF Stages Panel - Left Side */}
                      {showASFPanel && (
                        <div className="absolute top-0 left-0 w-64 h-full bg-white border-r border-gray-300 shadow-lg z-20 flex flex-col">
                          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-gray-800">ASF Stages</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowASFPanel(false)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {AVAILABLE_STAGES.map((stageType) => {
                              const stage = STAGE_DEFINITIONS[stageType]
                              const Icon = stage.icon

                              return (
                                <div
                                  key={stageType}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, stageType)}
                                  className="flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:bg-gray-50 hover:shadow-md hover:scale-105 border border-gray-200 hover:border-orange-300 bg-white"
                                >
                                  <div
                                    className={`w-10 h-10 rounded-full ${stage.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                                  >
                                    <Icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-800">{stage.name}</h4>
                                    <p className="text-xs text-gray-600">{stage.abilities.length} abilities</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <div className="p-3 bg-orange-50 border-t border-gray-200">
                            <p className="text-xs text-orange-700">
                              💡 Drag stages to canvas. Click orange handle, then blue handle to connect.
                            </p>
                          </div>
                        </div>
                      )}

                      {!showASFPanel && (
                        <div className="absolute top-4 left-4 z-20">
                          <Button
                            variant="outline"
                            className="bg-white shadow-lg border-gray-300 hover:bg-gray-50"
                            onClick={() => setShowASFPanel(true)}
                          >
                            ASF Stages
                          </Button>
                        </div>
                      )}

                      {/* Test Results Panel - Right Side */}
                      {!showTestResults && testResults.length > 0 && (
                        <div className="absolute top-4 right-4 z-20">
                          <Button
                            variant="outline"
                            className="bg-white shadow-lg border-gray-300 hover:bg-gray-50"
                            onClick={() => setShowTestResults(true)}
                          >
                            Test Results
                          </Button>
                        </div>
                      )}

                      {showTestResults && (
                        <div className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-300 shadow-lg z-20 flex flex-col">
                          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-gray-800">Test Run Results</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowTestResults(false)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {testResults.map((result) => (
                              <Card key={result.id} className="border-l-4 border-l-orange-600 bg-white">
                                <CardContent className="p-4">
                                  <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleResultExpansion(result.id)}
                                  >
                                    <h4 className="font-semibold text-gray-800">{result.name}</h4>
                                    {expandedResults[result.id] ? (
                                      <ChevronDown className="w-4 h-4 text-gray-600" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-600" />
                                    )}
                                  </div>

                                  {expandedResults[result.id] && (
                                    <div className="mt-4 space-y-3">
                                      <div>
                                        <span className="font-medium text-sm text-gray-700">Abilities:</span>
                                        <div className="text-gray-600 text-sm">
                                          {result.abilities.length > 0 ? result.abilities.join(", ") : "None selected"}
                                        </div>
                                      </div>

                                      <div>
                                        <h5 className="font-medium text-sm mb-2 text-gray-700">JSON</h5>
                                        <div className="space-y-2">
                                          <div>
                                            <span className="font-medium text-xs text-gray-600">Input:</span>
                                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto border">
                                              {JSON.stringify(result.input, null, 2)}
                                            </pre>
                                          </div>
                                          <div>
                                            <span className="font-medium text-xs text-gray-600">Output:</span>
                                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto border">
                                              {JSON.stringify(result.output, null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Center Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-300">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleZoomOut}
                          className="hover:bg-gray-50 bg-transparent"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="px-2 py-1 text-sm text-gray-700 min-w-[60px] text-center">
                          {Math.round(zoom * 100)}%
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleZoomIn}
                          className="hover:bg-gray-50 bg-transparent"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetView}
                          title="Reset View"
                          className="hover:bg-gray-50 bg-transparent"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Pan Mode"
                          className="hover:bg-gray-50 bg-transparent"
                        >
                          <Move className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Canvas */}
                      <div
                        ref={canvasRef}
                        className="w-full h-full relative bg-gray-100 overflow-hidden cursor-move"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseDown={handleCanvasMouseDown}
                      >
                        {/* Grid Background */}
                        <div
                          className="canvas-background absolute inset-0 opacity-30"
                          style={{
                            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                            transformOrigin: "0 0",
                          }}
                        >
                          <svg width="100%" height="100%">
                            <defs>
                              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="1" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                          </svg>
                        </div>

                        {/* Nodes */}
                        <div
                          style={{
                            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                            transformOrigin: "0 0",
                          }}
                        >
                          {nodes.map((node) => {
                            const stageDef = STAGE_DEFINITIONS[node.type]
                            const Icon = stageDef.icon
                            const isHighlighted = currentTestStage === node.id

                            return (
                              <div
                                key={node.id}
                                className={`absolute transition-all duration-300 ${
                                  isHighlighted ? "ring-4 ring-orange-400 ring-opacity-75 scale-110" : ""
                                } ${draggingNode === node.id ? "cursor-grabbing" : "cursor-grab"}`}
                                style={{ left: node.position.x, top: node.position.y, zIndex: 2 }}
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                onClick={(e) => handleNodeClick(node, e)}
                              >
                                <Card
                                  className={`w-36 hover:shadow-lg transition-shadow bg-white ${
                                    node.isDefault ? "border-2 border-gray-600" : "border border-gray-300"
                                  }`}
                                >
                                  <CardContent className="p-4 text-center relative">
                                    {/* Delete Button */}
                                    {!node.isDefault && hoveredNode === node.id && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 w-6 h-6 p-0 z-10 bg-red-600 hover:bg-red-700"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteNode(node.id)
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}

                                    {/* Connection Handles */}
                                    {stageDef.connectionType !== "target" && (
                                      <button
                                        className={`connection-handle absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg z-20 transition-all hover:scale-110 ${
                                          connectingFrom === node.id
                                            ? "bg-orange-700 ring-2 ring-orange-300"
                                            : "bg-orange-600 hover:bg-orange-700"
                                        }`}
                                        onClick={(e) => handleOutputClick(node.id, e)}
                                        title="Output - click to start connection"
                                        type="button"
                                      />
                                    )}
                                    {stageDef.connectionType !== "source" && (
                                      <button
                                        className={`connection-handle absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg z-20 transition-all hover:scale-110 ${
                                          connectingFrom && connectingFrom !== node.id
                                            ? "bg-blue-700 ring-2 ring-blue-300 animate-pulse"
                                            : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                        onClick={(e) => handleInputClick(node.id, e)}
                                        title="Input - click to complete connection"
                                        type="button"
                                      />
                                    )}

                                    <div
                                      className={`w-12 h-12 rounded-full ${stageDef.color} flex items-center justify-center mx-auto mb-2 shadow-md`}
                                    >
                                      <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-sm mb-1 text-gray-800">{stageDef.name}</h3>
                                    {!node.isDefault && (
                                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                        {node.abilities?.length || 0} abilities
                                      </Badge>
                                    )}
                                    {node.isDefault && node.type === "intake" && (
                                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                        {node.objectInputs?.length || 0} inputs
                                      </Badge>
                                    )}
                                    {node.isDefault && node.type === "complete" && (
                                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                        {node.objectOutputs?.length || 0} outputs
                                      </Badge>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            )
                          })}
                        </div>

                        {/* Connection Lines */}
                        <svg
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            zIndex: 1,
                            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                            transformOrigin: "0 0",
                          }}
                          width="100%"
                          height="100%"
                        >
                          <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                            </marker>
                          </defs>

                          {/* Render all connections */}
                          {connections.map((connection) => {
                            const path = getConnectionPath(connection.from, connection.to)
                            return (
                              <path
                                key={connection.id}
                                d={path}
                                stroke="#374151"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="8,4"
                                markerEnd="url(#arrowhead)"
                                className="drop-shadow-sm"
                              />
                            )
                          })}

                          {/* Connection Preview */}
                          {connectingFrom && connectionPreview && (
                            <path
                              d={getConnectionPreviewPath()}
                              stroke="#374151"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="4,4"
                              opacity="0.5"
                            />
                          )}
                        </svg>

                        {/* Ability Selection Panel */}
                        {selectedStage && (
                          <div
                            ref={abilityPanelRef}
                            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-30 min-w-80"
                            style={{
                              left: abilityPanelPosition.x,
                              top: abilityPanelPosition.y,
                              maxWidth: "400px",
                            }}
                          >
                            <div>
                              {(() => {
                                const selectedNode = nodes.find((n) => n.id === selectedStage)
                                const stageType = selectedNode?.type

                                if (stageType === "intake") {
                                  return (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-800">Object Inputs</h4>
                                        <Button
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                          onClick={() => handleAddObjectClick(selectedStage, "inputs")}
                                        >
                                          <Plus className="w-3 h-3 mr-1" />
                                          Add New
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                        {(selectedNode?.objectInputs || []).map((objectInput: string) => (
                                          <div
                                            key={objectInput}
                                            className="p-3 border rounded-lg bg-blue-50 border-blue-200"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-medium text-blue-800">{objectInput}</span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleObjectToggle(selectedStage, objectInput, "inputs")}
                                                className="text-red-600 hover:text-red-800"
                                              >
                                                <X className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                        {(selectedNode?.objectInputs || []).length === 0 && (
                                          <div className="text-sm text-gray-500 text-center py-4">
                                            No object inputs added yet
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                } else if (stageType === "complete") {
                                  return (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-800">Object Outputs</h4>
                                        <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                          onClick={() => handleAddObjectClick(selectedStage, "outputs")}
                                        >
                                          <Plus className="w-3 h-3 mr-1" />
                                          Add New
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                        {(selectedNode?.objectOutputs || []).map((objectOutput: string) => (
                                          <div
                                            key={objectOutput}
                                            className="p-3 border rounded-lg bg-green-50 border-green-200"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-medium text-green-800">{objectOutput}</span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  handleObjectToggle(selectedStage, objectOutput, "outputs")
                                                }
                                                className="text-red-600 hover:text-red-800"
                                              >
                                                <X className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                        {(selectedNode?.objectOutputs || []).length === 0 && (
                                          <div className="text-sm text-gray-500 text-center py-4">
                                            No object outputs added yet
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                } else {
                                  // Enhanced abilities panel for other stages
                                  return (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-800">Abilities list</h4>
                                        <Button
                                          size="sm"
                                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                                          onClick={() => handleAddAbilitiesClick(selectedStage)}
                                        >
                                          <Plus className="w-3 h-3 mr-1" />
                                          Add New
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                        {(selectedNode?.abilities || []).length === 0 ? (
                                          <div className="text-sm text-gray-500 text-center py-4">
                                            No abilities added yet
                                          </div>
                                        ) : (
                                          (selectedNode?.abilities || []).map((ability: string, index: number) => (
                                            <div
                                              key={`${ability}-${index}`}
                                              draggable
                                              onDragStart={(e) => handleAbilityDragStart(e, index)}
                                              onDragOver={(e) => handleAbilityDragOver(e, index)}
                                              onDragLeave={handleAbilityDragLeave}
                                              onDrop={(e) => handleAbilityDrop(e, index)}
                                              className={`p-3 border rounded-lg bg-gray-50 border-gray-200 cursor-move transition-all hover:bg-gray-100 ${
                                                dragOverIndex === index ? "border-orange-400 bg-orange-50" : ""
                                              } ${draggedAbilityIndex === index ? "opacity-50" : ""}`}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                  <div className="text-gray-400 cursor-grab">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                      <path d="M3 4h14a1 1 0 010 2H3a1 1 0 010-2zM3 8h14a1 1 0 010 2H3a1 1 0 010-2zM3 12h14a1 1 0 010 2H3a1 1 0 010-2z" />
                                                    </svg>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                      {index + 1}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-700">{ability}</span>
                                                  </div>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      handleEditAbility(ability)
                                                    }}
                                                    className="text-orange-600 hover:text-orange-800"
                                                  >
                                                    <Settings className="w-3 h-3" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      handleRemoveAbility(selectedStage, index)
                                                    }}
                                                    className="text-red-600 hover:text-red-800"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  )
                                }
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ability Configuration Panel */}
                    {showAbilityConfig &&
                      selectedAbility &&
                      (() => {
                        // Check if this is for intake or complete stage - use original config
                        const selectedNode = nodes.find((n) => n.id === selectedStage)
                        const isIntakeOrComplete = selectedNode?.type === "intake" || selectedNode?.type === "complete"

                        if (isIntakeOrComplete) {
                          // Original ability configuration for intake/complete
                          return (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
                              <div className="bg-white h-full w-96 shadow-xl overflow-y-auto">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    {selectedAbility}
                                  </h3>
                                  <Button variant="ghost" size="sm" onClick={() => setShowAbilityConfig(false)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="p-6 space-y-6">
                                  {/* Inputs Section */}
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Inputs</h4>
                                    <div className="space-y-2 mb-3">
                                      {abilityInputs.map((input, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between bg-blue-50 p-2 rounded border"
                                        >
                                          <span className="text-sm text-blue-800">{input}</span>
                                          {/* Hide remove button when locked for receive_invoice */}
                                          {selectedAbility !== "receive_invoice" && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeInput(index)}
                                              className="text-red-600 hover:text-red-800"
                                            >
                                              <X className="w-3 h-3" />
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    {/* For receive_invoice, show locked Atlas and disable edits */}
                                    {selectedAbility === "receive_invoice" ? (
                                      <div>
                                        <Input value="Atlas" disabled className="mb-2" />
                                        <p className="text-xs text-gray-500">
                                          Inputs are locked to Atlas for this ability.
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="relative">
                                        <Input
                                          value={currentInputValue}
                                          onChange={(e) => setCurrentInputValue(e.target.value)}
                                          placeholder="Type object name (e.g., invoice)"
                                          className="mb-2"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Instructions Section */}
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Instructions</h4>
                                    <Textarea
                                      value={abilityInstructions}
                                      onChange={(e) => setAbilityInstructions(e.target.value)}
                                      placeholder="Enter instructions for this ability..."
                                      className="min-h-32"
                                    />
                                  </div>

                                  {/* Outputs Section */}
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Outputs</h4>
                                    <div className="space-y-2 mb-3">
                                      {abilityOutputs.map((output, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between bg-green-50 p-2 rounded border"
                                        >
                                          <span className="text-sm text-green-800">{output}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeOutput(index)}
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            <X className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="relative">
                                      <Input
                                        value={currentOutputValue}
                                        onChange={(e) => setCurrentOutputValue(e.target.value)}
                                        placeholder="Type object name (e.g., invoice.status)"
                                        className="mb-2"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        } else {
                          // Enhanced ability configuration for other stages
                          return (
                            <EnhancedAbilityConfig
                              selectedAbility={selectedAbility}
                              abilityInstructions={abilityInstructions}
                              onClose={() => setShowAbilityConfig(false)}
                              onInstructionsChange={setAbilityInstructions}
                            />
                          )
                        }
                      })()}
                  </>
                )}

                {/* Template: show blank page for now */}
                {blueprintStep === "template" && (
                  <div className="flex-1 bg-white" aria-label="Template placeholder"></div>
                )}
              </>
            )}
          </>
        )}
        {activeLeftTab === "jobs" && <ProcessListView />}
        {/* Add after the Process List section and before the closing main tag: */}
        {activeLeftTab === "process-blueprint" && (
          <>
            {activeBlueprintTab === "list" ? (
              <div className="flex-1 flex flex-col bg-gray-50">
                {/* List Header */}
                <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Process Blueprints</h1>
                    <p className="text-gray-600 text-sm">Browse existing process blueprints.</p>
                  </div>
                  <div>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleAddNewBlueprint}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add new process blueprint
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <div className="p-4">
                  <Card className="bg-white">
                    <CardContent className="p-0">
                      <div className="w-full overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[260px]">Blueprint Name</TableHead>
                              <TableHead className="min-w-[120px]">Stages</TableHead>
                              <TableHead className="min-w-[140px]">Abilities</TableHead>
                              <TableHead className="min-w-[160px]">Last Modified</TableHead>
                              <TableHead className="min-w-[120px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {blueprints.map((b) => (
                              <TableRow key={b.id}>
                                <TableCell className="font-medium text-gray-900">{b.name}</TableCell>
                                <TableCell className="text-gray-700">{b.stages}</TableCell>
                                <TableCell className="text-gray-700">{b.abilities}</TableCell>
                                <TableCell className="text-gray-700">{b.lastModified}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewBlueprint(b.id)}
                                    className="hover:bg-orange-50 hover:border-orange-300"
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              // Blueprint Flow Builder - Copy entire Process Spine flow builder section but with blueprint variables
              <>
                {blueprintStep === "pick" && (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <Card className="w-full max-w-xl">
                      <CardContent className="p-6 space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Select process blueprint</h2>
                          <p className="text-sm text-gray-600 mt-1">
                            Choose how you want to start building your process blueprint.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Choose Process Blueprint</label>
                            <Select
                              value={blueprintChoice}
                              onValueChange={(v: "scratch" | "template") => {
                                setBlueprintChoice(v)
                                if (v === "scratch") {
                                  setTemplateBlueprintChoice("")
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select from template or start from scratch" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="template">select from template</SelectItem>
                                <SelectItem value="scratch">start from scratch</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {blueprintChoice === "template" && (
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">Choose a template</label>
                              <Select value={templateBlueprintChoice} onValueChange={setTemplateBlueprintChoice}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a template (e.g., Invoice processing 2 way matching)" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="invoice-2way">Invoice processing 2 way matching</SelectItem>
                                  <SelectItem value="invoice-3way">Invoice processing 3 way matching</SelectItem>
                                  <SelectItem value="cs-baseline">Customer support baseline</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setBlueprintChoice("")}>
                              Reset
                            </Button>
                            <Button
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={() => {
                                if (blueprintChoice === "scratch") {
                                  setBlueprintStep("scratch")
                                } else if (blueprintChoice === "template" && templateBlueprintChoice) {
                                  setBlueprintStep("template")
                                }
                              }}
                              disabled={
                                blueprintChoice === "" || (blueprintChoice === "template" && !templateBlueprintChoice)
                              }
                            >
                              Continue
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {blueprintStep === "scratch" && (
                  // Copy the entire scratch section from Process Spine but replace all spine variables with blueprint variables
                  <div className="h-[calc(100vh-56px)]">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-300 p-4 flex justify-between items-center relative z-10 shadow-sm">
                      <div className="flex items-center gap-4">
                        {viewingBlueprintId && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <button
                              onClick={handleBackToBlueprintsList}
                              className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Process Blueprints
                            </button>
                            <span>›</span>
                            <span className="text-gray-800 font-medium">{viewingBlueprintName}</span>
                          </div>
                        )}
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800">
                            {viewingBlueprintId ? viewingBlueprintName : "Process Blueprint"}
                          </h1>
                          <p className="text-gray-600">{currentConfig.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            /* Add blueprint test run handler */
                          }}
                          disabled={blueprintIsTestRunning}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {blueprintIsTestRunning ? "Testing..." : "Test Run"}
                        </Button>
                        <Button
                          onClick={() => {
                            /* Add blueprint save handler */
                          }}
                          disabled={blueprintIsSaving || !blueprintTestRunSuccessful}
                          variant="outline"
                          className={`border-orange-600 text-orange-600 hover:bg-orange-50 ${
                            !blueprintTestRunSuccessful ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {blueprintIsSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {blueprintIsSaving ? "Saving..." : "Save Blueprint"}
                        </Button>
                      </div>
                    </div>

                    {/* Placeholder for blueprint builder content */}
                    <div className="flex-1 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Blueprint Flow Builder</h3>
                        <p className="text-gray-600">Blueprint flow builder will be implemented here</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Object Selection Modal */}
      {showObjectSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Select {objectSelectionType === "inputs" ? "Input" : "Output"} Objects
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowObjectSelectionModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(objectSelectionType === "inputs" ? OBJECT_INPUTS.intake : OBJECT_OUTPUTS.complete).map((objectName) => (
                <div
                  key={objectName}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-orange-300 transition-colors group"
                  onMouseEnter={() => setHoveredObjectItem(objectName)}
                  onMouseLeave={() => setHoveredObjectItem(null)}
                >
                  <span className="text-sm font-medium text-gray-800">{objectName}</span>

                  {/* Test result display */}
                  {objectTestResults[objectName] && (
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        objectTestResults[objectName].success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {objectTestResults[objectName].message}
                    </div>
                  )}

                  {/* Test & Add button */}
                  {hoveredObjectItem === objectName && !objectTestResults[objectName] && (
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleTestAndAddObject(objectName)}
                      disabled={testingObjectItem === objectName}
                    >
                      {testingObjectItem === objectName ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Test & Add
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Abilities Modal */}
      {showAddAbilitiesModal && addAbilitiesStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Abilities - {STAGE_DEFINITIONS[addAbilitiesStage]?.name}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddAbilitiesModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Available Abilities */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Available Abilities</h4>
                <div className="grid grid-cols-1 gap-2">
                  {STAGE_DEFINITIONS[addAbilitiesStage]?.abilities?.map((ability: string) => (
                    <div
                      key={ability}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-colors group"
                      onMouseEnter={() => setHoveredAbilityItem(ability)}
                      onMouseLeave={() => setHoveredAbilityItem(null)}
                    >
                      <span className="text-sm font-medium text-gray-800">{ability}</span>

                      {/* Test result display */}
                      {abilityTestResults[ability] && (
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            abilityTestResults[ability].success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {abilityTestResults[ability].message}
                        </div>
                      )}

                      {/* Test & Add button */}
                      {hoveredAbilityItem === ability && !abilityTestResults[ability] && (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleTestAndAddAbility(ability)}
                          disabled={testingAbilityItem === ability}
                        >
                          {testingAbilityItem === ability ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Test & Add
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {ABILITY_RECOMMENDATIONS[selectedProcess] &&
                ABILITY_RECOMMENDATIONS[selectedProcess][addAbilitiesStage] && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Recommended Abilities</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {ABILITY_RECOMMENDATIONS[selectedProcess][addAbilitiesStage].map((recommendation: string) => (
                        <div
                          key={recommendation}
                          className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors group"
                          onMouseEnter={() => setHoveredAbilityItem(recommendation)}
                          onMouseLeave={() => setHoveredAbilityItem(null)}
                        >
                          <span className="text-sm font-medium text-blue-800">{recommendation}</span>

                          {/* Test result display */}
                          {abilityTestResults[recommendation] && (
                            <div
                              className={`text-xs px-2 py-1 rounded ${
                                abilityTestResults[recommendation].success
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {abilityTestResults[recommendation].message}
                            </div>
                          )}

                          {/* Test & Add button */}
                          {hoveredAbilityItem === recommendation && !abilityTestResults[recommendation] && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleTestAndAddAbility(recommendation)}
                              disabled={testingAbilityItem === recommendation}
                            >
                              {testingAbilityItem === recommendation ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Testing...
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 mr-1" />
                                  Test & Add
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Custom Ability Creation */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Create Custom Ability</h4>
                <p className="text-sm text-gray-600 mb-2">Can't find the ability you need? Create your own!</p>
                <Button
                  variant="outline"
                  onClick={handleCustomAbilityFromModal}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  Create Custom Ability
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Ability Modal */}
      {showCustomAbilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create Custom Ability</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCustomAbilityModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Ability Name */}
              <div>
                <label htmlFor="ability-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ability Name
                </label>
                <Input
                  type="text"
                  id="ability-name"
                  placeholder="Enter ability name"
                  value={customAbilityText}
                  onChange={(e) => setCustomAbilityText(e.target.value)}
                />
              </div>

              {/* Instructions */}
              <div>
                <label htmlFor="custom-instructions-textarea" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <Textarea
                  id="custom-instructions-textarea"
                  placeholder="Enter instructions for this ability..."
                  value={abilityInstructions}
                  onChange={(e) => setAbilityInstructions(e.target.value)}
                  className="min-h-32"
                />
              </div>

              {/* Object Input/Output Selection */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inputs</label>
                  <div className="space-y-2">
                    {abilityInputs.map((input, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded border">
                        <span className="text-sm text-blue-800">{input}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInput(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      value={currentInputValue}
                      onChange={(e) => handleInputChange(e.target.value, false)}
                      placeholder="Type object name (e.g., invoice)"
                      className="mb-2"
                    />
                    {inputSuggestions.length > 0 && (
                      <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                        {inputSuggestions.map((suggestion) => (
                          <div
                            key={suggestion}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion, false)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outputs</label>
                  <div className="space-y-2">
                    {abilityOutputs.map((output, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded border">
                        <span className="text-sm text-green-800">{output}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOutput(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      value={currentOutputValue}
                      onChange={(e) => handleInputChange(e.target.value, true)}
                      placeholder="Type object name (e.g., invoice.status)"
                      className="mb-2"
                    />
                    {outputSuggestions.length > 0 && (
                      <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                        {outputSuggestions.map((suggestion) => (
                          <div
                            key={suggestion}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion, true)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Sample Data</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Explore sample data for the Invoice_new object to help you define instructions.
                </p>

                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-700">Invoice_new</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedCustomObjects((prev) => ({
                        ...prev,
                        Invoice_new: !prev.Invoice_new,
                      }))
                    }}
                  >
                    {expandedCustomObjects["Invoice_new"] ? "Collapse" : "Expand"}
                  </Button>
                </div>

                {expandedCustomObjects["Invoice_new"] && (
                  <div className="border rounded-md p-4 bg-gray-50">
                    {CUSTOM_ABILITY_OBJECTS["Invoice_new"] ? (
                      renderCustomSampleDataFields(CUSTOM_ABILITY_OBJECTS["Invoice_new"].sampleData)
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No sample data available for Invoice_new
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={() => setShowCustomAbilityModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleCreateCustomAbility}
                disabled={isCreatingAbility || !customAbilityText.trim()}
              >
                {isCreatingAbility ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Ability"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
