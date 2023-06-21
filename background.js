const color = "rgb(153, 196, 230, 0.2)";

chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.sync.set({ color }, function () {
        // 缓存默认颜色
        console.log(`[Coloring] default color is set to: ${color}`);
    });

});

chrome.action.disable();

// 删除现有规则，只应用我们的规则
chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // 添加自定义规则
    chrome.declarativeContent.onPageChanged.addRules([
        {
            // 定义规则的条件
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({

                    /**
                     *   下面两个方式根据需要任取一个即可
                     * 
                     *   注意：hostEquals 规则永远不会匹配任何内容，因为根据 the documentation(https://developer.chrome.com/extensions/declarativeContent#type-PageStateMatcher)，它将与URL的主机部分进行比较，
                     *   例如简单的www.example.com，因此它不能包含 / 或 *；请注意，chrome.declarativeContent使用自己的过滤系统，
                     *   它不支持 content_scripts 或 webRequest 使用的任何常用匹配模式。
                     */

                    // pageUrl: { hostEquals: 'blog.csdn.net', pathPrefix: '/nav/', schemes: ['https'] },
                    pageUrl: { urlPrefix: 'https://www.baidu.com/' },
                }),
            ],
            // 满足条件时显示操作
            actions: [new chrome.declarativeContent.ShowAction()],
        },
    ]);
});


// 点击插件跳转至 options.html
chrome.action.onClicked.addListener((tab) => {
    chrome.runtime.openOptionsPage();
});

// chrome.runtime.onMessage.addListener(callback)
// 此处的callback为必选参数，为回调函数。
// callback接收到的参数有三个，分别是message、sender和sendResponse，即消息内容、消息发送者相关信息和相应函数。
// 其中sender对象包含4个属性，分别是tab、id、url和tlsChannelId，tab是发起消息的标签
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.msg == 'Hello') {
            sendResponse({ farewell: "goodbye" });
        } else if (message.msg == 'contextMenus') {
            // 创建自定义右键菜单
            contextMenus()
            sendResponse({ farewell: "菜单创建成功 !!!" });
        }
    }
);


// 自定义右键菜单
function contextMenus() {
    chrome.contextMenus.create({
        title: "自定义右键快捷菜单", //菜单的名称
        id: '01', //一级菜单的id
        contexts: ['page'], // page表示页面右键就会有这个菜单，如果想要当选中文字时才会出现此右键菜单，用：selection
    });

    chrome.contextMenus.create({
        title: '百度', //菜单的名称
        id: '0101',//二级菜单的id
        parentId: '01',//表示父菜单是“右键快捷菜单”
        contexts: ['page'],
    });

    chrome.contextMenus.create({
        title: 'CSDN', //菜单的名称
        id: '0102',
        parentId: '01',//表示父菜单是“右键快捷菜单”
        contexts: ['page'],
    });

    chrome.contextMenus.create({
        title: '自定义选中文字跳转百度搜索', //菜单的名称
        id: '02',
        contexts: ['selection'],
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId == '0101') {
            var createData = {
                url: "https://baidu.com",
                type: "popup",
                top: 200,
                left: 300,
                width: 1300,
                height: 800
            }
            // 创建（打开）一个新的浏览器窗口，可以提供大小、位置或默认 URL 等可选参数
            chrome.windows.create(createData);
        } else if (info.menuItemId == '02') {
            // 选中文字跳转百度检索
            chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(info.selectionText) });
        } else if (info.menuItemId == '0102') {
            chrome.tabs.create({ url: 'https://www.csdn.net' });
        }
    })
}


// 用户在地址栏上输入了一个关键词（在 manifest.json / omnibox 中 keyword）然后按下tab键
// 当检测到特定的关键词与我们事先指定的关键词相匹配时将调用对应的插件

// 当用户按下tab chrome将输入交给插件，然后输入第一个字符之后触发此事件
chrome.omnibox.onInputStarted.addListener(() => {
    console.log("[" + new Date() + "] omnibox event: onInputStarted");
});

// 当用户的输入改变之后
// text 用户的当前输入
// suggest 调用suggest为用户提供搜索建议
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    console.log("[" + new Date() + "] omnibox event: onInputChanged, user input: " + text);
    // 为用户提供一些搜索建议
    suggest([
        {
            "content": text + "*",
            "description": "是否跳转 baidu 检索" + text + "检索相关内容？"
        },
        {
            "content": text + " abj",
            "description": "是否要查看“" + text + " abj” 有关的内容？"
        },
        {
            "content": text + " aibujn",
            "description": "是否要查看“" + text + " aibujn” 有关的内容？"
        }
    ]);
});

// 按下回车时事件，表示向插件提交了一个搜索
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
    console.log("[" + new Date() + "] omnibox event: onInputEntered, user input: " + text + ", disposition: " + disposition);
    if (text.indexOf('*') != -1) {
        chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(text) });
    }
});

// 取消输入时触发的事件，注意使用上下方向键在搜索建议列表中搜搜也会触发此事件
chrome.omnibox.onInputCancelled.addListener(() => {
    console.log("[" + new Date() + "] omnibox event: onInputCancelled");
});

// 当删除了搜索建议时触发的
chrome.omnibox.onDeleteSuggestion.addListener(text => {
    console.log("[" + new Date() + "] omnibox event: onDeleteSuggestion, text: " + text);
});

// 设置默认的搜索建议，会显示在搜索建议列表的第一行位置，content省略使用用户当前输入的text作为content
chrome.omnibox.setDefaultSuggestion({
    "description": "啥也不干，就是随便试试...."
})
