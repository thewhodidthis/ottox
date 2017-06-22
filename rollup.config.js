import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.es',
  plugins: [
    babel(),
  ],
  targets: [
    {
      format: 'iife',
      moduleName: 'Otto',
      dest: 'dist/otto.js'
    },
    {
      format: 'cjs',
      dest: 'index.js'
    }
  ]
};
