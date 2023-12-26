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
  value: any
}

export interface AppFormFieldOptionalParams {
  placeholder?: string
  required?: boolean
  min?: number
  max?: number | null
  maxLength?: number | null
  disabled?: boolean
  readOnly?: boolean
  multiline?: boolean
  htmlClass?: string
}

export class AppFormField implements AppFormFieldOptionalParams {
  key: string
  label: string
  controlType: AppFormFieldType
  dataType: AppFormFieldDataType
  placeholder?: string
  required?: boolean
  min?: number
  max?: number | null
  maxLength?: number | null
  disabled?: boolean
  readOnly?: boolean
  multiline?: boolean
  htmlClass?: string

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
  formLayout: AppFormLayout = new AppFormLayout(this)

  constructor(groups: AppFormGroup[]) {
    this.groups = groups
  }

  getGroup(key: string) {
    return FormUtils.getGroup(this.groups, key)
  }

  getField(key: string) {
    return FormUtils.getField(this.groups, key)
  }

  set layout(layout: AppFormGroupLayout[]) {
    this.formLayout.groups = layout
    this.groups = this.formLayout.buildTemplate()
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
