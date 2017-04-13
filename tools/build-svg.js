import { src, dest, watch, parallel, series, lastRun } from 'gulp'
import plumber from 'gulp-plumber'
import cache from 'gulp-cached'
import remember from 'gulp-remember'
import svgmin from 'gulp-svgmin'
import svgstore from 'gulp-svgstore'
import rename from 'gulp-rename'

export const buildSvg = () => src('./src/svg/**/*.svg')
  .pipe(plumber())
  // .pipe(cache('svg'))
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  // .pipe(remember('svg'))
  .pipe(rename('sprite.svg'))
  .pipe(dest('./build/img/'))
