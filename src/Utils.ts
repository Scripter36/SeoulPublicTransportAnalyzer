export function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export function fileTimeToDate(fileName: string) {
  const splited = fileName.split('_');
  const year = parseInt(splited[1].substring(0, 4), 10);
  const month = parseInt(splited[1].substring(4, 6), 10);
  const day = parseInt(splited[1].substring(6, 8), 10);
  const hours = parseInt(splited[2].substring(0, 2), 10);
  const minutes = parseInt(splited[2].substring(2, 4), 10);
  const seconds = parseInt(splited[2].substring(4, 6), 10);

  return new Date(year, month - 1, day, hours, minutes, seconds);
}
