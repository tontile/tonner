import { randomBytes } from "node:crypto";

export const secureToken = (...options: number[]): string => {
  let length = 16;
  if (options.length > 0) {
    length = options[0]!;
  }
  const buffer = randomBytes(length);
  let token = buffer.toString("base64");
  token = token.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return token;
};
