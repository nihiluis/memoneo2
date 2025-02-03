export function isValidFilename(str: string) {
    const pattern = /^[a-zA-Z0-9 ]*$/;
    return pattern.test(str);
  }
  