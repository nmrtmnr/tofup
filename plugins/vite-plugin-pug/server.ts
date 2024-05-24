import * as fs from "node:fs";
import * as path from "node:path";
import { send, UserConfig } from "vite";
import type { ViteDevServer, Plugin } from "vite";
import { compileFile } from "pug";
import { PugViteOptions } from "./index.js";
import { glob } from "glob";
import { checkDynamic, getRouterFile } from "./util/checkDynamic.js";
import { importSource } from "./util/runInVM.js";

const transformPugToHtml = (
  server: ViteDevServer,
  path: string,
  options?: PugViteOptions
) => {
  try {
    const compiled = compileFile(path, options?.options)(options?.data);
    return server.transformIndexHtml(path, compiled);
  } catch (error) {
    console.log(error);
    return server.transformIndexHtml(path, "Pug Compile Error");
  }
};

export const vitePluginPugServe = (options: PugViteOptions): Plugin => {
  let userConfig: UserConfig;
  let root: string;
  return {
    name: "vite-plugin-pug-serve",
    enforce: "pre",
    apply: "serve",
    handleHotUpdate(context) {
      context.server.ws.send({
        type: "full-reload",
      });
      return [];
    },
    config(cfg) {
      userConfig = cfg;
      root = options.root || userConfig.root || "/";
    },
    configureServer(server) {
      const removeMatchingPath = (from: string, to: string) => {
        // パスの先頭と末尾のスラッシュを削除
        let fromPath = from.replace(/^\/|\/$/g, "").split("/");
        let toPath = to.replace(/^\/|\/$/g, "").split("/");
        return (
          fromPath
            .filter((item, i) => {
              return item !== toPath[i];
            })
            .join("/") || "/"
        );
      };

      server.middlewares.use(async (req, res, next) => {
        const projectRoot = path.join(server.config.root, options.view);
        console.log("projectRoot", projectRoot);
        let requestURL = (req.url || "")
          .replace(root, "/")
          .split("#")[0]
          .split("?")[0];
        if (requestURL.endsWith("/")) {
          requestURL = removeMatchingPath(requestURL, userConfig.base || "");
          requestURL = path.join(requestURL, "index.html");
        } else if (requestURL.endsWith(".html")) {
          requestURL = removeMatchingPath(requestURL, userConfig.base || "");
        }
        let fullReqPath = path.join(projectRoot, requestURL);
        if (fullReqPath.endsWith("/")) {
          fullReqPath = path.join(fullReqPath, "index.html");
        }

        if (fullReqPath.endsWith(".html")) {
          // HTMLファイルがあればそのまま次のステップ
          if (fs.existsSync(fullReqPath)) {
            return next();
          }

          const pugPath = `${
            fullReqPath.slice(0, Math.max(0, fullReqPath.lastIndexOf("."))) ||
            fullReqPath
          }.pug`;

          // pugファイルが存在しない場合
          if (!fs.existsSync(pugPath)) {
            // DynamicRoutingをチェック
            const regexp = /.*\[.*\].*\.pug/;
            const dynamicFiles = glob
              .sync(path.join(projectRoot, "**/*.pug"), {
                nodir: true,
              })
              .filter((p) => regexp.test(p));
            const targetData = checkDynamic(pugPath, dynamicFiles);
            if (targetData) {
              for (const targetDatum of targetData) {
                const routeFile = getRouterFile(targetDatum.pug);
                const modules = await importSource<{
                  onRequest: (data: object) => Promise<{}[]>;
                }>(routeFile);
                const d = await modules.onRequest(options.data);
                let result = d.filter((item: { [index: string]: any }) => {
                  return (
                    item[targetDatum.match] === targetDatum[targetDatum.match]
                  );
                })[0];
                // resultがない、つまりDynamicRoutingが予定されていなければ次のステップ
                if (!result) continue;
                options.data = Object.assign(options.data, {
                  [targetDatum.match]: targetDatum[targetDatum.match],
                  ...result,
                });
                const html = await transformPugToHtml(
                  server,
                  targetDatum.pug,
                  options
                );
                return send(req, res, html, "html", {});
              }
            } else {
              return next();
            }
          }

          const html = await transformPugToHtml(server, pugPath, options);
          return send(req, res, html, "html", {});
        } else {
          return next();
        }
      });
    },
  };
};
