import fs from "fs";

/**
 * @param {string} file
 */
export function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * @param {string} file
 * @param {any} data
 */
export function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/**
 * @param {string} dirFrom 
 * @param {string} dirTo 
 */
export function move(dirFrom, dirTo) {
    const files = fs.readdirSync(dirFrom);
    for (const file of files) {
        const loadedFile = fs.lstatSync(`${dirFrom}/${file}`);
        if (loadedFile.isDirectory()) {
            if (!fs.existsSync(`${dirTo}/${file}`)) fs.mkdirSync(`${dirTo}/${file}`);
            move(`${dirFrom}/${file}`, `${dirTo}/${file}`);
            fs.rmdirSync(`${dirFrom}/${file}`, { maxRetries: 3 });
        } else {
            moveFile(`${dirFrom}/${file}`, `${dirTo}/${file}`);
        }
    }
}

/**
 * @param {string} fileFrom
 * @param {string} fileTo
 */
export function moveFile(fileFrom, fileTo) {
    fs.renameSync(fileFrom, fileTo);
}

/**
 * @param {string} dir
 * @param {[string | RegExp, any][]} map
 */
export function renameByMap(dir, map) {
    for (const [first, second] of map) {
        if (Array.isArray(second)) {
            if (typeof first !== "string") throw new Error("First element of array must be a string.");
            renameByMap(`${dir}/${first}`, second);
            continue;
        }

        const fileRenames = [];

        if (typeof first === "string") {
            if (typeof second !== "string") throw new Error("Second element must be a string.");
            fileRenames.push([first, second]);
        } else if (first instanceof RegExp) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (first.test(file) && (typeof second === "string" || typeof second === "function")) {
                    fileRenames.push([file, file.replace(first, second)]);
                }
            }
        }

        for (const [fromName, toName] of fileRenames) {
            const from = `${dir}/${fromName}`;
            const to = `${dir}/${toName}`;

            if (fs.lstatSync(from).isDirectory()) {
                if (!fs.existsSync(to)) fs.mkdirSync(to);
                move(from, to);
                fs.rmdirSync(from);
                continue;
            }

            moveFile(from, to);
        }
    }
}