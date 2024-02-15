export function assertIsString(data: unknown): asserts data is string {
  if (!data || typeof data !== 'string') {
    throw new Error('Expected string')
  }
}

export function assertIsStringOrNull(
  data: unknown,
): asserts data is string | null {
  if (data !== null && typeof data !== 'string') {
    throw new Error('Expected string or null')
  }
}

export function assertIsNumberOrNull(
  data: unknown,
): asserts data is number | null {
  if (data !== null && typeof data !== 'number') {
    throw new Error('Expected number or null')
  }
}

export function assertIsRecordOrNull(
  data: unknown,
): asserts data is Record<string, unknown> | null {
  if (data !== null && typeof data !== 'object') {
    throw new Error('Expected object or null')
  }
}

export function assertIsArrayOrNull(
  data: unknown,
): asserts data is unknown[] | null {
  if (data !== null && !Array.isArray(data)) {
    throw new Error('Expected array or null')
  }
}

export function assertIsBooleanOrNull(
  data: unknown,
): asserts data is boolean | null {
  if (data !== null && data !== true && data !== false) {
    throw new Error('Expected boolean or null')
  }
}

export function assertIsFloatOrNull(
  data: unknown,
): asserts data is number | null {
  if (
    data !== null &&
    ((typeof data === 'string' && isNaN(parseFloat(data))) ||
      typeof data !== 'number')
  ) {
    throw new Error('Expected float string, number or null')
  }
}

export function assertIsArrayOfRecordsOrNull(
  data: unknown,
): asserts data is Record<string, unknown>[] | null {
  assertIsArrayOrNull(data)
  if (!data) {
    return
  }
  for (const item of data) {
    assertIsRecordOrNull(item)
  }
}
