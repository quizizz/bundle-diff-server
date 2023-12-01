import * as crypto from 'crypto';

// eslint-disable-next-line require-jsdoc
export function calculateSHA256(data: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}
