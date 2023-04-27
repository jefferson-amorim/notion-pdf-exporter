const fs = require('fs');

module.exports = function () {
    if (!fs.existsSync(`${process.cwd()}/.notion-urls`)) {
        throw new Error('.notion-urls isnt exists. Create a .notion-urls file with the notion url list.');
    }
    return fs
        .readFileSync(`${process.cwd()}/.notion-urls`, { encoding:'utf8' })
        .split('\n')
        .filter(url => !!url);
};
