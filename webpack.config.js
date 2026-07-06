const path = require('path')

module.exports = {
  mode: 'development',
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
