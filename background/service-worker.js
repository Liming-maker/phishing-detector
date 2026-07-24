// 模拟检测接口，真实项目替换为后端API
function mockDetectUrl(url) {
  // 模拟逻辑：包含ip、http、可疑关键词判定风险
  let score = 0;
  let level = 'safe';
  let desc = '该网站使用HTTPS加密，无恶意特征';
  const feature = {
    isHttps: url.startsWith('https'),
    isIp: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url.split('//')[1]),
    urlLen: url.length,
    subDomainCount: url.split('//')[1].split('.').length - 2
  };

  if (!feature.isHttps) score += 0.4;
  if (feature.isIp) score += 0.35;
  if (feature.urlLen > 80) score += 0.2;

  score = Math.min(score, 1);
  if (score >= 0.7) {
    level = 'high';
    desc = '高风险：该网址为IP直连且无HTTPS加密，存在钓鱼风险';
  } else if (score >= 0.4) {
    level = 'mid';
    desc = '中风险：网站未使用HTTPS加密传输，信息易被窃取';
  } else if (score >= 0.2) {
    level = 'low';
    desc = '低风险：URL过长，存在伪装域名的可能性';
  }

  return { code: 200, data: { score, level, desc, feature } };
}

// 监听popup发送的所有消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const { type, url } = msg;
  switch (type) {
    case 'DETECT_URL':
      const result = mockDetectUrl(url);
      sendResponse(result);
      break;
    case 'GET_DETECT_HISTORY':
      sendResponse({ list: [] });
      break;
    case 'REPORT_URL':
      sendResponse({ code: 200, msg: '举报成功' });
      break;
    case 'CLEAR_CACHE':
      sendResponse({ msg: '缓存已清空' });
      break;
    case 'UPDATE_SETTINGS':
      sendResponse({ msg: '设置已更新' });
      break;
    default:
      sendResponse({ code: 500, msg: '未知请求类型' });
  }
  return true; // 异步消息必须return true
});
