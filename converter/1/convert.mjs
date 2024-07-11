import { readJSON, renameByMap, writeJSON } from "../../utils/fs_util.mjs";

export const requiredPackFormat = 34;

/**
 * @param {string} color 
 */
function convertColor(color) {
    if (color === "light_gray") return "silver";
    return color;
}

const renameMap = [
    ["item", "items"],
    ["block", "blocks"],
    ["items", [

    ]],
    ["blocks", [
        ["andesite.png", "stone_andesite.png"],
        ["polished_andesite.png", "stone_andesite_smooth.png"],
        ["diorite.png", "stone_diorite.png"],
        ["polished_diorite.png", "stone_diorite_smooth.png"],
        ["granite.png", "stone_granite.png"],
        ["polished_granite.png", "stone_granite_smooth.png"],
        ["sandstone.png", "sandstone_normal.png"],
        ["cut_sandstone.png", "sandstone_smooth.png"],
        ["stone_bricks.png", "stonebrick.png"],
        ["mossy_stone_bricks.png", "stonebrick_mossy.png"],
        ["cracked_stone_bricks.png", "stonebrick_cracked.png"],
        ["chiseled_stone_bricks.png", "stonebrick_carved.png"],
        [/(.+)_terracotta.png/, (_, $1) => `hardened_clay_stained_${convertColor($1)}.png`],
        ["terracotta.png", "hardened_clay.png"],
        [/(.+)_wool.png/, (_, $1) => `wool_colored_${convertColor($1)}.png`],
        [/(.+)_planks.png/, "planks_$1.png"],
    ]],
]

/**
 * @param {string} target 
 */
export function convert(target) {
    const packMeta = readJSON(`${target}/pack.mcmeta`);
    packMeta.pack.pack_format = 1;
    writeJSON(`${target}/pack.mcmeta`, packMeta);


    const texturesDir = `${target}/assets/minecraft/textures`;

    renameByMap(texturesDir, renameMap);
}