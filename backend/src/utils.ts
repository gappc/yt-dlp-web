import { FileInfo } from "./types";

export const isUrlValid = (value: string | string[] | undefined) => {
  if (value == null) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every((v) => v.startsWith("https://www.youtube.com/watch?v="));
  }
  return value.startsWith("https://www.youtube.com/watch?v=");
};

export const buildFileInfo = (
  relativePath: string,
  audioOnly: boolean
): FileInfo => {
  // Get filename
  const lastSlashIndex = relativePath.lastIndexOf("/");
  if (lastSlashIndex === -1) {
    throw new Error("Invalid filename");
  }
  const inputFilename = relativePath.substring(lastSlashIndex + 1);
  console.log("inputFilename", inputFilename);

  // Get path to file
  const pathToFile = relativePath.substring(0, lastSlashIndex);

  // Get file extension
  const lastDotIndex = inputFilename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    throw new Error("Invalid filename");
  }
  const extension = audioOnly
    ? "mp3"
    : inputFilename.substring(lastDotIndex + 1);

  // Get filename without extension
  const nameWithoutExtension = inputFilename.substring(0, lastDotIndex);

  // Build filename
  const filename = `${nameWithoutExtension}.${extension}`;

  // Build location
  const location = `${pathToFile}/${filename}`;

  return { location, filename, extension };
};
