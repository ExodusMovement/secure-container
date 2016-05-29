'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = undefined;
exports.decode = decode;
exports.encode = encode;
exports.computeChecksum = computeChecksum;
exports.checkContents = checkContents;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _buffer = require('./buffer');

var _crypto = require('./crypto');

var scCrypto = _interopRequireWildcard(_crypto);

var _util = require('./util');

var _header = require('./header');

var _metadata = require('./metadata');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['header', (0, _varstruct.Buffer)(_header.HEADER_LEN_BYTES)], ['checksum', (0, _varstruct.Buffer)(32)], ['metadata', (0, _varstruct.Buffer)(_metadata.METADATA_LEN_BYTES)], ['blob', (0, _varstruct.VarBuffer)(_varstruct.UInt32BE)]]));

function decode(fileContents) {
  function _ref(_id) {
    if (!(_id instanceof Object)) {
      throw new TypeError('Function "decode" return value violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(_id));
    }

    return _id;
  }

  if (!(fileContents instanceof Buffer)) {
    throw new TypeError('Value of argument "fileContents" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(fileContents));
  }

  return _ref(struct.decode(fileContents));
}

function encode(fileContents) {
  function _ref2(_id2) {
    if (!(_id2 instanceof Buffer)) {
      throw new TypeError('Function "encode" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id2));
    }

    return _id2;
  }

  if (!(fileContents instanceof Object)) {
    throw new TypeError('Value of argument "fileContents" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(fileContents));
  }

  return _ref2(struct.encode(fileContents));
}

function computeChecksum(metadata, blob) {
  function _ref3(_id3) {
    if (!(_id3 instanceof Buffer)) {
      throw new TypeError('Function "computeChecksum" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id3));
    }

    return _id3;
  }

  if (!(metadata instanceof Buffer)) {
    throw new TypeError('Value of argument "metadata" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(metadata));
  }

  if (!(blob instanceof Buffer)) {
    throw new TypeError('Value of argument "blob" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(blob));
  }

  return _ref3(scCrypto.sha256(Buffer.concat([metadata, (0, _buffer.fromUInt32BE)(blob.byteLength), blob])));
}

function checkContents(fileContents) {
  function _ref4(_id4) {
    if (!(typeof _id4 === 'boolean')) {
      throw new TypeError('Function "checkContents" return value violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(_id4));
    }

    return _id4;
  }

  if (!(fileContents instanceof Buffer)) {
    throw new TypeError('Value of argument "fileContents" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(fileContents));
  }

  let fileObj = decode(fileContents);
  return _ref4(fileObj.checksum.equals(computeChecksum(fileObj.metadata, fileObj.blob)));
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