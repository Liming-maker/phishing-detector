//页面信息采集
const pageInfo = {
  url: window.location.href,
  title: document.title,
  text: document.body.innerText.substring(0, 10000),
  html: document.documentElement.outerHTML.substring(0, 500000),
  domain: window.location.hostname,
  protocol: window.location.protocol,
  meta: {
    description: document.querySelector('meta[name="description"]')?.content || '',
    keywords: document.querySelector('meta[name="keywords"]')?.content || ''
  },
  forms: {
    hasLoginForm: false,
    hasPasswordField: false,
    formCount: 0
  }
};

//  高风险警告横幅注入

// 监听 background 发来的消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // 匹配高风险预警指令
  if (msg.type === "SHOW_WARNING") {
    createWarningBanner();
  }
});

// 创建顶部警告横幅函数
function createWarningBanner() {
  // 避免重复插入多个警告条
  if (document.getElementById("phishing-warning-banner")) return;

  // 完整警告DOM字符串
  const bannerHtml = `
    <div id="phishing-warning-banner" style="
        position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
        background: #F56C6C; color: white; padding: 16px; text-align: center;
        font-size: 16px; font-weight: bold; font-family: sans-serif;">
        ⚠ 检测到疑似钓鱼网站！建议不要输入账号密码等敏感信息。
        <button id="phishing-warning-close" style="
            margin-left: 16px; background: white; color: #F56C6C;
            border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer;">
            我知道了
        </button>
    </div>
  `;

  // 将html转为DOM元素并插入页面最顶部
  document.body.insertAdjacentHTML("afterbegin", bannerHtml);

  // 绑定关闭按钮点击事件
  const closeBtn = document.getElementById("phishing-warning-close");
  closeBtn.addEventListener("click", () => {
    const banner = document.getElementById("phishing-warning-banner");
    banner.remove();
  });
}