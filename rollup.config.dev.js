import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import livereload from 'rollup-plugin-livereload'

export default {
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  input: 'test/index.js',
  output: {
    file: 'dist/amap-cluster-canvas.test.js',
    format: 'iife',
    sourcemap: true
  },
  watch: {
    include: ['src/**', 'test/**']
  },
  plugins: [
    replace( {
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    } ),
    babel( {
      exclude: 'node_modules/**'
    } ),
    serve( {
      // Launch in browser (default: false)
      open: true,

      // Show server address in console (default: true)
      verbose: true,

      // Folder to serve files from
      contentBase: '',

      // Multiple folders to serve from
      // contentBase: ['dist', 'static'],

      // Set to true to return index.html instead of 404
      historyApiFallback: false,

      // Options used in setting up server
      host: 'localhost',
      port: 3000
    } ),
    livereload()
  ]
}
