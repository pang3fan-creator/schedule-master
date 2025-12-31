# OAuth 2.0 认证流程详解

## 什么是 OAuth 2.0？

OAuth 2.0 是一个授权协议，允许应用**在不共享用户密码的情况下**，访问用户的 Google Calendar 数据。

### 核心概念

```
用户（你）       应用（ScheduleMaster）    Google
  |                    |                      |
  |1. 点击"连接"       |                      |
  |-------------------->|                      |
  |                    |2. 重定向到 Google    |
  |                    |--------------------->|
  |                    |                      |
  |3. 看到授权页面     |                      |
  |<-------------------------------------------|
  |                    |                      |
  |4. 同意授权         |                      |
  |------------------------------------------->|
  |                    |                      |
  |                    |5. 返回授权码         |
  |                    |<---------------------|
  |                    |                      |
  |                    |6. 用授权码换 token   |
  |                    |--------------------->|
  |                    |                      |
  |                    |7. 返回 access token  |
  |                    |<---------------------|
  |                    |                      |
  |8. 用 token 访问日历|                      |
  |                    |---------------------->|


```

---

## 完整流程图

### 步骤 1: 用户发起连接

**用户操作**: 点击 "连接 Google Calendar" 按钮

**前端代码**:
```typescript
// components/CalendarSyncDialog.tsx
const handleConnect = async () => {
  // 调用后端获取授权 URL
  const response = await fetch('/api/calendar/auth')
  const { authUrl } = await response.json()

  // 重定向到 Google 授权页面
  window.location.href = authUrl
}
```

---

### 步骤 2: 生成授权 URL

**后端 API**: `app/api/calendar/auth/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(req: NextRequest) {
  // 创建 OAuth2 客户端
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  // 生成授权 URL
  const authUrl = oauth2Client.generateAuthPrompt({
    access_type: 'offline',           // 重要：获取 refresh_token
    scope: ['https://www.googleapis.com/auth/calendar'],  // 权限范围
    prompt: 'consent',                // 强制显示同意页面
  })

  // 返回授权 URL 给前端
  return NextResponse.json({ authUrl })
}
```

**关键参数说明**:

| 参数 | 值 | 说明 |
|------|-----|------|
| `access_type` | `'offline'` | **关键**：获取 refresh_token，用于长期访问 |
| `scope` | `'auth/calendar'` | 请求的权限：读写 Google Calendar |
| `prompt` | `'consent'` | 强制显示同意页面，确保返回 refresh_token |

**生成的 URL 示例**:
```
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:3000/api/calendar/callback&
  response_type=code&
  scope=https://www.googleapis.com/auth/calendar&
  access_type=offline&
  prompt=consent
```

---

### 步骤 3: 用户授权

**用户看到**:
```
Google 授权页面

ScheduleMaster 想要:
✓ 查看和修改您的 Google 日历

账户: user@gmail.com

[允许] [取消]
```

**用户点击 "允许"** → Google 会重定向回我们的应用

---

### 步骤 4: 处理授权回调

**Google 重定向到**: `/api/calendar/callback?code=AUTHORIZATION_CODE`

**后端 API**: `app/api/calendar/callback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const userId = searchParams.get('state')  // 传递的用户 ID

  // 错误处理
  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=auth_failed', req.url)
    )
  }

  try {
    // 1. 用授权码换取 tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    const { tokens } = await oauth2Client.getToken(code)

    // tokens 结构:
    // {
    //   access_token: 'ya29.a0AfH6...',   // 短期 token (1小时)
    //   refresh_token: '1//0g...',        // 长期 token (永久有效)
    //   expiry_date: 1234567890,           // 过期时间
    //   token_type: 'Bearer',
    //   scope: 'https://www.googleapis.com/auth/calendar'
    // }

    // 2. 验证用户身份（通过 Clerk）
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      throw new Error('Unauthorized')
    }

    // 3. 获取用户的 Google 账户信息
    oauth2Client.setCredentials(tokens)
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const { data: calendarList } = await calendar.calendarList.list()

    const primaryCalendar = calendarList.items?.find(
      cal => cal.primary === true
    )

    // 4. 存储 tokens 到 Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('google_accounts')
      .upsert({
        user_id: clerkUserId,
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token!,
        token_expires_at: new Date(tokens.expiry_date!).toISOString(),
        calendar_id: primaryCalendar?.id || 'primary',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })

    if (error) throw error

    // 5. 重定向回应用，显示成功消息
    return NextResponse.redirect(
      new URL('/?calendar_sync=success', req.url)
    )

  } catch (error) {
    console.error('OAuth callback error:', error)

    // 重定向回应用，显示错误消息
    return NextResponse.redirect(
      new URL('/?calendar_sync=error', req.url)
    )
  }
}
```

**关键步骤说明**:

1. **获取 tokens**:
   - 用 `code` 换取 `access_token` 和 `refresh_token`
   - `access_token` 有效期 1 小时
   - `refresh_token` 永久有效，用于获取新的 access_token

2. **获取用户信息**:
   - 调用 Google Calendar API 获取用户的日历列表
   - 找到主日历（primary calendar）
   - 获取账户邮箱地址

3. **存储到数据库**:
   - 使用 `upsert`：如果已存在则更新，否则插入
   - 存储 tokens 的过期时间
   - 存储用户的日历 ID

4. **重定向回应用**:
   - 成功: `/?calendar_sync=success`
   - 失败: `/?calendar_sync=error`

---

### 步骤 5: 检查连接状态

**前端需要知道**:
- 用户是否已连接 Google Calendar
- 连接的账户邮箱
- 上次同步时间

**后端 API**: `app/api/calendar/status/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  // 验证用户
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 查询数据库
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: account, error } = await supabase
    .from('google_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !account) {
    // 未连接
    return NextResponse.json({
      connected: false,
    })
  }

  // 查询同步统计
  const { count } = await supabase
    .from('google_event_mappings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // 返回连接状态
  return NextResponse.json({
    connected: true,
    accountEmail: account.calendar_id,  // 或从 token 解析获取邮箱
    lastSyncTime: account.updated_at,
    syncedEventCount: count || 0,
  })
}
```

**前端使用**:

```typescript
// components/CalendarSyncDialog.tsx
useEffect(() => {
  const checkStatus = async () => {
    const response = await fetch('/api/calendar/status')
    const data = await response.json()

    if (data.connected) {
      setStatus({
        connected: true,
        accountEmail: data.accountEmail,
        lastSyncTime: data.lastSyncTime,
        syncedEventCount: data.syncedEventCount,
      })
    }
  }

  checkStatus()
}, [])
```

---

## 🔄 Token 刷新机制

### 为什么需要刷新？

- `access_token` 只能使用 **1 小时**
- 1 小时后，调用 Google Calendar API 会返回 401 错误
- `refresh_token` 永久有效，可以用来获取新的 `access_token`

### 自动刷新流程

```typescript
// lib/google-calendar.ts
import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

export async function getAuthenticatedClient(userId: string) {
  const supabase = createClient(/* ... */)

  // 1. 从数据库获取 tokens
  const { data: account } = await supabase
    .from('google_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!account) {
    throw new Error('Google account not connected')
  }

  // 2. 创建 OAuth2 客户端
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  // 3. 检查 token 是否即将过期（提前 5 分钟刷新）
  const expiresAt = new Date(account.token_expires_at).getTime()
  const now = Date.now()
  const buffer = 5 * 60 * 1000  // 5 分钟

  if (expiresAt - now < buffer) {
    // ⚠️ Token 即将过期，需要刷新

    oauth2Client.setCredentials({
      refresh_token: account.refresh_token,
    })

    // 刷新 token
    const { credentials } = await oauth2Client.refreshAccessToken()

    // 更新数据库
    await supabase
      .from('google_accounts')
      .update({
        access_token: credentials.access_token,
        token_expires_at: new Date(credentials.expiry_date!).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    // 设置新的 token
    oauth2Client.setCredentials(credentials)
  } else {
    // Token 仍然有效
    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    })
  }

  return oauth2Client
}
```

### 使用示例

```typescript
// 任何需要调用 Google Calendar API 的地方
import { getAuthenticatedClient } from '@/lib/google-calendar'

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  // 自动处理 token 刷新
  const authClient = await getAuthenticatedClient(userId)

  // 创建 calendar 客户端
  const calendar = google.calendar({ version: 'v3', auth: authClient })

  // 调用 API（不用担心 token 过期）
  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: 'Test Event',
      start: { dateTime: '2025-12-31T10:00:00Z' },
      end: { dateTime: '2025-12-31T11:00:00Z' },
    },
  })

  return NextResponse.json(data)
}
```

---

## 🔐 安全注意事项

### 1. Token 存储

✅ **正确的做法**:
```typescript
// 存储在 Supabase 中，使用 RLS 保护
await supabase
  .from('google_accounts')
  .insert({
    user_id: userId,
    access_token: encryptedToken,  // 可选：加密存储
    refresh_token: encryptedRefreshToken,
  })
```

❌ **错误的做法**:
```typescript
// 不要存储在 localStorage（容易被 XSS 攻击）
localStorage.setItem('access_token', token)

// 不要在客户端日志中输出
console.log('Token:', token)  // ❌ 会暴露在浏览器控制台
```

### 2. HTTPS 必须要求

```typescript
// 生产环境必须使用 HTTPS
if (process.env.NODE_ENV === 'production' && !req.url.startsWith('https://')) {
  throw new Error('HTTPS required')
}
```

### 3. State 参数（防止 CSRF）

```typescript
// 生成随机 state
const state = crypto.randomBytes(16).toString('hex')

// 存储到 session/sessionStorage
sessionStorage.setItem('oauth_state', state)

// 生成授权 URL 时包含 state
const authUrl = oauth2Client.generateAuthPrompt({
  state: state,  // ← 添加这个
  // ...
})

// 回调时验证
const { state: returnedState } = searchParams
if (returnedState !== sessionStorage.getItem('oauth_state')) {
  throw new Error('Invalid state parameter')
}
```

---

## 🧪 测试 OAuth 流程

### 本地开发测试

1. **添加授权重定向 URI**:
   ```
   http://localhost:3000/api/calendar/callback
   ```

2. **测试连接流程**:
   ```bash
   # 1. 启动开发服务器
   npm run dev

   # 2. 访问应用
   # http://localhost:3000

   # 3. 点击"连接 Google Calendar"

   # 4. 在 Google 授权页面点击"允许"

   # 5. 应该被重定向回应用，URL 变成:
   # http://localhost:3000/?calendar_sync=success
   ```

3. **验证数据库**:
   ```sql
   SELECT * FROM google_accounts WHERE user_id = 'user_xxx';
   ```
   应该能看到：
   - `access_token`
   - `refresh_token`
   - `token_expires_at`

---

## 📚 常见问题

### Q1: 为什么我获取不到 `refresh_token`？

**原因**: Google 只在第一次用户授权时返回 `refresh_token`

**解决**:
1. 使用 `prompt: 'consent'` 参数
2. 在 Google Cloud Console 删除已授权的应用
3. 让用户重新授权

### Q2: Token 刷新失败怎么办？

**原因**:
- 用户撤销了授权
- `refresh_token` 过期（极少情况）
- Client ID/Secret 错误

**解决**:
```typescript
try {
  await oauth2Client.refreshAccessToken()
} catch (error) {
  // 刷新失败，提示用户重新连接
  if (error.code === 401) {
    // 删除无效的 tokens
    await supabase
      .from('google_accounts')
      .delete()
      .eq('user_id', userId)

    // 提示用户重新授权
    throw new Error('Please reconnect your Google Calendar')
  }
}
```

### Q3: 如何处理多个 Google 账户？

**扩展数据库表**:
```sql
ALTER TABLE google_accounts DROP CONSTRAINT google_accounts_user_id_key;

-- 现在一个用户可以连接多个 Google 账户
```

**查询时选择主账户**:
```typescript
const { data: accounts } = await supabase
  .from('google_accounts')
  .select('*')
  .eq('user_id', userId)
  .eq('is_primary', true)  // 添加 is_primary 字段
```

---

## 🎯 总结

### OAuth 2.0 认证流程的关键点

1. **授权 URL 生成**:
   - 包含 `access_type=offline` 和 `prompt=consent`
   - 这确保我们能获得 `refresh_token`

2. **回调处理**:
   - 用 `code` 换取 tokens
   - 存储到数据库（而不是 localStorage）
   - 获取用户的日历信息

3. **Token 刷新**:
   - 每次使用前检查过期时间
   - 提前 5 分钟刷新
   - 更新数据库中的新 token

4. **安全保护**:
   - 使用 HTTPS
   - 使用 `state` 参数防止 CSRF
   - Token 加密存储（可选）

---

**下一步**: 查看 [技术详解-02-事件同步逻辑.md](./技术详解-02-事件同步逻辑.md)
