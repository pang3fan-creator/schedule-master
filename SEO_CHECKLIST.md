# SEO 上线前核验清单

## ✅ 已完成项目

### 1. 首页 SEO
- ✅ **H1 标题**: 已添加 `<h1 className="sr-only">Free Online Schedule Builder</h1>`
  - 位置: `app/page.tsx`
  - 说明: 使用 `sr-only` 类视觉隐藏但对搜索引擎可见

- ✅ **Logo Alt Text**: 已正确设置
  - 位置: `components/navbar.tsx` 和 `components/footer.tsx`
  - 内容: `alt="TrySchedule - Free Online Schedule Builder"`

- ✅ **Browser Title**: 已正确设置
  - 位置: `app/layout.tsx`
  - 内容: `"TrySchedule | The #1 Free Schedule Builder (No Login)"`

### 2. 页脚 SEO
- ✅ **版权声明**: 已正确设置
  - 位置: `components/footer.tsx`
  - 内容: `© 2025 TrySchedule. All rights reserved.`

- ✅ **SEO 描述**: 已正确添加
  - 位置: `components/footer.tsx`
  - 内容: `"TrySchedule is the easiest free online schedule builder for students, managers, and teams."`

### 3. /pricing 页面
- ✅ **Hero Section H1**: 已更新
  - 内容: `"Professional Scheduling Tools for Everyone"`
  - 副标题: 包含关键词 "free schedule builder"、"AI"、"PDF"、"rosters" 等

- ✅ **定价卡片**: 已更新
  - Free 计划: 标题改为 "Starter"
  - 所有计划的描述和功能列表已按 SEO 要求更新

- ✅ **Feature Comparison Table**: 已完全重构
  - 包含所有 SEO 关键词（Visual Schedule Builder、Mobile-Friendly Editor、Printable PDF Export、Export to Excel/CSV、Sync to Google Calendar、AI Schedule Generator、Employee Shift Templates、Recurring Shifts、Cloud Storage 等）
  - 按类别分组（Core Tools、Export & Sharing、Advanced Power）

- ✅ **FAQs**: 已更新
  - 包含 SEO 要求的所有问题和答案
  - 覆盖关键词：free online schedule maker、AI scheduler、work shift schedules

- ✅ **Metadata**: 已添加
  - 位置: `app/pricing/layout.tsx`
  - 包含 title、description 和 Open Graph 数据

### 4. 技术 SEO
- ✅ **robots.txt**: 已创建
  - 位置: `app/robots.ts`
  - 配置: 允许所有爬虫访问，禁止 `/api/`、`/portal`、`/sso-callback`、`/checkout`

- ✅ **sitemap.xml**: 已创建
  - 位置: `app/sitemap.ts`
  - 包含: 首页、pricing、blog、templates、contact、terms、privacy 以及所有模板页面

- ✅ **全局 Metadata**: 已增强
  - 位置: `app/layout.tsx`
  - 包含: keywords、Open Graph、Twitter Card

- ✅ **CSS sr-only 类**: 已添加
  - 位置: `app/globals.css`
  - 用于视觉隐藏但对 SEO 友好的 H1 标题

## ⚠️ 待处理项目

### 1. Open Graph 图片
- ❌ **需要创建**: `public/opengraph-image.png`
  - 尺寸: 1200x630px
  - 建议: 使用工具界面截图，添加 TrySchedule 品牌标识
  - 说明: 虽然代码中已引用，但实际文件需要手动创建

### 2. 环境变量
- ⚠️ **NEXT_PUBLIC_SITE_URL**: 需要设置
  - 用途: robots.txt 和 sitemap.xml 中使用
  - 建议值: `https://tryschedule.com`（或您的实际域名）
  - 位置: Vercel 环境变量或 `.env.local`

## 📋 验证清单

上线前请确认：

1. ✅ 首页有 H1 标题（视觉隐藏）
2. ✅ Logo 有正确的 Alt Text
3. ✅ Browser Title 正确
4. ✅ 页脚版权和 SEO 描述正确
5. ✅ Pricing 页面 Hero、表格、FAQ 符合要求
6. ✅ robots.txt 可访问（访问 `/robots.txt`）
7. ✅ sitemap.xml 可访问（访问 `/sitemap.xml`）
8. ⚠️ Open Graph 图片存在（访问 `/opengraph-image.png`）
9. ⚠️ 所有页面在未登录状态下内容可见（不要用 JS 隐藏）

## 🔍 SEO 关键词覆盖检查

以下关键词已在页面中覆盖：

- ✅ Free Online Schedule Builder
- ✅ Schedule Builder
- ✅ Visual Schedule Builder
- ✅ Mobile-Friendly Editor
- ✅ Printable PDF Export
- ✅ Export to Excel / CSV
- ✅ Sync to Google Calendar
- ✅ AI Schedule Generator
- ✅ Employee Shift Templates
- ✅ Recurring Shifts
- ✅ Cloud Storage
- ✅ Work Shift Schedules

## 📝 注意事项

1. **Schema 标记**: 如果使用 JSON-LD，确保包含 `SoftwareApplication` 标记
2. **速度优化**: 确保支付和登录 SDK 使用懒加载
3. **内容可见性**: 确保非登录状态下所有 SEO 内容对爬虫可见
4. **定期更新**: sitemap 会随着模板增加自动更新

## 🚀 上线后验证

1. 使用 Google Search Console 提交 sitemap
2. 验证 robots.txt 是否正确
3. 检查 Open Graph 图片在社交媒体分享时的显示
4. 使用 Google Rich Results Test 验证结构化数据（如果使用）
5. 使用 PageSpeed Insights 检查页面速度
