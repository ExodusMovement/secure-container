'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = exports.METADATA_LEN_BYTES = undefined;
exports.decode = decode;
exports.encode = encode;
exports.serialize = serialize;
exports.create = create;
exports.encryptBlobKey = encryptBlobKey;
exports.decryptBlobKey = decryptBlobKey;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _crypto = require('./crypto');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const METADATA_LEN_BYTES = exports.METADATA_LEN_BYTES = 256;

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['scrypt', [['salt', (0, _varstruct.Buffer)(32)], ['n', _varstruct.UInt32BE], ['r', _varstruct.UInt32BE], ['p', _varstruct.UInt32BE]]], ['cipher', (0, _util.CStr)(32)], ['blobKey', [['iv', (0, _varstruct.Buffer)(_crypto.IV_LEN_BYTES)], ['authTag', (0, _varstruct.Buffer)(16)], ['key', (0, _varstruct.Buffer)(32)]]], ['blob', [['iv', (0, _varstruct.Buffer)(_crypto.IV_LEN_BYTES)], ['authTag', (0, _varstruct.Buffer)(16)]]]]));

function decode(metadataBlob) {
  function _ref(_id) {
    if (!(_id instanceof Object)) {
      throw new TypeError('Function "decode" return value violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(_id));
    }

    return _id;
  }

  if (!(metadataBlob instanceof Buffer)) {
    throw new TypeError('Value of argument "metadataBlob" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(metadataBlob));
  }

  if (metadataBlob.byteLength > METADATA_LEN_BYTES) console.warn('metadata greater than `${METADATA_LEN_BYTES}` bytes, are you sure this is the SECO metadata?');
  return _ref(struct.decode(metadataBlob));
}

function encode(metadataObject) {
  function _ref2(_id2) {
    if (!(_id2 instanceof Buffer)) {
      throw new TypeError('Function "encode" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id2));
    }

    return _id2;
  }

  return _ref2(struct.encode(metadataObject));
}

function serialize(metadata) {
  function _ref3(_id3) {
    if (!(_id3 instanceof Buffer)) {
      throw new TypeError('Function "serialize" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id3));
    }

    return _id3;
  }

  if (!(metadata instanceof Object)) {
    throw new TypeError('Value of argument "metadata" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(metadata));
  }

  let buf = Buffer.alloc(METADATA_LEN_BYTES);
  encode(metadata).copy(buf);
  return _ref3(buf);
}

function create(scryptParams = (0, _crypto.createScryptParams)()) {
  return {
    scrypt: scryptParams,
    cipher: 'aes-256-gcm',
    blobKey: {
      iv: Buffer.alloc(_crypto.IV_LEN_BYTES),
      authTag: Buffer.alloc(16),
      key: Buffer.alloc(32)
    },
    blob: {
      iv: Buffer.alloc(_crypto.IV_LEN_BYTES),
      authTag: Buffer.alloc(16)
    }
  };
}

function encryptBlobKey(metadata, passphrase, blobKey) {
  if (!(metadata instanceof Object)) {
    throw new TypeError('Value of argument "metadata" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(metadata));
  }

  if (!(typeof passphrase === 'string' || passphrase instanceof Buffer)) {
    throw new TypeError('Value of argument "passphrase" violates contract.\n\nExpected:\nstring | Buffer\n\nGot:\n' + _inspect(passphrase));
  }

  if (!(blobKey instanceof Buffer)) {
    throw new TypeError('Value of argument "blobKey" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(blobKey));
  }

  const { authTag, blob, iv, salt } = (0, _crypto.boxEncrypt)(passphrase, blobKey, metadata.scrypt);
  metadata.scrypt.salt = salt;
  metadata.blobKey = { authTag, iv, key: blob };
}

function decryptBlobKey(metadata, passphrase) {
  function _ref5(_id5) {
    if (!(_id5 instanceof Buffer)) {
      throw new TypeError('Function "decryptBlobKey" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id5));
    }

    return _id5;
  }

  if (!(metadata instanceof Object)) {
    throw new TypeError('Value of argument "metadata" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(metadata));
  }

  if (!(typeof passphrase === 'string' || passphrase instanceof Buffer)) {
    throw new TypeError('Value of argument "passphrase" violates contract.\n\nExpected:\nstring | Buffer\n\nGot:\n' + _inspect(passphrase));
  }

  const blobKey = (0, _crypto.boxDecrypt)(passphrase, metadata.blobKey.key, metadata.blobKey, metadata.scrypt);
  return _ref5(blobKey);
}

function _inspect(input, depth) {
  const maxDepth = 4;
  const maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      const first = _inspect(input[0], depth);

      if (input.every(item => _inspect(item, depth) === first)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    const keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    const indent = '  '.repeat(depth - 1);
    let entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}