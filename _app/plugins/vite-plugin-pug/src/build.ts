import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import type {Plugin, UserConfig} from "vite";
import { compileFile } from "pug";
import { PugViteOptions } from "./index.js";
import deepmerge from "deepmerge";
// @ts-ignore
import { isPlainObject } from "is-plain-object";

export const vitePluginPugBuild = (options: PugViteOptions): Plugin => {
  const pathMap: Record<string, string> = {};
  let root: string;
  let userConfig: UserConfig;
  return {
    name: "vite-plugin-pug-build",
    enforce: "pre",
    apply: "build",
    config(cnf)  {
      userConfig = cnf;
      root = options.root || cnf.root || "/";
    },
    options(inputOptions) {
      const globbingPath = path.join(path.resolve(root), options.view, options.src);
      const files = glob.sync(globbingPath, {
        nodir: true
      })
      let  createOption: {input: {[index: string]: string}} = {
        input: {}
      }
      for (const file of files) {
        const relativePath = path.relative(path.resolve(path.join(root, options.view)), file)
        const viewsRoot = relativePath.replace(path.extname(file), "")
        createOption = deepmerge(createOption, {
          input: {
            [viewsRoot]: file
          }
        })
      }
      return deepmerge(inputOptions, createOption, {
        // @ts-ignore
        isMergedOption: isPlainObject
      })
    },
    resolveId(source: string) {
      if (source.endsWith(".pug")) {
        const dummy = `${
          source.slice(0, Math.max(0, source.lastIndexOf("."))) || source
        }.html`.replace(options?.view, "");
        pathMap[dummy] = source;
        return dummy;
      }
    },
    load(id: string) {
      if (id.endsWith(".html")) {
        if (pathMap[id]) {
          const html = compileFile(pathMap[id], options?.options)(options?.data);
          return html;
        }
        return fs.readFileSync(id, "utf-8");
      }
    },
  };
};
