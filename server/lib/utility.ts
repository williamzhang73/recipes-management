export function compareDate(due: Date, now: Date): boolean {
  if (due > now) return true;
  return false;
}
