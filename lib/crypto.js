'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultScryptParams = defaultScryptParams;
exports.stretchPassphrase = stretchPassphrase;
exports.aesEncrypt = aesEncrypt;
exports.aesDecrypt = aesDecrypt;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _scryptsy = require('scryptsy');

var _scryptsy2 = _interopRequireDefault(_scryptsy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultScryptParams() {
  return { salt: _crypto2.default.randomBytes(32), n: 16384, r: 8, p: 1 };
}

// always returns 32 byte key
function stretchPassphrase(passphrase, { salt, n, r, p } = defaultScryptParams()) {
  const key = (0, _scryptsy2.default)(passphrase, salt, n, r, p, 32);
  return { key, salt };
}

function aesEncrypt(key, message, iv = _crypto2.default.randomBytes(12)) {
  const cipher = _crypto2.default.createCipheriv('aes-256-gcm', key, iv);
  const blob = Buffer.concat([cipher.update(message), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { authTag, blob, iv };
}

function aesDecrypt(key, blob, { iv, authTag } = {}) {
  const decipher = _crypto2.default.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const message = Buffer.concat([decipher.update(blob), decipher.final()]);
  return message;
}