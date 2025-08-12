import type { ObjectKey } from "./object-schema"

export type StageName = "Intake" | "Understand" | "Prepare" | "Decide" | "Review" | "Create" | "Do" | "Complete"

export interface Ability {
  id: string
  name: string
  inputs: string[]
  instructions: string
  outputs: string[]
}

export interface BlueprintStage {
  id: string
  name: StageName
  abilities: Ability[]
  expanded?: boolean
}

export interface ProcessBlueprint {
  id: string
  name: string
  description?: string
  objects: ObjectKey[]
  stages: BlueprintStage[]
}
