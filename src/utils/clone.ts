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
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clonedObj[key] = cloneDeep((value as any)[key]);
    }
  }
  return clonedObj;
}
