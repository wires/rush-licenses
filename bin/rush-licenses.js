#! /usr/bin/env node
const fs = require('fs')
const { program } = require('commander')
const readRushInfo = require('../src/read-rush-info')
const readLicenseInfo = require('../src/read-license-info')

program.version('0.0.1')
    .option('-r, --rush <rootdir>', 'root of rush monorepo')
    .option('-o, --output <filename>', 'where to write json output');

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
    let allLicenseInfo = []
    for(let [pkg, pkgInfo] of Object.entries(pkgs)) {
        let info = await readLicenseInfo(rushRoot, pkg)
        if (info) {
            allLicenseInfo.push(info)
        }
    }
    let obj = Object.fromEntries(allLicenseInfo)
    fs.writeFileSync(output, JSON.stringify(obj))
    console.log(`found licenses for ${allLicenseInfo.length} packages`)
}

if(options.rush) {
    if(options.output) {
        main(options.rush).then(pkgs => {
            licenses(options.rush, pkgs, options.output)
        })
    } else {
        main(options.rush)
    }
}