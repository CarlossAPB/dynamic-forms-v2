import { CdkDropList } from "@angular/cdk/drag-drop"
import { FormUtils } from "src/utils/FormUtils"
import { GlobalUtils } from "src/utils/GlobalUtils"

export type AppFormFieldDataType = 'TEXT' | 'NUMBER'

export enum AppFormFieldType {
  TEXT_FIELD = 'text',
  NUMBER = 'number',
  EMAIL = 'email'
}

export interface AppGenericSelectableOption {
  label: string,
  value: any,
  type?: string
}

export interface AppFormFieldOptionalParams {
  value?: any
  placeholder?: string
  required?: boolean
  min?: number
  max?: number | undefined
  maxLength?: number
  disabled?: boolean
  readOnly?: boolean
  multiline?: boolean
  htmlClass?: string
  helpText?: string
}

export class AppFormField implements AppFormFieldOptionalParams {
  key: string
  label: string
  controlType: AppFormFieldType
  dataType: AppFormFieldDataType
  value!: any
  required!: boolean
  disabled!: boolean
  readOnly!: boolean
  placeholder?: string
  min?: number
  max!: number | undefined
  maxLength?: number
  multiline?: boolean
  htmlClass?: string
  helpText?: string

  constructor(key: string, label: string, controlType: AppFormFieldType, dataType: AppFormFieldDataType, optionalParams?: AppFormFieldOptionalParams) {
    this.key = key
    this.label = label
    this.controlType = controlType
    this.dataType = dataType
    Object.assign(this, GlobalUtils.getOptionalFormFieldParams(optionalParams))
  }
}

export class AppFormColumn {
  field: AppFormField

  constructor(field: AppFormField) {
    this.field = field
  }
}

export class AppFormRow {
  cols: AppFormColumn[] = []
}

export class AppFormGrid {
  rows: AppFormRow[] = []
}

export class AppFormGroup {
  key: string = ''
  title?: string = ''
  grid: AppFormGrid = new AppFormGrid()
}

export class AppFormTemplate {
  groups: AppFormGroup[]

  constructor(groups: AppFormGroup[]) {
    this.groups = groups
  }

  getGroup(key: string) {
    return FormUtils.getGroup(this.groups, key)
  }

  getField(key: string) {
    return FormUtils.getField(this.groups, key)
  }
}

export class AppFormGroupLayout {
  key: string
  gridLayout: string[][]

  constructor(key: string, gridLayout: string[][]) {
    this.key = key
    this.gridLayout = gridLayout
  }
}

export class AppFormLayout {
  groups_: AppFormGroupLayout[] = []
  formTemplate: AppFormTemplate

  constructor(formTemplate: AppFormTemplate) {
    this.formTemplate = formTemplate
  }

  set groups(groups: AppFormGroupLayout[]) {
    this.groups_ = groups
  }

  get groups() {
    return this.groups_
  }

  buildTemplate(): AppFormGroup[] {
    const groups = this.groups.map(group => {
      const layoutGroup = JSON.parse(JSON.stringify(this.formTemplate.getGroup(group.key)))
      if (layoutGroup) {
        layoutGroup.grid.rows = group.gridLayout.map(row => {
          return {
            cols: row.map(colKey => {
              return {
                field: this.formTemplate.getField(colKey)
              }
            }) as AppFormColumn[]
          }
        }) as AppFormRow[]
      }
      return layoutGroup
    }) as AppFormGroup[]
    return groups
  }
}

export class DragDropAction {
  previousContainer!: CdkDropList<any[]>
  previousIndex: number = 0
  currentContainer!: CdkDropList<any[]>
  currentIndex: number = 0

  constructor(
    previousContainer: CdkDropList<any[]>,
    previousIndex: number,
    currentContainer: CdkDropList<any[]>,
    currentIndex: number
  ) {
    this.previousContainer = previousContainer
    this.previousIndex = previousIndex
    this.currentContainer = currentContainer
    this.currentIndex = currentIndex
  }
}

export type ArrayActionType = 'INSERT' | 'DELETE'

export class ArrayAction {
  item: any
  container: any[]
  idx: number
  type: ArrayActionType

  constructor(item: any, container: any[], idx: number, type: ArrayActionType) {
    this.item = item
    this.container = container
    this.idx = idx
    this.type = type
  }
}

export class ObjectAction<T> {
  previous: T
  current: T

  constructor(previous: T, current: T) {
    this.previous = previous
    this.current = current
  }
}

export class FormGroupAction extends ObjectAction<AppFormGroup> { }
export class FormFieldAction extends ObjectAction<AppFormField> { }

export class ActionHistory<T> {
  undoActions: T[] = []
  redoActions: T[] = []
}

export type DynamicFormAction = DragDropAction | ArrayAction | FormGroupAction | FormFieldAction
export type DynamicFormActionHistory = ActionHistory<DynamicFormAction>

