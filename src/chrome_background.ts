/// <reference path="../typings/main.d.ts" />
/// <reference path="hantool.ts" />

const root_id = "ctxm_hantool_root";
var db: DBType;

function genMessage(target: string, key: string): any {
    return {
        exec: 'hantool_run',
        db: db,
        target: target,
        key: key
    }
}

loadDB(chrome.extension.getURL, (parsedDb) => {
    db = parsedDb;

    chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("plugin_name"),
      "id": root_id
  });

  chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("ruby_pinyin_page"),
      "parentId": root_id,
      "onclick": (info, tab) => {
          chrome.tabs.sendMessage(tab.id, genMessage('page', 'm'));
      }
  });

  chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("ruby_korean_page"),
      "parentId": root_id,
      "onclick": (info, tab) => {
          chrome.tabs.sendMessage(tab.id, genMessage('page','k'));
      }
  });
});
