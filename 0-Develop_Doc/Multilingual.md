# 1. 核心技术框架

- **框架选择**：建议使用 `next-intl` 或 Next.js 原生的 **App Router 国际化路由**。
- **路由结构**：将 `app/` 目录下的所有页面迁移至 `app/[locale]/` 动态路由中。
- **字典管理**：在项目根目录创建 `messages/` 文件夹，存放 `en.json`、`es.json` 等静态文本字典。
- **自动化语言检测**：通过 `Accept-Language` 请求头自动识别用户语言并重定向，但必须在 UI 中保留语言切换器（Language Switcher）。

# 2. SEO 规范化配置 (规避 GSC 风险)

### A. 规范化链接 (Canonical Tags)

- **原则**：每个语言版本必须拥有**自引用**的 Canonical 标签。
- **配置**：
  - 英文页：`<link rel="canonical" href="https://www.tryschedule.com/pricing" />`
  - 西语页：`<link rel="canonical" href="https://www.tryschedule.com/es/pricing" />`
- **严禁**：所有语言版本都指向同一个英文规范地址，否则会导致其他语言页面无法被收录。



**规范化 (Canonical)**：每个语言版本应指向其**自身的**规范地址，而不是统一指向英文首页。

### B. Hreflang 标签 (区域对齐)

- **作用**：告知 Google 不同语言版本之间的互补关系，避免判定为内容重复。

- **配置示例**：

  ```HTML
  <link rel="alternate" hreflang="en" href="https://www.tryschedule.com/pricing" />
  <link rel="alternate" hreflang="es" href="https://www.tryschedule.com/es/pricing" />
  <link rel="alternate" hreflang="x-default" href="https://www.tryschedule.com/pricing" />
  ```

### C. 301 重定向

- **必须操作**：如果将现有的 `tryschedule.com/pricing` 路径更改为 `/en/pricing`，必须在 `next.config.js` 中配置 **301 永久重定向**，以保留现有页面权重并防止 404 错误。

# 3. 内容翻译与权重分配策略

考虑到目前已有 25 个 URL 处于收录排队状态，应采取分步策略。

- **优先语种**：首选 **西班牙语 (ES)**。
  - **理由**：针对您新增的“建筑 (Construction)”和“家政 (Cleaning)”模板，美国和拉美市场有庞大的西语用户基数。
- **页面优先级**：首页 > 定价页 > 核心行业模板。
- **URL 本地化**：
  - **优化前**：`.../es/templates/cleaning-schedule-builder`
  - **优化后**：`.../es/plantillas/constructor-horario-limpieza`（这能显著提升当地语种的搜索排名）。

# 4. 结构化数据 (JSON-LD) 迁移

在多语言化过程中，必须确保每个页面的 Schema 代码同样包含必填字段。

- **同步更新**：每个语言版本的 `Product` 代码块必须包含 `priceValidUntil`、`shippingDetails` 和 `hasMerchantReturnPolicy`。
- **本地化评价**：尝试引导当地用户留下评论，以填充 `review` 和 `aggregateRating` 字段，提升搜索结果的点击率。

# 5、Sitemap：单个统一 Sitemap

**多语言站点地图**：更新您的 `sitemap.xml`，为每个 URL 添加 `xhtml:link` 扩展，列出所有语言变体。

**XML 代码结构示例：**

```XML
<url>
  <loc>https://www.tryschedule.com/pricing</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.tryschedule.com/pricing" />
  <xhtml:link rel="alternate" hreflang="es" href="https://www.tryschedule.com/es/pricing" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.tryschedule.com/pricing" />
</url>
```

# 6. 其他

- 既然您的浏览器显示首页带斜杠 `...com/` 是规范网址，保留 `tryschedule.com/` 作为主入口（自动检测语言或默认为英文），而将子页面放入语言目录（如 `/es/`）。





