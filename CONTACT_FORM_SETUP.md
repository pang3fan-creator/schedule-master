# 联系表单配置说明

## 概述

联系表单已经配置完成，用户提交表单后，消息会发送到您的邮箱 `support@tryschedule.com`。

## 配置步骤

### 方法一：使用 Resend（推荐，Vercel 官方推荐）

Resend 是 Vercel 推荐的邮件服务，免费额度充足（每月 3000 封邮件），设置简单。

#### 1. 注册 Resend 账号

访问 [https://resend.com](https://resend.com) 并注册账号。

#### 2. 创建 API Key

1. 登录 Resend 控制台
2. 进入 "API Keys" 页面
3. 点击 "Create API Key"
4. 复制生成的 API Key（格式类似：`re_xxxxxxxxxxxxx`）


#### 3. 验证域名（可选但推荐）

为了使用自定义发件人地址（如 `noreply@tryschedule.com`），需要验证域名：

1. 在 Resend 控制台进入 "Domains" 页面
2. 添加您的域名 `tryschedule.com`
3. 按照提示添加 DNS 记录
4. 等待验证完成（通常几分钟内）

#### 4. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=TrySchedule <noreply@tryschedule.com>
ADMIN_EMAIL=support@tryschedule.com
```

**本地开发环境**：在项目根目录创建 `.env.local` 文件：

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=TrySchedule <noreply@tryschedule.com>
ADMIN_EMAIL=support@tryschedule.com
```

#### 5. 安装 Resend 包（可选，当前使用 fetch API）

当前实现使用原生 `fetch` API 调用 Resend，无需安装额外包。如果需要使用 Resend SDK，可以运行：

```bash
npm install resend
```

### 方法二：使用其他邮件服务

如果您想使用其他邮件服务（如 SendGrid、Mailgun、AWS SES 等），可以修改 `app/api/contact/route.ts` 文件中的邮件发送逻辑。

## 邮件内容

用户提交表单后，您会收到一封包含以下信息的邮件：

- **发件人**：用户填写的邮箱地址（设置为 reply-to）
- **收件人**：`support@tryschedule.com`（或您在 `ADMIN_EMAIL` 中配置的邮箱）
- **主题**：`[联系表单] {用户填写的主题}`
- **内容**：
  - 用户姓名
  - 用户邮箱
  - 主题
  - 消息内容

## 测试

### 开发环境测试

1. 启动开发服务器：`npm run dev`
2. 访问联系页面：`http://localhost:3000/contact`
3. 填写并提交表单
4. 检查控制台输出（开发模式下会打印表单数据）
5. 检查邮箱收件箱（如果已配置 Resend）

### 生产环境测试

1. 确保已配置所有环境变量
2. 访问生产环境的联系页面
3. 提交测试表单
4. 检查邮箱是否收到邮件

## 故障排查

### 邮件未收到

1. **检查环境变量**：确保 `RESEND_API_KEY` 已正确配置
2. **检查 Resend 控制台**：登录 Resend 查看邮件发送日志
3. **检查垃圾邮件文件夹**：邮件可能被标记为垃圾邮件
4. **检查域名验证**：如果使用自定义域名，确保域名已验证

### 错误信息

- **"邮件服务未配置"**：需要配置 `RESEND_API_KEY` 环境变量
- **"所有字段都是必填的"**：表单验证失败，检查前端表单
- **"邮箱格式无效"**：用户输入的邮箱格式不正确

## 安全注意事项

1. **API Key 安全**：永远不要将 API Key 提交到 Git 仓库
2. **环境变量**：使用 Vercel 的环境变量功能管理敏感信息
3. **XSS 防护**：代码中已包含 HTML 转义函数，防止 XSS 攻击
4. **速率限制**：考虑添加速率限制以防止滥用（可在 Vercel 或 Resend 层面配置）

## 费用说明

- **Resend 免费版**：每月 3000 封邮件，100 个域名
- **超出限制**：按量付费，价格合理
- **其他服务**：根据您选择的服务商定价

## 支持

如有问题，请查看：
- [Resend 文档](https://resend.com/docs)
- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
