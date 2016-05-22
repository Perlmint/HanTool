/// <reference path="../typings/main.d.ts" />
/// <reference path="db.ts" />

interface Finder { (ch: string): string };
const ns = "http://github.com/perlmint/hantool";
interface AssetURLGetter { (path: string): string };
interface Result { prevNode: Node, newNode: Node[] };

function loadDB(getAssetURL: AssetURLGetter, callback: {(db: DBType): void}) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (et: ProgressEvent) => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.responseType == "json") {
                callback(<DBType>xhr.response);
            }
            else {
                callback(JSON.parse(xhr.response));
            }
        }
    };
    xhr.open("GET", getAssetURL('/db.json'), true);
    xhr.send();
}

function walk(node : Node, finder : Finder): Result[] {
    if (node.nodeType == Node.TEXT_NODE) {
        var result = replaceWithRuby(<Text>node, finder);
        if (result != null) {
            return [result];
        }
    }
    else {
        if (node.nodeType == Node.ELEMENT_NODE &&
            node.attributes.getNamedItemNS(ns, "appended") != null) {
            // already ruby created. replace rt only
            var element = <HTMLElement>node;
            var new_pronounce = finder((<Text>element.getElementsByTagName('rb')[0].firstChild).data);
            (<Text>element.getElementsByTagName('rt')[0].firstChild).data = new_pronounce;
            return;
        }
        var nodes = node.childNodes;
        var ret: Result[] = [];
        for (var i = 0; i < nodes.length; i++) {
            var child = nodes.item(i);
            Array.prototype.push.apply(ret, walk(child, finder));
        }
        return ret;
    }
}

function makeRuby(char :string, pronounce: string): HTMLElement {
    var ruby = document.createElement("ruby");
    var attr = document.createAttributeNS(ns, "appended");
    ruby.attributes.setNamedItemNS(attr);
    var rb = document.createElement("rb");
    rb.appendChild(document.createTextNode(char));
    ruby.appendChild(rb);
    var rt = document.createElement("rt");
    rt.appendChild(document.createTextNode(pronounce));
    ruby.appendChild(rt);
    return ruby;
}

function removeRuby(target: Node) {
    var rubys = (<HTMLElement>target).getElementsByTagName('ruby');
    var items: { prev: Node, after: Node, parent: Node }[] = [];
    for (var i = 0; i < rubys.length; i++) {
        var ruby = rubys[i];
        var ch = (<Text>ruby.getElementsByTagName('rb')[0].firstChild).data;
        var pronounce = (<Text>ruby.getElementsByTagName('rt')[0].firstChild).data;
        items.push({ prev: ruby, after: document.createTextNode(ch), parent: ruby.parentNode });
    }
    for (var item of items) {
        item.parent.replaceChild(item.after, item.prev);
    }
}

function isHan(ch: string): boolean {
    var c = ch.charCodeAt(0);
    return (c >= 0x4e00 && c <= 0x9fff) ||
        (c >= 0x3400 && c <= 0x4DBF) ||
        (c >= 0x20000 && c <= 0x2CEAF);
}

function replaceWithRuby(node: Text, finder: Finder): Result {
    var buffer = "";
    var length = node.data.length;
    var items: Node[] = [];
    function flushBuffer() {
        if (buffer.length > 0) {
            items.push(document.createTextNode(buffer));
            buffer = "";
        }
    }
    for (var i = 0; i < length; i++) {
        var ch = node.data[i];
        var rep = finder(ch);
        if (rep != null) {
            flushBuffer();
            items.push(makeRuby(ch, rep));
            continue;
        }
        // no replacement...
        buffer += ch;
    }
    flushBuffer();

    // no replacement...
    if (items.length == 1 && items[0].nodeType == Node.TEXT_NODE) {
        return null;
    }

    return { prevNode: node, newNode: items };
}

function findFromDB(ch: string, db: DBType, key: string): string {
    if (isHan(ch)) {
        var cc = ch.charCodeAt(0).toString(16).toUpperCase();
        if (db.hasOwnProperty(cc) && db[cc].hasOwnProperty(key)) {
            return db[cc][key];
        }
    }
    return null;
}

function bindFinder(db: DBType, key: string): Finder {
    return (n) => { return findFromDB(n, db, key); };
}
