import { src, dest, watch, parallel, series, lastRun } from 'gulp'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import stripAnsi from 'strip-ansi'
import config from './webpack.config'

import { create as bsCreate } from 'browser-sync'

import { buildSvg } from './tools/build-svg'
import { buildCss } from './tools/build-css'
import { buildPug } from './tools/build-pug'
import { buildImage } from './tools/build-image'

const browserSync = bsCreate()

const dirs = {
  src: 'src',
  dest: 'build'
}

const sources = {
  pug: [`${dirs.src}/template/**/*.pug`],
  cssLayout: `${dirs.src}/css/layout/**/*.styl`,
  cssUi: `${dirs.src}/css/ui/**/*.styl`,
  css: `${dirs.src}/css/**/*.styl`
}

const bundler = webpack(config)

bundler.plugin('done', function(stats) {
  if (stats.hasErrors() || stats.hasWarnings()) {
    return browserSync.sockets.emit('fullscreen:message', {
      title: "Webpack Error:",
      body: stripAnsi(stats.toString()),
      timeout: 100000
    })
  }
  browserSync.reload()
})

export const browserSyncStart = () => {
  browserSync.init({
    files: ["build/**/*"],
    server: {
      baseDir: dirs.dest,
      directory: true,
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: config.output.publicPath,
          noInfo: false,
          quiet: false,
          reload: true,
          index: "index.html",
          stats: {
            assets: true,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false
          }
        }, browserSync.reload()),
      ]
    }
  })
}

export const devWatch = () => {
  global.watch = true
  watch([sources.pug, './build/img/sprite.svg'], series(buildPug)).on('all', (event, filepath) => {
    global.changedTempalteFile = filepath.replace(/\\/g, '/')
  })
  watch(sources.css, series(buildCss))
  watch('src/svg/**/*.svg', series(buildSvg))
  watch('./src/img/**/*.{png,jpg,jpeg}', series(buildImage))
}

export const dev = parallel(devWatch, browserSyncStart)

export default dev
