export class Utils {
  static deepCopy<T>(source: T): T {
    if (source === null || typeof source !== 'object') {
      return source;
    }

    if (source instanceof Date) {
      return new Date(source.getTime()) as any;
    }

    if (source instanceof Array) {
      const newArray = [];
      for (let i = 0; i < source.length; i++) {
        newArray[i] = this.deepCopy(source[i]);
      }
      return newArray as any;
    }

    if (source instanceof Object) {
      const newObject = {} as T;
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          newObject[key] = this.deepCopy(source[key]);
        }
      }
      return newObject;
    }

    throw new Error('Unable to copy object. Unsupported type.');
  }
}
