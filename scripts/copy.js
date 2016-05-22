var fs = require('fs-extra');
var path = require('path');

var copy_list = [
    'res/manifest.json',
    'res/db.json',
    'res/_locales/'
];
var out_dir = 'out';

fs.emptyDirSync(out_dir);

for (i = 0; i < copy_list.length; i++) {
    var item = copy_list[i];
    if (typeof(item) == 'string') {
        var src = item;
        var dst = path.join(out_dir, path.basename(item));
    } else {
        var src = item[0];
        var dst = path.join(out_dir, item[1]);
    }
    fs.copy(src, dst);
}
