export const createImageHash = (min: number, max: number, fileName: string) => {
  const hash = Math.floor(Math.random() * (max - min) + min);
  return `${hash}-${fileName}`;
}