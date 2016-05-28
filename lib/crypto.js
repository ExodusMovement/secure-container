'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createScryptParams = createScryptParams;
exports.stretchPassphrase = stretchPassphrase;
exports.aesEncrypt = aesEncrypt;
exports.aesDecrypt = aesDecrypt;
exports.boxEncrypt = boxEncrypt;
exports.boxDecrypt = boxDecrypt;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _scryptsy = require('scryptsy');

var _scryptsy2 = _interopRequireDefault(_scryptsy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createScryptParams() {
  return { salt: _crypto2.default.randomBytes(32), n: 16384, r: 8, p: 1 };
}

// always returns 32 byte key
function stretchPassphrase(passphrase, { salt, n, r, p } = createScryptParams()) {
  const key = (0, _scryptsy2.default)(passphrase, salt, n, r, p, 32);
  return { key, salt };
}

// http://csrc.nist.gov/publications/nistpubs/800-38D/SP-800-38D.pdf 8.2.2 RBG-based Construction (about initialization vectors)
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

function boxEncrypt(passphrase, message, scryptParams) {
  const { key, salt } = stretchPassphrase(passphrase, scryptParams);
  const { authTag, blob, iv } = aesEncrypt(key, message);
  return { authTag, blob, iv, salt };
}

function boxDecrypt(passphrase, blob, { iv, authTag }, scryptParams) {
  scryptParams = _extends({}, createScryptParams(), scryptParams);
  const { key } = stretchPassphrase(passphrase, scryptParams);
  const message = aesDecrypt(key, blob, { iv, authTag });
  return message;
}