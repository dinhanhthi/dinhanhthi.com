import json from "@rollup/plugin-json";

export default [
  {
    input: ['src/js/main.js'],
    output: [
      {
        file: "src/js/main.min.js",
        format: "iife",
        sourcemap: false,
      },
    ],
    plugins: [json()],
  }
];
