const path = require('path')
const fs = require('fs')
const checker = require('license-checker')

async function checkLicense(path) {
    return new Promise((resolve, reject) => {
        checker.init({
            start: path
        }, function(err, packages) {
            if (err) {
                reject(err)
            } else {
                resolve(packages)
            }
        })
    })
}

async function readLicenseInfo (rushRootPath, key) {

    if(/^file:/.test(key)) {
        console.log(`Warning: skipping ${key}`)
        return
    }
    
    // keys always look like `/name/semver`
    if(/^\/[^/]+\/[\d\.]*$/.test(key)) {
        const [_, pkg, version] = key.split('/')
        const versionedName = `${pkg}@${version}`
        const root = path.resolve(rushRootPath)
        const dir = path.join(root, 'common', 'temp', 'node_modules', '.pnpm', versionedName, 'node_modules', pkg)
        if(fs.existsSync(dir)) {
            // retrieve license info
            const info = await checkLicense(dir)

            // we assume there is only one element
            if (Object.keys(info).length !== 1) {
                console.log('Warning: expected only one license')
                return false
            }
            
            // contains references to rushRootPath, remove those
            const rawLicenseInfo = info[versionedName]
            const cleanPath = rawLicenseInfo.path.replace(rushRootPath, '')
            const cleanFile = rawLicenseInfo.licenseFile?.replace(rushRootPath, '')
            rawLicenseInfo.path = cleanPath
            rawLicenseInfo.licenseFile = cleanFile
            return [versionedName, {...rawLicenseInfo, pkg, version}]
        } else {
            console.log(`Warning: failed to locate node_modules folder for ${pkg}, I thought it was "${dir}", but that folder doesn't exist`)
            return false
        }
    }

    console.log('Warning: unknown type key', key)
    return false
}

async function readAllLicenses(rushRoot, pkgs) {
    let allLicenseInfo = []
    for(let [pkg, pkgInfo] of Object.entries(pkgs)) {
        let info = await readLicenseInfo(rushRoot, pkg)
        if (info) {
            allLicenseInfo.push(info)
        }
    }
    return Object.fromEntries(allLicenseInfo)
}

module.exports = {
    readAllLicenses
}