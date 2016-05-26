/* @flow */
import varstruct from 'varstruct'

export const MAGIC = Buffer.from('SECO', 'utf8')

export function checkMagic (magic) {
  if (!magic.equals(MAGIC)) throw new RangeError('Invalid secure container magic.')
}

export const container = varstruct([
  { name: 'magic', type: varstruct.Bound(varstruct.Buffer(4), checkMagic) },
  { name: 'versionTag', type: varstruct.VarString(varstruct.UInt8) },
  { name: 'appName', type: varstruct.VarString(varstruct.UInt8, 'utf-8') },
  { name: 'appVersion', type: varstruct.VarString(varstruct.UInt8, 'utf-8') },
  { name: 'metadata', type: varstruct.VarBuffer(varstruct.UInt32BE) },
  { name: 'blob', type: varstruct.VarBuffer(varstruct.UInt32BE) }
])

export function decode (containerBlob: Buffer): Object {
  return container.decode(containerBlob)
}

export function encode (object): Buffer {
  return container.encode(object)
}
