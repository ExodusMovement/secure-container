/* @flow */
import varstruct, { UInt32BE, Buffer as Buf } from 'varstruct'
import { vsf } from './util'

export const struct = varstruct(vsf([
  ['scrypt', [
    ['salt', Buf(32)],
    ['n', UInt32BE],
    ['r', UInt32BE],
    ['p', UInt32BE]
  ]],
  ['blobKey', [
    ['iv', Buf(12)],
    ['authTag', Buf(16)],
    ['key', Buf(32)]
  ]],
  ['blob', [
    ['iv', Buf(12)],
    ['authTag', Buf(16)]
  ]]
]))

export function decode (metadataBlob: Buffer): Object {
  if (metadataBlob.byteLength > 2048) console.warn('metadata greater than 2048 bytes, are you sure this is the SECO metadata?')
  return struct.decode(metadataBlob)
}

export function encode (metadataObject): Buffer {
  return struct.encode(metadataObject)
}

/*
export function create (scryptParams = defaultScryptParams()) : Object {
  return {
    scrypt: scryptParams,
    blobKey: {
      iv: Buffer.alloc(12),
      authTag: Buffer.alloc(16),
      key: Buffer.alloc(32)
    },
    blob: {
      iv: Buffer.alloc(12),
      authTag: Buffer.alloc(16)
    }
  }
}
*/
