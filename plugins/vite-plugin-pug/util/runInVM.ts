import {BuildOptions} from "esbuild";
import vm from "vm";

const importSource = async<T extends {}>(filePath: string) => {
    const targetBuilder = "esbuild";
    const builder = await import(targetBuilder);
    // esbuildでroute.tsのコードをコンパイル
    const buildOption: BuildOptions = {
        entryPoints: [filePath],
        write: false,
        platform: "node",
        format: "cjs",
        target: "es6",
        bundle: true,
    }
    const build = await (builder.build)(buildOption);
    const code = build.outputFiles[0].text;
    // コンパイルしたコードを、vmで実行しonRequestを取得
    const context = vm.createContext({
        module,
        console,
        process
    });
    vm.runInContext(code, context);
    return (context.module.exports as T);
}

export {
    importSource
}