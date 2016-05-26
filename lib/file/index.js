'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.container = exports.MAGIC = undefined;
exports.checkMagic = checkMagic;
exports.decode = decode;
exports.encode = encode;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAGIC = exports.MAGIC = Buffer.from('SECO', 'utf8');

function checkMagic(magic) {
  if (!magic.equals(MAGIC)) throw new RangeError('Invalid secure container magic.');
}

const container = exports.container = (0, _varstruct2.default)([{ name: 'magic', type: _varstruct2.default.Bound(_varstruct2.default.Buffer(4), checkMagic) }, { name: 'versionTag', type: _varstruct2.default.VarString(_varstruct2.default.UInt8) }, { name: 'appName', type: _varstruct2.default.VarString(_varstruct2.default.UInt8, 'utf-8') }, { name: 'appVersion', type: _varstruct2.default.VarString(_varstruct2.default.UInt8, 'utf-8') }, { name: 'metadata', type: _varstruct2.default.VarBuffer(_varstruct2.default.UInt32BE) }, { name: 'blob', type: _varstruct2.default.VarBuffer(_varstruct2.default.UInt32BE) }]);

function decode(containerBlob) {
  return container.decode(containerBlob);
}

function encode(object) {
  return container.encode(object);
}