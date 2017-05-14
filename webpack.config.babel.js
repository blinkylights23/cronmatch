
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
              [ 'env', { 'targets': { 'browsers': ['last 2 versions', 'ie >= 10'] } } ]
            ],
            plugins: [
              'add-module-exports',
              'transform-es2015-modules-umd'
            ]
          }
        }]
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
};