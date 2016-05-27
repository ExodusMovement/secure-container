'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vsf = vsf;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function vsf(fields) {
  return fields.map(fields => ({
    name: fields[0],
    type: Array.isArray(fields[1]) ? (0, _varstruct2.default)(vsf(fields[1])) : fields[1]
  }));
}