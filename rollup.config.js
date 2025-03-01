// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

export default [
  // CommonJS and ESM builds
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/oho-spin.cjs.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/oho-spin.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(), 
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true, 
        declarationDir: "dist", 
      }),
      terser(), 
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: "dist/oho-spin.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
