import { log } from "console";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * ディレクトリを削除する
 * @param targetDir 対象ディレクトリ
 * @param deleteList targetDirから削除するディレクトリ
 */
const Plugin = (targetDir: string, deleteList: string[]): Plugin => {
  return {
    name: "vite-delete-directory",
    apply: "build",
    closeBundle: () => {
      log("------------------");
      log("👉 Start Delete items");
      log("→ deleteList: ", deleteList);

      // targetDir の path を作成
      targetDir = path.join(__dirname, "../" + targetDir);
      log("targetDir:", targetDir);

      // targetDir が存在しない場合は処理を終了
      if (!fs.existsSync(targetDir)) return;

      // targetDir から deleteList を取得して削除
      deleteList.forEach((item) => {
        const removeTarget = path.join(targetDir, item);

        try {
          fs.rmSync(removeTarget, { force: true, recursive: true });
          log(`→ Deleted ${removeTarget}`);
        } catch (error) {
          console.error(error.message);
        }
      });

      log("👉 Done delete items");
      log("------------------");
    },
  };
};

export default Plugin;
