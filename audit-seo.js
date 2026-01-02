// audit-seo.js
const https = require('https');

// 1. 定义你需要检测的 URL 列表
const URLS_TO_CHECK = [
  'https://www.tryschedule.com/',
  'https://www.tryschedule.com/pricing',
  'https://www.tryschedule.com/templates/employee-schedule-builder'
];

// 2. 定义 Google 报错中提到的核心必填字段
const REQUIRED_FIELDS = [
  'priceValidUntil',
  'aggregateRating',
  'review',
  'shippingDetails',
  'hasMerchantReturnPolicy'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`\n--- 正在检查: ${url} ---`);
        
        // 匹配页面中的 JSON-LD 脚本块
        const jsonLdMatch = data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
        
        if (!jsonLdMatch) {
          console.log('❌ 错误：页面未发现任何 JSON-LD 代码！');
          return resolve();
        }

        jsonLdMatch.forEach((block, index) => {
          try {
            const cleanJson = block.replace(/<script.*?>|<\/script>/g, '');
            const json = JSON.parse(cleanJson);
            
            // 递归查找缺失字段
            const jsonString = JSON.stringify(json);
            REQUIRED_FIELDS.forEach(field => {
              if (!jsonString.includes(field)) {
                console.warn(`⚠️  警告 [Block ${index + 1}]: 缺失字段 "${field}"`);
              } else {
                console.log(`✅ 已通过: ${field}`);
              }
            });
          } catch (e) {
            console.error(`❌ 解析 JSON-LD 第 ${index + 1} 块时出错`);
          }
        });
        resolve();
      });
    }).on('error', (err) => {
      console.error(`无法访问 URL: ${url}`, err.message);
      resolve();
    });
  });
}

(async () => {
  console.log('🚀 开始 SEO 结构化数据审计...');
  for (const url of URLS_TO_CHECK) {
    await checkUrl(url);
  }
  console.log('\n✨ 审计结束。如果出现警告，请在代码中补充相应字段。');
})();