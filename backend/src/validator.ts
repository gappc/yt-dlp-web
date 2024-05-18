export const isUrlValid = (value: string | string[] | undefined) => {
  if (value == null) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every((v) => v.startsWith("https://www.youtube.com/watch?v="));
  }
  return value.startsWith("https://www.youtube.com/watch?v=");
};
