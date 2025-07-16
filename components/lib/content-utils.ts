const fileKeys = ['lastModified', 'name', 'size', 'type']

// compares two arbitrary variables and returns whether they are fully equal
export function deepEqual(x: any, y: any): boolean {
  const typeOfX = typeof x
  const typeOfY = typeof y
  if (x && y && typeOfX === 'object' && typeOfX === typeOfY) {
    const keysX = x instanceof File ? fileKeys : Object.keys(x)
    const keysY = x instanceof File ? fileKeys : Object.keys(y)

    return (
      keysX.length === keysY.length &&
      keysX.every((key) => deepEqual(x[key], y[key]))
    )
  }

  return x === y
}
