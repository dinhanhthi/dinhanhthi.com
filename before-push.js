const fs = require("fs");
fs.copyFile('remote.eleventyignore', '.eleventyignore', (err) => {
    if (err) throw err;
    console.log('remote.eleventyignore was copied to .eleventyignore');
});