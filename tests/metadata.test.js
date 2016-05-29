import crypto from 'crypto'
import test from 'tape'
import * as metadata from '../src/metadata'
import { IV_LEN_BYTES } from '../src/crypto'

test('encode / decode metadata', (t) => {
  t.plan(1)

  var obj = {
    scrypt: {
      salt: crypto.randomBytes(32),
      n: 16384,
      r: 8,
      p: 1
    },
    cipher: 'aes-256-gcm',
    blobKey: {
      iv: crypto.randomBytes(IV_LEN_BYTES),
      authTag: Buffer.alloc(16),
      key: Buffer.alloc(32)
    },
    blob: {
      iv: crypto.randomBytes(IV_LEN_BYTES),
      authTag: Buffer.alloc(16)
    }
  }

  var obj2 = metadata.decode(metadata.encode(obj))
  t.deepEqual(obj2, obj, 'verify objects are the same')

  t.end()
})
