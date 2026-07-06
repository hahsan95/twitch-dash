const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  plugins: [
    // Not a demo build: the app talks to the real Express backend.
    // (See demo.config.js for the static demo build.)
    new webpack.DefinePlugin({
      'process.env.DEMO_MODE': '"false"',
      'process.env.TWITCH_CLIENT_ID': '""'
    })
  ],
  optimization: {
    // Embed the real NODE_ENV into the bundle (defaults to the webpack mode
    // otherwise), so e.g. NODE_ENV=test builds can gate test-only modules.
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  entry: ['./client/index.js'],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
