import { terser } from "rollup-plugin-terser";
import scss from 'rollup-plugin-scss';

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: "js/min.js",
        format: "iife",
        sourcemap: true,
        plugins: [terser()],
      },
    ],
  },
  {
    input: 'css/main_input.js',
    output: {
      file: 'css/main.js',
      format: 'esm'
    },
    plugins: [
      scss({
        watch: ['css/components', 'css'],
      })
    ]
  }
];
