---
title: "AnZhiYu主题todayCard调用今日诗词"
description: "AnZhiYu主题todayCard调用今日诗词"
publishDate: "2025-03-23"
tags:
  - "折腾"
  - "Hexo"
---

## 预期实现的功能

在AnZhiYu主题中的首页顶部右侧（todayCard）的tittle文案调用今日诗词API，以自动显示诗词。

![效果图](https://cbc25ff.webp.li/todayCard.png)

## 实现方式

可以通过「外部注入」的方式实现这个功能，而不需要修改原项目的代码。这样可以避免对原项目造成任何不必要的改动，降低引起其他问题的风险。

以下是一个使用外部注入方式的解决方案，可以将它作为一个独立的脚本添加到你的网站：

```javascript
(function() {
    // 创建今日诗词注入功能
    const injectTodayPoetry = () => {
        // 检查todayCard-title元素是否存在
        const checkAndUpdatePoetry = () => {
            const todayCardTitle = document.querySelector(".todayCard-title");
            if (todayCardTitle) {
                fetchAndUpdatePoetry(todayCardTitle);
                // 监听卡片的显示状态变化
                observeTodayCard();
                return true;
            }
            return false;
        };

        // 从今日诗词API获取内容并更新
        const fetchAndUpdatePoetry = (titleElement) => {
            // 记录原始文本，以便在API调用失败时可以恢复
            const originalText = titleElement.innerText;
            
            // 如果元素已经有诗词标记属性，跳过更新
            if (titleElement.getAttribute('data-poetry-injected')) return;
            
            fetch('https://v1.jinrishici.com/all')
                .then(response => response.json())
                .then(data => {
                    // 清空原有内容
                    titleElement.innerHTML = '';
                    
                    // 添加诗词内容
                    const poetryContent = document.createElement('div');
                    poetryContent.textContent = data.content;
                    poetryContent.style.fontSize = "1em";
                    poetryContent.style.lineHeight = "1.5";
                    titleElement.appendChild(poetryContent);
                    
                    // 添加来源信息
                    if (data.author && data.origin) {
                        const sourceInfo = document.createElement("div");
                        sourceInfo.textContent = `—— ${data.author}《${data.origin}》`;
                        sourceInfo.style.fontSize = "0.8em";
                        sourceInfo.style.opacity = "0.8";
                        sourceInfo.style.marginTop = "8px";
                        sourceInfo.style.textAlign = "right";
                        titleElement.appendChild(sourceInfo);
                    }
                    
                    // 标记为已注入诗词
                    titleElement.setAttribute('data-poetry-injected', 'true');
                })
                .catch(error => {
                    console.error('获取今日诗词失败:', error);
                    titleElement.textContent = originalText; // 恢复原始文本
                });
        };
        
        // 监听todayCard的显示/隐藏状态
        const observeTodayCard = () => {
            const todayCard = document.getElementById("todayCard");
            if (!todayCard) return;
            
            // 使用MutationObserver监听类名变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        // 当卡片从隐藏变为显示时更新诗词
                        if (!todayCard.classList.contains('hide')) {
                            const titleElement = todayCard.querySelector('.todayCard-title');
                            if (titleElement) {
                                // 移除已注入标记，以便重新获取诗词
                                titleElement.removeAttribute('data-poetry-injected');
                                fetchAndUpdatePoetry(titleElement);
                            }
                        }
                    }
                });
            });
            
            // 开始监听
            observer.observe(todayCard, { attributes: true });
        };

        // 尝试立即更新，如果元素还未加载，则设置重试
        if (!checkAndUpdatePoetry()) {
            // 如果元素还未加载，等待DOM变化后再尝试
            const bodyObserver = new MutationObserver((mutations, observer) => {
                if (checkAndUpdatePoetry()) {
                    // 找到并更新后，停止观察
                    observer.disconnect();
                }
            });
            
            // 观察DOM变化
            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 设置超时，防止无限等待
            setTimeout(() => {
                bodyObserver.disconnect();
            }, 10000); // 10秒后停止尝试
        }
    };

    // 页面加载完成后执行注入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTodayPoetry);
    } else {
        injectTodayPoetry();
    }
})();
```

### 如何使用这段代码：

1. **作为独立JavaScript文件**：

   - 将这段代码保存为一个独立的JS文件（例如`poetry-injector.js`）

   - 在网站的HTML中使用

     ```
     <script>
     ```

     标签引入：

     ```html
     <script src="path/to/poetry-injector.js"></script>
     ```

2. **作为书签脚本**：

   - 创建一个新的浏览器书签

   - 将书签的URL设置为：

     ```
     javascript:(function(){const s=document.createElement('script');s.textContent='这里粘贴上面的代码';document.body.appendChild(s);})();
     ```

   - 每当你想激活这个功能时，点击这个书签

3. **使用浏览器扩展**：

   - 如Chrome的Tampermonkey或Firefox的Greasemonkey
   - 创建一个新脚本，粘贴上面的代码
   - 设置脚本仅在你的网站上运行

### 代码的工作原理：

1. 它以无侵入的方式查找并修改`.todayCard-title`元素
2. 使用`MutationObserver`监听DOM变化，确保即使元素延迟加载也能被处理
3. 当卡片从隐藏变为显示状态时，自动更新诗词内容
4. 采用标记机制避免重复请求API
5. 发生错误时会恢复原始内容，保证不会破坏页面显示

这种方法的优势是完全不修改原项目代码，并能适应各种情况，包括卡片隐藏/显示的状态变化。