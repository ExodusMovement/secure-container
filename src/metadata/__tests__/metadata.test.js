import crypto from 'crypto'
import test from 'tape'
import * as metadata from '../'

test('encode / decode metadata', (t) => {
  t.plan(1)

  var obj = {
    scrypt: {
      salt: crypto.randomBytes(32),
      n: 16384,
      r: 8,
      p: 1
    },
    blobKey: {
      iv: crypto.randomBytes(12),
      authTag: Buffer.alloc(16),
      key: Buffer.alloc(32)
    },
    blob: {
      iv: crypto.randomBytes(12),
      authTag: Buffer.alloc(16)
    }
  }

  var obj2 = metadata.decode(metadata.encode(obj))
  t.deepEqual(obj, obj2, 'verify objects are the same')

  t.end()
})
