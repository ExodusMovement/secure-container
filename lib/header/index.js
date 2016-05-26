'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.header = undefined;
exports.decode = decode;
exports.encode = encode;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const header = exports.header = (0, _varstruct2.default)([{ name: 'magic', type: _varstruct2.default.Bound(_varstruct2.default.Buffer(4), checkMagic) }, { name: 'versionTag', type: _varstruct2.default.Bound(_varstruct2.default.VarString(_varstruct2.default.UInt8), checkVersionTag) }, { name: 'appName', type: _varstruct2.default.VarString(_varstruct2.default.UInt8, 'utf-8') }, { name: 'appVersion', type: _varstruct2.default.VarString(_varstruct2.default.UInt8, 'utf-8') }, { name: 'metadata', type: SCStructMetadata }, { name: 'blob', type: _varstruct2.default.VarBuffer(_varstruct2.default.UInt32BE) }]);

function decode(containerBlob) {
  if (!(containerBlob instanceof Buffer)) {
    throw new TypeError('Value of argument "containerBlob" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(containerBlob));
  }
}

function encode() {}

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