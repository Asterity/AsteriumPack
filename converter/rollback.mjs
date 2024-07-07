import fs from "fs";
import { move } from "../utils/fs_util.mjs";


if (fs.existsSync("asterium")) deleteFiles("asterium");

function deleteFiles(path) {
    const target = fs.lstatSync(path);
    if (!target.isDirectory()) {
        fs.unlinkSync(path);
        return;
    }
    const files = fs.readdirSync(path);
    for (const file of files) {
        deleteFiles(path + "/" + file);
    }
    fs.rmdirSync(path);
}

copy("asterium_backup", "asterium");

function copy(from, to) {
    const target = fs.lstatSync(from);
    if (!target.isDirectory()) {
        fs.copyFileSync(from, to);
        return;
    }
    fs.mkdirSync(to);
    const files = fs.readdirSync(from);
    for (const file of files) {
        copy(from + "/" + file, to + "/" + file);
    }
}