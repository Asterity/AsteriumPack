import { readJSON } from "../utils/fs_util.mjs";

const target = process.argv[3];

run(Number(process.argv[2]));

/**
 * @param {number} version pack format version to convert to
 */
async function run(version) {

    const packFormat = readJSON(`${target}/pack.mcmeta`).pack.pack_format;
    if (packFormat === version) return;

    const converter = await import(`./${version}/convert.mjs`);

    if (converter.requiredPackFormat !== packFormat) {
        await run(converter.requiredPackFormat);
    }

    await converter.convert(target);
};