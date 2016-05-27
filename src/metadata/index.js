/* @flow */
import varstruct from 'varstruct'

export const metadata = varstruct([
  { name: 'scrypt', type: varstruct([
    { name: 'salt', type: varstruct.Buffer(32) },
    { name: 'n', type: varstruct.UInt32BE },
    { name: 'r', type: varstruct.UInt32BE },
    { name: 'p', type: varstruct.UInt32BE }
  ]) },
  { name: 'blobKey', type: varstruct([
    { name: 'iv', type: varstruct.Buffer(12) },
    { name: 'authTag', type: varstruct.Buffer(16) },
    { name: 'key', type: varstruct.Buffer(32) }
  ]) },
  { name: 'blob', type: varstruct([
    { name: 'iv', type: varstruct.Buffer(12) },
    { name: 'authTag', type: varstruct.Buffer(16) }
  ])}
])

export function decode (metadataBlob: Buffer): Object {
  return metadata.decode(metadataBlob)
}

export function encode (metadataObject): Buffer {
  return metadata.encode(metadataObject)
}
