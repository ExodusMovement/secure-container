/* @flow */
// import assert from 'assert'
import varstruct, {
  Bound,
  UInt8,
  UInt32BE,
  VarBuffer,
  VarString
} from 'varstruct'
import { vsf } from './util'

export const MAGIC = Buffer.from('SECO', 'utf8')

export function checkMagic (magic) {
  if (!magic.equals(MAGIC)) throw new RangeError('Invalid secure container magic.')
}

export const struct = varstruct(vsf([
  ['magic', Bound(varstruct.Buffer(4), checkMagic)],
  ['version', UInt32BE], // should be all 0's for now
  ['reserved', UInt32BE], // should be all 0's for now
  ['versionTag', VarString(UInt8)],
  ['appName', VarString(UInt8, 'utf-8')],
  ['appVersion', VarString(UInt8, 'utf-8')],
  ['metadata', VarBuffer(UInt32BE)],
  ['blob', VarBuffer(UInt32BE)]
]))

export function decode (headerBlob: Buffer): Object {
  // if (headerBlob.byteLength > 512) console.warn('header greater than 512 bytes, are you sure this is the header?')
  return struct.decode(headerBlob)
}

export function encode (headerObject): Buffer {
  return struct.encode(headerObject)
}
