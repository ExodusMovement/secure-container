'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vsf = vsf;
exports.CStr = CStr;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function vsf(fields) {
  function _ref(_id) {
    if (!Array.isArray(_id)) {
      throw new TypeError('Function "vsf" return value violates contract.\n\nExpected:\nArray\n\nGot:\n' + _inspect(_id));
    }

    return _id;
  }

  if (!Array.isArray(fields)) {
    throw new TypeError('Value of argument "fields" violates contract.\n\nExpected:\nArray\n\nGot:\n' + _inspect(fields));
  }

  return _ref(fields.map(fields => {
    return {
      name: fields[0],
      type: Array.isArray(fields[1]) ? (0, _varstruct2.default)(vsf(fields[1])) : fields[1]
    };
  }));
}

// zero-terminated C-string (Buffer)
function CStr(length, encoding = 'utf8') {
  if (!(typeof length === 'number')) {
    throw new TypeError('Value of argument "length" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(length));
  }

  let bufferCodec = (0, _varstruct.Buffer)(length);

  function encode(value, buffer, offset) {
    function _ref2(_id2) {
      if (!(_id2 instanceof Buffer)) {
        throw new TypeError('Function "encode" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id2));
      }

      return _id2;
    }

    if (!(typeof value === 'string')) {
      throw new TypeError('Value of argument "value" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(value));
    }

    if (!(buffer == null || buffer instanceof Buffer)) {
      throw new TypeError('Value of argument "buffer" violates contract.\n\nExpected:\n?Buffer\n\nGot:\n' + _inspect(buffer));
    }

    if (!(offset == null || typeof offset === 'number')) {
      throw new TypeError('Value of argument "offset" violates contract.\n\nExpected:\n?number\n\nGot:\n' + _inspect(offset));
    }

    let buf = Buffer.alloc(length);
    buf.write(value, encoding);
    return _ref2(bufferCodec.encode(buf, buffer, offset));
  }

  function decode(buffer, offset, end) {
    function _ref3(_id3) {
      if (!(typeof _id3 === 'string')) {
        throw new TypeError('Function "decode" return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id3));
      }

      return _id3;
    }

    if (!(buffer instanceof Buffer)) {
      throw new TypeError('Value of argument "buffer" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(buffer));
    }

    let buf = bufferCodec.decode(buffer, offset, end);
    let i = 0;
    for (; i < buf.length; i++) if (buf[i] === 0) break;
    return _ref3(buf.slice(0, i).toString(encoding));
  }

  const encodingLength = () => {
    return length;
  };

  // TODO: submit pr on varstruct if 'bytes' is undefined
  encode.bytes = decode.bytes = length;

  return { encode, decode, encodingLength };
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