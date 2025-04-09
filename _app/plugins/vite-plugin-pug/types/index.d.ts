export type TOptions = any;
export type TData = any;
export interface PugViteOptions {
    view?: string;
    base?: string;
    src?: string;
    options?: TOptions;
    data?: TData;
}
declare const vitePluginPug: (options?: PugViteOptions) => import("vite").Plugin[];
export default vitePluginPug;
