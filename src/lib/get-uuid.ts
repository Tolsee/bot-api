export function getUUID(name: string) {
  const splitArray = name.split('-');
  return splitArray.slice(1).join('-');
}
