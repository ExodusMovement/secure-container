'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metadata = undefined;
exports.decode = decode;
exports.encode = encode;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const metadata = exports.metadata = (0, _varstruct2.default)([{ name: 'scrypt', type: (0, _varstruct2.default)([{ name: 'salt', type: _varstruct2.default.Buffer(32) }, { name: 'n', type: _varstruct2.default.UInt32BE }, { name: 'r', type: _varstruct2.default.UInt32BE }, { name: 'p', type: _varstruct2.default.UInt32BE }]) }, { name: 'blobKey', type: (0, _varstruct2.default)([{ name: 'iv', type: _varstruct2.default.Buffer(12) }, { name: 'authTag', type: _varstruct2.default.Buffer(16) }, { name: 'key', type: _varstruct2.default.Buffer(32) }]) }, { name: 'blob', type: (0, _varstruct2.default)([{ name: 'iv', type: _varstruct2.default.Buffer(12) }, { name: 'authTag', type: _varstruct2.default.Buffer(16) }]) }]);

function decode(metadataBlob) {
  return metadata.decode(metadataBlob);
}

function encode(metadataObject) {
  return metadata.encode(metadataObject);
}