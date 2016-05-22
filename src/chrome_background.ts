/// <reference path="../typings/main.d.ts" />

const root_id = "ctxm_hantool_root";

chrome.contextMenus.create({
    "title": chrome.i18n.getMessage("plugin_name"),
    "id": root_id
});

chrome.contextMenus.create({
    "title": chrome.i18n.getMessage("ruby_pinyin_page"),
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
    "title": chrome.i18n.getMessage("ruby_korean_page"),
    "parentId": root_id,
    "onclick": (info, tab) => {
        chrome.tabs.sendMessage(tab.id, {
            exec: 'hantool_run',
            target: 'page',
            key: 'k'
        });
    }
});
