import { AppFormFieldOptionalParams } from "./AppGenericClasses"

interface GlobalsModel {
  OPTIONAL_PARAMS: {
    FORM_FIELD: AppFormFieldOptionalParams
  }
}

export const Globals: GlobalsModel = Object.freeze({
  OPTIONAL_PARAMS: {
    FORM_FIELD: {
      value: null,
      placeholder: '',
      required: false,
      min: 0,
      max: undefined,
      maxLength: 10000000,
      htmlClass: '',
      disabled: false,
      readOnly: false,
      multiline: false,
      helpText: 'Generic help text.'
    }
  }
})
