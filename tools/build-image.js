
import { src, dest, watch, parallel, series, lastRun } from 'gulp'
import tinypng from 'gulp-tinypng-compress'

export const buildImage = () => src('./src/img/**/*.{png,jpg,jpeg}')
  .pipe(tinypng({
    key: 'wFsD0dwWNjsvqdjfVOZI_hU8zq2sNvDD',
    sigFile: './src/img/.tinypng-sigs',
    log: true
  }))
  .pipe(dest('./build/img'))
