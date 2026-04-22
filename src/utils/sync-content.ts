const TEXT_FILE_EXTENSIONS = new Set([
  ".canvas",
  ".csv",
  ".json",
  ".markdown",
  ".md",
  ".txt",
  ".yaml",
  ".yml",
]);

export const isTextSyncPath = (path: string): boolean => {
  const lower = path.toLowerCase();
  for (const extension of TEXT_FILE_EXTENSIONS) {
    if (lower.endsWith(extension)) {
      return true;
    }
  }
  return false;
};

const toUint8Array = (value: Uint8Array | ArrayBuffer): Uint8Array => {
  return value instanceof Uint8Array ? value : new Uint8Array(value);
};

export const decodeUtf8 = (bytes: Uint8Array | ArrayBuffer): string => {
  return new TextDecoder("utf-8", { fatal: false }).decode(toUint8Array(bytes));
};

export const encodeUtf8 = (value: string): Uint8Array => {
  return new TextEncoder().encode(value);
};

export const decodeBase64Utf8 = (contentBase64: string): string => {
  return decodeUtf8(Buffer.from(contentBase64, "base64"));
};

export const buildMergedConflictText = (
  path: string,
  localText: string,
  remoteText: string
): string => {
  if (localText === remoteText) {
    return localText;
  }

  if (localText.includes(remoteText)) {
    return localText;
  }

  if (remoteText.includes(localText)) {
    return remoteText;
  }

  const localLines = localText.split("\n");
  const remoteLines = remoteText.split("\n");
  let prefixLength = 0;

  while (
    prefixLength < localLines.length &&
    prefixLength < remoteLines.length &&
    localLines[prefixLength] === remoteLines[prefixLength]
  ) {
    prefixLength += 1;
  }

  let suffixLength = 0;
  while (
    suffixLength < localLines.length - prefixLength &&
    suffixLength < remoteLines.length - prefixLength &&
    localLines[localLines.length - 1 - suffixLength] ===
      remoteLines[remoteLines.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }

  const prefix = localLines.slice(0, prefixLength);
  const suffix =
    suffixLength > 0 ? localLines.slice(localLines.length - suffixLength) : [];
  const localMiddle = localLines.slice(prefixLength, localLines.length - suffixLength);
  const remoteMiddle = remoteLines.slice(prefixLength, remoteLines.length - suffixLength);

  return [
    `<!-- Sync conflict artifact for ${path} -->`,
    ...prefix,
    "<<<<<<< LOCAL",
    ...localMiddle,
    "=======",
    ...remoteMiddle,
    ">>>>>>> REMOTE",
    ...suffix,
    "",
  ].join("\n");
};
