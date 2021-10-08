import json from "@rollup/plugin-json";

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: "src/_includes/main.min.js",
        format: "iife",
        sourcemap: false,
      },
    ],
    plugins: [json()],
  }
];
