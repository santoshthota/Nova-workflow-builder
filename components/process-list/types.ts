export type JobStatus = "Running" | "Paused"

export interface ObjectMapping {
  objectName: string
  connector: string
}

export interface JobItem {
  id: string
  name: string
  spine: string
  status: JobStatus
  lastModified: string // YYYY-MM-DD
  objectMappings: ObjectMapping[]
}
