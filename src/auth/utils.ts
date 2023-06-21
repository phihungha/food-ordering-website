export function calcSessionExpireSeconds(hours: number) {
  return 1000 * 60 * 60 * hours;
}
