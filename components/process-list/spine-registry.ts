export interface SpineOption {
  id: string
  name: string
  objects: string[]
}

export const SPINE_OPTIONS: SpineOption[] = [
  {
    id: "invoice-2way",
    name: "Invoice processing 2-way spine",
    // Including these objects per the example mapping
    objects: ["invoice", "purchase_order", "goods_receipt", "review_response"],
  },
  {
    id: "invoice-3way",
    name: "Invoice processing 3-way spine",
    objects: ["invoice", "purchase_order", "goods_receipt", "review_response"],
  },
  {
    id: "cs-baseline",
    name: "Customer support baseline spine",
    objects: ["customer_inquiry", "support_ticket", "response_message", "review_response"],
  },
]

export const CONNECTOR_OPTIONS = ["S3", "Email", "API", "ERP", "MS-365", "Slack", "Database", "Webhook"]

export function getObjectsForSpine(spineId: string): string[] {
  return SPINE_OPTIONS.find((s) => s.id === spineId)?.objects || []
}

export function getSpineName(spineId: string): string {
  return SPINE_OPTIONS.find((s) => s.id === spineId)?.name || spineId
}
