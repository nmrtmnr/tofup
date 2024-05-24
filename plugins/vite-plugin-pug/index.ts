// @ts-ignore
import deepmerge from "deepmerge";

import { vitePluginPugBuild } from "./build.js";
import { vitePluginPugServe } from "./server.js";
import * as pug from "pug";

// refs: https://pugjs.org/api/reference.html
export type TOptions = Omit<pug.Options, "name">;
export type TData = object;

export interface PugViteOptions {
  view: string
  root?: string
  src: string
  options: TOptions
  data: TData
};

const defaultOptions: PugViteOptions = {
  view: "pages",
  src: "/**/*.pug",
  options: {},
  data: {}
};

const vitePluginPug = (options: Partial<PugViteOptions> = {}) => {
  const mergeOptions = deepmerge(defaultOptions, options);
  return [vitePluginPugBuild(mergeOptions), vitePluginPugServe(mergeOptions)];
};
export default vitePluginPug;
