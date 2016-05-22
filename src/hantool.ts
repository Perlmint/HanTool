/// <reference path="../typings/main.d.ts" />

interface Finder { (ch: string): string };
const ns = "http://github.com/perlmint/hantool";
interface DBType { [key:string]:{ [key:string]:string } };
interface AssetURLGetter { (path: string): string };
interface Result { prevNode: Node, newNode: Node[] };
var db : DBType, getAssetURL : AssetURLGetter;
var loaded = false;

function loadDB() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (et: ProgressEvent) => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.responseType == "json") {
                db = <DBType>xhr.response;
            }
            else {
                db = JSON.parse(xhr.response);
            }
            loaded = true;
        }
    };
    xhr.open("GET", getAssetURL('/db.json'), true);
    xhr.send();
}
loadDB();

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
            var new_pronounce = finder((<Text>node.firstChild).data);
            (<Text>node.lastChild.firstChild).data = new_pronounce;
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
    ruby.appendChild(document.createTextNode(char));
    var rt = document.createElement("rt");
    rt.appendChild(document.createTextNode(pronounce));
    ruby.appendChild(rt);
    return ruby;
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

function findFromDB(ch: string, key: string): string {
    if (isHan(ch)) {
        var cc = ch.charCodeAt(0).toString(16).toUpperCase();
        if (db.hasOwnProperty(cc) && db[cc].hasOwnProperty(key)) {
            return db[cc][key];
        }
    }
    return null;
}

function bindFinder(key: string): Finder {
    return (n) => { return findFromDB(n, key); };
}
