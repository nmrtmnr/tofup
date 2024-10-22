/* vite.config.ts */
// common
import fs from "node:fs";
import path from "node:path";
import { log } from "node:console";
import * as glob from "glob";
import deepmerge from "deepmerge";
import { isPlainObject } from "is-plain-object";
import imageSize from "image-size";

// vite
import { defineConfig, loadEnv } from "vite";

// plugins
import vitePluginPug from "./plugins/vite-plugin-pug/dist/index.cjs";

const getData = (): Object => {
  let datum = {};
  const baseDir = path.resolve(__dirname, "src/data");

  const files = glob
    .sync(path.join(baseDir, "/**/*"), {
      nodir: true,
    })
    .map((file) => file);
  // log("src/data -> files: ", files);

  for (const file of files) {
    if (
      path.extname(file) === ".ts" ||
      path.extname(file) === ".js" ||
      path.extname(file) === ".json"
    ) {
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
  }

  log("data: ", JSON.stringify(datum, null, 2));
  return datum;
};

export default ({ mode }) => {
  log("mode: ", loadEnv(mode, process.cwd()));
  return defineConfig({
    root: "./src",
    plugins: [
      vitePluginPug({
        options: {
          doctype: "html",
          pretty: true,
          basedir: path.resolve(__dirname, "src/html"),
        },
        view: "./html/pages",
        data: {
          data: getData(),
          imageSize: (src: string) => {
            const srcPath = path.resolve(__dirname, "src");
            const filePath = path
              .resolve(srcPath, src.slice(1))
              .replace("/src/img/", "/src/public/img/");
            if (fs.existsSync(filePath)) {
              return imageSize(filePath);
            }
          },
        },
      }),
    ],
    build: {
      emptyOutDir: true,
      outDir: path.resolve(__dirname, "dist"),
      minify: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, `dist + "" ? "/" + "" + "/" : ""}`),
          chunkFileNames: () => {
            return `/scripts/[name].js`;
          },
          assetFileNames: (info) => {
            const imageRegExp = /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i;
            const styleRegExp = /\.(styl|stylus|css)$/i;
            if (info.name && styleRegExp.test(info.name)) {
              return `assets/styles/[name].[ext]`;
            } else if (info.name && imageRegExp.test(info.name)) {
              return `assets/images/[name].[ext]`;
            } else {
              return `assets/[name].[ext]`;
            }
          },
        },
      },
    },
    preview: {
      open: "/",
    },
    server: {
      open: "/",
    },
  });
};
