export function findInList<T>(
  list: T[],
  predicate: (item: T) => boolean,
): T | undefined {
  return list.find(predicate);
}
