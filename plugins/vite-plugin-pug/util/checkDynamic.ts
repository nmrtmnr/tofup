import path from "path";

const isDynamicName = (dirname: string) => {
    return /.*\[.*\].*/.test(dirname)
}

const getBetweenStr = (str: string) => {
    const startIndex = str.indexOf('[');
    if (startIndex === -1) {
        return false;
    }
    const nextIndex = startIndex + 1;
    const endIndex = str.indexOf(']', nextIndex);
    if (endIndex === -1) {
        return false;
    }
    return str.substring(nextIndex, endIndex);
}

const createRegExp = (f: string) => {
    const id = getBetweenStr(f);
    const regexp = new RegExp(f.replace(`[${id}]`, `[^${path.sep}]*`));
    return regexp;
}

const checkDynamic = (url: string, files: string[])=> {
    let targetFiles = [];
    for (const dynamicFile of files) {
        const regexp = createRegExp(dynamicFile);
        if (regexp.test(url)) {
            targetFiles.push(dynamicFile);
        }
    }
    if (targetFiles.length === 0) return false;
    const result: {[p: string]: string, pug: any, match: string, url: string}[] = [];
    for (const targetFile of targetFiles) {
        const match = getBetweenStr(targetFile);
        const urlArray = url.split(path.sep);
        let id = targetFile.split(path.sep).map((val, currentIndex) => {
            if (/\[.*\]/.test(val)) {
                const deleteArr = val.split(`[${match}]`);
                let u = urlArray[currentIndex];
                for (const d of deleteArr) {
                    u = u.replace(d, "")
                }
                return u;
            }
            return undefined
        }).filter(item => typeof item !== "undefined")[0]
        if (typeof match === "string" && typeof id === "string") {
            result.push({
                match,
                url: url,
                pug: targetFile,
                [`${match}`]: id
            });
        }
    }
    if (result.length === 0) return false;
    return result;
}

const getRouterFile = (file: string) => {
    let isDynamicAfter = false;
    const dynamicRouteFile = path.join(file.split(path.sep).map(item => {
        if (isDynamicName(item)) {
            isDynamicAfter = true;
            if (!path.extname(item)) return item
        }
        if (!isDynamicAfter) return item;
        return ""
    }).join("/"), "route.ts");
    return dynamicRouteFile;
}

export {
    checkDynamic,
    getBetweenStr,
    isDynamicName,
    getRouterFile
}