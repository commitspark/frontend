const fileKeys = ['lastModified', 'name', 'size', 'type']

// compares two arbitrary variables and returns whether they are fully equal
export function deepEqual(x: any, y: any): boolean {
  // fast path for referential equality and primitives
  if (x === y) {
    return true
  }

  // handle null/undefined mismatches quickly
  if (x == null || y == null) {
    return x === y
  }

  const typeOfX = typeof x
  const typeOfY = typeof y

  // Arrays: compare length and each element in order
  if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) {
      return false
    }
    for (let i = 0; i < x.length; i++) {
      if (!deepEqual(x[i], y[i])) {
        return false
      }
    }
    return true
  }

  // Files: compare known immutable keys
  if (x instanceof File && y instanceof File) {
    return fileKeys.every((key) => (x as any)[key] === (y as any)[key])
  }

  if (x && y && typeOfX === 'object' && typeOfX === typeOfY) {
    const keysX = Object.keys(x)
    const keysY = Object.keys(y)
    if (keysX.length !== keysY.length) return false
    // All keys in x must be in y and values equal
    for (let i = 0; i < keysX.length; i++) {
      const key = keysX[i]
      if (!Object.prototype.hasOwnProperty.call(y, key)) {
        return false
      }
      if (!deepEqual((x as any)[key], (y as any)[key])) {
        return false
      }
    }
    return true
  }

  return false
}
