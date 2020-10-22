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

var _randombytes = require('randombytes');

var _randombytes2 = _interopRequireDefault(_randombytes);

var _createHash = require('create-hash');

var _createHash2 = _interopRequireDefault(_createHash);

var _browserifyAes = require('browserify-aes');

var _browserifyAes2 = _interopRequireDefault(_browserifyAes);

var _scryptsy = require('@exodus/scryptsy');

var _scryptsy2 = _interopRequireDefault(_scryptsy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://csrc.nist.gov/publications/nistpubs/800-38D/SP-800-38D.pdf 8.2.2 RBG-based Construction (about initialization vectors)
const IV_LEN_BYTES = exports.IV_LEN_BYTES = 12; // <-- always 12, any other value will error, not sure why it won't allow higher... probably concat with freefield?

function createScryptParams(params = {}) {
  return _extends({ salt: (0, _randombytes2.default)(32), n: 16384, r: 8, p: 1 }, params);
}

// always returns 32 byte key
function stretchPassphrase(passphrase, { salt, n, r, p } = createScryptParams()) {
  const key = (0, _scryptsy2.default)(passphrase, salt, n, r, p, 32);
  return { key, salt };
}

function aesEncrypt(key, message) {
  const iv = (0, _randombytes2.default)(IV_LEN_BYTES);
  const cipher = _browserifyAes2.default.createCipheriv('aes-256-gcm', key, iv);
  const blob = Buffer.concat([cipher.update(message), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { authTag, blob, iv };
}

function aesDecrypt(key, blob, { iv, authTag } = {}) {
  const decipher = _browserifyAes2.default.createDecipheriv('aes-256-gcm', key, iv);
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

function sha256(message) {
  return (0, _createHash2.default)('sha256').update(message).digest();
}