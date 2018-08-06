import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import {
  terser
} from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'


export default {
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify 
  // `file` and `format` for each target)
  input: 'src/cluster.js',
  output: [{
      name: 'amap-cluster-canvas',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    }, {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    terser()
  ]
}