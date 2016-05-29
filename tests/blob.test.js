import crypto from 'crypto'
import test from 'tape'
import * as metadata from '../src/metadata'
import * as blob from '../src/blob'

test('encrypt / decrypt ', (t) => {
  const blobKey = crypto.randomBytes(32)
  const message = 'we will attack at dawn!'
  let md = metadata.create()

  const { blobKey: newBlobKey, blob: secretBlob } = blob.encrypt(new Buffer(message), md, blobKey)
  t.deepEqual(newBlobKey, blobKey, 'keys are the same')

  const actualMessage = blob.decrypt(secretBlob, md, blobKey)
  t.is(actualMessage.toString('utf8'), message, 'secret messages are the same')

  t.end()
})
