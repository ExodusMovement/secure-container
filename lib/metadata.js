'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = undefined;
exports.decode = decode;
exports.encode = encode;
exports.create = create;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _crypto = require('./crypto');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['scrypt', [['salt', (0, _varstruct.Buffer)(32)], ['n', _varstruct.UInt32BE], ['r', _varstruct.UInt32BE], ['p', _varstruct.UInt32BE]]], ['blobKey', [['iv', (0, _varstruct.Buffer)(12)], ['authTag', (0, _varstruct.Buffer)(16)], ['key', (0, _varstruct.Buffer)(32)]]], ['blob', [['iv', (0, _varstruct.Buffer)(12)], ['authTag', (0, _varstruct.Buffer)(16)]]]]));

function decode(metadataBlob) {
  if (metadataBlob.byteLength > 2048) console.warn('metadata greater than 2048 bytes, are you sure this is the SECO metadata?');
  return struct.decode(metadataBlob);
}

function encode(metadataObject) {
  return struct.encode(metadataObject);
}

function create(scryptParams = (0, _crypto.createScryptParams)()) {
  return {
    scrypt: scryptParams,
    blobKey: {
      iv: Buffer.alloc(12),
      authTag: Buffer.alloc(16),
      key: Buffer.alloc(32)
    },
    blob: {
      iv: Buffer.alloc(12),
      authTag: Buffer.alloc(16)
    }
  };
}