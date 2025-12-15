# 日历编辑器分析报告

本报告基于 PRD.md 的要求，对当前日历编辑器的进度、问题及开发计划进行总结。

------

## 一、当前进度总结

### ✅ 已完成功能

| 功能点                     | 状态       | 相关文件                                                     |
| :------------------------- | :--------- | :----------------------------------------------------------- |
| 周视图 (Weekly View)       | ✅ 已完成   | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)weekly-calendar.tsx |
| 日视图 (Daily View)        | ✅ 已完成   | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)daily-calendar.tsx |
| 拖拽调整事件时间           | ✅ 已完成   | 两个组件均支持                                               |
| 添加新事件                 | ✅ 已完成   | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)add-event-dialog.tsx |
| localStorage 本地存储      | ✅ 已完成   | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)app/page.tsx |
| 日/周视图切换              | ✅ 已完成   | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)sidebar.tsx |
| 周/日导航 (上一周/下一周)  | ✅ 已完成   | 日历组件内置                                                 |
| "Today" 按钮快速跳转       | ✅ 已完成   | 两个组件均支持                                               |
| 重置所有事件               | ✅ 已完成   | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)sidebar.tsx |
| Pro 功能付费墙 (Export/AI) | ✅ 骨架完成 | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)UpgradeModal.tsx |
| 模板列表页                 | ✅ 基础完成 | ![img](vscode-file://vscode-app/c:/Users/pang1fan/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/react-ts.svg)app/templates/page.tsx |

### ❌ 未完成功能

| 功能点                | PRD 要求        | 当前状态           |
| :-------------------- | :-------------- | :----------------- |
| 事件颜色自定义        | P0 - 基础编辑   | ❌ 未实现           |
| 删除事件              | P0 - 基础编辑   | ❌ 未实现           |
| 编辑已有事件          | P0 - 基础编辑   | ❌ 未实现           |
| 场景化模板预设        | P0 - 模板引擎   | ❌ 模板页返回 404   |
| 导出 JPG/PNG (带水印) | P0 - 免费版导出 | ❌ 未实现           |
| 导出 PDF (Pro)        | P1 - 付费功能   | ❌ 未实现           |
| AI Smart Fill         | P2 - 营销功能   | ❌ 未实现           |
| Settings 页面         | 用户设置        | ❌ 按钮存在但无功能 |

------

## 二、问题与优化建议

### 🔴 严重问题 (违反 PRD 要求)

#### 1. 周起始日设置错误

- **PRD 要求**: 默认 Sunday (周日) 为第一天，符合美国习惯
- **当前实现**: 默认 Monday (周一) 为第一天
- **影响**: 不符合目标市场 (en-US) 用户习惯
- **建议**: 添加 Toggle 开关，默认设为 Sunday

#### 2. 时间格式不符合规范

- **PRD 要求**: 默认 12 小时制 (AM/PM)，可切换 24 小时制
- **当前实现**: 硬编码 24 小时制 (`08:00`, `17:00`)
- **影响**: 不符合美式习惯
- **建议**: 实现时间格式切换，默认显示如 `8:00 AM`

#### 3. 缺少事件颜色功能

- **PRD 要求**: "修改颜色" 是基础编辑功能 (P0)
- **当前实现**: 所有事件固定蓝色
- **影响**: 无法区分不同类型的事件
- **建议**: 为 Event 添加 `color` 属性，支持预设调色板

### 🟠 中等问题 (影响用户体验)

#### 4. 无法删除/编辑事件

- 用户添加事件后，无法删除或修改

- 建议

  :

  - 点击事件弹出详情/编辑对话框
  - 添加删除按钮或右键菜单

#### 5. 模板系统未实现

- `/templates/[slug]` 全部返回 404

- `lib/data/` 目录为空，无预设数据

- 建议

  :

  - 创建模板 JSON 配置文件
  - 根据 slug 加载不同预设事件

#### 6. 代码重复严重

- ```
  weekly-calendar.tsx
  ```

   

  和

   

  ```
  daily-calendar.tsx
  ```

   

  约 80% 代码重复:

  - 拖拽逻辑完全相同
  - 时间计算函数重复定义
  - 样式定义重复

- **建议**: 提取公共逻辑到共享 hook 和工具函数

#### 7. 时间范围硬编码

- 固定 8:00 AM - 5:00 PM
- **建议**: 可配置化，适应不同场景 (如大学课程 7AM-10PM)

### 🟡 轻微问题 (可后续优化)

#### 8. 无触屏/移动端支持

- 仅支持 mousedown/mousemove 事件
- **建议**: 添加 touch 事件支持

#### 9. 无事件冲突检测

- 可以在同一时段添加多个事件导致重叠
- **建议**: 添加冲突警告或并排显示

#### 10. 无键盘快捷键

- **建议**: 添加常用快捷键 (如 N=新建, D=删除, T=今天)

------

## 三、开发计划

基于 PRD 优先级和当前进度，建议分以下阶段开发：

### Phase 1: 核心功能完善 (优先级最高)

> **目标**: 完成 P0 级别的基础编辑功能

| 任务                   | 预计工时 | 说明                              |
| :--------------------- | :------- | :-------------------------------- |
| 事件颜色支持           | 2h       | 添加颜色属性，预设 8 种颜色供选择 |
| 事件删除功能           | 1.5h     | 点击事件显示删除按钮              |
| 事件编辑功能           | 2h       | 复用 AddEventDialog，支持编辑模式 |
| 时间格式切换 (12h/24h) | 1.5h     | 添加设置并持久化到 localStorage   |
| 周起始日切换 (Sun/Mon) | 1.5h     | 添加设置并持久化到 localStorage   |

### Phase 2: 模板引擎实现

> **目标**: 实现 P0 场景化模板功能

| 任务              | 预计工时 | 说明                                   |
| :---------------- | :------- | :------------------------------------- |
| 创建模板数据结构  | 1h       | 定义 JSON schema                       |
| 实现 5 个核心模板 | 3h       | Employee, College, Workout, Visual, AI |
| 模板页面渲染      | 2h       | 根据 slug 加载预设事件                 |
| 模板与编辑器集成  | 1h       | 从模板初始化 localStorage              |

### Phase 3: 导出功能

> **目标**: 实现免费版导出 + Pro PDF 导出

| 任务                  | 预计工时 | 说明                               |
| :-------------------- | :------- | :--------------------------------- |
| JPG/PNG 导出 (带水印) | 3h       | 使用 html-to-image 或 dom-to-image |
| 水印组件              | 0.5h     | 显示域名水印                       |
| PDF 导出 (Pro)        | 2h       | 使用 jsPDF 或 react-pdf            |

### Phase 4: 代码优化

> **目标**: 提高代码质量和可维护性

| 任务              | 预计工时 | 说明                  |
| :---------------- | :------- | :-------------------- |
| 提取共享拖拽 hook | 1.5h     | useDragEvent hook     |
| 提取时间工具函数  | 1h       | lib/calendar-utils.ts |
| 添加触屏支持      | 1.5h     | touch events          |
| 事件冲突检测      | 1h       | 可视化警告            |

------

## 四、推荐优先级

根据 PRD 要求和用户体验影响，建议按以下顺序开发：

1. **周起始日切换** - 符合 PRD 硬性要求
2. **时间格式切换** - 符合 PRD 硬性要求
3. **事件颜色支持** - P0 基础功能
4. **事件删除功能** - 基础用户体验
5. **事件编辑功能** - 基础用户体验
6. **导出 JPG/PNG** - P0 免费版核心功能
7. **模板引擎** - P0 SEO 和场景化核心

------

*报告生成时间: 2025-12-15*