import test from 'tape'
import * as header from '../src/header'

test('encode / decode header', (t) => {
  t.plan(1)

  var obj = {
    magic: header.MAGIC,
    version: 0,
    reserved: 0,
    versionTag: 'seco-test-1',
    appName: 'Exodus',
    appVersion: 'v1.0.0'
  }

  var obj2 = header.decode(header.encode(obj))
  t.deepEqual(obj, obj2, 'verify objects are the same')

  t.end()
})
