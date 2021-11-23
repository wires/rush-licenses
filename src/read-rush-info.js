const yaml = require('js-yaml')
const path = require('path')
const fs = require('fs')

module.exports = async function readRushInfo (rushRootPath) {
    // Get document, or throw exception on error
    const root = path.resolve(rushRootPath)
    const pnpmLockPath = path.join(root, 'common', 'config', 'rush', 'pnpm-lock.yaml')
    try {
        const pnpmLockContents = fs.readFileSync(pnpmLockPath, 'utf8')
        const pnpmLock = yaml.load(pnpmLockContents)
        return pnpmLock;
    } catch (e) {
        throw new Error(`failed to load pnpm-lock.yaml from ${pnpmLockPath}`, e)
    }
}