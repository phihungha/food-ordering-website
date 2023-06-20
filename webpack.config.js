const path = require('path');
const glob = require('glob');

const client = {
  entry: glob.sync('./src/public/scripts/**.ts').reduce((result, item) => {
    result[path.parse(item).name] = item;
    return result;
  }, {}),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist/public/scripts'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: { chunks: 'all' },
  },
  plugins: [],
  // Disable nest build default ignore options
  externalsPresets: {},
  externals: [],
};

function server(options) {
  return options;
}

module.exports = [server, client];
