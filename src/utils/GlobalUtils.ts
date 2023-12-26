import { AppFormFieldOptionalParams } from 'src/classes/AppGenericClasses';
import { Globals } from 'src/classes/Globals';
export class GlobalUtils {

  static getOptionalFormFieldParams(obj?: AppFormFieldOptionalParams) {
    return { ...Globals.OPTIONAL_PARAMS.FORM_FIELD, ...obj ?? {} }
  }
}
