
const json2csv = require('json2csv');
const os = require('os');
const fs = require('fs');

exports.exportJsonObjToCSV = (data,  outputFile) => {
    const header = false;
    const fields = Object.keys(data);
    const opts = {fields, header};

    try {
        const parser = new json2csv.Parser(opts);
        const csv = parser.parse(data);

        fs.writeFileSync(outputFile, `${csv}${os.EOL}`, {flag: 'a'});

    } catch (err) {
        console.error(err.message);
    }
};

exports.formatDocketNum = (docketNum) => {
    if(docketNum) {
        const pattern = /[0-9]*$/;
        return pattern.exec(docketNum)[0];
    } else
        return docketNum;
};
