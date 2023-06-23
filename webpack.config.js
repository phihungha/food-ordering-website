const path = require('path');
const glob = require('glob');

function client(options) {
  return {
    entry: glob.sync('./src/public/scripts/**.ts').reduce((result, item) => {
      result[path.parse(item).name] = item;
      return result;
    }, {}),
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist/public/scripts'),
      filename: '[name].js',
    },
    module: {
      rules: [
        ...options.module.rules,
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    optimization: {
      splitChunks: { chunks: 'all' },
    },
    plugins: [],
    // Disable nest build default ignore options
    externalsPresets: {},
    externals: [],
  };
}

function server(options) {
  return options;
}

module.exports = [server, client];
