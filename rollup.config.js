import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import stripCode from "rollup-plugin-strip-code";

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "typsy"
    },
    plugins: [
      terser({
        compress: true,
        ecma: 8,
        mangle: {
          keep_classnames: true
        }
      }),
      stripCode({
        start_comment: "START.DEV",
        end_comment: "END.DEV"
      })
    ]
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/index.development.js",
      format: "umd",
      name: "typsy"
    }
  },
  {
    input: "./src/index.js",
    output: {
      file: "dist/typsy.es5.js",
      format: "umd",
      name: "typsy"
    },
    plugins: [
      babel({
        exclude: "node_modules/**"
      }),
      terser({
        ecma: 5,
        compress: {
          drop_console: true
        }
      })
    ]
  },
  {
    input: "./src/index.js",
    output: {
      file: "dist/typsy.es5.development.js",
      format: "umd",
      name: "typsy"
    },
    plugins: [
      babel({
        exclude: "node_modules/**"
      }),
      terser({
        ecma: 5
      })
    ]
  }
];
