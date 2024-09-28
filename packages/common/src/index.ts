export function mapObject<T, R>(values: Record<string, T>, mapper: (value: T, key: string) => R): R[] {
  return Object.entries(values).map(([key, value]) => mapper(value, key));
}

export function sumNumbers(values: readonly number[]): number {
  return values.reduce((previous, current) => previous + current, 0);
}
