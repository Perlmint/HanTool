/// <reference path="../typings/main.d.ts" />
/// <reference path="hantool.ts" />

const prefix = "ctxm_hantool_";
const ids = {
    root_id: prefix + "root",
    ruby_pinyin_page: prefix + "pinyin_page",
    ruby_korean_page: prefix + "korean_page",
    ruby_jyutpin_page: prefix + "jyutpin_page",
    ruby_vietnam_page: prefix + "vietnam_page"
};
var db: DBType;

function genMessage(target: string, key: string): any {
    return {
        exec: 'hantool_run',
        db: db,
        target: target,
        key: key
    }
}

function run(tab: chrome.tabs.Tab, target: string, key: string) {
    chrome.tabs.sendMessage(tab.id, genMessage(target, key));
}

loadDB(chrome.extension.getURL, (parsedDb) => {
    db = parsedDb;

    chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("plugin_name"),
      "id": ids.root_id
    });

    chrome.contextMenus.create({
        "title": chrome.i18n.getMessage("no_ruby"),
        "parentId": ids.root_id,
        "type": "radio",
        "checked": true,
        "onclick": (info, tab) => {
            chrome.tabs.sendMessage(tab.id, {
                exec: 'hantool_clear'
            });
        }
    });

  chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("ruby_pinyin_page"),
      "parentId": ids.root_id,
      "id": ids.ruby_pinyin_page,
      "type": "radio",
      "onclick": (info, tab) => {
          run(tab, 'page', 'm');
      }
  });

  chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("ruby_korean_page"),
      "parentId": ids.root_id,
      "id": ids.ruby_korean_page,
      "type": "radio",
      "onclick": (info, tab) => {
          run(tab, 'page','k');
      }
  });

  chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("ruby_jyutping_page"),
      "parentId": ids.root_id,
      "id": ids.ruby_jyutpin_page,
      "type": "radio",
      "onclick": (info, tab) => {
          run(tab, 'page','c');
      }
  });

  chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("ruby_vietnam_page"),
      "parentId": ids.root_id,
      "id": ids.ruby_vietnam_page,
      "type": "radio",
      "onclick": (info, tab) => {
          run(tab, 'page', 'v');
      }
  });
});
