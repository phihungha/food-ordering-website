const path = require('path');

const client = {
  entry: './src/public/scripts/index.ts',
  mode: 'none',
  target: 'web',
  externalsPresets: {},
  externals: [],
  output: {
    path: path.resolve(__dirname, 'dist', 'public'),
    filename: 'bundle.js',
  },
  plugins: [],
};

function server(options) {
  return options;
}

module.exports = [server, client];
