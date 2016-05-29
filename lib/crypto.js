'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IV_LEN_BYTES = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createScryptParams = createScryptParams;
exports.stretchPassphrase = stretchPassphrase;
exports.aesEncrypt = aesEncrypt;
exports.aesDecrypt = aesDecrypt;
exports.boxEncrypt = boxEncrypt;
exports.boxDecrypt = boxDecrypt;
exports.sha256 = sha256;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _scryptsy = require('scryptsy');

var _scryptsy2 = _interopRequireDefault(_scryptsy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://csrc.nist.gov/publications/nistpubs/800-38D/SP-800-38D.pdf 8.2.2 RBG-based Construction (about initialization vectors)
const IV_LEN_BYTES = exports.IV_LEN_BYTES = 12; // <-- always 12, any other value will error, not sure why it won't allow higher... probably concat with freefield?

function createScryptParams(params = {}) {
  return _extends({ salt: _crypto2.default.randomBytes(32), n: 16384, r: 8, p: 1 }, params);
}

// always returns 32 byte key
function stretchPassphrase(passphrase, { salt, n, r, p } = createScryptParams()) {
  if (!(typeof passphrase === 'string' || passphrase instanceof Buffer)) {
    throw new TypeError('Value of argument "passphrase" violates contract.\n\nExpected:\nstring | Buffer\n\nGot:\n' + _inspect(passphrase));
  }

  const key = (0, _scryptsy2.default)(passphrase, salt, n, r, p, 32);
  return { key, salt };
}

function aesEncrypt(key, message, opts = { cipher: 'aes-256-gcm', iv: _crypto2.default.randomBytes(IV_LEN_BYTES) }) {
  if (!(key instanceof Buffer)) {
    throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(key));
  }

  if (!(message instanceof Buffer)) {
    throw new TypeError('Value of argument "message" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(message));
  }

  const cipher = _crypto2.default.createCipheriv(opts.cipher, key, opts.iv);
  const blob = Buffer.concat([cipher.update(message), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { authTag, blob, iv: opts.iv };
}

function aesDecrypt(key, blob, { cipher = 'aes-256-gcm', iv, authTag } = {}) {
  function _ref4(_id4) {
    if (!(_id4 instanceof Buffer)) {
      throw new TypeError('Function "aesDecrypt" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id4));
    }

    return _id4;
  }

  if (!(key instanceof Buffer)) {
    throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(key));
  }

  if (!(blob instanceof Buffer)) {
    throw new TypeError('Value of argument "blob" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(blob));
  }

  const decipher = _crypto2.default.createDecipheriv(cipher, key, iv);
  decipher.setAuthTag(authTag);
  const message = Buffer.concat([decipher.update(blob), decipher.final()]);
  return _ref4(message);
}

function boxEncrypt(passphrase, message, scryptParams) {
  if (!(typeof passphrase === 'string' || passphrase instanceof Buffer)) {
    throw new TypeError('Value of argument "passphrase" violates contract.\n\nExpected:\nstring | Buffer\n\nGot:\n' + _inspect(passphrase));
  }

  if (!(message instanceof Buffer)) {
    throw new TypeError('Value of argument "message" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(message));
  }

  const { key, salt } = stretchPassphrase(passphrase, scryptParams);
  const { authTag, blob, iv } = aesEncrypt(key, message);
  return { authTag, blob, iv, salt };
}

function boxDecrypt(passphrase, blob, { iv, authTag }, scryptParams) {
  if (!(typeof passphrase === 'string' || passphrase instanceof Buffer)) {
    throw new TypeError('Value of argument "passphrase" violates contract.\n\nExpected:\nstring | Buffer\n\nGot:\n' + _inspect(passphrase));
  }

  if (!(blob instanceof Buffer)) {
    throw new TypeError('Value of argument "blob" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(blob));
  }

  scryptParams = _extends({}, createScryptParams(), scryptParams);
  const { key } = stretchPassphrase(passphrase, scryptParams);
  const message = aesDecrypt(key, blob, { iv, authTag });
  return message;
}

function sha256(message) {
  function _ref5(_id5) {
    if (!(_id5 instanceof Buffer)) {
      throw new TypeError('Function "sha256" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id5));
    }

    return _id5;
  }

  if (!(message instanceof Buffer)) {
    throw new TypeError('Value of argument "message" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(message));
  }

  return _ref5(_crypto2.default.createHash('sha256').update(message).digest());
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