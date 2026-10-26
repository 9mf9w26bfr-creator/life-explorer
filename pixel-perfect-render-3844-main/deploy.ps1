# Life Explorer - Vercel 一键自动化部署脚本 (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Life Explorer - Vercel 一键自动化部署" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] 执行单元测试与完整性校验..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 单元测试未通过！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/3] 执行生产环境打包 (Nitro Vercel Preset)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 生产打包失败！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[3/3] 正在发布至 Vercel 生产环境..." -ForegroundColor Yellow
npx vercel deploy --prebuilt --prod

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "  部署完成！请在上方查看您的生产域名 (Production URL)" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
