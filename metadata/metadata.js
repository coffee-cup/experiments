/*
 * This script creates html files with the json data in metadata/
 *
 * Useful for SEO in an SPA
 */

const Mustache = require('mustache');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const mkdirp = require('mkdirp');

const outputDir = 'build/';

const template = fs.readFileSync('metadata/template.mustache', 'utf8');
const getJsonData = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const getPageHtml = (json) => Mustache.render(template, json);
const saveTo = (f, html) => {
    mkdirp.sync(path.dirname(f));
    fs.writeFileSync(f, html);
};

glob('metadata/**/*.json', (err, files) => {
    if (err) throw new Error(err);

    files.forEach((f) => {
        const json = getJsonData(f);
        const html = getPageHtml(json);

        const name = f.replace('.json', '').replace('metadata/', '');
        if (path.basename(f) === 'index.json') {
            saveTo(`${outputDir}${name}.html`, html);
            saveTo(`public/${name}.html`, html);
        } else {
            saveTo(`${outputDir}${name}/index.html`, html);
        }
    });
});
