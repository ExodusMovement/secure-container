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
