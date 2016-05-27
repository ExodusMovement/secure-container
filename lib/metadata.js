'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metadata = undefined;
exports.decode = decode;
exports.encode = encode;
exports.create = create;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const metadata = exports.metadata = (0, _varstruct2.default)((0, _util.vsf)([['scrypt', [['salt', (0, _varstruct.Buffer)(32)], ['n', _varstruct.UInt32BE], ['r', _varstruct.UInt32BE], ['p', _varstruct.UInt32BE]]], ['blobKey', [['iv', (0, _varstruct.Buffer)(12)], ['authTag', (0, _varstruct.Buffer)(16)], ['key', (0, _varstruct.Buffer)(32)]]], ['blob', [['iv', (0, _varstruct.Buffer)(12)], ['authTag', (0, _varstruct.Buffer)(16)]]]]));

function decode(metadataBlob) {
  return metadata.decode(metadataBlob);
}

function encode(metadataObject) {
  return metadata.encode(metadataObject);
}

function create(passphrase, scryptParams = { n: 16834, r: 8, p: 1 }) {
  return {};
}