# 事件卡片与日期之间的耦合关系

> 本文档记录了如何将"周模板视图"（事件与日期解耦）恢复为"日期日历"（事件与日期耦合）的完整步骤。

---

## 📊 双向转换对照表

| 方向                 | 定位依据     | 冲突依据     | 事件特性   |
| :------------------- | :----------- | :----------- | :--------- |
| **解耦（周模板）**   | `day` + 时间 | `day` + 时间 | 每周重复   |
| **耦合（日期日历）** | `date` + 时间 | `date` + 时间 | 一次性事件 |

---

## 📁 涉及文件清单

| 文件 | 类型 | 修改内容 |
|------|------|----------|
| `lib/types.ts` | 数据模型 | 新增 `date` 字段 |
| `lib/event-conflict.ts` | 冲突检测 | 用 `date` 替代 `day` |
| `components/WeeklyCalendar.tsx` | 视图定位 | 按 `date` 分组和渲染 |
| `components/DailyCalendar.tsx` | 视图定位 | 按 `date` 筛选 |
| `hooks/useDragToCreate.ts` | 事件创建 | 计算并设置 `date` |
| `components/AddEventDialog.tsx` | 事件创建 | 根据 `day` 和当前周计算 `date` |
| `components/EditEventDialog.tsx` | 事件编辑 | 支持修改 `date` 并同步 `day` |

---

## 逆向操作步骤：从周模板 → 日期日历

### 步骤 1：扩展数据模型

```typescript
// lib/types.ts

interface Event {
    id: string
    title: string
    description: string
    day: number           // 保留，作为辅助（星期几 0-6）
    date: string          // ⬅️ 新增：YYYY-MM-DD 格式
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    color?: EventColor
}
```

---

### 步骤 2：修改事件创建逻辑

| 位置 | 操作 |
| :--- | :--- |
| `useDragToCreate.ts` | 根据当前视图的 `weekDates[dayIndex]` 计算 `date` |
| `AddEventDialog.tsx` | 根据选中的 `day` 和当前周的起始日计算 `date` |
| `EditEventDialog.tsx` | 支持修改 `date`，并同步更新 `day` |

**示例代码（useDragToCreate.ts）**：
```typescript
// 在创建事件时，根据 dayIndex 和 weekDates 计算具体日期
const newEvent = {
    // ...其他字段
    day: dayIndex,
    date: formatDateString(weekDates[dayIndex]),  // ⬅️ 新增
}
```

---

### 步骤 3：修改视图定位逻辑

**WeeklyCalendar.tsx - 分组逻辑**：
```typescript
// 从：按 day 分组
const eventsByDay = events.reduce((map, event) => {
    map.get(event.day)?.push(event)
}, ...)

// 改为：按 date 分组
const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>()
    events.forEach(event => {
        const dateKey = event.date
        if (!map.has(dateKey)) {
            map.set(dateKey, [])
        }
        map.get(dateKey)!.push(event)
    })
    return map
}, [events])
```

**WeeklyCalendar.tsx - 渲染逻辑**：
```typescript
// 渲染时按 date 匹配（约第 476 行）
eventsByDate.get(formatDateString(weekDates[dayIndex])) || []
```

**DailyCalendar.tsx - 筛选逻辑**：
```typescript
// 从：按 day 筛选
events.filter(e => e.day === selectedDate.getDay())

// 改为：按 date 筛选（约第 128 行）
events.filter(event => event.date === formatDateString(selectedDate))
```

---

### 步骤 4：修改冲突检测逻辑

```typescript
// lib/event-conflict.ts

// findConflictingEvents 函数（约第 43-46 行）
// 从：
if (existing.day !== newEvent.day) return false

// 改为：
if (existing.date !== newEvent.date) return false


// wouldDragConflict 函数（约第 89-92 行）
// 从：
const otherEvents = allEvents.filter(
    (e) => e.id !== draggedEvent.id && e.day === draggedEvent.day
)

// 改为：
const otherEvents = allEvents.filter(
    (e) => e.id !== draggedEvent.id && e.date === draggedEvent.date
)
```

---

### 步骤 5：数据迁移（如果有现有数据）

如果已有基于 `day` 的事件数据，需要为每个事件生成具体的 `date`：

```typescript
// 迁移脚本示例
function migrateEvents(
    existingEvents: Event[],
    referenceWeekStart: Date  // 选择一个参考周的起始日
): Event[] {
    return existingEvents.map(event => ({
        ...event,
        date: calculateDateFromDay(event.day, referenceWeekStart)
    }))
}

// 辅助函数：根据 day 和周起始日计算具体日期
function calculateDateFromDay(day: number, weekStart: Date): string {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + day)
    return formatDateString(date)  // 返回 YYYY-MM-DD 格式
}
```

---

## 核心思路

解耦和耦合是**对称操作**，关键修改点都是：

1. **数据模型**：有无 `date` 字段
2. **视图分组/筛选**：用 `day` 还是 `date`
3. **冲突检测**：用 `day` 还是 `date`

只要统一修改这三个地方，就能在两种模式之间自由切换。