const fs = require('fs')

let htmlTemplate = tableRows => `
<html>
<head>
<title>Licenses for dependencies of this projects</title>
<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script>
<style>
th, td {
   border: 1px solid black;
   padding: 1px 3px;
}
table {
    border-collapse: collapse;
}
table.sortable thead {
    background-color:#eee;
    color:#666666;
    font-weight: bold;
    cursor: default;
}
</style>
</hed>
<body>
<table class="sortable">
<tr>
<th>Package</th>
<th>Version</th>
<th>License</th>
<th>Repository</th>
</tr>
${tableRows}
</table>
</body>
</html>
`.trim()

let tableRow = ({pkg,licenses,repository,version}) => `
<tr>
<td><a href="https://npm.im/${pkg}">${pkg}</a></td>
<td>${version}</td>
<td><a href="https://spdx.org/licenses/${licenses}.html">${licenses}</a></td>
<td><a href="${repository}">${repository}</a></td>
</tr>
`.trim()

module.exports = function writeHTML (licenses, target) {
    let rows = Object.entries(licenses).map(([k,v]) => tableRow(v))
    return htmlTemplate(rows.join('\n'))
}