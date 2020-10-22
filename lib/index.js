'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _randombytes = require('randombytes');

var _randombytes2 = _interopRequireDefault(_randombytes);

var _blob = require('./blob');

var conBlob = _interopRequireWildcard(_blob);

var _header = require('./header');

var conHeader = _interopRequireWildcard(_header);

var _metadata = require('./metadata');

var conMetadata = _interopRequireWildcard(_metadata);

var _file = require('./file');

var conFile = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// options: passphrase, blobKey, metdata
function encrypt(data, options = {}) {
  if (!options.header) console.warn('seco: should pass options.header.');
  let header = conHeader.create(options.header);

  let blobKey;
  let metadata;
  if (options.passphrase) {
    blobKey = (0, _randombytes2.default)(32);
    metadata = conMetadata.create();
    conMetadata.encryptBlobKey(metadata, options.passphrase, blobKey);
  } else if (options.metadata && options.blobKey) {
    blobKey = options.blobKey;
    metadata = options.metadata;
  } else {
    throw new Error('Must set either passphrase or (metadata and blobKey)');
  }

  data = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  let { blob: encBlob } = conBlob.encrypt(data, metadata, blobKey);

  const headerBuf = conHeader.serialize(header);
  const mdBuf = conMetadata.serialize(metadata);

  let fileObj = {
    header: headerBuf,
    checksum: conFile.computeChecksum(mdBuf, encBlob),
    metadata: mdBuf,
    blob: encBlob
  };
  const encryptedData = conFile.encode(fileObj);

  return { encryptedData, blobKey, metadata };
} /* flow */
function decrypt(encryptedData, passphrase) {
  const fileObj = conFile.decode(encryptedData);

  const checksum = conFile.computeChecksum(fileObj.metadata, fileObj.blob);
  if (!fileObj.checksum.equals(checksum)) throw new Error('seco checksum does not match; data may be corrupted');

  let metadata = conMetadata.decode(fileObj.metadata);
  let blobKey = conMetadata.decryptBlobKey(metadata, passphrase);
  let header = conHeader.decode(fileObj.header);
  let data = conBlob.decrypt(fileObj.blob, metadata, blobKey);

  return { data, blobKey, metadata, header };
}