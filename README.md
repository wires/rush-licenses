# `rush-licences`

This tool will extract a list of all licenses uses in a [rush](rushjs.io/) monorepo.

```shell
rush-licenses --rush ~/my-rush-monorepo -o licenses.json
```

It will produce a JSON dictionary with this shape

```json
{
  "yargs@16.2.0": {
    "licenses": "MIT",
    "repository": "https://github.com/yargs/yargs",
    "path": "/common/temp/node_modules/.pnpm/yargs@16.2.0/node_modules/yargs",
    "licenseFile": "/common/temp/node_modules/.pnpm/yargs@16.2.0/node_modules/yargs/LICENSE",
    "pkg": "yargs",
    "version": "16.2.0"
  }
}
```
