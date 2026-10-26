# Vercel 一键部署指南 (One-Click Deployment Guide)

本项目基于 **TanStack Start + Nitro (Vercel Build Output API v3)**，已完全配置并测试通过，支持以下两种最便捷的一键部署方式。

---

## 方式一：本地脚本一键部署（推荐，最省心）

项目根目录已为您准备好一键部署脚本：

1. **直接双击** 根目录下的 [`deploy.bat`](file:///c:/Users/User/Desktop/2026项目开发/Life%20Explorer/pixel-perfect-render-3844-main/deploy.bat)  
   （或者在 PowerShell 中运行 `./deploy.ps1`，或运行 `npm run deploy:prebuilt`）。
2. 脚本会自动完成：
   - 全套 15 项自动化单元测试
   - 生成符合 Vercel 规范的 SSR 生产包（`.vercel/output`）
   - 调用 Vercel CLI 部署上线
3. **初次使用说明**：
   - 若您的电脑尚未登录 Vercel，CLI 会自动在浏览器中打开授权页面，点击确认即可；
   - 若您已有 Vercel Token，也可以直接执行：
     ```bash
     npx vercel deploy --prebuilt --prod --token <你的_VERCEL_TOKEN>
     ```

---

## 方式二：通过 GitHub 关联 Vercel 持续集成部署（推荐长期维护）

当前项目已完成本地 Git 仓库初始化与代码提交（`git commit` 已就绪）。

1. 在 GitHub 上新建一个仓库（例如 `life-explorer`）。
2. 在项目根目录下将本地代码推送到 GitHub：
   ```bash
   git remote add origin https://github.com/<你的用户名>/life-explorer.git
   git branch -M main
   git push -u origin main
   ```
3. 打开 [Vercel 控制台](https://vercel.com/new)，选择 **Import** 刚刚创建的 GitHub 仓库。
4. **Vercel 项目设置**（已通过 `vercel.json` 自动配置）：
   - Framework Preset: **Other**（自动识别 Nitro `.vercel/output`）
   - Build Command: `npm run build`
   - Output Directory: 默认留空（由 Nitro 输出到 `.vercel/output`）
5. 点击 **Deploy**，等待约 1 分钟即可部署成功并分配全局免费 HTTPS 域名。

---

## 线上环境变量配置清单 (Vercel Environment Variables)

部署成功后，请在 Vercel 项目控制台的 **Settings -> Environment Variables** 中添加以下环境变量：

| 变量名 | 说明 | 示例值 |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL 数据库连接串 | `postgresql://user:pass@ep-xxx.neon.tech/neondb` (可用 Neon / Supabase / Vercel Postgres) |
| `GEMINI_API_KEY` | Google Gemini 官方 API Key | `AIzaSy...` (在 [Google AI Studio](https://aistudio.google.com/) 免费获取) |
| `AUTH_SECRET` | 会员防伪 Session 加密密钥 | 任意 32 位随机字符串 (如 `9f7a8b3c2d1e0f4a5b6c7d8e9f0a1b2c`) |
| `SMTP_HOST` | (可选) 发信邮箱 SMTP 服务器 | `smtp.qq.com` / `smtp.163.com` / `smtp.resend.com` |
| `SMTP_PORT` | (可选) SMTP 端口 | `465` 或 `587` |
| `SMTP_USER` | (可选) SMTP 邮箱账号 | `your-service@domain.com` |
| `SMTP_PASS` | (可选) SMTP 邮箱授权码/密码 | `your-smtp-password` |
| `EMAIL_FROM` | (可选) 发件人名称与地址 | `"Life Explorer <no-reply@domain.com>"` |
| `NODE_ENV` | 生产环境标识 | `production` |

> **提示**：若暂不配置 SMTP，系统会自动采用控制台日志与内置安全防刷机制，用户输入邮箱后即可快速完成验证与全功能解锁。
