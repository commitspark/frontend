// compares two arbitrary variables and returns whether they are fully equal
export function deepEqual(x: any, y: any): boolean {
  const typeOfX = typeof x
  const typeOfY = typeof y
  return x && y && typeOfX === 'object' && typeOfX === typeOfY
    ? Object.keys(x).length === Object.keys(y).length &&
        Object.keys(x).every((key) => deepEqual(x[key], y[key]))
    : x === y
}
