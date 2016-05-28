/* @flow */
import varstruct, { Buffer as Buf, VarBuffer, UInt32BE } from 'varstruct'
import { vsf } from './util'

import { HEADER_LEN_BYTES } from './header'
import { METADATA_LEN_BYTES } from './metadata'

export const struct = varstruct(vsf([
  ['header', Buf(HEADER_LEN_BYTES)],
  ['checksum', Buf(32)],
  ['metadata', Buf(METADATA_LEN_BYTES)],
  ['blob', VarBuffer(UInt32BE)]
]))

export function decode (file: Buffer): Object {
  return struct.decode(file)
}

export function encode (file: Object): Buffer {
  return struct.encode(file)
}
