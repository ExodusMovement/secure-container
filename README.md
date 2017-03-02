secure-container
================

[![Build Status](https://travis-ci.org/ExodusMovement/secure-container.svg?branch=master)](https://travis-ci.org/ExodusMovement/secure-container)


Install
-------

    npm i --save secure-container



API
-----

### `header` module

```js
import * as header from 'secure-container/lib/header'
// OR
const header = require('secure-container/lib/header')
```

#### `header.create(data)`

Create a header object.

- `data` (Object)
  - `appName` (String) Name of your app
  - `appVersion` (String) Version of your app

Returns an Object.

#### `header.serialize(headerObj)`

Serialize a header object. `headerObj` is a header object made with `create()`. Returns a Buffer.

### `metadata` module

```js
import * as metadata from 'secure-container/lib/metadata'
// OR
const metadata = require('secure-container/lib/metadata')
```

#### `metadata.create()`

Create a metadata object. Returns an Object.

#### `metadata.encryptBlobKey(metadata, passphrase, blobKey)`

- `metadata` (Object) Metadata created with `metadata.create()`.
- `passphrase` (String | Buffer)
- `blobKey` (Buffer)

Mutates `metadata` object; returns `undefined`.

#### `metadata.serialize(metadata)`

Serialize a metadata object. Returns a Buffer.

#### `metadata.decode(buffer)`

Takes a metadata buffer, decodes it, and returns an object.

#### `metadata.decryptBlobKey(metadata, passphrase)`

- `metadata` (Object) Metadata with an encrypted blobKey.
- `passphrase` (String | Buffer)

Returns `blobKey` as a buffer.

### `blob` module

```js
import * as blob from 'secure-container/lib/blob'
// OR
const blob = require('secure-container/lib/blob')
```

#### `blob.encrypt(data, metadata, blobKey)`

- `data` (Buffer) Data or message to encrypt.
- `metadata` (Object) Metadata object.
- `blobKey` (Buffer)

Mutates `metadata`. Returns an object:

- `blob` (Buffer) Encrypted data.
- `blobKey` (Buffer) The `blobKey` you passed in.

#### `blob.decrypt(blob, metadata, blobKey)`

- `blob` (Buffer) Encrypted data.
- `metadata` (Object) Metadata object.
- `blobKey` (Buffer)

Returns the decrypted data as a buffer.

### `file` module

```js
import * as file from 'secure-container/lib/file'
// OR
const file = require('secure-container/lib/file')
```

#### `file.computeChecksum(metadata, blob)`

- `metadata` (Buffer) Metadata as a Buffer
- `blob` (Buffer) Encrypted blob

Returns a `sha256` checksum as a buffer.

#### `file.encode(fileObj)`

- `fileObj` (Object)
  - `header` (Buffer) Serialized header
  - `checksum` (Buffer) Checksum from `file.computeChecksum()`
  - `metadata` (Buffer) Metadata as a Buffer
  - `blob` (Buffer) Encrypted blob

Returns a buffer.

#### `file.decode(fileBuffer)`

The opposite of `file.encode()`. Takes a buffer and returns an object.

Description
-----------

Offset | Size | Label | Description |
------ | ---- | ----- | ----------- |
0 | 4 | `magic` | The magic header indicating the file type. Always `SECO`.
