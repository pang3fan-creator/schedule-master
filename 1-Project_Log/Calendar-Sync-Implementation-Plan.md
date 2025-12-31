# Calendar Sync 实现计划

## 功能定义
- **同步方向**: 单向（ScheduleMaster → Google Calendar）
- **触发方式**: 手动同步按钮
- **用户权限**: Pro 专属功能

---

## 技术架构

### 技术栈
```
前端: React + TypeScript
后端: Next.js API Routes
认证: Google OAuth 2.0
数据库: Supabase (存储 tokens 和同步状态)
API: Google Calendar API
```

---

## 数据库设计

### 表 1: Google OAuth Tokens
```sql
CREATE TABLE google_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  calendar_id TEXT DEFAULT 'primary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_google_accounts_user_id ON google_accounts(user_id);
```

### 表 2: 事件同步映射
```sql
CREATE TABLE google_event_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  local_event_id TEXT NOT NULL,
  google_event_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(local_event_id, user_id)
);

CREATE INDEX idx_google_event_mappings_local ON google_event_mappings(local_event_id);
CREATE INDEX idx_google_event_mappings_user ON google_event_mappings(user_id);
```

---

## 实现步骤

### Phase 1: Google Cloud 设置

#### 1.1 创建 Google Cloud 项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 Google Calendar API

#### 1.2 配置 OAuth 2.0
1. 创建 OAuth 2.0 凭据
   - 应用类型: Web 应用
   - 名称: ScheduleMaster
2. 配置授权重定向 URI:
   ```
   http://localhost:3000/api/calendar/callback
   https://your-domain.com/api/calendar/callback
   ```
3. 获取:
   - Client ID
   - Client Secret

#### 1.3 环境变量
在 `.env.local` 中添加:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Phase 2: 后端实现

#### 2.1 OAuth 认证流程
**文件**: `app/api/calendar/auth/route.ts`
- 生成 Google OAuth URL
- 重定向用户到 Google 授权页面

**文件**: `app/api/calendar/callback/route.ts`
- 处理 Google 回调
- 交换 authorization code 获取 tokens
- 存储 tokens 到 Supabase

**文件**: `app/api/calendar/disconnect/route.ts`
- 断开 Google Calendar 连接
- 删除存储的 tokens

#### 2.2 Token 刷新
**文件**: `app/api/calendar/refresh-token/route.ts`
- 检查 token 是否过期
- 使用 refresh_token 获取新的 access_token
- 更新数据库

#### 2.3 事件同步
**文件**: `app/api/calendar/sync/route.ts`
- 获取用户的所有事件
- 过滤未同步或已更新的事件
- 调用 Google Calendar API 创建/更新事件
- 存储映射关系

---

### Phase 3: 前端实现

#### 3.1 同步对话框
**文件**: `components/CalendarSyncDialog.tsx`

**功能**:
1. 连接状态检查
   - 未连接: 显示"连接 Google Calendar"按钮
   - 已连接: 显示账户信息和"断开连接"选项

2. 同步控制
   - "立即同步"按钮
   - 同步进度显示
   - 同步结果反馈

3. 同步历史
   - 显示上次同步时间
   - 显示已同步事件数量

**UI 设计**:
```typescript
interface CalendarSyncDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 状态管理
interface SyncState {
  connected: boolean
  syncing: boolean
  lastSyncTime: Date | null
  syncedEventCount: number
  accountEmail: string | null
}
```

#### 3.2 修改 Sidebar.tsx
**位置**: `components/Sidebar.tsx:93-99`

```typescript
// 替换当前的 handleCalendarSyncClick 函数
const handleCalendarSyncClick = () => {
  if (isLoading) return

  // Paywall: Non-Pro users see upgrade modal
  if (!isPro) {
    setUpgradeFeature("Calendar Sync")
    setShowUpgradeModal(true)
    return
  }

  // Pro users: Open Calendar Sync dialog
  setShowCalendarSyncDialog(true)
}

// 添加新的状态
const [showCalendarSyncDialog, setShowCalendarSyncDialog] = useState(false)

// 在组件中添加 dialog
<CalendarSyncDialog
  open={showCalendarSyncDialog}
  onOpenChange={setShowCalendarSyncDialog}
/>
```

---

### Phase 4: 同步逻辑

#### 4.1 事件映射规则

| ScheduleMaster Event | Google Calendar Event |
|---------------------|----------------------|
| title | summary |
| description | description |
| startTime | start.dateTime |
| endTime | end.dateTime |
| color/category | colorId (映射到 Google 颜色) |
| location | location |
| selectedDays | 多天事件 (recur 或独立事件) |

#### 4.2 颜色映射
```typescript
const COLOR_MAP: Record<string, string> = {
  blue: '1',    // Google Blue
  green: '2',   // Google Green
  purple: '3',  // Google Purple
  red: '4',     // Google Red
  yellow: '5',  // Google Yellow
  orange: '6',  // Google Orange
  turquoise: '7', // Google Turquoise
  gray: '8',    // Google Gray
}
```

#### 4.3 同步策略
1. **首次同步**: 推送所有现有事件到 Google Calendar
2. **增量同步**:
   - 只同步新创建的事件
   - 更新已修改的事件
   - 可选: 删除 Google 中已删除的事件
3. **冲突处理**:
   - 以 Google Calendar 的事件为准（不覆盖）
   - 或者询问用户如何处理

---

## API 端点设计

### 认证相关

#### GET `/api/calendar/auth`
**功能**: 生成 Google OAuth URL
```typescript
// 请求
// 无需请求体

// 响应
{
  authUrl: string  // Google 授权 URL
}
```

#### GET `/api/calendar/callback`
**功能**: 处理 OAuth 回调
```typescript
// 查询参数
{
  code: string        // Authorization code
  state?: string      // CSRF token (可选)
  error?: string      // 错误信息（如果用户拒绝）
}

// 响应
// 重定向到应用页面，显示成功/失败消息
```

#### POST `/api/calendar/disconnect`
**功能**: 断开 Google Calendar 连接
```typescript
// 请求
// 无需请求体（使用 Clerk 认证）

// 响应
{
  success: boolean
  message: string
}
```

#### GET `/api/calendar/status`
**功能**: 获取连接状态
```typescript
// 响应
{
  connected: boolean
  accountEmail?: string
  lastSyncTime?: string
  syncedEventCount?: number
}
```

### 同步相关

#### POST `/api/calendar/sync`
**功能**: 同步事件到 Google Calendar
```typescript
// 请求体
{
  mode?: 'full' | 'incremental'  // 默认: incremental
}

// 响应
{
  success: boolean
  message: string
  synced: number          // 同步成功的事件数
  failed: number          // 同步失败的事件数
  errors?: Array<{        // 错误详情
    eventId: string
    error: string
  }>
}
```

#### POST `/api/calendar/refresh-token`
**功能**: 刷新 access token（内部调用）
```typescript
// 请求
// 无需请求体

// 响应
{
  success: boolean
  accessToken?: string
  expiresAt?: string
}
```

---

## 用户体验流程

### 场景 1: 首次连接

1. 用户点击 "Calendar Sync"
2. 显示连接对话框:
   ```
   📅 Google Calendar 同步
   
   将你的日程同步到 Google Calendar，方便在所有设备上查看。
   
   [连接 Google Calendar]
   ```
3. 点击"连接"后，重定向到 Google 授权页面
4. 用户授权后，返回应用
5. 显示成功消息:
   ```
   ✅ 已连接到 Google Calendar
   账户: user@gmail.com
   
   [立即同步] [断开连接]
   ```

### 场景 2: 执行同步

1. 用户点击"立即同步"
2. 显示同步进度:
   ```
   正在同步...
   ✓ 已同步 1/5 个事件
   ```
3. 同步完成:
   ```
   ✅ 同步完成！
   成功: 5 个事件
   失败: 0 个事件
   
   上次同步: 2 分钟前
   ```

### 场景 3: 同步失败处理

1. 显示错误消息:
   ```
   ❌ 同步失败
   
   3 个事件同步失败:
   - Team Meeting: 网络错误
   - Lunch: 权限不足
   
   [重试] [关闭]
   ```

---

## 安全考虑

### 1. Token 安全
- ✅ Token 加密存储在 Supabase
- ✅ 使用 HTTPS 传输
- ✅ Token 定期自动刷新
- ✅ 不在客户端日志中暴露 token

### 2. 权限控制
- ✅ 使用 Clerk 验证用户身份
- ✅ 只能访问自己的 Google Calendar
- ✅ Pro 用户权限检查
- ✅ RLS (Row Level Security) 保护数据

### 3. 错误处理
- ✅ 网络错误重试机制
- ✅ Token 过期自动刷新
- ✅ 用户友好的错误消息
- ✅ 详细的服务端日志

---

## 测试计划

### 单元测试
- [ ] Token 刷新逻辑
- [ ] 事件映射转换
- [ ] 错误处理函数

### 集成测试
- [ ] OAuth 认证流程
- [ ] 事件同步 API
- [ ] Token 过期处理

### 手动测试清单
- [ ] 首次连接流程
- [ ] 同步单个事件
- [ ] 同步多个事件
- [ ] 同步多天事件
- [ ] 同步失败重试
- [ ] 断开连接
- [ ] Pro 用户限制
- [ ] Token 自动刷新

---

## 未来扩展

### 可能的后续功能
1. **双向同步**: 从 Google Calendar 同步到 ScheduleMaster
2. **自动同步**: 定期自动同步（如每小时）
3. **多日历支持**: 选择同步到哪个 Google Calendar
4. **冲突解决策略**: 用户选择如何处理冲突
5. **同步设置**:
   - 选择要同步的事件类别
   - 设置同步频率
   - 是否同步历史事件
6. **批量操作**: 删除 Google 中已删除的事件

---

## 参考资料

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [Google OAuth 2.0 for Web Server Apps](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google API Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**创建日期**: 2025-12-31
**状态**: 待实现
**优先级**: 高（Pro 功能）
