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

---

# 7. 项目特定补充事项

以下内容基于本项目的实际技术栈和功能模块进行补充。

## A. Clerk 认证系统的多语言适配

项目使用 `@clerk/nextjs` 进行用户认证，需要配置：

- **Clerk UI 组件本地化**：登录、注册、密码重置等界面需要翻译
- **错误消息本地化**：认证失败、验证码错误等提示信息
- **配置方式**：在 `ClerkProvider` 中设置 `localization` 属性

```tsx
import { esES } from '@clerk/localizations'

<ClerkProvider localization={esES}>
  {children}
</ClerkProvider>
```

- **参考文档**：[Clerk Localization](https://clerk.com/docs/localization/overview)

## B. UI 组件翻译清单

项目包含大量需要翻译的 UI 组件，建议在 `messages/{locale}.json` 中按模块组织：

### 核心对话框
| 组件文件 | 翻译内容 |
|---------|---------|
| `SettingsDialog.tsx` | 设置选项标签、按钮文本 |
| `AddEventDialog.tsx` | 表单标签、占位符、按钮 |
| `EditEventDialog.tsx` | 编辑表单、确认/取消按钮 |
| `ExportDialog.tsx` | 导出选项、格式说明 |
| `CloudSaveDialog.tsx` | 云端保存提示、操作按钮 |
| `AIAutofillDialog.tsx` | AI 功能描述、使用提示 |
| `CalendarSyncDialog.tsx` | 同步选项、状态提示 |

### 导航与布局
| 组件文件 | 翻译内容 |
|---------|---------|
| `Navbar.tsx` | 导航链接、用户菜单 |
| `Sidebar.tsx` | 工具栏按钮、功能标签 |
| `MobileToolbar.tsx` | 移动端操作按钮 |
| `Footer.tsx` | 页脚链接、版权信息 |

### 提示与反馈
- Toast 消息（成功/错误/警告提示）
- 确认对话框（删除确认、重置确认等）
- 空状态提示（无数据时的引导文案）

## C. 模板系统 (`lib/templates.ts`) 翻译策略

项目有 10+ 个预设模板，每个模板包含以下可翻译字段：

```typescript
interface TemplateData {
  title: string           // 需翻译：模板标题
  description: string     // 需翻译：简短描述
  longDescription: string // 需翻译：详细描述（SEO 重要）
  category: string        // 需翻译：分类名称
  events: Event[]         // 需翻译：预设事件的 title 和 description
}
```

**建议方案**：
1. 创建 `lib/templates/{locale}.ts` 或使用翻译函数包装
2. **URL 本地化**（可选）：如文档建议，`/es/plantillas/constructor-horario-empleados`
3. 模板 slug 保持英文不变，仅翻译显示内容

## D. 博客文章 (MDX) 多语言方案

`posts/` 目录结构调整建议：

```
posts/
├── en/
│   ├── employee-scheduling-guide.mdx
│   └── remote-work-best-practices.mdx
├── es/
│   ├── guia-programacion-empleados.mdx
│   └── mejores-practicas-trabajo-remoto.mdx
└── zh/
    └── ...
```

**注意事项**：
- MDX frontmatter 中的 `date` 格式根据 locale 显示
- 文章 slug 可以本地化以提升 SEO
- `lib/posts.ts` 需要修改以支持按语言筛选文章

## E. 日期和时间格式本地化

项目使用 `date-fns`，需要按语言加载对应 locale：

```typescript
import { es } from 'date-fns/locale'
import { format } from 'date-fns'

// 根据当前语言选择 locale
const formattedDate = format(date, 'PPP', { locale: es })
```

**需要本地化的时间显示**：
- 日历头部日期显示
- 事件时间范围
- 最后更新时间
- 12/24 小时制自动适配

## F. 价格与货币本地化

`/pricing` 页面注意事项：
- 主要货币：USD（面向全球用户）
- 可选：根据用户地区显示本地货币参考价格
- 数字格式：`1,234.56`（英文）vs `1.234,56`（西语）

## G. 项目目录结构调整建议

```
app/
├── [locale]/                    # 新增：语言动态路由
│   ├── layout.tsx              # 语言特定 metadata
│   ├── page.tsx                # 首页
│   ├── pricing/
│   ├── templates/
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── blog/
│   └── contact/
├── api/                         # API 路由保持不变
└── ...

messages/                        # 新增：翻译字典
├── en.json
├── es.json
└── zh.json

middleware.ts                    # 新增：语言检测与重定向
```

## H. 元数据与 SEO

`layout.tsx` 中的 metadata 需要针对每种语言创建：

```typescript
// app/[locale]/layout.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'es': '/es',
        'x-default': '/',
      },
    },
  }
}
```

## I. 结构化数据 (Schema) 本地化

`layout.tsx` 中的 JSON-LD schema 需要：
- `Organization.description` 翻译
- `SoftwareApplication.review[].reviewBody` 本地化
- 考虑为不同语言版本添加本地用户评价

## J. 错误页面多语言

- `not-found.tsx` 需要翻译 404 错误消息
- 创建语言特定的错误页面或使用翻译函数





