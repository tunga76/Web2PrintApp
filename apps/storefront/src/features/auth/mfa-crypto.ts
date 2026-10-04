import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { getMfaEncryptionKey } from '@/lib/env';

const nonceLength = 12;
const tagLength = 16;

export function encryptMfaSecret(secret: string) {
  const nonce = randomBytes(nonceLength);
  const cipher = createCipheriv('aes-256-gcm', getMfaEncryptionKey(), nonce);
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), ciphertext]);
}

export function decryptMfaSecret(encrypted: Uint8Array) {
  const value = Buffer.from(encrypted);
  if (value.length <= nonceLength + tagLength) throw new Error('Encrypted MFA secret is truncated.');
  const nonce = value.subarray(0, nonceLength);
  const tag = value.subarray(nonceLength, nonceLength + tagLength);
  const ciphertext = value.subarray(nonceLength + tagLength);
  const decipher = createDecipheriv('aes-256-gcm', getMfaEncryptionKey(), nonce);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
