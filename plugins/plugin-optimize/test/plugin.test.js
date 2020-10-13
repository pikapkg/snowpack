const path = require('path');
const fs = require('fs');

const plugin = require('../plugin').default;
const {getSnowpackPluginOutputSnapshotSerializer} = require('./serializer');

describe('@snowpack/plugin-webpack', () => {
  beforeEach(() => {
    expect.addSnapshotSerializer(getSnowpackPluginOutputSnapshotSerializer(__dirname));

    const originalWriteFileSync = fs.writeFileSync;
    fs.writeFileSync = jest
      .fn()
      .mockName('fs.writeFileSync')
      .mockImplementation((path, ...args) => {
        if (path.startsWith(__dirname)) return;

        // write files outside of the current folder
        originalWriteFileSync(path, ...args);
      });

    console.log = jest.fn().mockName('console.log');
  });

  it('minimal - no options', async () => {
    const pluginInstance = plugin({
      buildOptions: {},
    });

    await pluginInstance.optimize({
      buildDirectory: path.resolve(__dirname, 'stubs/minimal/'),
    });

    expect(fs.writeFileSync).toMatchSnapshot('fs.writeFileSync');
    expect(console.log).toMatchSnapshot('console.log');
  });

  it('minimal - all options', async () => {
    const pluginInstance = plugin({
      buildOptions: {},
    }, {
      minifyJS: false,
      minifyCSS: false,
      minifyHTML: false,
      preloadModules: true,
      target: 'es2020'
    });

    await pluginInstance.optimize({
      buildDirectory: path.resolve(__dirname, 'stubs/minimal/'),
    });

    expect(fs.writeFileSync).toMatchSnapshot('fs.writeFileSync');
    expect(console.log).toMatchSnapshot('console.log');
  });
});
