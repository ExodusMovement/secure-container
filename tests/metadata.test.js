import crypto from 'crypto'
import test from 'tape'
import * as metadata from '../src/metadata'

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

  var b = Buffer.alloc(2048)
  var b2 = metadata.encode(obj)
  b2.copy(b)

  var obj2 = metadata.decode(b)
  t.deepEqual(obj, obj2, 'verify objects are the same')

  t.end()
})

test.skip('_encryptKey / _decryptKey', (t) => {
  t.end()
})
