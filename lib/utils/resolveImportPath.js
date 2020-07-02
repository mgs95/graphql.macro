"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var CONFIG_FILENAMES = ['jsconfig.json', 'tsconfig.json'];

var CMD = _fs.default.realpathSync(process.cwd());

var configPaths = CONFIG_FILENAMES.map(function (filename) {
  return _path.default.resolve(CMD, filename);
}).filter(function (actPath) {
  return _fs.default.existsSync(actPath);
});
var jsconfigInclude;

if (configPaths.length === 1) {
  var jsconfig = JSON.parse(_fs.default.readFileSync(configPaths[0], 'utf8'));
  jsconfigInclude = jsconfig.include ? jsconfig.include[0] : null;
} else if (configPaths.length > 1) {
  throw new Error('You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.');
}

var resolveImportPath = function resolveImportPath(_ref) {
  var filename = _ref.filename,
      relativePath = _ref.relativePath;

  if (relativePath.startsWith('.')) {
    return _path.default.join(filename, '..', relativePath);
  }

  var resolvedPath = _path.default.resolve(CMD, jsconfigInclude || process.env.NODE_PATH || '.', relativePath);

  if (_fs.default.existsSync(resolvedPath)) {
    return resolvedPath;
  } // Note: Try to resolve from node_modules if the file does not exist. PR#39


  return _path.default.resolve(CMD, 'node_modules', relativePath);
};

var _default = resolveImportPath;
exports.default = _default;
module.exports = exports.default;