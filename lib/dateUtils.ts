const EASTERN = 'America/New_York';

/** Current date in Eastern time as YYYY-MM-DD */
export function getTodayDateStrEastern(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: EASTERN });
}

/** Yesterday's date in Eastern time as YYYY-MM-DD */
export function getYesterdayDateStrEastern(): string {
  const today = getTodayDateStrEastern();
  const [y, m, d] = today.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
