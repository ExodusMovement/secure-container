'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _crypto = require('./crypto');

var scCrypto = _interopRequireWildcard(_crypto);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function encrypt(message, metadata, blobKey) {
  if (!(message instanceof Buffer)) {
    throw new TypeError('Value of argument "message" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(message));
  }

  if (!(metadata instanceof Object)) {
    throw new TypeError('Value of argument "metadata" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(metadata));
  }

  if (!(blobKey instanceof Buffer)) {
    throw new TypeError('Value of argument "blobKey" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(blobKey));
  }

  const { authTag, iv, blob } = scCrypto.aesEncrypt(blobKey, message);
  metadata.blob = { authTag, iv };
  return { blob, blobKey };
}

function decrypt(blob, metadata, blobKey) {
  function _ref(_id) {
    if (!(_id instanceof Buffer)) {
      throw new TypeError('Function "decrypt" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id));
    }

    return _id;
  }

  if (!(blob instanceof Buffer)) {
    throw new TypeError('Value of argument "blob" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(blob));
  }

  if (!(metadata instanceof Object)) {
    throw new TypeError('Value of argument "metadata" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(metadata));
  }

  if (!(blobKey instanceof Buffer)) {
    throw new TypeError('Value of argument "blobKey" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(blobKey));
  }

  const message = scCrypto.aesDecrypt(blobKey, blob, metadata.blob);
  return _ref(message);
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