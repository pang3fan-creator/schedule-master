import { NextRequest, NextResponse } from "next/server"

/**
 * 联系表单 API 路由
 * 接收表单数据并发送邮件到站长邮箱
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "所有字段都是必填的" },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "邮箱格式无效" },
        { status: 400 }
      )
    }

    // 获取站长邮箱（从环境变量）
    const adminEmail = process.env.ADMIN_EMAIL || "support@tryschedule.com"
    
    // 如果配置了 Resend API Key，使用 Resend 发送邮件
    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "TrySchedule <noreply@tryschedule.com>",
          to: [adminEmail],
          reply_to: email,
          subject: `[联系表单] ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                新的联系表单提交
              </h2>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>姓名：</strong> ${escapeHtml(name)}</p>
                <p style="margin: 10px 0;"><strong>邮箱：</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
                <p style="margin: 10px 0;"><strong>主题：</strong> ${escapeHtml(subject)}</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">消息内容：</h3>
                <p style="color: #4b5563; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                <p>此邮件来自 TrySchedule 联系表单</p>
                <p>回复此邮件将直接发送给用户：${escapeHtml(email)}</p>
              </div>
            </div>
          `,
          text: `
新的联系表单提交

姓名：${name}
邮箱：${email}
主题：${subject}

消息内容：
${message}

---
此邮件来自 TrySchedule 联系表单
回复此邮件将直接发送给用户：${email}
          `.trim(),
        }),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text()
        console.error("Resend API error:", errorData)
        throw new Error(`Resend API error: ${resendResponse.status}`)
      }

      const resendData = await resendResponse.json()
      console.log("Email sent via Resend:", resendData.id)
      
      return NextResponse.json(
        { 
          success: true, 
          message: "消息已成功发送",
          emailId: resendData.id 
        },
        { status: 200 }
      )
    }

    // 如果没有配置 Resend，使用 mailto 链接（仅用于开发环境）
    // 生产环境应该配置 Resend 或其他邮件服务
    if (process.env.NODE_ENV === "development") {
      console.log("=== 联系表单提交（开发模式）===")
      console.log("姓名:", name)
      console.log("邮箱:", email)
      console.log("主题:", subject)
      console.log("消息:", message)
      console.log("应该发送到:", adminEmail)
      console.log("================================")
      
      return NextResponse.json(
        { 
          success: true, 
          message: "消息已记录（开发模式）",
          note: "生产环境请配置 RESEND_API_KEY 环境变量以启用邮件发送"
        },
        { status: 200 }
      )
    }

    // 生产环境但没有配置邮件服务
    return NextResponse.json(
      { error: "邮件服务未配置，请联系管理员" },
      { status: 500 }
    )

  } catch (error) {
    console.error("联系表单提交错误:", error)
    return NextResponse.json(
      { error: "发送消息时出错，请稍后重试" },
      { status: 500 }
    )
  }
}

/**
 * HTML 转义函数，防止 XSS 攻击
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
