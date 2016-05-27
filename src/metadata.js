/* @flow */
import varstruct, { UInt32BE, Buffer as Buf } from 'varstruct'
import { vsf } from './util'

export const metadata = varstruct(vsf([
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
  return metadata.decode(metadataBlob)
}

export function encode (metadataObject): Buffer {
  return metadata.encode(metadataObject)
}

export function create (passphrase, scryptParams = { n: 16834, r: 8, p: 1 }) : Object {
  return {}
}
