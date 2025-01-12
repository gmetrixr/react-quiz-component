import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import types from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-scripts': 'ReactScripts',
};

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

export default [
  {
    input: './src/lib/Quiz.tsx',
    external: Object.keys(globals),
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        globals,
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
        globals,
      },
    ],
    plugins: [
      peerDepsExternal(),
      typescript(),
      nodeResolve({
        modulePaths: ['./src/lib/'],
        browser: true,
        preferBuiltins: true,
        jsnext: true,
        extensions,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      postcss({
        plugins: [],
        minimize: true,
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions,
        presets: [
          '@babel/preset-env',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      terser(),
    ],
  },
  {
    input: './dist/dts/lib/Quiz.d.ts',
    external: [/\.css$/],
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
