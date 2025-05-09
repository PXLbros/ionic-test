export function cloneDeep<T>(value: T): T {
  // Handle null, undefined, primitives
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(cloneDeep) as unknown as T;
  }

  // Handle plain objects
  const clonedObj: any = {};

  const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];

  for (const key in value) {
    if (
      Object.prototype.hasOwnProperty.call(value, key) &&
      !forbiddenKeys.includes(key)
    ) {
      // eslint-disable-next-line security/detect-object-injection
      clonedObj[key] = cloneDeep((value as any)[key]);
    }
  }

  return clonedObj;
}
