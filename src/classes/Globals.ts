import { AppFormFieldOptionalParams } from "./AppGenericClasses"

interface GlobalsModel {
  OPTIONAL_PARAMS: {
    FORM_FIELD: AppFormFieldOptionalParams
  }
}

export const Globals: GlobalsModel = Object.freeze({
  OPTIONAL_PARAMS: {
    FORM_FIELD: {
      placeholder: '',
      required: false,
      min: 0,
      max: null,
      maxLength: 0,
      htmlClass: '',
      disabled: false,
      readOnly: false,
      multiline: false
    }
  }
})
