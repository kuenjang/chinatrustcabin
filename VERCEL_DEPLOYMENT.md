# 🚀 Vercel 部署指南

## 1. 連接 GitHub 倉庫到 Vercel

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "New Project"
3. 選擇 "Import Git Repository"
4. 選擇您的 `chinatrustcabin` 倉庫
5. 點擊 "Deploy"

## 2. 設定環境變數

在 Vercel 專案設定中，前往 "Settings" > "Environment Variables"，添加以下環境變數：

### 必要環境變數

```bash
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://rjfpddvihfolmmeqcrwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ1MTEsImV4cCI6MjA2ODU1MDUxMX0.VBuB8vOrVKf0tIRDewoCzoayCnVTENebCGnuQIRQciw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3NDUxMSwiZXhwIjoyMDY4NTUwNTExfQ.E7n7Y-vPho_CFiG5rAW4plE_Sn_qybc52jb3E7kzz3A

# Telegram Bot 設定
TELEGRAM_BOT_TOKEN=7906456083:AAHrTaMKuAuvfJo2UP08_GShH8m1bimgclo
TELEGRAM_CHAT_ID=6323783287
```

### 環境變數設定說明

1. **NEXT_PUBLIC_SUPABASE_URL**: Supabase 專案 URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase 匿名金鑰（公開）
3. **SUPABASE_SERVICE_ROLE_KEY**: Supabase 服務角色金鑰（私有）
4. **TELEGRAM_BOT_TOKEN**: Telegram Bot Token
5. **TELEGRAM_CHAT_ID**: Telegram Chat ID

## 3. 部署設定

### 建置設定
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 環境變數範圍
確保所有環境變數都設定為：
- ✅ Production
- ✅ Preview
- ✅ Development

## 4. 自動部署

設定完成後：
- 每次推送到 `main` 分支都會自動觸發部署
- 可以設定自定義域名
- 支援預覽部署（Pull Request）

## 5. 故障排除

### 常見錯誤

1. **"supabaseUrl is required"**
   - 檢查 `NEXT_PUBLIC_SUPABASE_URL` 是否正確設定
   - 確保環境變數在所有環境中都有設定

2. **"supabaseAnonKey is required"**
   - 檢查 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是否正確設定

3. **"supabaseServiceKey is required"**
   - 檢查 `SUPABASE_SERVICE_ROLE_KEY` 是否正確設定

4. **建置失敗**
   - 檢查 Vercel 建置日誌
   - 確保所有依賴都已正確安裝

### 檢查步驟

1. 前往 Vercel Dashboard
2. 選擇您的專案
3. 點擊 "Deployments"
4. 查看最新的部署日誌
5. 檢查環境變數是否正確設定

## 6. 驗證部署

部署完成後，檢查以下功能：

1. **主頁面**: 確認餐點選單正常顯示
2. **訂單提交**: 測試新增訂單功能
3. **後台管理**: 確認管理介面正常運作
4. **Telegram 通知**: 確認新訂單會發送通知

## 7. 自定義域名（可選）

1. 前往 "Settings" > "Domains"
2. 添加您的自定義域名
3. 設定 DNS 記錄
4. 等待 DNS 傳播完成

## 8. 監控和維護

- 使用 Vercel Analytics 監控效能
- 設定錯誤通知
- 定期檢查部署狀態
- 更新依賴套件

---

**注意**: 確保所有環境變數都正確設定，這是部署成功的關鍵！ 