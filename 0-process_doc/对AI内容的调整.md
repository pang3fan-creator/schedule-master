## 思路一定要清晰，如果脑子乱了，那宁可啥也不做，不然做也出错！

# 1、`stitch`设计首页`UI`

> # 产品定义：
>
> 这是一个现代化的、极简风格的 SaaS 在线排班工具 (Online Schedule Builder)。
>
> # 核心交互与价值：
>
> 这里的核心体验是“零阻力”。用户无需注册登录，进入首页即可看到一个周视图日历。
>
> # **完整的产品页面与功能需求：**
>
> ## `Page Header`
>
> `Page Header`位于页面的最上方。
>
> `Page Header`的左侧为网站的logo以及网站名字；
>
> `Page Header`的的中间部分为product、pricing和blog选项，当用户的鼠标停留在对应的选项名字时，该选项的颜色发生变化
>
> `Page Header`的右侧部分为`log in`和`sign up`。
>
> ## **核心编辑器 (首页/工具页 - 最重要)**
>
> ### **布局：**
>
>  经典的 SaaS 布局。左侧是“侧边栏”，右侧是“日历网格”。
>
> ### **左侧侧边栏：**
>
>  有“添加新项目”、“导出/下载”、切换（日/周）、“AI 自动填充”按钮（带闪光特效）、settings、reset等等功能按钮。
>
> ### **右侧日历区：**
>
> -  一个标准的周视图表格 (Mon-Sun)，表格中有时间轴，表格内显示已经排好的任务块。
> - 用户可以在日历网格中任意拖拽任务块，从而完成排班。
> - 任务块上会显示当前所在的时间范围，如8点35分到11点26分。
> - 周视图表格 (Mon-Sun)上方会显示日期，比如“< October 21 - 27,2025 >”，日期可以根据使用者的要求，向前向后调整
>
> ## UI 风格要求：
>
> - **风格：** Clean SaaS, Minimalist, Linear-style (类似 Linear 或 Notion 的质感)。
> - **配色：** 以黑白灰为主，用一种鲜明的强调色（如靛蓝色或薄荷绿）来区分“排班色块”和“主按钮”。
> - **字体：** 现代无衬线字体 (Inter 或 San Francisco)。
>
> ## 输出要求：
>
> - 我需要以上提到的所有关键界面的高保真 UI 设计稿。

# 2、`v0`生成用户界面

> You are an expert React/Tailwind developer. I have attached a screenshot of a "Weekly Schedule Builder" UI. Please recreate this interface pixel-perfectly using React, Tailwind CSS, and Lucide React for icons.
>
> Use `shadcn/ui` components where appropriate (Button, Card, Tabs, Select).
>
> Here are the specific implementation details based on the design:
>
> 1. **Layout Architecture:**
>    - A full-screen layout with a fixed Top Navigation Bar, a fixed Left Sidebar (approx 250px width), and a main Scrollable Calendar Area on the right.
>    - Font: Use a clean sans-serif font (Inter or similar).
>
> 2. **Top Navigation:**
>    - Left: Brand Logo "Schedule Builder" (icon + text).
>    - Center: Links "Product", "Pricing", "Blog".
>    - Right: "Log In" (Ghost variant button) and "Sign Up" (Solid Blue primary button).
>
> 3. **Left Sidebar:**
>    - Top: A large, primary blue button "Add New Item" (with Plus icon).
>    - Below it: A Segmented Control/Tabs for "Day" vs "Week" view.
>    - Menu Items: "Export/Download", "Settings", "Reset" (Ghost styling, gray text, with icons).
>    - Bottom: A distinctive "AI Autofill" button. IMPORTANT: Use a purple-to-blue gradient background for this button to match the screenshot, with a sparkle icon.
>
> 4. **Main Calendar Area (The Grid):**
>    - Header: Centered date range "October 21 - 27, 2025" with Left/Right chevron arrows.
>    - The Grid Structure:
>      - Use CSS Grid. First column for Time Labels (8 AM - 5 PM).
>      - Next 7 columns for Days (Mon 21 - Sun 27).
>      - Light gray borders (`border-gray-100` or `200`) for the grid lines.
>    - **Event Cards (The Chips):**
>      - Create sample event cards placed absolutely or within grid cells (e.g., "Team Sync", "Design Review", "Lunch Break").
>      - Styling: Light blue background (`bg-blue-100`), Dark blue text (`text-blue-700`), and a thick dark blue left border (`border-l-4 border-blue-600`).
>      - Content: Title bold, sub-id (e.g., 123456) small, Time range at bottom.
>
> 5. **Color Palette:**
>    - Primary Blue: Approx `#2563EB` (Tailwind `blue-600`).
>    - Background: White.
>    - Text: Slate/Gray for secondary text.
>
> 6. **Technical Constraints:**
>    - Use `grid` for the calendar layout to ensure alignment.
>    - Ensure the layout is responsive but optimized for desktop view as shown.
>    - Hardcode the sample data shown in the image so the preview looks exactly like the screenshot.

## 翻译

> 您是一位专业的 React/Tailwind 开发人员。我已附上“每周日程安排生成器”用户界面的截图。
>
> 请使用 React、Tailwind CSS 和 Lucide React 图标库，像素级完美地重现此界面。
>
> 请在适当的地方使用 `shadcn/ui` 组件（例如 Button、Card、Tabs、Select）。
>
> 以下是基于设计稿的具体实现细节：
>
> 1. 产品定义：
>
> - 这是一个现代化的、极简风格的 SaaS 在线排班工具 (Online Schedule Builder)。
>
>
> 2. **布局架构：**
>
> - 全屏布局，包含固定顶部导航栏、固定左侧边栏（宽度约为 250px）和右侧可滚动的日历主区域。 
> - 字体：使用简洁的无衬线字体（例如 Inter 或类似字体）。
>
> 3. **顶部导航栏：**
> - 左侧：品牌徽标“Schedule Builder”（图标 + 文字）。 
> - 中间：链接“产品”、“定价”、“博客”。 
> - 右侧：“登录”（透明按钮）和“注册”（蓝色实心主按钮）。
>
> 4. **左侧边栏：**
> - 顶部：一个大型蓝色主按钮“添加新项目”（带加号图标）。 
> - 下方：用于切换“日”视图和“周”视图的选项卡/分段控件。 
> - 菜单项：“导出/下载”、“设置”、“重置”（透明样式，灰色文字，带图标）。 
> - 底部：一个醒目的“AI 自动填充”按钮。重要提示：此按钮的背景应使用紫色到蓝色的渐变色，并带有闪光图标，以匹配截图。
>
> 5. **日历主区域（网格）：**
> - 标题：
>   - 居中显示日期范围“2025 年 10 月 21 日 - 27 日”，两侧带有左右箭头。 
>
> - 网格结构：
>   - 使用 CSS Grid。第一列用于时间标签（上午 8 点 - 下午 5 点）。 
>   - 接下来 7 列用于星期（周一 21 日 - 周日 27 日）。 
>   - 网格线使用浅灰色边框（`border-gray-100` 或 `200`）。
>   - 网格结构会根据屏幕的尺寸进行动态的调整，以进行适配
>
> - **事件卡片（标签）：**
>   - 创建示例事件卡片，并将其绝对定位或放置在网格单元格内（例如，“团队同步”、“设计评审”、“午餐休息”）。事件卡片覆盖在网格结构上方
>   - 样式：浅蓝色背景 (`bg-blue-100`)，深蓝色文本 (`text-blue-700`)，以及粗实的深蓝色左边框 (`border-l-4 border-blue-600`)。
>   - 事件卡片可以在当天范围内进行上下拖拽。
>   
> - 内容：
>   - 标题加粗，内容（例如 123456）字体较小，时间范围显示在底部。
>
> - 颜色：
>   - 日历主区域颜色比顶部导航栏和左侧边栏颜色稍微深一点
>
>
> 6. **颜色方案：**
> - 主色调蓝色：大约 `#2563EB`（Tailwind `blue-600`）。
> - 背景：白色。
> - 文本：辅助文本使用石板灰/灰色。
>
> 7. **技术限制：**
> - 使用 `grid` 布局来实现日历布局，确保对齐。
> - 确保布局具有响应式设计，但以所示的桌面视图为优化目标。
> - 硬编码图像中显示的示例数据，使预览效果与截图完全一致。

# 3、auth google

> # Authentication System Implementation Plan (v2)
>
> ## Goal
>
> Implement user registration and login functionality using **Clerk** with **modal dialogs** (no page redirects). Use Next.js 16's `proxy.ts` for route protection.
>
> ------
>
> ## User Review Required
>
> IMPORTANT
>
> You will need to create a Clerk account at [clerk.com](https://clerk.com/) and provide:
>
> - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
> - `CLERK_SECRET_KEY`
>
> ------
>
> ## Proposed Changes
>
> ### Dependencies
>
> #### [MODIFY] package.json
>
> ```
> + "@clerk/nextjs": "^6.x"
> ```
>
> ------
>
> ### Environment Configuration
>
> #### [MODIFY] .env.local
>
> ```
> NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
> 
> CLERK_SECRET_KEY=sk_test_xxxxx
> ```
>
> NOTE
>
> Modal mode does NOT require `SIGN_IN_URL` or `SIGN_UP_URL` environment variables since we're not using separate pages.
>
> ------
>
> ### Core Integration
>
> #### [MODIFY] layout.tsx
>
> Wrap application with `ClerkProvider`.
>
> ------
>
> ### Navbar Integration (Modal Approach)
>
> #### [MODIFY] navbar.tsx
>
> Replace placeholder buttons with Clerk's modal components:
>
> ```
> import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
> 
> 
> 
> // When signed out:
> 
> <SignedOut>
> 
>   <SignInButton mode="modal">
> 
>     <Button variant="ghost">Log In</Button>
> 
>   </SignInButton>
> 
>   <SignUpButton mode="modal">
> 
>     <Button>Sign Up</Button>
> 
>   </SignUpButton>
> 
> </SignedOut>
> 
> 
> 
> // When signed in:
> 
> <SignedIn>
> 
>   <UserButton />
> 
> </SignedIn>
> ```
>
> **Key difference**: `mode="modal"` makes auth appear as overlay dialog on current page (as shown in your reference image).
>
> ------
>
> ### Route Protection
>
> #### [NEW] proxy.ts
>
> Configure Clerk proxy for route protection (Next.js 16 convention):
>
> ```
> import { clerkMiddleware } from "@clerk/nextjs/server"
> 
> 
> 
> export default clerkMiddleware()
> 
> 
> 
> export const config = {
> 
>   matcher: [
> 
>     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
> 
>   ],
> 
> }
> ```
>
> NOTE
>
> By default all routes are public. Protected routes for premium features can be added later.
>
> ------
>
> ## Verification Plan
>
> ### Manual Browser Testing
>
> 1. Click "Sign Up" → Modal appears on current page (no navigation)
> 2. Click "Log In" → Modal appears on current page (no navigation)
> 3. Complete registration/login → Modal closes, user avatar appears in navbar
> 4. Click avatar → Sign out option available
> 5. Test on multiple pages (home, blog) → Modal works consistently

## 翻译

> # 身份验证系统实施方案（v2）
>
> ## 目标
>
> 使用 **Clerk** 和 **模态对话框**（不进行页面重定向）实现用户注册和登录功能。使用 Next.js 16 的 `proxy.ts` 进行路由保护。
>
> ------
>
> ## 用户审核
>
> 重要
>
> 您需要在 [clerk.com](https://clerk.com/) 创建一个 Clerk 帐户，并提供以下信息：
>
> - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
>
> - `CLERK_SECRET_KEY`
>
> ------
>
> ## 建议的更改
>
> ### 依赖项
>
> #### [修改] package.json
>
> ```
> 
> + "@clerk/nextjs": "^6.x"
> 
> ```
>
> ------
>
> ### 环境配置
>
> #### [修改] .env.local
>
> ```
> 
> NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
> 
> CLERK_SECRET_KEY=sk_test_xxxxx
> 
> ```
>
> 注意
>
> 由于我们已启用模态模式，因此模态模式不需要 `SIGN_IN_URL` 或 `SIGN_UP_URL` 环境变量。不使用单独的页面。
>
> ------
>
> ### 核心集成
>
> #### [修改] layout.tsx
>
> 使用 `ClerkProvider` 包裹应用程序。
>
> ------
>
> ### 导航栏集成（模态框方法）
>
> #### [修改] navbar.tsx
>
> 将占位符按钮替换为 Clerk 的模态框组件：
>
> ```
> 
> import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
> 
> // 退出登录时：
> 
> <SignedOut>
> 
> <SignInButton mode="modal">
> 
> <Button variant="ghost">登录</Button>
> 
> </SignInButton>
> 
> <SignUpButton mode="modal">
> 
> <Button>注册</Button>
> 
> </SignUpButton>
> 
> </SignedOut>
> 
> // 已登录时：
> 
> <SignedIn>
> 
> <UserButton />
> 
> </SignedIn>
> 
> ```
>
> **主要区别**：`mode="modal"` 使身份验证以覆盖对话框的形式显示在当前页面上。页面（如参考图片所示）。
>
> ------
>
> ### 路由保护
>
> #### [新增] proxy.ts
>
> 配置 Clerk 代理以进行路由保护（Next.js 16 约定）：
>
> ```
> 
> import { clerkMiddleware } from "@clerk/nextjs/server"
> 
> export default clerkMiddleware()
> 
> export const config = {
> 
> matcher: [
> 
> "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
> 
> ],
> 
> }
> ```
>
> 注意
>
> 默认情况下，所有路由都是公开的。高级功能的受保护路由可以稍后添加。
>
> ------
>
> ## 验证计划
>
> ### 手动浏览器测试
>
> 1. 点击“注册”→ 当前页面出现弹窗（无导航）
>
> 2. 点击“登录”→ 当前页面出现弹窗（无导航）
>
> 3. 完成注册/登录 → 弹窗关闭，用户头像出现在导航栏
>
> 4. 点击头像 → 出现“退出”选项
>
> 5. 在多个页面（首页、博客）上测试 → 弹窗运行正常

# 4、定价

> # Pricing Page Implementation Plan
>
> ## Goal
>
> Build a professional, SEO-friendly Pricing page based on the reference design and 
>
> pricing.md strategy.
>
> 
>
> ------
>
> ## Reference Design Analysis
>
> **Key elements from reference:**
>
> - 4 pricing tiers in horizontal cards
> - "Most Popular" badge on Monthly tier
> - Feature comparison table below
> - FAQ accordion at bottom
>
> ------
>
> ## Proposed Changes
>
> ### Page Structure
>
> #### [MODIFY] page.tsx
>
> **Section 1: Hero**
>
> - H1: "Choose Your Plan"
> - Subtitle: "Find the perfect plan for your needs. No hidden fees, no credit card required to start."
>
> **Section 2: Pricing Cards (4 tiers)**
>
> | Tier           | Price        | Features                                                     |
> | :------------- | :----------- | :----------------------------------------------------------- |
> | **Free**       | $0           | Basic scheduling, Limited templates, Watermarked exports     |
> | **7-Day Pass** | $2.99/week   | All Free features, Watermark-free exports, Premium templates |
> | **Monthly** ⭐  | $9/month     | All previous features, AI-powered suggestions, Cloud saving & sync, Priority support |
> | **Lifetime**   | $49 one-time | All Monthly features, One-time payment, Future updates included |
>
> **Section 3: Compare Plans Table**
>
> | Feature             | Free | 7-Day Pass | Pro  | Lifetime |
> | :------------------ | :--- | :--------- | :--- | :------- |
> | AI Features         | No   | Yes        | Yes  | Yes      |
> | No Watermark Export | No   | Yes        | Yes  | Yes      |
> | Cloud Save          | No   | Yes        | Yes  | Yes      |
> | Unlimited Schedules | Yes  | Yes        | Yes  | Yes      |
> | Priority Support    | No   | No         | Yes  | Yes      |
>
> **Section 4: FAQ Accordion**
>
> - Can I cancel my subscription anytime?
> - What is the 7-Day Pass?
> - What happens if I downgrade my Monthly plan?
>
> ------
>
> ### New Components
>
> #### [NEW] pricing-card.tsx
>
> Reusable card component with:
>
> - Title, price, description
> - Feature list with checkmarks
> - CTA button (variant: primary/secondary)
> - "Most Popular" badge option
>
> #### [NEW] faq-accordion.tsx
>
> Collapsible FAQ using existing Radix Accordion component.
>
> ------
>
> ## Verification Plan
>
> 1. Run `npm run dev` and navigate to `/pricing`
> 2. Verify 4 pricing cards display correctly
> 3. Verify "Most Popular" badge on Monthly card
> 4. Verify comparison table renders
> 5. Verify FAQ accordion expands/collapses
> 6. Test responsive layout on mobile viewport

## 翻译

> # 定价页面实施计划
>
> ## 目标
>
> 基于参考设计和 pricing.md 策略，构建一个专业且对搜索引擎友好的定价页面。
>
> ------
>
> ## 参考设计分析
>
> **参考设计中的关键要素：**
>
> - 4 个价格层级，采用横向卡片形式
>
> - 月付层级上方带有“最受欢迎”徽章
>
> - 下方为功能对比表
>
> - 底部为常见问题解答折叠面板
>
> ------
>
> ## 建议更改
>
> ### 页面结构
>
> #### [修改] page.tsx
>
> **第一部分：首页横幅**
>
> - H1 标题：“选择您的套餐”
>
> - 副标题：“找到最适合您需求的套餐。无隐藏费用，无需信用卡即可开始。”
>
> **第二部分：价格卡片（4 个层级）**
>
> | 层级 | 价格 | 功能 |
>
> | :------------- | :----------- | :----------------------------------------------------------- |
>
> | **免费** | $0 | 基本日程安排、有限模板、导出带水印 |
>
> | **7 天通行证** | $2.99/周 | 所有免费功能、无水印导出、高级模板 |
>
> | **月度** ⭐ | $9/月 | 所有之前的功能、AI 智能建议、云端保存和同步、优先支持 |
>
> | **终身** | $49 一次性付款 | 所有月度功能、一次性付款、包含未来更新 |
>
> **第三部分：套餐对比表**
>
> **第四部分：常见问题解答折叠面板**
>
> - 我可以随时取消订阅吗？
>
> - 什么是 7 天通行证？
>
> - 如果我降级月度套餐会怎样？
>
> ------
>
> ### 新组件
>
> #### [新增] pricing-card.tsx
>
> 可重复使用的卡片组件，包含：
>
> - 标题、价格、描述
>
> - 带复选框的功能列表
>
> - CTA 按钮（变体：主按钮/副按钮）
>
> - “最受欢迎”徽章选项
>
> #### [新增] faq-accordion.tsx
>
> 使用现有 Radix Accordion 组件的可折叠常见问题解答。
>
> ------
>
> ## 验证计划
>
> 1. 运行 `npm run dev` 并导航至 `/pricing` 目录
>
> 2. 验证 4 张价格卡片显示正确
>
> 3. 验证“最受欢迎”徽章在月度价格卡片上是否显示
>
> 4. 验证对比表格是否渲染成功
>
> 5. 验证常见问题解答 (FAQ) 手风琴式折叠面板是否展开/折叠成功
>
> 6. 在移动端视口测试响应式布局

# 5、blog

> # Blog System Implementation Plan
>
> ## Goal
>
> Build a blog system using **MDX** as specified in PRD, with a list page (`/blog`) and article pages (`/blog/[slug]`).
>
> ------
>
> ## Reference Designs
>
> ```
> Review
> Article Page
> ```
>
> ------
>
> ## Proposed Changes
>
> ### Content Structure
>
> #### [NEW] posts/ folder
>
> Store MDX articles with frontmatter:
>
> ```
> posts/
> 
> ├── async-communication.mdx
> 
> ├── time-saving-features.mdx
> 
> └── scheduling-mistakes.mdx
> ```
>
> Frontmatter format:
>
> ```
> ---
> 
> title: "The Ultimate Guide to Asynchronous Communication"
> 
> slug: "async-communication"
> 
> category: "Productivity Tips"
> 
> date: "2024-05-22"
> 
> readTime: "8 min read"
> 
> excerpt: "Discover how async communication can transform..."
> 
> coverImage: "/blog/async-cover.jpg"
> 
> featured: true
> 
> ---
> ```
>
> ------
>
> ### Blog List Page
>
> #### [MODIFY] app/blog/page.tsx
>
> | Section          | Description                                                  |
> | :--------------- | :----------------------------------------------------------- |
> | Hero             | "Our Blog" title + subtitle                                  |
> | Category Filter  | Pills: All, Productivity, Updates, Case Studies, Integrations |
> | Featured Article | Large card (image left, content right) for `featured: true` post |
> | Article Grid     | 3-column grid of article cards                               |
> | Pagination       | Page numbers (optional for MVP)                              |
>
> ------
>
> ### Article Page
>
> #### [NEW] app/blog/[slug]/page.tsx
>
> | Section          | Description                                  |
> | :--------------- | :------------------------------------------- |
> | Header           | Category label, title, author/date/read time |
> | Cover Image      | Full-width image                             |
> | Content          | MDX-rendered article body                    |
> | Share Buttons    | Social sharing icons                         |
> | Related Articles | 2-column grid of related posts               |
>
> ------
>
> ### Components
>
> #### [NEW] blog-card.tsx
>
> Reusable article card with image, category, title, date, read time.
>
> #### [NEW] category-filter.tsx
>
> Filter pills for blog categories.
>
> ------
>
> ### MDX Configuration
>
> #### [NEW] mdx-components.tsx
>
> Custom MDX component mappings for styling headings, images, etc.
>
> #### Install dependencies
>
> ```
> npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter
> ```
>
> ------
>
> ## Verification Plan
>
> 1. Create 3 sample MDX articles in `posts/`
> 2. Verify `/blog` displays article list with featured article
> 3. Verify `/blog/[slug]` renders MDX content correctly
> 4. Verify category filter works
> 5. Verify responsive layout

## 翻译：

> # 博客系统实施方案
>
> ## 目标
>
> 使用**MDX**构建一个博客系统，具体实现方式请参考产品需求文档（PRD），该系统包含列表页面（`/blog`）和文章页面（`/blog/[slug]`）。
>
> ------
>
> ## 参考设计
>
> 
>
> ------
>
> ## 建议更改
>
> ### 内容结构
>
> #### [新增] posts/ 文件夹
>
> 存储带有 frontmatter 的 MDX 文章：
>
> ```
> 
> posts/
> 
> ├── async-communication.mdx
> 
> ├── time-saving-features.mdx
> 
> └── scheduling-mistakes.mdx
> 
> ```
>
> Frontmatter 格式：
>
> ```
> 
> ---
> 
> title: "异步沟通终极指南"
> 
> slug: "async-communication"
> 
> category: "效率提升技巧"
> 
> date: "2024-05-22"
> 
> readTime: "8 分钟阅读"
> 
> excerpt: "探索异步沟通如何改变……"
> 
> coverImage: "/blog/async-cover.jpg"
> 
> featured: true
> 
> ---
> 
> ```
>
> ------
>
> ### 博客列表页面
>
> #### [修改] app/blog/page.tsx
>
> | 版块 | 描述 |
>
> | :--------------- | :----------------------------------------------------------- |
>
> | 首页 | “我们的博客”标题 + 副标题 |
>
> | 分类筛选 | 分类：全部、效率、更新、案例研究、集成 |
>
> | 特色文章 | 大卡片（左侧图片，右侧内容），用于显示已启用 `featured: true` 的文章 |
>
> | 文章网格 | 三列文章卡片网格 |
>
> | 分页 | 页码（MVP 版本可选） |
>
> ------
>
> ### 文章页面
>
> #### [新增] app/blog/[slug]/page.tsx
>
> | 版块 | 描述 |
>
> | :--------------- | :------------------------------------------- |
>
> | 页眉 | 分类标签、标题、作者/日期/阅读时间 |
>
> | 封面图片 | 全宽图片 |
>
> | 内容 | MDX 渲染的文章正文 |
>
> | 分享按钮 | 社交分享图标 |
>
> | 相关文章 | 相关文章的双栏网格 |
>
> ------
>
> ### 组件
>
> #### [新增] blog-card.tsx
>
> 可重复使用的文章卡片，包含图片、分类、标题、日期和阅读时间。
>
> #### [新增] category-filter.tsx
>
> 博客分类筛选器。
>
> ------
>
> ### MDX 配置
>
> #### [新增] mdx-components.tsx
>
> 自定义 MDX 组件映射，用于设置标题、图片等的样式。
>
> #### 安装依赖项
>
> ```
> 
> npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter
> 
> ```
>
> ------
>
> ## 验证计划
>
> 1. 在 `posts/` 目录下创建 3 篇示例 MDX 文章
>
> 2. 验证 `/blog` 是否显示文章列表以及特色文章
>
> 3. 验证 `/blog/[slug]` 是否正确渲染 MDX 内容
>
> 4. 验证分类筛选器是否正常工作
>
> 5. 验证响应式布局

# 6、支付



