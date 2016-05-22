/// <reference path="../typings/main.d.ts" />

const root_id = "ctxm_hantool_root";

chrome.contextMenus.create({
    "title": "HanTool",
    "id": root_id
});

chrome.contextMenus.create({
    "title": "Ruby Pinyin",
    "parentId": root_id,
    "onclick": (info, tab) => {
        chrome.tabs.sendMessage(tab.id, {
            exec: 'hantool_run',
            target: 'page',
            key: 'm'
        });
    }
});

chrome.contextMenus.create({
    "title": "Ruby Korean",
    "parentId": root_id,
    "onclick": (info, tab) => {
        chrome.tabs.sendMessage(tab.id, {
            exec: 'hantool_run',
            target: 'page',
            key: 'k'
        });
    }
});
