import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return id => pattern.test(id)
}

export default {
  input: 'src/index.js',

  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],

  external: makeExternalPredicate([
    // ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]),

  plugins: [
    // TODO: why was that there?
    // babel({ plugins: ['external-helpers'] }),
    resolve({
      // use "module" field for ES6 module if possible
      module: true, // Default: true

      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: false,  // Default: false

      // use "main" field or index.js, even if it's not an ES6 module
      // (needs to be converted from CommonJS to ES6
      // – see https://github.com/rollup/rollup-plugin-commonjs
      main: true,  // Default: true

      // some package.json files have a `browser` field which
      // specifies alternative files to load for people bundling
      // for the browser. If that's you, use this option, otherwise
      // pkg.browser will be ignored
      browser: true,  // Default: false

      // not all files you want to resolve are .js files
      extensions: [ '.mjs', '.js', '.jsx', '.json' ],  // Default: [ '.mjs', '.js', '.json', '.node' ]

      // whether to prefer built-in modules (e.g. `fs`, `path`) or
      // local ones with the same names
      preferBuiltins: false,  // Default: true

      // Lock the module search in this path (like a chroot). Module defined
      // outside this path will be marked as external
      // jail: '/my/jail/path', // Default: '/'

      // Set to an array of strings and/or regexps to lock the module search
      // to modules that match at least one entry. Modules not matching any
      // entry will be marked as external
      // only: [
      //   /^state-transducer/,
      //   /^penpal/,
      // ], // Default: null

      // If true, inspect resolved files to check that they are
      // ES2015 modules
      modulesOnly: false, // Default: false

      // Any additional options that should be passed through
      // to node-resolve
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs({
      include: ['node_modules/**'],
      //   // non-CommonJS modules will be ignored, but you can also
      //   // specifically include/exclude files
      //   include: 'node_modules/fast-json-patch/lib/duplex.js',  // Default: undefined
      //   // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
      //   // these values can also be regular expressions
      //   // include: /node_modules/
      //   // exclude: [ /node_modules\/[a-f].*/], mined
      //
      //   // search for files other than .js files (must already
      //   // be transpiled by a previous plugin!)
      //   // extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]
      //
      //   // if true then uses of `global` won't be dealt with by this plugin
      //   ignoreGlobal: false,  // Default: false
      //
      //   // if false then skip sourceMap generation for CommonJS modules
      //   // sourceMap: false,  // Default: true
      //
      //   // explicitly specify unresolvable named exports
      //   // (see below for more details)
      //   namedExports: { './module.js': ['foo', 'bar' ] },  // Default: undefined
      //
      //   // sometimes you have to leave require statements
      //   // unconverted. Pass an array containing the IDs
      //   // or a `id => boolean` function. Only use this
      //   // option if you know what you're doing!
      //   ignore: [ 'conditional-runtime-dependency' ]
    }),
    terser()
  ],
}
