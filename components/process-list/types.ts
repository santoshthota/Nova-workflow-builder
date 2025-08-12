export type ProcessStatus = "Running" | "Paused"

export interface ObjectMapping {
  objectName: string
  connector: string
}

export interface ProcessItem {
  id: string
  name: string
  spine: string
  status: ProcessStatus
  lastModified: string // YYYY-MM-DD
  objectMappings: ObjectMapping[]
}
