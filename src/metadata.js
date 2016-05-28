/* @flow */
import varstruct, { UInt32BE, Buffer as Buf } from 'varstruct'
import { createScryptParams } from './crypto'
import { vsf } from './util'

export const METADATA_LEN_BYTES = 256

const IV_LEN_BYTES = 12

export const struct = varstruct(vsf([
  ['scrypt', [
    ['salt', Buf(32)],
    ['n', UInt32BE],
    ['r', UInt32BE],
    ['p', UInt32BE]
  ]],
  ['blobKey', [
    ['iv', Buf(IV_LEN_BYTES)],
    ['authTag', Buf(16)],
    ['key', Buf(32)] // JP you were thinking about moving this to end of struct
  ]],
  ['blob', [
    ['iv', Buf(IV_LEN_BYTES)],
    ['authTag', Buf(16)]
  ]]
]))

export function decode (metadataBlob: Buffer): Object {
  if (metadataBlob.byteLength > METADATA_LEN_BYTES) console.warn('metadata greater than `${METADATA_LEN_BYTES}` bytes, are you sure this is the SECO metadata?')
  return struct.decode(metadataBlob)
}

export function encode (metadataObject): Buffer {
  return struct.encode(metadataObject)
}

export function serialize (metadata: Object): Buffer {
  let buf = Buffer.alloc(METADATA_LEN_BYTES)
  encode(metadata).copy(buf)
  return buf
}

export function create (scryptParams = createScryptParams()) : Object {
  return {
    scrypt: scryptParams,
    blobKey: {
      iv: Buffer.alloc(IV_LEN_BYTES),
      authTag: Buffer.alloc(16),
      key: Buffer.alloc(32)
    },
    blob: {
      iv: Buffer.alloc(IV_LEN_BYTES),
      authTag: Buffer.alloc(16)
    }
  }
}
