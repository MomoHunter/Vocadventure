import fs from 'fs'
import path from 'path'

export default function filePlugin(opt) {
  let outDir = ''
  return {
    name: 'vite-plugin-files',
    enforce: 'post',
    configResolved (config) {
      outDir = config.build.outDir
    },
    closeBundle () {
      walk(outDir, (err, results) => {
        if (err) {
          console.error(err)
        } else {
          results.push(opt.path)
          fs.writeFile(
            `${outDir}/${opt.path}`,
            opt.serialize ? opt.serialize(results) : JSON.stringify(results, null, 2),
            (err) => {
              console.error(err)
            }
          )
        }
      })
    }
  }
}

function walk (dir, done) {
  var results = []
  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err)
    }

    var pending = list.length

    if (!pending) {
      return done(null, results)
    }

    list.forEach(file => {
      let filePath = path.resolve(dir, file)
      fs.stat(filePath, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(filePath, (err, res) => {
            res = res.map(result => file + '/' + result)
            results = results.concat(res)
            pending -= 1
            if (pending === 0) {
              done(null, results)
            }
          })
        } else {
          results.push(file)
          pending -= 1
          if (pending === 0) {
            done(null, results)
          }
        }
      })
    })
  })
}