const path = require('path');
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line import/no-extraneous-dependencies
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  entry: path.resolve(__dirname, 'src/app.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    /* REquired if creating a library */
    /* library: "$",
    libraryTarget: "umd", */
  },
  target: 'node', // use require() & use NodeJs CommonJS style
  devtool: argv.mode === 'development' ? 'source-map' : undefined,
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externalsPresets: {
    node: true, // in order to ignore built-in modules like path, fs, etc.
  },
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|\.huskey|build)/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/database'),
          to: path.resolve(__dirname, 'build'),
        },
        {
          from: path.resolve(__dirname, '.sequelizerc'),
          to: path.resolve(__dirname, 'build'),
        },
      ],
    }),
  ],
  mode: argv.mode || 'production',
});
