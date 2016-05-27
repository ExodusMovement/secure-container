import test from 'tape'
import * as scCrypto from '../src/crypto'

test('stretchPassphrase should return 32 bytes', (t) => {
  t.plan(3)

  const passphrase = 'super secret'
  const inputSalt = Buffer.from('b231f5603df27d48457c1f773e673aff1f43f4001786f458e91cceb45d2837e7', 'hex')

  var scryptParams = { salt: inputSalt, n: 16384, r: 8, p: 1 }

  var expectedKey = Buffer.from('b451dbfb31c7dc5b45238e1a446a6ad7ae16b9a71235678e9a52089c321ec4cf', 'hex')
  var { key, salt } = scCrypto.stretchPassphrase(passphrase, scryptParams)

  t.is(key.toString('hex'), expectedKey.toString('hex'), 'keys are the same')
  t.is(key.byteLength, 32, '32 byte key')
  t.is(salt.toString('hex'), inputSalt.toString('hex'), 'salts are the same')

  t.end()
})

test('stretchPassphrase will accept a buffer passphrase', (t) => {
  t.plan(2)

  const passphrase = Buffer.from('super secret', 'utf8')
  const salt = Buffer.from('b231f5603df27d48457c1f773e673aff1f43f4001786f458e91cceb45d2837e7', 'hex')

  var scryptParams = { salt, n: 16384, r: 8, p: 1 }

  var expectedKey = Buffer.from('b451dbfb31c7dc5b45238e1a446a6ad7ae16b9a71235678e9a52089c321ec4cf', 'hex')
  var { key } = scCrypto.stretchPassphrase(passphrase, scryptParams)
  t.is(key.toString('hex'), expectedKey.toString('hex'), 'keys are the same')
  t.is(key.byteLength, 32, '32 byte key')

  t.end()
})
