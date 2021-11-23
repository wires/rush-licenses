#! /usr/bin/env node
const fs = require('fs')
const { program } = require('commander')
const readRushInfo = require('../src/read-rush-info')
const { readAllLicenses } = require('../src/read-license-info')
const writeHTML = require('../src/write-html')

program.version('0.0.1')
    .option('-r, --rush <rootdir>', 'root of rush monorepo')
    .option('-o, --output <filename>', 'where to write json output')
    .option('-H, --html <filename>', 'where to write HTML output');

program.parse(process.argv);

const options = program.opts();

async function main(rushRoot) {
    // read rush monorepo information
    console.log(`processing rush monorepo: ${rushRoot}`)
    const rushInfo = await readRushInfo(rushRoot)
    const pkgs = rushInfo.packages
    console.log(`found ${Object.keys(pkgs).length} packages`)
    return pkgs
}

async function licenses(rushRoot, pkgs, output) {
    let obj = await readAllLicenses(rushRoot, pkgs)
    fs.writeFileSync(output, JSON.stringify(obj), {encoding: 'utf8'})
    console.log(`found licenses for ${allLicenseInfo.length} packages`)
}

async function html(rushRoot, pkgs, target) {
    let licenses = await readAllLicenses(rushRoot, pkgs)
    let html = writeHTML(licenses)
    fs.writeFileSync(target, html, {encoding:'utf8'})
}

if(options.rush) {
    if(options.output) {
        // write JSON output
        main(options.rush).then(pkgs => {
            licenses(options.rush, pkgs, options.output)
        })
    } else if (options.html) {
        // write HTML output
        main(options.rush).then(pkgs => {
            html(options.rush, pkgs, options.html)
        })
    } else {
        main(options.rush)
    }
}