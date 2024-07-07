(async () => {

    const version = process.argv[2];
    const target = process.argv[3];

    const convert = (await import(`./${version}/convert.mjs`)).default;

    await convert(target);
})();