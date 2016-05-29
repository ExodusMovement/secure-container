import crypto from 'crypto'
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

test('aesEncrypt / aesDecrypt', (t) => {
  t.plan(3)

  const key = crypto.randomBytes(32)
  const message = new Buffer('we will attack at midnight!')

  const { blob, authTag, iv } = scCrypto.aesEncrypt(key, message)
  t.true(Buffer.isBuffer(iv), 'iv is a buffer')
  t.true(Buffer.isBuffer(authTag), 'authTag is a buffer')

  const decryptedMessage = scCrypto.aesDecrypt(key, blob, { iv, authTag })

  t.is(decryptedMessage.toString('utf8'), message.toString('utf8'), 'messages are the same')

  t.end()
})

test('boxEncrypt / boxDecrypt', (t) => {
  t.plan(1)

  const passphrase = 'open sesame'
  const message = new Buffer('The secret launch code is 1234.')

  const { authTag, blob, iv, salt } = scCrypto.boxEncrypt(passphrase, message)
  const actualMessage = scCrypto.boxDecrypt(passphrase, blob, { iv, authTag }, { salt })

  t.is(message.toString('utf8'), actualMessage.toString('utf8'), 'messages are the same')

  t.end()
})

test('createScryptParams', (t) => {
  t.plan(1)

  let params = scCrypto.createScryptParams({ n: 16 })
  t.is(params.n, 16, 'var is set')

  t.end()
})
