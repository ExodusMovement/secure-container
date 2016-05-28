'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = undefined;
exports.decode = decode;
exports.encode = encode;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _util = require('./util');

var _header = require('./header');

var _metadata = require('./metadata');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['header', (0, _varstruct.Buffer)(_header.HEADER_LEN_BYTES)], ['checksum', (0, _varstruct.Buffer)(32)], ['metadata', (0, _varstruct.Buffer)(_metadata.METADATA_LEN_BYTES)], ['blob', (0, _varstruct.VarBuffer)(_varstruct.UInt32BE)]]));

function decode(file) {
  return struct.decode(file);
}

function encode(file) {
  return struct.encode(file);
}