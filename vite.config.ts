/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2023-04-25 17:52:00
 * @LastEditors        : Felix
 * @LastEditTime       : 2023-04-25 18:49:32
 */

// @ts-nocheck
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'
import commonjsExternals from "vite-plugin-commonjs-externals";
import path from "path";
import pkg from "./package.json";

export default () => {
  console.log(`\n\t版本：\x1B[32m${pkg.version}\x1B[39m\n`);

  return defineConfig({
    plugins: [
      commonjsExternals({
        externals: ["child_process"],
      }),
      dts(),
    ],
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
    build: {
      lib: {
        entry: "src/baseboard.ts",
        name: "baseboard",
        // formats: ["umd"],
        fileName: (format) => `baseboard.${format}.js`,
      },
      outDir: "lib",
    },
  });
};

function testNodeModule(id: string, node_modules: string[]): boolean {
  return new RegExp(`node_modules/[.pnpm/]?(${node_modules.join("|")})`).test(
    id
  );
}
