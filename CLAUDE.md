# ScheduleMaster - 项目配置文档

## 📋 项目概述

**项目名称**: ScheduleMaster
**类型**: 日程管理系统
**技术栈**: Next.js 16 + TypeScript + Supabase + Clerk
**样式**: Tailwind CSS + shadcn/ui

### 核心功能

- 📅 多视图日历（周视图、日视图）
- ✏️ 事件创建、编辑、删除
- 🎨 事件分类和颜色标记
- 📱 响应式设计（桌面端 + 移动端）
- 👤 用户认证（Clerk）
- 💾 云端同步（Supabase）
- 📝 博客系统
- 💰 订阅和定价管理

---

## 🏗️ 项目架构

### 目录结构

```
ScheduleMaster/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── blog/              # 博客页面
│   ├── checkout/          # 支付流程
│   ├── pricing/           # 定价页面
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── calendar/         # 日历相关组件
│   ├── DailyCalendar.tsx # 日视图
│   └── WeeklyCalendar.tsx# 周视图
├── lib/                  # 工具函数
│   ├── types.ts         # TypeScript 类型定义
│   ├── utils.ts         # 通用工具
│   └── time-utils.ts    # 时间处理工具
├── hooks/               # 自定义 Hooks
│   ├── useEventDrag.ts  # 拖拽事件
│   ├── useDragToCreate.ts # 拖拽创建
│   └── useMediaQuery.ts # 响应式检测
└── 1-Project_Log/       # 项目文档和笔记
```

---

## 🎯 开发规范

### 代码规范

#### TypeScript

- ✅ 使用 **严格模式**（strict: true）
- ✅ 所有组件必须有类型定义
- ✅ 使用接口定义 Props 类型
- ✅ 避免使用 `any` 类型

#### 组件规范

```typescript
// ✅ 组件命名：PascalCase
EventForm.tsx;
WeeklyCalendar.tsx;

// ❌ 避免：
eventForm.tsx;
weekly - calendar.tsx;
```

#### 文件命名

- 组件文件：`PascalCase.tsx`
- 工具文件：`kebab-case.ts`
- 类型文件：`kebab-case.ts`
- Hook 文件：`useSomething.ts`

### 样式规范

#### Tailwind CSS

- ✅ 优先使用 Tailwind 工具类
- ✅ 复杂组件使用 `cn()` 工具函数合并类名
- ✅ 响应式设计：`md:` 前缀表示桌面端

#### shadcn/ui 组件

```typescript
// ✅ 使用 shadcn/ui 组件
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover } from "@/components/ui/popover";
```

#### 颜色系统

- 使用 Tailwind 的颜色变量
- 保持一致的视觉风格
- 支持深色模式（next-themes）

---

## 🎨 UI/UX 指南

### 响应式设计

#### 移动端 vs 桌面端

```typescript
// ✅ 使用 useIsMobile hook
import { useIsMobile } from "@/hooks/useMediaQuery"

const isMobile = useIsMobile()

// 条件渲染
{isMobile ? <MobileView /> : <DesktopView />}
```

#### Tailwind 断点

```typescript
// 移动端默认
<div className="p-2">

// 桌面端（md 断点以上）
<div className="p-2 md:p-6">
```

---

## 🗄️ 数据层

### Supabase 集成

#### 表结构（参考 migrations/）

- `events` - 事件表
- `profiles` - 用户资料
- `subscriptions` - 订阅信息

#### 查询规范

```typescript
// ✅ 使用 SSR 客户端
import { createServerClient } from "@supabase/ssr";

// ✅ 错误处理
const { data, error } = await supabase.from("events").select("*");

if (error) {
  console.error("Error fetching events:", error);
  return [];
}
```

### Clerk 认证

#### 中间件使用

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

---

## 📝 Claude 工作指南

### ✅ 推荐做法

#### 1. 修改代码前

```typescript
// ✅ 说明变更范围
"我将修改 WeeklyCalendar.tsx 的移动端日历弹窗逻辑";

// ✅ 说明影响范围
"这个修改只影响移动端，桌面端不受影响";
```

#### 2. 实现功能时

```typescript
// ✅ 使用现有组件
"使用 shadcn/ui 的 Dialog 组件实现弹窗";

// ✅ 遵循现有模式
"参考 EditEventDialog 的实现方式";

// ✅ 添加类型定义
"先在 lib/types.ts 中定义新类型";
```

#### 3. 处理响应式

```typescript
// ✅ 同时考虑移动端和桌面端
"实现移动端和桌面端的不同布局";
"使用 useIsMobile hook 检测设备";
```

#### 4. 错误处理

```typescript
// ✅ 添加错误边界
"添加 try-catch 处理 Supabase 查询错误";

// ✅ 用户友好提示
"使用 sonner 显示错误消息";
```

### ❌ 避免做法

```typescript
// ❌ 不要使用 any 类型
const data: any = ...

// ❌ 不要跳过类型检查
// @ts-ignore

// ❌ 不要硬编码值
const width = 375  // 应该使用动态计算

// ❌ 不要忽略错误
try { ... } catch { }  // 至少要 console.error

// ❌ 不要直接修改状态
// 应该使用 useState 的 setter 函数
```

---

## 🔐 安全注意事项

### 敏感信息

- ⚠️ **不要**在代码中硬编码 API 密钥
- ⚠️ **不要**提交 `.env.local` 文件到 Git
- ✅ 使用环境变量：`process.env.NEXT_PUBLIC_SUPABASE_URL`

### 用户数据

- ✅ 所有数据访问需要通过 Clerk 认证
- ✅ 使用 RLS（Row Level Security）保护 Supabase 数据
- ✅ 验证用户权限后再操作数据

### API 路由

```typescript
// ✅ 验证用户身份
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  // ... 处理请求
}
```

---

## 🎯 优先级指南

### 高优先级

1. 🔴 **用户体验问题**：影响核心功能的使用
2. 🔴 **安全漏洞**：数据泄露、未授权访问
3. 🔴 **数据丢失风险**：可能导致用户数据丢失的 bug

### 中优先级

1. 🟡 **性能优化**：提升加载速度、响应速度
2. 🟡 **UI 改进**：视觉优化、交互改进
3. 🟡 **代码质量**：重构、代码清理

### 低优先级

1. 🟢 **文档更新**：代码注释、使用说明
2. 🟢 **小功能**：锦上添花的功能
3. 🟢 **代码风格**：不影响功能的格式调整

---

## 📦 常用依赖速查

### UI 组件

```typescript
// shadcn/ui (Radix UI)
@radix-ui/react-dialog
@radix-ui/react-popover
@radix-ui/react-dropdown-menu

// 数据展示
recharts         // 图表
react-day-picker // 日历
sonner          // Toast 通知
```

### 状态管理

```typescript
// 本项目使用 React Context + Hooks
components / SettingsContext.tsx;
```

### 工具库

```typescript
date-fns              // 日期处理
zod                  // 数据验证
react-hook-form      // 表单管理
@hookform/resolvers  // 表单验证集成
```

---

## 🚀 性能优化建议

### 已实施的优化

- ✅ 使用 `useMemo` 缓存计算结果
- ✅ 使用 `useCallback` 缓存事件处理器
- ✅ 动态导入（Next.js 自动代码分割）
- ✅ 图片优化（next/image）

### 可优化的地方

- 📊 虚拟滚动（长列表）
- 📊 React.memo（减少不必要的重渲染）
- 📊 懒加载组件
- 📊 Service Worker（离线支持）

---

## 📚 相关资源

### 外部文档

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Clerk 文档](https://clerk.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

## 🔄 版本历史

### v0.1.0 (当前)

- ✅ 核心日历功能（周视图、日视图）
- ✅ 事件 CRUD 操作
- ✅ 拖拽创建和移动事件
- ✅ 响应式设计（桌面端 + 移动端）
- ✅ 用户认证（Clerk）
- ✅ 云端同步（Supabase）
- ✅ 博客系统
- ✅ 定价和订阅页面

---

## 💡 开发提示

### 快速定位组件

```bash
# 查找组件
grep -r "WeeklyCalendar" components/

# 查找类型定义
grep -r "interface Event" lib/
```

### 调试技巧

```typescript
// 使用 console.log 调试
console.log("Event data:", event);

// 使用 React DevTools
// 检查组件状态和 props

// 使用浏览器网络面板
// 检查 API 请求
```

### 常用工具函数

```typescript
// 时间工具（lib/time-utils.ts）
formatTime(hour, minute, use12HourFormat);
formatDateString(date);
getWeekDates(startDate);

// 通用工具（lib/utils.ts）
cn(...classes); // 合并 Tailwind 类名
```

---

**文档版本**: 1.0
**最后更新**: 2025-12-31
**维护者**: ScheduleMaster 开发团队

---

> 💡 **提示**: 这份文档会随着项目发展持续更新。如有疑问，请参考相关文档或联系团队。
