/* @flow */
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
    appVersion: '1.0.0'
  }

  var obj2 = header.decode(header.encode(obj))
  t.deepEqual(obj, obj2, 'verify objects are the same')

  t.end()
})

test('create()', (t) => {
  t.plan(6)

  let headerObj: Object = header.create({ appName: 'Exodus', appVersion: '1.0.0' })

  t.deepEqual(headerObj.magic, header.MAGIC, 'magic the same')
  t.is(headerObj.version, 0, 'version is 0')
  t.is(headerObj.reserved, 0, 'reserved is 0')
  t.is(headerObj.versionTag, 'seco-v0-scrypt-aes', 'versionTag is set')
  t.is(headerObj.appName, 'Exodus', 'appName is set')
  t.is(headerObj.appVersion, '1.0.0', 'appVersion is set')

  t.end()
})
