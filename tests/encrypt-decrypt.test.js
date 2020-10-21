import test from 'tape'
import fs from 'fs'
import { encrypt, decrypt } from '../src'

test('encrypt / decrypt', (t) => {
  let secretMessage = Buffer.from('Hello, lets meet at 10 PM to plan our secret mission!', 'utf8')
  const passphrase = Buffer.from('opensesame', 'utf8')

  const { encryptedData } = encrypt(secretMessage, { passphrase })

  const { data } = decrypt(encryptedData, passphrase)

  t.is(data.toString('utf8'), secretMessage.toString('utf8'), 'verify content is the same')

  t.end()
})

test('encrypt / decrypt (with blobkey)', (t) => {
  let secretMessage = Buffer.from('Hello, lets meet at 10 PM to plan our secret mission!', 'utf8')
  const passphrase = Buffer.from('opensesame', 'utf8')

  const { metadata, blobKey } = encrypt(secretMessage, { passphrase })

  const { encryptedData } = encrypt(secretMessage, { metadata, blobKey })

  const { data } = decrypt(encryptedData, passphrase)

  t.is(data.toString('utf8'), secretMessage.toString('utf8'), 'verify content is the same')

  t.end()
})

test('decrypt returns valid blobKey and metadata', (t) => {
  let secretMessage = Buffer.from('Hello, lets meet at 10 PM to plan our secret mission!', 'utf8')
  let secretMessage2 = Buffer.from('Hello, lets meet at 10 AM to plan our secret mission!', 'utf8')
  const passphrase = Buffer.from('opensesame', 'utf8')

  const { encryptedData } = encrypt(secretMessage, { passphrase })

  const { data, metadata, blobKey } = decrypt(encryptedData, passphrase)
  t.is(data.toString('utf8'), secretMessage.toString('utf8'), 'verify content is the same')

  const { encryptedData: encryptedData2 } = encrypt(secretMessage2, { metadata, blobKey })

  const { data: data2 } = decrypt(encryptedData2, passphrase)
  t.is(data2.toString('utf8'), secretMessage2.toString('utf8'), 'verify content is the same')

  t.end()
})

test('decrypt verifies checksum', (t) => {
  const testFile = 'tests/fixtures/corrupted.seco'
  const buf = fs.readFileSync(testFile)

  try {
    decrypt(buf, 'opensesame')
  } catch (err) {
    t.assert(err)
    t.ok(err.message.match(/seco checksum does not match; data may be corrupted/))
    t.end()
  }
})

test('decrypt returns header', (t) => {
  let secretMessage = Buffer.from('Hi, lets meet at 10 PM to plan our secret mission!', 'utf8')
  const passphrase = Buffer.from('opensesame')
  const header = {
    appName: 'test',
    appVersion: '1.0.0'
  }

  const { encryptedData } = encrypt(secretMessage, { passphrase, header })

  const result = decrypt(encryptedData, passphrase)

  t.is(result.header.appName, header.appName, 'appName is returned')
  t.is(result.header.appVersion, header.appVersion, 'appVersion is returned')

  t.end()
})
