/* @flow */
import varstruct from 'varstruct'

export function vsf (fields: Array): Array {
  return fields.map(fields => ({
    name: fields[0],
    type: Array.isArray(fields[1]) ? varstruct(vsf(fields[1])) : fields[1]
  }))
}
