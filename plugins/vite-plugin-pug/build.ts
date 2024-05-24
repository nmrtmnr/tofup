import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import type { Plugin, UserConfig } from "vite";
import { compileFile } from "pug";
import { PugViteOptions } from "./index.js";
import deepmerge from "deepmerge";
// @ts-ignore
import { isPlainObject } from "is-plain-object";
import { importSource } from "./util/runInVM.js";
import { getBetweenStr, getRouterFile } from "./util/checkDynamic.js";

export const vitePluginPugBuild = (options: PugViteOptions): Plugin => {
  const regexp = /.*\[.*\].*\.pug/;
  const pathMap: Record<
    string,
    {
      source: string;
      data: {};
    }
  > = {};
  let root: string;
  let userConfig: UserConfig;
  let dynamicPageData: { [p: string]: any } = {};
  return {
    name: "vite-plugin-pug-build",
    enforce: "pre",
    apply: "build",
    config(cnf) {
      userConfig = cnf;
      root = options.root || cnf.root || "/";
    },
    async options(inputOptions) {
      const globbingPath = path.join(
        path.resolve(root),
        options.view,
        options.src
      );
      const dynamicFiles = glob
        .sync(globbingPath, {
          nodir: true,
        })
        .filter((item) => regexp.test(item));
      const files = glob
        .sync(globbingPath, {
          nodir: true,
        })
        .filter((item) => !dynamicFiles.includes(item));
      let createOption: { input: { [index: string]: string } } = {
        input: {},
      };
      for (const file of files) {
        const relativePath = path.relative(
          path.resolve(path.join(root, options.view)),
          file
        );
        const viewsRoot = relativePath.replace(path.extname(file), "");
        createOption = deepmerge(createOption, {
          input: {
            [viewsRoot]: file,
          },
        });
      }
      const promises = dynamicFiles.map((file) => {
        return new Promise(async (resolve) => {
          const slug = getBetweenStr(file);
          if (!slug) return resolve(null);
          const relativePath = path.relative(
            path.resolve(path.join(root, options.view)),
            file
          );
          const viewsRoot = relativePath.replace(path.extname(file), "");
          const dynamicRouteFile = getRouterFile(file);
          const dynamicData = await importSource<{
            onRequest: (data: object) => Promise<{ [p: string]: any }[]>;
          }>(dynamicRouteFile);
          const data = await dynamicData.onRequest(options.data || {});
          dynamicPageData = deepmerge(dynamicPageData, {
            [file]: {
              data: data,
              done: 0,
            },
          });
          for (const d of data) {
            const requestURL = viewsRoot.replace(`[${slug}]`, d[slug]);
            createOption = deepmerge(createOption, {
              input: {
                [requestURL]: file,
              },
            });
          }
          resolve(null);
        });
      });
      await Promise.all(promises);
      return deepmerge(inputOptions, createOption, {
        // @ts-ignore
        isMergedOption: isPlainObject,
      });
    },
    resolveId(source: string, a, v) {
      if (source.endsWith(".pug")) {
        const slug = getBetweenStr(source);
        if (!slug) {
          // Dynamicルーティングじゃないやつ
          const dummy = `${
            source.slice(0, Math.max(0, source.lastIndexOf("."))) || source
          }.html`.replace(options?.view, "");
          pathMap[dummy] = {
            source,
            data: {},
          };
          return dummy;
        } else {
          // Dynamicルーティングのやつ
          const data = dynamicPageData[source];
          const dummy = `${
            source.slice(0, Math.max(0, source.lastIndexOf("."))) || source
          }.html`
            .replace(options?.view, "")
            .replace(`[${slug}]`, data.data[data.done][slug]);
          pathMap[dummy] = {
            source,
            data: data.data[data.done],
          };
          dynamicPageData[source].done = dynamicPageData[source].done + 1;
          return dummy;
        }
      }
    },
    load(id: string) {
      if (id.endsWith(".html")) {
        if (pathMap[id]) {
          const html = compileFile(
            pathMap[id].source,
            options?.options
          )(deepmerge(options.data || {}, pathMap[id].data));
          return html;
        }
        return fs.readFileSync(id, "utf-8");
      }
    },
  };
};
