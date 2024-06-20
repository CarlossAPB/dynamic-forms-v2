import { AppFormField, AppFormGroup } from "src/classes/AppGenericClasses";

export class FormUtils {
  static getGroup(groups: AppFormGroup[], key: string): AppFormGroup | undefined {
    return groups.find(group => group.key === key)
  }

  static getFields(groups: AppFormGroup[]): AppFormField[] {
    const fields: AppFormField[] = []
    groups.forEach(group => {
      group.grid.rows.forEach(row => {
        row.cols.forEach(col => {
          fields.push(col.field)
        })
      })
    })
    return fields
  }

  static getField(groups: AppFormGroup[], key: string): AppFormField | undefined {
    return this.getFields(groups).find(field => field.key === key)
  }
}
