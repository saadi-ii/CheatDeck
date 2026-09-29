/** Returns a new array with the item at `index` swapped with its neighbour (delta -1 = up, 1 = down). */
export function move<T>(items: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;

  const next = items.slice();
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
