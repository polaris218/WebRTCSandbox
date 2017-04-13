import { src, dest, watch, parallel, series, lastRun } from 'gulp'
import pug from 'gulp-pug'
import pugInheritance from 'yellfy-pug-inheritance'
import gulpif from 'gulp-if'
import filter from 'gulp-filter'
import plumber from 'gulp-plumber'

let pugInheritanceCache = {}
const pugDirectory = 'src/template'

export const buildPug = () => {
  return new Promise((resolve, reject) => {
    const changedFile = global.changedTempalteFile
    const options = {
      changedFile,
      treeCache: pugInheritanceCache
    }

    // Update cache for all files or only for specified file
    pugInheritance.updateTree(pugDirectory, options).then((inheritance) => {
      // Save cache for secondary compilations
      pugInheritanceCache = inheritance.tree
      return src([`${pugDirectory}/*.pug`, `!${pugDirectory}/_*.pug`])
        // We can use Cache only for Watch mode
        .pipe(plumber())
        .pipe(gulpif(global.watch, filter((file) => pugFilter(file, inheritance))))
        .pipe(pug({
          pretty: true
        }))
        .pipe(dest('build'))
        .on('end', resolve)
        .on('error', reject)
    })
  })
}

function pugFilter (file, inheritance) {
  const filepath = `${pugDirectory}/${file.relative}`
  if (inheritance.checkDependency(filepath, global.changedTempalteFile)) {
    console.log(`Compiling: ${filepath}`)
    return true
  }
  return false
}
