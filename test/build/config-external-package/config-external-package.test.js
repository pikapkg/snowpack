const path = require('path');
const snowpack = require('../../../snowpack');
const {getFile} = require('../../test-utils');

const TEST_ROOT = __dirname;
const TEST_OUT = path.join(__dirname, 'build');
let result;

 

describe('config: installOptions.externalPackage', () => {
  beforeAll(async () => {
    const config = snowpack.createConfiguration({
      root: TEST_ROOT,
      mount: {
        [path.resolve(TEST_ROOT, './src')]: '/_dist_',
      },
      installOptions: {
        externalPackage: ['fs'],
      },
      buildOptions: {
        out: TEST_OUT,
      },
    });
    const {result: _result} = await snowpack.buildProject({config, lockfile: null});
    result = _result;
  });

  it('preserves external package', () => {
    expect( getFile(result, TEST_OUT, './_dist_/index.js')).toEqual(expect.stringContaining(`import 'fs';`));
  });
});
