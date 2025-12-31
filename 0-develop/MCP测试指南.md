# MCP 服务器测试指南

## 配置位置
配置文件：`C:\Users\pang1fan\AppData\Roaming\Claude\settings.json`

## 已配置的服务器

### 1. PostgreSQL (Supabase)
- **包名**：`@modelcontextprotocol/server-postgres`
- **功能**：直接查询 Supabase 数据库
- **数据库**：`wqzeiqfwpmjaaeustkab.supabase.co`

### 2. Filesystem
- **包名**：`@modelcontextprotocol/server-filesystem`
- **功能**：访问 `D:\WeiYun\Code` 目录

---

## 测试步骤

### 步骤 1：重启 Claude Code
配置需要重启后才能生效：
1. 关闭当前 Claude Code 会话
2. 重新启动 Claude Code

### 步骤 2：验证 MCP 服务器
重启后，运行以下命令：
```bash
/mcp
```

你应该看到：
```
MCP Servers:
- postgres: Connected
- filesystem: Connected
```

---

## 使用示例

### PostgreSQL 测试查询

#### 示例 1：查看所有表
```
查询数据库中所有的表名
```

#### 示例 2：查看 events 表结构
```
显示 events 表的结构和列信息
```

#### 示例 3：查询最近的事件
```sql
SELECT * FROM events ORDER BY created_at DESC LIMIT 10
```

#### 示例 4：统计用户数量
```
统计 profiles 表中的用户数量
```

#### 示例 5：查看订阅数据
```sql
SELECT * FROM subscriptions LIMIT 5
```

### Filesystem 测试命令

#### 示例 1：列出组件目录
```
列出 components 目录下的所有 TypeScript 文件
```

#### 示例 2：搜索特定函数
```
在 components 目录中搜索包含 "useEvent" 的文件
```

#### 示例 3：查找类型定义
```
查找 lib 目录中所有 .ts 文件
```

---

## 高级用法

### PostgreSQL 操作

#### 创建视图
```sql
CREATE VIEW user_events AS
SELECT e.*, p.email
FROM events e
JOIN profiles p ON e.user_id = p.id
```

#### 分析数据
```
分析每个用户创建的平均事件数量
```

#### 性能检查
```
查看 events 表的索引信息
```

### Filesystem 操作

#### 批量操作
```
列出所有 .tsx 文件及其大小
```

#### 内容搜索
```
在 components 目录中搜索 "useState" 的使用情况
```

---

## 常见问题

### Q1: MCP 服务器显示 "Disconnected"
**解决方法**：
1. 检查网络连接
2. 验证数据库连接字符串
3. 确认数据库可访问

### Q2: PostgreSQL 查询超时
**解决方法**：
1. 检查 Supabase 项目是否暂停
2. 验证网络连接
3. 尝试简单的查询（如 SELECT 1）

### Q3: Filesystem 权限错误
**解决方法**：
1. 确认路径存在：`D:\WeiYun\Code`
2. 检查文件权限
3. 尝试访问子目录

---

## 安全提醒

⚠️ **重要安全注意事项**：

1. **不要分享配置文件**：`settings.json` 包含数据库密码
2. **定期更新密码**：定期更改 Supabase 数据库密码
3. **限制访问权限**：确保 MCP 服务器只能访问必要的目录和表
4. **日志审计**：定期检查 Supabase 的访问日志

---

## 有用的 MCP 资源

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [Supabase Dashboard](https://supabase.com/dashboard/project/wqzeiqfwpmjaaeustkab)

---

**创建日期**：2025-12-31
**最后更新**：2025-12-31
