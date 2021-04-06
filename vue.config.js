const { WebpackManifestPlugin } =require('webpack-manifest-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/Vocadventure/' : '/',
  configureWebpack: {
    plugins: [
      new WebpackManifestPlugin({
        basePath: process.env.NODE_ENV === 'production' ? '/Vocadventure/' : '/',
        fileName: 'files.js',
        serialize: obj => {
          return 'var FILES = ' + JSON.stringify(obj)
        }
      })
    ]
  }
}