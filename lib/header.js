'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = exports.MAGIC = undefined;
exports.checkMagic = checkMagic;
exports.decode = decode;
exports.encode = encode;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import assert from 'assert'
const MAGIC = exports.MAGIC = Buffer.from('SECO', 'utf8');

function checkMagic(magic) {
  if (!magic.equals(MAGIC)) throw new RangeError('Invalid secure container magic.');
}

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['magic', (0, _varstruct.Bound)(_varstruct2.default.Buffer(4), checkMagic)], ['reserved', _varstruct.UInt32BE], // should be all 0's for now
['versionTag', (0, _varstruct.VarString)(_varstruct.UInt8)], ['appName', (0, _varstruct.VarString)(_varstruct.UInt8, 'utf-8')], ['appVersion', (0, _varstruct.VarString)(_varstruct.UInt8, 'utf-8')], ['metadata', (0, _varstruct.VarBuffer)(_varstruct.UInt32BE)], ['blob', (0, _varstruct.VarBuffer)(_varstruct.UInt32BE)]]));

function decode(headerBlob) {
  // if (headerBlob.byteLength > 512) console.warn('header greater than 512 bytes, are you sure this is the header?')
  return struct.decode(headerBlob);
}

function encode(headerObject) {
  return struct.encode(headerObject);
}