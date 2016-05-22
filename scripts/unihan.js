var fs = require('fs-extra');
var readline = require('readline');
var jsonfile = require('jsonfile');

var key_tr = {
    "kCantonese": "c",
    "kMandarin": "m",
    "kHangul": "k",
    "kVietnamese": "v"
};

var reader = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
});
var data = {};

reader.on('close', function() {
    fs.mkdirsSync('res');
    jsonfile.writeFile(process.argv[3], data, function(err) {
        console.error(err);
    });
});

reader.on('line', function(line) {
    var splitted = line.trim().split("\t");
    var charcode = splitted[0].substring(2);
    var key = splitted[1];
    var val = splitted[2];
    if (!key_tr.hasOwnProperty(key)) {
        return;
    }
    key = key_tr[key];
    if (!data.hasOwnProperty(charcode)) {
        data[charcode] = {};
    }
    data[charcode][key] = val;
});
