(async () => {

    const version = process.argv[2];

    const convert = (await import(`./converter/${version}/convert.mjs`)).default;

    await convert();
})();