"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight, X, Settings, Play, Database, FileText, Save } from "lucide-react"

// Object definitions with initial states
const AVAILABLE_OBJECTS = {
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

interface EnhancedAbilityConfigProps {
  selectedAbility: string
  abilityInstructions: string
  onClose: () => void
  onInstructionsChange: (instructions: string) => void
}

export function EnhancedAbilityConfig({
  selectedAbility,
  abilityInstructions,
  onClose,
  onInstructionsChange,
}: EnhancedAbilityConfigProps) {
  const [objectStates] = useState(AVAILABLE_OBJECTS)
  const [expandedObjects, setExpandedObjects] = useState<Record<string, boolean>>({})
  const [availableObjectsExpanded, setAvailableObjectsExpanded] = useState(true)
  const [sampleData, setSampleData] = useState<any>(null)
  const [isGeneratingSample, setIsGeneratingSample] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Generate sample data based on instruction content
  const generateSampleData = async () => {
    setIsGeneratingSample(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let sample: any = {}

    if (abilityInstructions.toLowerCase().includes("matching")) {
      sample = {
        matching_result: {
          overall_match: true,
          vendor_match: true,
          amount_match: true,
          discrepancies: [],
          confidence_score: 0.95,
        },
      }
    } else if (abilityInstructions.toLowerCase().includes("tolerance")) {
      sample = {
        tolerance_check: {
          within_tolerance: true,
          price_variance: 2.5,
          quantity_variance: 0,
          acceptable: true,
        },
      }
    } else if (abilityInstructions.toLowerCase().includes("validation")) {
      sample = {
        validation_result: {
          is_valid: true,
          errors: [],
          warnings: ["Minor formatting issue"],
          status: "passed",
        },
      }
    } else {
      sample = {
        processing_result: {
          status: "completed",
          timestamp: "2024-01-15T10:30:00Z",
          data: "Processed successfully",
        },
      }
    }

    setSampleData(sample)
    setTestCompleted(true)
    setIsGeneratingSample(false)
  }

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const toggleObjectExpansion = (objectName: string) => {
    setExpandedObjects((prev) => ({
      ...prev,
      [objectName]: !prev[objectName],
    }))
  }

  const insertObjectReference = (objectName: string) => {
    const textarea = document.getElementById("instructions-textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const beforeCursor = abilityInstructions.substring(0, start)
      const afterCursor = abilityInstructions.substring(end)
      const newInstructions = beforeCursor + `$${objectName}` + afterCursor
      onInstructionsChange(newInstructions)

      // Set cursor position after the inserted text
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + objectName.length + 1, start + objectName.length + 1)
      }, 0)
    }
  }

  const renderSampleDataFields = (data: any, parentPath = "", level = 0) => {
    return Object.entries(data).map(([key, value]) => {
      const fieldPath = parentPath ? `${parentPath}.${key}` : key
      const fullPath = `Invoice_new.${fieldPath}`

      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
        return (
          <div key={key} className={`ml-${level * 4}`}>
            <div className="text-sm font-medium text-gray-700 mb-1">{key}[]:</div>
            <div className="ml-4 border-l-2 border-gray-200 pl-3">
              {renderSampleDataFields(value[0], `${fieldPath}[0]`, level + 1)}
            </div>
          </div>
        )
      } else if (typeof value === "object" && value !== null) {
        return (
          <div key={key} className={`ml-${level * 4}`}>
            <div className="text-sm font-medium text-gray-700 mb-1">{key}:</div>
            <div className="ml-4 border-l-2 border-gray-200 pl-3">
              {renderSampleDataFields(value, fieldPath, level + 1)}
            </div>
          </div>
        )
      } else {
        return (
          <div
            key={key}
            className={`ml-${level * 4} flex items-center justify-between py-1 hover:bg-gray-50 rounded px-2 cursor-pointer group`}
            onClick={() => insertObjectReference(fullPath)}
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
                insertObjectReference(fullPath)
              }}
            >
              Insert
            </Button>
          </div>
        )
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-[500px] shadow-xl overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {selectedAbility}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Available Objects Section */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => setAvailableObjectsExpanded(!availableObjectsExpanded)}
            >
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Available Objects
              </h4>
              {availableObjectsExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </div>

            {availableObjectsExpanded && (
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {Object.entries(objectStates).map(([objectName, state]) => (
                      <div key={objectName} className="border rounded-lg p-3 bg-gray-50">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleObjectExpansion(objectName)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{objectName}</span>
                            <Badge
                              variant={state.isEmpty ? "outline" : "secondary"}
                              className={`text-xs ${
                                state.isEmpty ? "border-gray-300 text-gray-600" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {state.isEmpty ? "(0)" : `(${state.fieldCount})`}
                            </Badge>
                            {state.isPopulated && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                populated
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                insertObjectReference(objectName)
                              }}
                              className="text-orange-600 hover:text-orange-800"
                              title="Insert object reference"
                            >
                              Insert
                            </Button>
                            {objectName === "Invoice_new" &&
                              state.sampleData &&
                              (expandedObjects[objectName] ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              ))}
                          </div>
                        </div>

                        {expandedObjects[objectName] && objectName === "Invoice_new" && state.sampleData && (
                          <div className="mt-3 pl-4 space-y-2 max-h-60 overflow-y-auto">
                            <div className="text-xs text-gray-500 mb-2">
                              Click any field to insert into instructions:
                            </div>
                            {renderSampleDataFields(state.sampleData)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Instructions Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Instructions
            </h4>
            <div className="space-y-3">
              <Textarea
                id="instructions-textarea"
                value={abilityInstructions}
                onChange={(e) => onInstructionsChange(e.target.value)}
                placeholder="Enter instructions for this ability... Use $ObjectName to reference objects from the Available Objects list."
                className="min-h-40 font-mono text-sm"
              />
            </div>
          </div>

          {/* Generate Sample Data Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800">Generate Sample Data</h4>
              <Button
                onClick={generateSampleData}
                disabled={isGeneratingSample || !abilityInstructions.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                {isGeneratingSample ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test
                  </>
                )}
              </Button>
            </div>

            {sampleData && (
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto border font-mono">
                    {JSON.stringify(sampleData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {!sampleData && abilityInstructions.trim() && (
              <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
                Click "Test" to generate sample data based on your instructions
              </div>
            )}
          </div>
        </div>

        {/* Fixed Save Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={handleSave}
            disabled={!testCompleted || isSaved}
            className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            {isSaved ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Ability
              </>
            )}
          </Button>
          {!testCompleted && (
            <p className="text-xs text-gray-500 text-center mt-2">Click "Test" to enable save functionality</p>
          )}
        </div>
      </div>
    </div>
  )
}
