"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  List,
} from "lucide-react"
import { BlueprintsView } from "@/components/blueprints/blueprints-view"
import { ProcessListView } from "@/components/process-list/process-list-view"

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
    objectStructure: {
      invoice: {
        invoiceId: "string",
        invoiceNumber: "string",
        vendorId: "string",
        vendorName: "string",
        totalAmount: "number",
        invoiceDate: "date",
        dueDate: "date",
        documentType: "string",
        poReference: "string",
        lineItems: [
          {
            description: "string",
            amount: "number",
            quantity: "number",
            glCode: "string",
            taxAmount: "number",
            taxCategory: "string",
            department: "string",
            category: "string",
          },
        ],
        paymentTerms: "string",
        taxRate: "number",
        discountAmount: "number",
        netAmount: "number",
        documentStructure: "object",
        hasValidFormat: "boolean",
        structureAnomalies: "array",
        invoiceType: "string",
        requiresPoMatch: "boolean",
        requiresGrnMatch: "boolean",
        sourceSystem: "string",
        documentVersion: "string",
        digitalSignature: "string",
        attachmentCount: "number",
        language: "string",
        requiresTranslation: "boolean",
        toleranceRules: {
          pricePercent: "number",
          quantityPercent: "number",
          dateDays: "number",
          autoApprovalLimit: "number",
        },
        matchingResult: {
          overallMatch: "boolean",
          vendorMatch: "boolean",
          lineItemMatches: "array",
          quantityMatch: "boolean",
          priceMatch: "boolean",
          discrepancies: "array",
        },
        toleranceResult: {
          applied: "boolean",
          acceptableVariances: "array",
          unacceptableVariances: "array",
          withinTolerance: "boolean",
        },
        paymentVoucher: {
          voucherNumber: "string",
          paymentAmount: "number",
          paymentDueDate: "date",
          paymentMethod: "string",
        },
        journalEntry: {
          entryNumber: "string",
          debitEntries: "array",
          creditEntries: "array",
          postingDate: "date",
        },
        taxRecord: {
          recordId: "string",
          taxableAmount: "number",
          taxAmount: "number",
          filingPeriod: "string",
        },
        auditTrail: {
          auditId: "string",
          processSteps: "array",
          decisionPoints: "array",
          timestamps: "array",
        },
        reports: {
          summaryUrl: "string",
          exceptionUrl: "string",
          vendorReportUrl: "string",
        },
        payment: {
          transactionId: "string",
          status: "string",
          confirmationNumber: "string",
          executedDate: "date",
        },
        systemSync: {
          erpStatus: "string",
          accountingStatus: "string",
          timestamp: "date",
        },
        triggeredWorkflows: "array",
        activityLog: {
          logId: "string",
          entries: "array",
        },
        syncStatus: {
          completed: "boolean",
          systems: "array",
          timestamp: "date",
        },
        notifications: {
          sent: "boolean",
        },
        status: "string",
        completedAt: "date",
        completedBy: "string",
        finalNotifications: {
          vendorNotified: "boolean",
          financeNotified: "boolean",
          timestamp: "date",
        },
      },
      purchase_order: {
        poNumber: "string",
        vendorId: "string",
        totalAmount: "number",
        lineItems: "array",
        paymentTerms: "string",
        status: "string",
      },
      goods_receipt: {
        grnNumber: "string",
        poNumber: "string",
        lineItems: "array",
        receivedDate: "date",
        status: "string",
      },
      approval_status: {
        decision: "string",
        reason: "string",
        approvedBy: "string",
      },
      review_request: {
        requestId: "string",
        assignedTo: "string",
        priority: "string",
      },
      human_review_response: {
        decision: "string",
        comments: "string",
        reviewedBy: "string",
      },
      vendor_message: {
        messageId: "string",
        content: "string",
        sentStatus: "string",
        deliveryTimestamp: "date",
      },
      archive_package: {
        packageId: "string",
        documents: "array",
        archiveDate: "date",
      },
    },
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
    objectStructure: {
      customer_inquiry: {
        inquiryId: "string",
        customerId: "string",
        customerName: "string",
        customerEmail: "string",
        customerPhone: "string",
        inquiryType: "string",
        channel: "string",
        subject: "string",
        description: "string",
        priority: "string",
        attachments: "array",
        productId: "string",
        orderId: "string",
        accountNumber: "string",
        timestamp: "date",
        language: "string",
        location: "string",
        channelMetadata: "object",
        sessionId: "string",
        interactionHistory: "array",
        processedAttachments: "array",
        attachmentUrls: "array",
        securityStatus: "string",
        intent: "string",
        sentiment: "string",
        entities: "object",
        keywords: "array",
        detectedLanguage: "string",
        emotionalTone: "string",
        urgencyIndicator: "string",
        primaryCategory: "string",
        subCategory: "string",
        issueType: "string",
        complexity: "string",
      },
      customer_profile: {
        customerId: "string",
        name: "string",
        email: "string",
        tier: "string",
        accountStatus: "string",
        purchaseHistory: "array",
        supportHistory: "array",
        preferences: "object",
        language: "string",
        timezone: "string",
        loyaltyPoints: "number",
        lifetime_value: "number",
        risk_score: "number",
        previousIssues: "array",
        satisfactionTrend: "string",
        vipStatus: "boolean",
        churnRisk: "string",
        lastInteraction: "date",
        updated: "boolean",
        technicalLevel: "string",
      },
      knowledge_base: {
        articles: "array",
        faqs: "array",
        solutions: "array",
        productDocs: "array",
        policies: "array",
        troubleshootingGuides: "array",
        videoTutorials: "array",
        relevantArticles: "array",
        suggestedSolutions: "array",
        troubleshootingSteps: "array",
        newArticle: "object",
        updated: "boolean",
        newSolutions: "array",
        articleRatings: "object",
      },
      support_ticket: {
        ticketId: "string",
        ticketNumber: "string",
        status: "string",
        priority: "string",
        category: "string",
        subcategory: "string",
        assignedTo: "string",
        createdAt: "date",
        sla: "object",
        tags: "array",
        slaTarget: "object",
        responseDeadline: "date",
        resolutionDeadline: "date",
        knownIssue: "boolean",
        incidentId: "string",
        affectedCustomers: "array",
        workaround: "string",
        responseTemplates: "array",
        personalizationTokens: "object",
        preferredChannel: "string",
        selfServiceViable: "boolean",
        recommendedArticles: "array",
        confidenceScore: "number",
        routingDecision: "string",
        targetTeam: "string",
        requiredSkills: "array",
        estimatedHandleTime: "number",
        automationEligible: "boolean",
        automatedSolution: "object",
        customerConsent: "boolean",
        escalationRequired: "boolean",
        escalationLevel: "string",
        escalationReason: "string",
        assignedAgent: "string",
        assignmentTime: "date",
        queuePosition: "number",
        solutionExecuted: "boolean",
        executionResults: "object",
        customerActions: "array",
        systemsUpdated: "boolean",
        triggeredWorkflows: "array",
        preventiveActions: "array",
        surveySent: "boolean",
        surveyDelivered: "boolean",
        surveyId: "string",
        surveySchedule: "date",
        surveyQuestions: "array",
        closedAt: "date",
        closureReason: "string",
        metrics: {
          responseTime: "number",
          resolutionTime: "number",
          slaCompliance: "boolean",
          customerEffort: "number",
        },
        patternAnalysis: "object",
        trendIndicators: "array",
        productFeedback: "object",
        archiveId: "string",
        archiveLocation: "string",
        retentionDate: "date",
      },
      agent_response: {
        agentId: "string",
        agentName: "string",
        response: "string",
        solution: "string",
        nextSteps: "array",
        escalationNeeded: "boolean",
        transferTo: "string",
        internalNotes: "string",
        timestamp: "date",
        qualityScore: "number",
        approved: "boolean",
        feedback: "string",
      },
      response_message: {
        messageId: "string",
        ticketId: "string",
        recipient: "string",
        channel: "string",
        subject: "string",
        body: "string",
        attachments: "array",
        templateUsed: "string",
        personalizations: "object",
        scheduledTime: "date",
        sentStatus: "string",
        deliveryTime: "date",
        readReceipt: "boolean",
      },
      escalation_request: {
        escalationId: "string",
        ticketId: "string",
        reason: "string",
        urgency: "string",
        targetTeam: "string",
        specialistRequired: "string",
        context: "string",
        previousAttempts: "array",
      },
      resolution_record: {
        resolutionId: "string",
        ticketId: "string",
        solution: "string",
        stepsToken: "array",
        timeToResolve: "number",
        knowledgeArticles: "array",
        rootCause: "string",
        preventiveMeasures: "array",
        solutionSteps: "array",
        visualAids: "array",
        estimatedTime: "number",
      },
      follow_up_task: {
        taskId: "string",
        ticketId: "string",
        type: "string",
        scheduledDate: "date",
        assignedTo: "string",
        customerContact: "string",
        purpose: "string",
        automatedReminders: "boolean",
      },
      customer_feedback: {
        ticketId: "string",
        rating: "number",
        comments: "string",
        satisfactionScore: "number",
        npsScore: "number",
        resolvedIssue: "boolean",
        wouldRecommend: "boolean",
        improvementSuggestions: "array",
      },
    },
  },
}

// Ability data for both processes
const ABILITY_DATA = {
  // Invoice Processing abilities
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
  "Identify Document Type": {
    inputs: ["invoice.documentType", "invoice.vendorId"],
    instructions: "Classify invoice type: Standard, Credit Note, Proforma,\nRecurring, Utility, Service, Goods.",
    outputs: ["invoice.invoiceType", "invoice.requiresPoMatch", "invoice.requiresGrnMatch"],
  },
  "Parse Metadata": {
    inputs: ["invoice"],
    instructions: "Extract metadata: creation timestamp, source system,\ndocument version, digital signatures.",
    outputs: ["invoice.sourceSystem", "invoice.documentVersion", "invoice.digitalSignature", "invoice.attachmentCount"],
  },
  "Classify Content": {
    inputs: ["invoice.lineItems", "invoice.vendorId"],
    instructions: "Classify line items by category, GL codes,\ntax categories, department allocation.",
    outputs: [
      "invoice.lineItems[].category",
      "invoice.lineItems[].glCode",
      "invoice.lineItems[].taxCategory",
      "invoice.lineItems[].department",
    ],
  },
  "Detect Language": {
    inputs: ["invoice.vendorName", "invoice.lineItems[].description"],
    instructions: "Detect document language for proper processing\nand compliance requirements.",
    outputs: ["invoice.language", "invoice.requiresTranslation"],
  },
  find_matching_po: {
    inputs: ["invoice.vendorId", "invoice.invoiceDate", "invoice.totalAmount", "invoice.poReference"],
    instructions: "Search for matching Purchase Order using vendor ID,\ndates, amounts, and reference numbers.",
    outputs: ["purchase_order"],
  },
  find_matching_grn: {
    inputs: ["purchase_order.poNumber", "invoice.invoiceDate"],
    instructions: "Locate Goods Receipt Note linked to the PO.\nVerify delivery completion status.",
    outputs: ["goods_receipt"],
  },
  load_tolerance_rules: {
    inputs: ["invoice.vendorId", "invoice.totalAmount", "invoice.invoiceType"],
    instructions: "Load applicable tolerance rules based on vendor,\namount, and invoice type.",
    outputs: [
      "invoice.toleranceRules.pricePercent",
      "invoice.toleranceRules.quantityPercent",
      "invoice.toleranceRules.dateDays",
      "invoice.toleranceRules.autoApprovalLimit",
    ],
  },
  match_details: {
    inputs: [
      "invoice.vendorId",
      "invoice.lineItems",
      "invoice.totalAmount",
      "purchase_order.vendorId",
      "purchase_order.lineItems",
      "purchase_order.totalAmount",
      "goods_receipt.lineItems",
      "goods_receipt.receivedDate",
    ],
    instructions: "Perform 3-way matching comparing invoice, PO, and GRN.\nCheck vendors, items, quantities, prices.",
    outputs: [
      "invoice.matchingResult.overallMatch",
      "invoice.matchingResult.vendorMatch",
      "invoice.matchingResult.lineItemMatches",
      "invoice.matchingResult.quantityMatch",
      "invoice.matchingResult.priceMatch",
      "invoice.matchingResult.discrepancies",
    ],
  },
  apply_tolerance: {
    inputs: [
      "invoice.matchingResult.discrepancies",
      "invoice.toleranceRules.pricePercent",
      "invoice.toleranceRules.quantityPercent",
    ],
    instructions: "Apply tolerance rules to identified discrepancies.\nMark acceptable variances.",
    outputs: [
      "invoice.toleranceResult.applied",
      "invoice.toleranceResult.acceptableVariances",
      "invoice.toleranceResult.unacceptableVariances",
      "invoice.toleranceResult.withinTolerance",
    ],
  },
  make_decision: {
    inputs: [
      "invoice.matchingResult.overallMatch",
      "invoice.toleranceResult.withinTolerance",
      "invoice.totalAmount",
      "invoice.toleranceRules.autoApprovalLimit",
    ],
    instructions: "Make approval decision based on matching results\nand tolerance application.",
    outputs: ["approval_status"],
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
  "Generate Payment Voucher": {
    inputs: [
      "invoice.invoiceNumber",
      "invoice.totalAmount",
      "invoice.dueDate",
      "invoice.vendorId",
      "purchase_order.paymentTerms",
      "approval_status.approvedBy",
    ],
    instructions: "Create payment voucher for approved invoices.",
    outputs: [
      "invoice.paymentVoucher.voucherNumber",
      "invoice.paymentVoucher.paymentAmount",
      "invoice.paymentVoucher.paymentDueDate",
      "invoice.paymentVoucher.paymentMethod",
    ],
  },
  "Create Journal Entry": {
    inputs: [
      "invoice.lineItems[].glCode",
      "invoice.lineItems[].amount",
      "invoice.lineItems[].taxAmount",
      "invoice.lineItems[].department",
    ],
    instructions: "Generate accounting journal entries with GL codes\nand tax allocations.",
    outputs: [
      "invoice.journalEntry.entryNumber",
      "invoice.journalEntry.debitEntries",
      "invoice.journalEntry.creditEntries",
      "invoice.journalEntry.postingDate",
    ],
  },
  "Generate Tax Records": {
    inputs: [
      "invoice.taxAmount",
      "invoice.lineItems[].taxCategory",
      "invoice.lineItems[].taxAmount",
      "invoice.vendorId",
    ],
    instructions: "Create tax records for compliance and filing.",
    outputs: [
      "invoice.taxRecord.recordId",
      "invoice.taxRecord.taxableAmount",
      "invoice.taxRecord.taxAmount",
      "invoice.taxRecord.filingPeriod",
    ],
  },
  "Create Audit Trail": {
    inputs: ["invoice.invoiceId", "approval_status", "human_review_response", "invoice.matchingResult"],
    instructions: "Create comprehensive audit record of processing.",
    outputs: [
      "invoice.auditTrail.auditId",
      "invoice.auditTrail.processSteps",
      "invoice.auditTrail.decisionPoints",
      "invoice.auditTrail.timestamps",
    ],
  },
  "Generate Reports": {
    inputs: [
      "invoice.invoiceNumber",
      "invoice.vendorId",
      "approval_status.decision",
      "invoice.paymentVoucher.voucherNumber",
    ],
    instructions: "Generate processing reports and summaries.",
    outputs: ["invoice.reports.summaryUrl", "invoice.reports.exceptionUrl", "invoice.reports.vendorReportUrl"],
  },
  "Create Notifications": {
    inputs: [
      "approval_status.decision",
      "invoice.vendorId",
      "invoice.invoiceNumber",
      "invoice.paymentVoucher.paymentDueDate",
    ],
    instructions: "Prepare notifications based on processing outcome.",
    outputs: ["vendor_message"],
  },
  "Execute Payment": {
    inputs: [
      "invoice.paymentVoucher.voucherNumber",
      "invoice.paymentVoucher.paymentAmount",
      "invoice.paymentVoucher.paymentMethod",
      "approval_status.approvedBy",
    ],
    instructions: "Initiate payment through payment gateway or ERP.",
    outputs: [
      "invoice.payment.transactionId",
      "invoice.payment.status",
      "invoice.payment.confirmationNumber",
      "invoice.payment.executedDate",
    ],
  },
  "Send Notifications": {
    inputs: ["vendor_message", "invoice.invoiceNumber", "approval_status.decision"],
    instructions: "Send notifications to vendors and internal teams.",
    outputs: ["vendor_message.sentStatus", "vendor_message.deliveryTimestamp", "invoice.notifications.sent"],
  },
  "Update Systems": {
    inputs: [
      "invoice.journalEntry",
      "invoice.payment.transactionId",
      "purchase_order.poNumber",
      "goods_receipt.grnNumber",
    ],
    instructions: "Update ERP and accounting systems with transaction data.",
    outputs: ["invoice.systemSync.erpStatus", "invoice.systemSync.accountingStatus", "invoice.systemSync.timestamp"],
  },
  "Trigger Workflows": {
    inputs: ["approval_status.decision", "invoice.payment.status", "purchase_order.poNumber"],
    instructions: "Trigger dependent workflows like PO closure.",
    outputs: ["invoice.triggeredWorkflows", "purchase_order.status"],
  },
  "Log Activities": {
    inputs: ["invoice.invoiceId", "invoice.auditTrail", "invoice.systemSync"],
    instructions: "Log all activities for monitoring and compliance.",
    outputs: ["invoice.activityLog.logId", "invoice.activityLog.entries"],
  },
  "Sync Data": {
    inputs: ["invoice", "purchase_order.status", "goods_receipt.status"],
    instructions: "Synchronize data across all connected systems.",
    outputs: ["invoice.syncStatus.completed", "invoice.syncStatus.systems", "invoice.syncStatus.timestamp"],
  },
  update_invoice_status: {
    inputs: ["invoice.invoiceId", "approval_status.decision", "invoice.payment.status"],
    instructions: "Update invoice with final processing status.",
    outputs: ["invoice.status", "invoice.completedAt", "invoice.completedBy"],
  },
  notify_stakeholders: {
    inputs: ["invoice.invoiceNumber", "invoice.vendorId", "invoice.status", "invoice.payment.confirmationNumber"],
    instructions: "Send completion notifications to all stakeholders.",
    outputs: [
      "invoice.finalNotifications.vendorNotified",
      "invoice.finalNotifications.financeNotified",
      "invoice.finalNotifications.timestamp",
    ],
  },
  archive_documents: {
    inputs: ["invoice", "purchase_order", "goods_receipt", "approval_status"],
    instructions: "Package all documents for archival and compliance.",
    outputs: ["archive_package"],
  },

  // Customer Support abilities
  "Receive Customer Inquiry": {
    inputs: [],
    instructions:
      "Capture customer inquiry from any channel (email, chat, phone, social).\nExtract all relevant information and create initial record.",
    outputs: ["customer_inquiry"],
  },
  "Capture Channel Context": {
    inputs: ["customer_inquiry"],
    instructions:
      "Identify source channel and capture channel-specific metadata\n(email headers, chat session, call recording reference).",
    outputs: ["customer_inquiry.channelMetadata", "customer_inquiry.sessionId", "customer_inquiry.interactionHistory"],
  },
  "Extract Attachments": {
    inputs: ["customer_inquiry.attachments"],
    instructions:
      "Process and store any attachments (screenshots, documents, logs).\nScan for security threats and validate file types.",
    outputs: [
      "customer_inquiry.processedAttachments",
      "customer_inquiry.attachmentUrls",
      "customer_inquiry.securityStatus",
    ],
  },
  "Identify Customer": {
    inputs: ["customer_inquiry.customerEmail", "customer_inquiry.customerPhone", "customer_inquiry.accountNumber"],
    instructions:
      "Match customer with existing profile using email, phone, or account.\nCreate new profile if customer not found.",
    outputs: ["customer_profile"],
  },
  "Analyze Inquiry Content": {
    inputs: ["customer_inquiry.subject", "customer_inquiry.description"],
    instructions:
      "Use NLP to understand intent, sentiment, and key issues.\nExtract entities (product names, order numbers, error codes).",
    outputs: [
      "customer_inquiry.intent",
      "customer_inquiry.sentiment",
      "customer_inquiry.entities",
      "customer_inquiry.keywords",
    ],
  },
  "Detect Language & Tone": {
    inputs: ["customer_inquiry.description"],
    instructions:
      "Identify language and emotional tone of the inquiry.\nDetermine if translation or special handling needed.",
    outputs: [
      "customer_inquiry.detectedLanguage",
      "customer_inquiry.emotionalTone",
      "customer_inquiry.urgencyIndicator",
    ],
  },
  "Categorize Issue": {
    inputs: ["customer_inquiry.intent", "customer_inquiry.keywords", "customer_inquiry.productId"],
    instructions:
      "Classify inquiry into primary category and subcategories.\nMap to internal taxonomy for routing and reporting.",
    outputs: [
      "customer_inquiry.primaryCategory",
      "customer_inquiry.subCategory",
      "customer_inquiry.issueType",
      "customer_inquiry.complexity",
    ],
  },
  "Assess Customer History": {
    inputs: ["customer_profile.supportHistory", "customer_profile.tier"],
    instructions: "Review previous interactions and identify patterns.\nCheck for recurring issues or VIP status.",
    outputs: [
      "customer_profile.previousIssues",
      "customer_profile.satisfactionTrend",
      "customer_profile.vipStatus",
      "customer_profile.churnRisk",
    ],
  },
  "Create Support Ticket": {
    inputs: ["customer_inquiry", "customer_profile"],
    instructions: "Generate unique ticket with all relevant information.\nSet initial status and properties.",
    outputs: ["support_ticket"],
  },
  "Set Priority & SLA": {
    inputs: ["customer_inquiry.priority", "customer_profile.tier", "customer_inquiry.issueType"],
    instructions: "Calculate priority based on impact, urgency, and customer tier.\nAssign appropriate SLA targets.",
    outputs: [
      "support_ticket.priority",
      "support_ticket.slaTarget",
      "support_ticket.responseDeadline",
      "support_ticket.resolutionDeadline",
    ],
  },
  "Search Knowledge Base": {
    inputs: ["customer_inquiry.keywords", "customer_inquiry.primaryCategory", "customer_inquiry.entities"],
    instructions:
      "Search for relevant articles, solutions, and documentation.\nRank results by relevance and success rate.",
    outputs: [
      "knowledge_base.relevantArticles",
      "knowledge_base.suggestedSolutions",
      "knowledge_base.troubleshootingSteps",
    ],
  },
  "Check Known Issues": {
    inputs: ["customer_inquiry.productId", "customer_inquiry.entities.errorCode"],
    instructions: "Check if issue matches any known problems or outages.\nIdentify if part of larger incident.",
    outputs: [
      "support_ticket.knownIssue",
      "support_ticket.incidentId",
      "support_ticket.affectedCustomers",
      "support_ticket.workaround",
    ],
  },
  "Prepare Response Templates": {
    inputs: ["customer_inquiry.issueType", "customer_profile.language", "customer_profile.preferences"],
    instructions: "Select appropriate response templates.\nPersonalize based on customer profile.",
    outputs: [
      "support_ticket.responseTemplates",
      "support_ticket.personalizationTokens",
      "support_ticket.preferredChannel",
    ],
  },
  "Evaluate Self-Service Options": {
    inputs: ["knowledge_base.suggestedSolutions", "customer_inquiry.complexity", "customer_profile.technicalLevel"],
    instructions:
      "Assess if issue can be resolved through self-service.\nMatch solution complexity to customer capability.",
    outputs: [
      "support_ticket.selfServiceViable",
      "support_ticket.recommendedArticles",
      "support_ticket.confidenceScore",
    ],
  },
  "Determine Routing": {
    inputs: ["support_ticket.category", "support_ticket.complexity", "support_ticket.priority"],
    instructions:
      "Decide which team or specialist should handle the ticket.\nConsider workload and expertise requirements.",
    outputs: [
      "support_ticket.routingDecision",
      "support_ticket.targetTeam",
      "support_ticket.requiredSkills",
      "support_ticket.estimatedHandleTime",
    ],
  },
  "Check Automation Eligibility": {
    inputs: ["customer_inquiry.issueType", "support_ticket.knownIssue", "customer_profile.preferences"],
    instructions: "Determine if issue can be resolved automatically.\nVerify customer accepts automated resolution.",
    outputs: [
      "support_ticket.automationEligible",
      "support_ticket.automatedSolution",
      "support_ticket.customerConsent",
    ],
  },
  "Assess Escalation Need": {
    inputs: ["customer_profile.vipStatus", "customer_inquiry.sentiment", "support_ticket.complexity"],
    instructions: "Evaluate if immediate escalation required.\nCheck escalation triggers and thresholds.",
    outputs: ["support_ticket.escalationRequired", "support_ticket.escalationLevel", "support_ticket.escalationReason"],
  },
  "Agent Assignment": {
    inputs: ["support_ticket.targetTeam", "support_ticket.requiredSkills", "support_ticket.priority"],
    instructions: "Assign to available agent with matching skills.\nConsider workload balancing and expertise.",
    outputs: ["support_ticket.assignedAgent", "support_ticket.assignmentTime", "support_ticket.queuePosition"],
  },
  "Expert Review": {
    inputs: ["support_ticket", "customer_inquiry", "knowledge_base.suggestedSolutions"],
    instructions: "Agent reviews issue and proposed solutions.\nIdentifies best approach for resolution.",
    outputs: ["agent_response"],
  },
  "Quality Check": {
    inputs: ["agent_response", "support_ticket.priority", "customer_profile.tier"],
    instructions: "Review agent response for quality and completeness.\nEnsure compliance with standards and policies.",
    outputs: ["agent_response.qualityScore", "agent_response.approved", "agent_response.feedback"],
  },
  "Escalation Review": {
    inputs: ["support_ticket.escalationRequired", "agent_response.escalationNeeded", "customer_inquiry"],
    instructions: "Senior agent/manager reviews escalated cases.\nDetermines special handling requirements.",
    outputs: ["escalation_request"],
  },
  "Compose Response": {
    inputs: ["agent_response", "support_ticket.responseTemplates", "customer_profile.preferences"],
    instructions:
      "Create personalized response using templates and agent input.\nEnsure tone matches customer sentiment and brand voice.",
    outputs: ["response_message"],
  },
  "Generate Solution Steps": {
    inputs: ["agent_response.solution", "knowledge_base.troubleshootingSteps"],
    instructions: "Create clear, step-by-step instructions for customer.\nInclude screenshots or videos if helpful.",
    outputs: ["resolution_record.solutionSteps", "resolution_record.visualAids", "resolution_record.estimatedTime"],
  },
  "Create Follow-up Tasks": {
    inputs: ["support_ticket.issueType", "agent_response.nextSteps", "customer_profile"],
    instructions: "Generate follow-up tasks for proactive service.\nSchedule based on issue type and resolution.",
    outputs: ["follow_up_task"],
  },
  "Document Resolution": {
    inputs: ["support_ticket", "agent_response", "resolution_record"],
    instructions: "Create comprehensive record of issue and resolution.\nUpdate knowledge base with new solutions.",
    outputs: ["resolution_record", "knowledge_base.newArticle"],
  },
  "Prepare Satisfaction Survey": {
    inputs: ["support_ticket.ticketId", "customer_profile.preferences", "resolution_record"],
    instructions: "Create customized satisfaction survey.\nSchedule for appropriate time after resolution.",
    outputs: ["support_ticket.surveyId", "support_ticket.surveySchedule", "support_ticket.surveyQuestions"],
  },
  "Send Response": {
    inputs: ["response_message", "customer_inquiry.channel"],
    instructions: "Deliver response through customer's preferred channel.\nEnsure delivery and track read receipts.",
    outputs: ["response_message.sentStatus", "response_message.deliveryTime", "response_message.readReceipt"],
  },
  "Execute Solution": {
    inputs: ["resolution_record.solutionSteps", "support_ticket.automatedSolution"],
    instructions: "Implement automated fixes where applicable.\nGuide customer through manual steps.",
    outputs: ["support_ticket.solutionExecuted", "support_ticket.executionResults", "support_ticket.customerActions"],
  },
  "Update Customer Systems": {
    inputs: ["resolution_record", "customer_profile.customerId"],
    instructions: "Update CRM and other systems with interaction details.\nSync across all customer touchpoints.",
    outputs: ["customer_profile.lastInteraction", "customer_profile.updated", "support_ticket.systemsUpdated"],
  },
  "Send Survey": {
    inputs: ["support_ticket.surveyId", "customer_profile.customerEmail"],
    instructions: "Send satisfaction survey at scheduled time.\nTrack response rates and send reminders.",
    outputs: ["support_ticket.surveySent", "support_ticket.surveyDelivered"],
  },
  "Close Ticket": {
    inputs: ["support_ticket", "resolution_record", "customer_feedback"],
    instructions: "Update ticket status to closed.\nVerify all actions completed.",
    outputs: ["support_ticket.status", "support_ticket.closedAt", "support_ticket.closureReason"],
  },
  "Calculate Metrics": {
    inputs: ["support_ticket", "response_message.deliveryTime", "resolution_record.timeToResolve"],
    instructions: "Calculate performance metrics (response time, resolution time).\nCompare against SLA targets.",
    outputs: [
      "support_ticket.metrics.responseTime",
      "support_ticket.metrics.resolutionTime",
      "support_ticket.metrics.slaCompliance",
      "support_ticket.metrics.customerEffort",
    ],
  },
  "Update Knowledge Base": {
    inputs: ["resolution_record", "support_ticket.issueType", "customer_feedback"],
    instructions: "Add successful solutions to knowledge base.\nUpdate article ratings based on effectiveness.",
    outputs: ["knowledge_base.updated", "knowledge_base.newSolutions", "knowledge_base.articleRatings"],
  },
  "Analyze Patterns": {
    inputs: ["support_ticket", "customer_profile.supportHistory", "resolution_record.rootCause"],
    instructions: "Identify trends and recurring issues.\nFlag systemic problems for product team.",
    outputs: ["support_ticket.patternAnalysis", "support_ticket.trendIndicators", "support_ticket.productFeedback"],
  },
  "Archive Interaction": {
    inputs: ["support_ticket", "customer_inquiry", "resolution_record", "customer_feedback"],
    instructions: "Create complete archive of interaction.\nEnsure compliance with retention policies.",
    outputs: ["support_ticket.archiveId", "support_ticket.archiveLocation", "support_ticket.retentionDate"],
  },
}

const ABILITY_RECOMMENDATIONS = {
  "invoice-processing": {
    intake: [
      "Validate invoice format and structure",
      "Extract vendor information automatically",
      "Scan for duplicate invoices",
      "Parse line items and amounts",
    ],
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
      "Load company-specific business rules",
    ],
    decide: [
      "Apply three-way matching logic",
      "Calculate tolerance variances",
      "Flag exceptions for review",
      "Auto-approve within tolerance",
    ],
    review: [
      "Route to appropriate approver",
      "Add reviewer comments",
      "Request additional documentation",
      "Override system decisions",
    ],
    create: [
      "Generate accounting entries",
      "Create payment instructions",
      "Update vendor records",
      "Generate compliance reports",
    ],
    do: ["Process payment transactions", "Send vendor notifications", "Update ERP systems", "Log audit trail"],
    complete: [
      "Mark invoice as processed",
      "Send completion notifications",
      "Archive all documents",
      "Update dashboard metrics",
    ],
  },
  "customer-support": {
    intake: [
      "Validate customer contact information",
      "Extract urgency indicators from message",
      "Identify communication channel preferences",
      "Parse customer sentiment automatically",
    ],
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
    decide: [
      "Route to specialized teams",
      "Determine automation opportunities",
      "Assess self-service viability",
      "Calculate resolution priority",
    ],
    review: [
      "Assign to best-matched agent",
      "Review solution accuracy",
      "Validate response quality",
      "Check compliance requirements",
    ],
    create: [
      "Generate personalized responses",
      "Create step-by-step guides",
      "Prepare follow-up schedules",
      "Document solution knowledge",
    ],
    do: [
      "Send multi-channel responses",
      "Execute automated solutions",
      "Update customer records",
      "Trigger satisfaction surveys",
    ],
    complete: [
      "Close ticket with resolution",
      "Calculate satisfaction metrics",
      "Update knowledge articles",
      "Archive interaction records",
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

export default function ProcessSpine() {
  // Global left sidebar tab (prepared for future tabs)
  const [activeLeftTab, setActiveLeftTab] = useState<"process-spine" | "process-blue-print" | "process-list">(
    "process-spine",
  )

  // Selection gate for Process Spine
  const [blueprintStep, setBlueprintStep] = useState<"pick" | "scratch" | "template">("pick")
  const [blueprintChoice, setBlueprintChoice] = useState<"scratch" | "template" | "">("")
  const [templateChoice, setTemplateChoice] = useState<string>("")

  const [spineView, setSpineView] = useState<"list" | "flow">("list")
  const [spines] = useState<
    Array<{ id: string; name: string; stages: number; abilities: number; lastModified: string }>
  >([
    { id: "sp-1", name: "Invoice processing 2-way spine", stages: 8, abilities: 17, lastModified: "2025-07-01" },
    { id: "sp-2", name: "Customer support baseline spine", stages: 3, abilities: 3, lastModified: "2025-07-02" },
  ])

  // Reset selection when navigating back to Process Spine
  useEffect(() => {
    if (activeLeftTab === "process-spine") {
      setBlueprintStep("pick")
      setBlueprintChoice("")
      setTemplateChoice("")
      setSpineView("list")
    }
  }, [activeLeftTab])

  const [selectedProcess, setSelectedProcess] = useState("invoice-processing")
  const [nodes, setNodes] = useState([
    {
      id: "intake-1",
      type: "intake",
      position: { x: 300, y: 200 },
      abilities: selectedProcess === "invoice-processing" ? ["receive_invoice"] : ["Receive Customer Inquiry"],
      isDefault: true,
    },
    {
      id: "complete-1",
      type: "complete",
      position: { x: 800, y: 200 },
      abilities: [],
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
  const [inputSuggestions, setInputSuggestions] = useState<string[]>([])
  const [outputSuggestions, setOutputSuggestions] = useState<string[]>([])
  const [currentInputValue, setCurrentInputValue] = useState("")
  const [currentOutputValue, setCurrentOutputValue] = useState("")

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const abilityPanelRef = useRef<HTMLDivElement | null>(null)

  // Get current process configuration
  const currentConfig = PROCESS_CONFIGS[selectedProcess]
  const STAGE_DEFINITIONS = currentConfig.stages as any
  const AVAILABLE_STAGES = currentConfig.availableStages as string[]
  const OBJECT_STRUCTURE = currentConfig.objectStructure as any

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
        isDefault: true,
      },
      {
        id: "complete-1",
        type: "complete",
        position: { x: 800, y: 200 },
        abilities: [],
        isDefault: true,
      },
    ])

    setConnections([])
    setSelectedStage(null)
    setTestResults([])
    setTestCompleted(false)
    setTestRunSuccessful(false)
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
      setInputSuggestions([])
      setOutputSuggestions([])
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

  const handleAbilityToggle = (nodeId: string, ability: string) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const abilities = node.abilities.includes(ability)
            ? node.abilities.filter((a: string) => a !== ability)
            : [...node.abilities, ability]
          return { ...node, abilities }
        }
        return node
      }),
    )
  }

  // Custom ability functions
  const handleAddCustomAbility = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)!
    setCustomAbilityStage(node.type)
    setCustomAbilityText("")
    setAbilityInputs([])
    setAbilityOutputs([])
    setAbilityInstructions("")
    setCurrentInputValue("")
    setCurrentOutputValue("")
    setInputSuggestions([])
    setOutputSuggestions([])
    setAbilityValidationResult(null)
    setShowCustomAbilityModal(true)
  }

  const handleRecommendationClick = (recommendation: string) => {
    setCustomAbilityText(recommendation)
  }

  const validateAbility = (ability: string, stage: string) => {
    // Simple validation rules
    if (!ability || ability.trim().length < 5) {
      return { valid: false, reason: "Ability must be at least 5 characters long" }
    }

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

      setAbilityValidationResult({
        success: true,
        message: "Successfully created custom ability!",
      })

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowCustomAbilityModal(false)
        setCustomAbilityText("")
        setCustomAbilityStage(null)
      }, 2000)
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
                <label className="block text-sm text-gray-700 mb-1">Start mode</label>
                <Select
                  value={blueprintChoice}
                  onValueChange={(v: "scratch" | "template") => {
                    setBlueprintChoice(v)
                    if (v === "scratch") {
                      setTemplateChoice("")
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
                  <Select value={templateChoice} onValueChange={setTemplateChoice}>
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
                    } else if (blueprintChoice === "template" && templateChoice) {
                      setBlueprintStep("template")
                    }
                  }}
                  disabled={blueprintChoice === "" || (blueprintChoice === "template" && !templateChoice)}
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
              activeLeftTab === "process-blue-print"
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveLeftTab("process-blue-print")}
          >
            <FileText
              className={`w-4 h-4 ${activeLeftTab === "process-blue-print" ? "text-orange-700" : "text-gray-500"}`}
            />
            <span>{"Process Blue Print"}</span>
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
              activeLeftTab === "process-list"
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveLeftTab("process-list")}
          >
            <List className={`w-4 h-4 ${activeLeftTab === "process-list" ? "text-orange-700" : "text-gray-500"}`} />
            <span>Process List</span>
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {spines.map((s) => (
                              <TableRow key={s.id}>
                                <TableCell className="font-medium text-gray-900">{s.name}</TableCell>
                                <TableCell className="text-gray-700">{s.stages}</TableCell>
                                <TableCell className="text-gray-700">{s.abilities}</TableCell>
                                <TableCell className="text-gray-700">{s.lastModified}</TableCell>
                              </TableRow>
                            ))}
                            {spines.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4}>
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
                {/* Existing selector/builder/template flow remains unchanged below */}

                {/* Selection Gate */}
                {blueprintStep === "pick" && renderSelectionGate()}

                {/* Scratch: render builder (process dropdown already removed) */}
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
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800">Process Spine</h1>
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
                      {/* ASF Stages Panel - Left Side (inside builder) */}
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
                                        1 ability
                                      </Badge>
                                    )}
                                    {node.isDefault && node.type === "complete" && (
                                      <Badge variant="outline" className="text-xs border-gray-400 text-gray-600">
                                        Default
                                      </Badge>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            )
                          })}
                        </div>

                        {/* Connection Lines - Fixed SVG positioning */}
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
                            <h4 className="font-semibold mb-3 text-gray-800">Select Abilities</h4>
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                              {STAGE_DEFINITIONS[nodes.find((n) => n.id === selectedStage)?.type]?.abilities.map(
                                (ability: string) => {
                                  const node = nodes.find((n) => n.id === selectedStage)
                                  const isSelected = node?.abilities?.includes(ability)

                                  return (
                                    <div
                                      key={ability}
                                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-300 ${
                                        isSelected ? "bg-orange-100 border-orange-400" : "bg-gray-50 border-gray-200"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAbilityToggle(selectedStage, ability)
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="pointer-events-none"
                                          />
                                          <span className="text-sm font-medium text-gray-700">{ability}</span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleAbilityClick(ability)
                                          }}
                                          className="text-orange-600 hover:text-orange-800"
                                        >
                                          <Settings className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                },
                              )}

                              {/* Add Custom Ability Option */}
                              <div
                                className="p-3 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-400"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddCustomAbility(selectedStage)
                                }}
                              >
                                <div className="flex items-center space-x-2 text-orange-600">
                                  <Plus className="w-4 h-4" />
                                  <span className="text-sm font-medium">Add Custom Ability</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ability Configuration Panel */}
                    {showAbilityConfig && (
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
                                  <p className="text-xs text-gray-500">Inputs are locked to Atlas for this ability.</p>
                                </div>
                              ) : (
                                <div className="relative">
                                  <Input
                                    value={currentInputValue}
                                    onChange={(e) => handleInputChange(e.target.value, false)}
                                    placeholder="Type object name (e.g., invoice)"
                                    className="mb-2"
                                  />
                                  {inputSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                      {inputSuggestions.map((suggestion, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSuggestionClick(suggestion, false)}
                                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                        >
                                          {suggestion}
                                        </button>
                                      ))}
                                    </div>
                                  )}
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
                                  onChange={(e) => handleInputChange(e.target.value, true)}
                                  placeholder="Type object name (e.g., invoice.status)"
                                  className="mb-2"
                                />
                                {outputSuggestions.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                    {outputSuggestions.map((suggestion, index) => (
                                      <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion, true)}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                      >
                                        {suggestion}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
        {activeLeftTab === "process-blue-print" && <BlueprintsView />}
        {activeLeftTab === "process-list" && <ProcessListView />}
      </main>
    </div>
  )
}
