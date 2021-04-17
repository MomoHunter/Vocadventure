const { WebpackManifestPlugin } =require('webpack-manifest-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/Vocadventure/' : '/',
  configureWebpack: {
    plugins: [
      new WebpackManifestPlugin({
        basePath: process.env.NODE_ENV === 'production' ? '/Vocadventure/' : '/',
        fileName: 'files.js',
        filter: file => {
          let nameParts = file.name.split('/')
          if (nameParts.length > 0) {
            let fileName = nameParts[nameParts.length - 1]
            return !((fileName.startsWith('app') || fileName.startsWith('chunk')) && fileName.endsWith('map'))
          }
          return true
        },
        serialize: obj => {
          return 'var FILES = ' + JSON.stringify(obj)
        }
      })
    ]
  }
}