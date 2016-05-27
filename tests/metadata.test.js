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

test('_stretchPassphrase should return 32 bytes', (t) => {
  t.plan(2)

  const passphrase = 'super secret'
  const salt = Buffer.from('b231f5603df27d48457c1f773e673aff1f43f4001786f458e91cceb45d2837e7', 'hex')

  var scryptParams = { salt, n: 16384, r: 8, p: 1 }

  var expectedKey = Buffer.from('b451dbfb31c7dc5b45238e1a446a6ad7ae16b9a71235678e9a52089c321ec4cf', 'hex')
  var actualKey = metadata._stretchPassphrase(passphrase, scryptParams)
  t.is(actualKey.toString('hex'), expectedKey.toString('hex'), 'keys are the same')
  t.is(actualKey.byteLength, 32, '32 byte key')

  t.end()
})

test('_stretchPassphrase will accept a buffer passphrase', (t) => {
  t.plan(2)

  const passphrase = Buffer.from('super secret', 'utf8')
  const salt = Buffer.from('b231f5603df27d48457c1f773e673aff1f43f4001786f458e91cceb45d2837e7', 'hex')

  var scryptParams = { salt, n: 16384, r: 8, p: 1 }

  var expectedKey = Buffer.from('b451dbfb31c7dc5b45238e1a446a6ad7ae16b9a71235678e9a52089c321ec4cf', 'hex')
  var actualKey = metadata._stretchPassphrase(passphrase, scryptParams)
  t.is(actualKey.toString('hex'), expectedKey.toString('hex'), 'keys are the same')
  t.is(actualKey.byteLength, 32, '32 byte key')

  t.end()
})
