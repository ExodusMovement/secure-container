import test from 'tape'
import * as container from '../src/header'

test('encode / decode container', (t) => {
  t.plan(1)

  var obj = {
    magic: container.MAGIC,
    reserved: 0,
    versionTag: 'seco-test-1',
    appName: 'Exodus',
    appVersion: 'v1.0.0',
    metadata: new Buffer('this does not matter for this test'),
    blob: new Buffer('this does not matter either')
  }

  var obj2 = container.decode(container.encode(obj))
  t.deepEqual(obj, obj2, 'verify objects are the same')

  t.end()
})
