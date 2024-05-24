import path from "node:path";
import * as glob from "glob";
import deepmerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

import { defineConfig, loadEnv } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
// import viteJoinMediaQueries from "vite-join-media-queries";

import vitePluginPug from "./plugins/vite-plugin-pug";
// import cssURLReplacer from "./plugins/cssURLReplacer";

const PROJECT_ROOT_PATH = "";
const ASSETS_PATH = PROJECT_ROOT_PATH
  ? PROJECT_ROOT_PATH + "/assets"
  : "assets";

const getData = (): Object => {
  let datum = {};
  const baseDir = path.resolve(__dirname, "/src/data");
  const files = glob
    .sync(path.join(baseDir, "/../*.ts"), {
      nodir: true,
    })
    .map((file) => file);

  for (const file of files) {
    const relativePaths = path
      .relative(baseDir, file)
      .replace(path.extname(file), "")
      .split("/");

    let tempData = require(file);
    for (const key of relativePaths.reverse()) {
      tempData = { [key]: tempData };
    }

    datum = deepmerge(datum, tempData, {
      isMergeableObject: isPlainObject,
    });
  }
  console.log("datum: ", JSON.stringify(datum, null, 2));

  return datum;
};

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  console.log(process.env.NODE_ENV);

  return defineConfig({
    plugins: [
      vitePluginPug({
        options: {
          doctype: "html",
          pretty: true,
          basedir: path.resolve(__dirname, "src/html"),
        },
        view: "./src/html/pages",
        data: {
          data: getData(),
          baseUrl: process.env.VITE_BASE_URL,
          projectRoot: process.env.VITE_PROJECT_ROOT,
        },
      }),
      ViteImageOptimizer({
        exclude: [],
      }),
      // viteJoinMediaQueries({
      //   paths2css: [`./dist/${ASSETS_PATH}/styles`],
      //   cssnanoConfig: { preset: "default" },
      // }),
      // cssURLReplacer(),
    ],
    root: "src",
    build: {
      emptyOutDir: true,
      outDir: path.resolve(__dirname, "dist"),
      minify: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          dir: path.resolve(
            __dirname,
            `dist${PROJECT_ROOT_PATH ? "/" + PROJECT_ROOT_PATH + "/" : ""}`
          ),
          chunkFileNames: () => {
            return `${ASSETS_PATH}/scripts/[name].js`;
          },
          assetFileNames: (info) => {
            const imageRegExp = /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i;
            const styleRegExp = /\.(styl|stylus|css)$/i;
            if (styleRegExp.test(info.name)) {
              return `assets/styles/[name].[ext]`;
            } else if (imageRegExp.test(info.name)) {
              return `assets/images/[name].[ext]`;
            } else {
              return `assets/[name].[ext]`;
            }
          },
        },
      },
    },
    preview: {
      open: PROJECT_ROOT_PATH,
    },
    server: {
      open: PROJECT_ROOT_PATH,
    },
  });
};
