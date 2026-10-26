@echo off
chcp 65001 >nul
echo ==================================================
echo   Life Explorer - Vercel 一键自动化部署脚本
echo ==================================================
echo.
echo [1/3] 执行单元测试与完整性校验...
call npm test
if %errorlevel% neq 0 (
    echo [错误] 测试未通过，终止部署！
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] 执行生产环境打包 (Nitro Vercel Preset)...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 构建失败，终止部署！
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] 一键部署至 Vercel 生产环境...
call npx vercel deploy --prebuilt --prod
if %errorlevel% neq 0 (
    echo.
    echo [提示] 若首次使用需登录，请在弹出的浏览器页面中点击确认授权。
)

echo.
echo ==================================================
echo   操作完成！请在上方终端查看生产环境访问链接。
echo ==================================================
pause
