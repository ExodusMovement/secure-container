/* flow */
import randomBytes from 'randombytes'
import * as conBlob from './blob'
import * as conHeader from './header'
import * as conMetadata from './metadata'
import * as conFile from './file'

type BufOrStr = Buffer | string

// options: passphrase, blobKey, metdata
export function encrypt (data: BufOrStr, options = {}) {
  if (!options.header) console.warn('seco: should pass options.header.')
  let header = conHeader.create(options.header)

  let blobKey
  let metadata
  if (options.passphrase) {
    blobKey = randomBytes(32)
    metadata = conMetadata.create()
    conMetadata.encryptBlobKey(metadata, options.passphrase, blobKey)
  } else if (options.metadata && options.blobKey) {
    blobKey = options.blobKey
    metadata = options.metadata
  } else {
    throw new Error('Must set either passphrase or (metadata and blobKey)')
  }

  data = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
  let { blob: encBlob } = conBlob.encrypt(data, metadata, blobKey)

  const headerBuf = conHeader.serialize(header)
  const mdBuf = conMetadata.serialize(metadata)

  let fileObj = {
    header: headerBuf,
    checksum: conFile.computeChecksum(mdBuf, encBlob),
    metadata: mdBuf,
    blob: encBlob
  }
  const encryptedData = conFile.encode(fileObj)

  return { encryptedData, blobKey, metadata }
}

export function decrypt (encryptedData: Buffer, passphrase: BufOrStr) {
  const fileObj = conFile.decode(encryptedData)

  const checksum = conFile.computeChecksum(fileObj.metadata, fileObj.blob)
  if (!fileObj.checksum.equals(checksum)) throw new Error('seco checksum does not match; data may be corrupted')

  let metadata = conMetadata.decode(fileObj.metadata)
  let blobKey = conMetadata.decryptBlobKey(metadata, passphrase)
  let header = conHeader.decode(fileObj.header)
  let data = conBlob.decrypt(fileObj.blob, metadata, blobKey)

  return { data, blobKey, metadata, header }
}
