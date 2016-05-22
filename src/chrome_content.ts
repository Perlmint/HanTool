/// <reference path="../typings/main.d.ts" />
/// <reference path="hantool.ts" />

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.exec != 'hantool_run') {
        return;
    }
    var target: Node;
    if (msg.target == 'page') {
        target = document;
    }
    else {
    }
    var results = walk(target, bindFinder(msg.db, msg.key));

    for (var result of results) {
        var node = result.prevNode;
        var parentNode = node.parentNode;
        for (var newNode of result.newNode) {
            parentNode.insertBefore(newNode, node);
        }
        parentNode.removeChild(node);
    }
});
