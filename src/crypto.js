import crypto from 'crypto'
import scrypt from 'scryptsy'

export function defaultScryptParams () : Object {
  return { salt: crypto.randomBytes(32), n: 16384, r: 8, p: 1 }
}

// always returns 32 byte key
export function stretchPassphrase (passphrase: string | Buffer, { salt, n, r, p } = defaultScryptParams()) : Object {
  const key = scrypt(passphrase, salt, n, r, p, 32)
  return { key, salt }
}

export function aesEncrypt (key, message, iv = crypto.randomBytes(12)) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const blob = Buffer.concat([cipher.update(message), cipher.final()])
  const authTag = cipher.getAuthTag()
  return { authTag, blob, iv }
}

export function aesDecrypt (key, blob, { iv, authTag } = {}) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  const message = Buffer.concat([decipher.update(blob), decipher.final()])
  return message
}
