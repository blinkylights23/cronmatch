
export default {
  context: __dirname + '/src',
  entry: {
    app: './index'
  },
  output: {
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    library: 'cronmatch'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: { 
            presets: [ 
              [ "env", { "targets": { "browsers": ["last 2 versions", "ie >= 10"] } } ]
            ]
          }
        }]
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
};