import path from 'path';
import fs from 'fs';
var CONFIG_FILENAMES = ['jsconfig.json', 'tsconfig.json'];
var CMD = fs.realpathSync(process.cwd());
var configPaths = CONFIG_FILENAMES.map(function (filename) {
  return path.resolve(CMD, filename);
}).filter(function (actPath) {
  return fs.existsSync(actPath);
});
var jsconfigInclude;

if (configPaths.length === 1) {
  var jsconfig = JSON.parse(fs.readFileSync(configPaths[0], 'utf8'));
  jsconfigInclude = jsconfig.include ? jsconfig.include[0] : null;
} else if (configPaths.length > 1) {
  throw new Error('You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.');
}

var resolveImportPath = function resolveImportPath(_ref) {
  var filename = _ref.filename,
      relativePath = _ref.relativePath;

  if (relativePath.startsWith('.')) {
    return path.join(filename, '..', relativePath);
  }

  var resolvedPath = path.resolve(CMD, jsconfigInclude || process.env.NODE_PATH || '.', relativePath);

  if (fs.existsSync(resolvedPath)) {
    return resolvedPath;
  } // Note: Try to resolve from node_modules if the file does not exist. PR#39


  return path.resolve(CMD, 'node_modules', relativePath);
};

export default resolveImportPath;