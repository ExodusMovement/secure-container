'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = exports.MAGIC = exports.HEADER_LEN_BYTES = undefined;
exports.checkMagic = checkMagic;
exports.decode = decode;
exports.encode = encode;
exports.serialize = serialize;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import assert from 'assert'
const HEADER_LEN_BYTES = exports.HEADER_LEN_BYTES = 224;
const MAGIC = exports.MAGIC = Buffer.from('SECO', 'utf8');

function checkMagic(magic) {
  if (!magic.equals(MAGIC)) throw new RangeError('Invalid secure container magic.');
}

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['magic', (0, _varstruct.Bound)(_varstruct2.default.Buffer(4), checkMagic)], ['version', _varstruct.UInt32BE], // should be all 0's for now
['reserved', _varstruct.UInt32BE], // should be all 0's for now
['versionTag', (0, _varstruct.VarString)(_varstruct.UInt8)], ['appName', (0, _varstruct.VarString)(_varstruct.UInt8, 'utf-8')], ['appVersion', (0, _varstruct.VarString)(_varstruct.UInt8, 'utf-8')]]));

function decode(headerBlob) {
  function _ref(_id) {
    if (!(_id instanceof Object)) {
      throw new TypeError('Function "decode" return value violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(_id));
    }

    return _id;
  }

  if (!(headerBlob instanceof Buffer)) {
    throw new TypeError('Value of argument "headerBlob" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(headerBlob));
  }

  if (headerBlob.byteLength > HEADER_LEN_BYTES) console.warn(`header greater than ${ HEADER_LEN_BYTES } bytes, are you sure this is the header?`);
  return _ref(struct.decode(headerBlob));
}

function encode(header) {
  function _ref2(_id2) {
    if (!(_id2 instanceof Buffer)) {
      throw new TypeError('Function "encode" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id2));
    }

    return _id2;
  }

  if (!(header instanceof Object)) {
    throw new TypeError('Value of argument "header" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(header));
  }

  return _ref2(struct.encode(header));
}

function serialize(header) {
  if (!(header instanceof Object)) {
    throw new TypeError('Value of argument "header" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(header));
  }

  let buf = Buffer.alloc(HEADER_LEN_BYTES);
  encode(header).copy(buf);
  return buf;
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