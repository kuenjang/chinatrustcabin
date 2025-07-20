# 🔧 Vercel 部署故障排除指南

## 當前錯誤：NEXT_PUBLIC_SUPABASE_URL is required

這個錯誤表示 Vercel 沒有設定必要的環境變數。請按照以下步驟解決：

## 🚨 立即解決步驟

### 1. 前往 Vercel Dashboard
1. 打開 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到您的 `chinatrustcabin` 專案
3. 點擊專案進入詳細頁面

### 2. 設定環境變數
1. 點擊 "Settings" 標籤
2. 在左側選單中選擇 "Environment Variables"
3. 點擊 "Add New" 按鈕

### 3. 添加以下環境變數

#### 第一個環境變數
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://rjfpddvihfolmmeqcrwk.supabase.co`
- **Environment**: 勾選所有三個選項 (Production, Preview, Development)

#### 第二個環境變數
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ1MTEsImV4cCI6MjA2ODU1MDUxMX0.VBuB8vOrVKf0tIRDewoCzoayCnVTENebCGnuQIRQciw`
- **Environment**: 勾選所有三個選項

#### 第三個環境變數
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3NDUxMSwiZXhwIjoyMDY4NTUwNTExfQ.E7n7Y-vPho_CFiG5rAW4plE_Sn_qybc52jb3E7kzz3A`
- **Environment**: 勾選所有三個選項

#### 第四個環境變數
- **Name**: `TELEGRAM_BOT_TOKEN`
- **Value**: `7906456083:AAHrTaMKuAuvfJo2UP08_GShH8m1bimgclo`
- **Environment**: 勾選所有三個選項

#### 第五個環境變數
- **Name**: `TELEGRAM_CHAT_ID`
- **Value**: `6323783287`
- **Environment**: 勾選所有三個選項

### 4. 重新部署
1. 設定完所有環境變數後
2. 前往 "Deployments" 標籤
3. 點擊 "Redeploy" 按鈕重新部署

## 📋 環境變數檢查清單

確保您已經設定了以下所有環境變數：

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `TELEGRAM_CHAT_ID`

## 🔍 常見問題

### Q: 為什麼需要設定環境變數？
A: 環境變數包含敏感資訊（如 API 金鑰），不能直接寫在代碼中。Vercel 需要這些變數來連接 Supabase 資料庫和 Telegram Bot。

### Q: 環境變數設定後還是失敗？
A: 
1. 確保所有環境變數都勾選了 Production、Preview、Development
2. 重新部署專案
3. 檢查變數名稱是否完全正確（注意大小寫）

### Q: 如何確認環境變數已正確設定？
A: 
1. 在 Vercel Dashboard 中檢查環境變數列表
2. 重新部署後查看建置日誌
3. 如果成功，會看到 "✅ Supabase 環境變數已正確設定" 訊息

## 🎯 成功指標

部署成功後，您應該看到：
- ✅ 建置成功訊息
- ✅ "Supabase 環境變數已正確設定" 日誌
- ✅ 網站可以正常訪問
- ✅ 訂單提交功能正常

## 📞 需要幫助？

如果按照以上步驟仍然無法解決，請：
1. 檢查 Vercel 建置日誌的完整錯誤訊息
2. 確認所有環境變數都已正確設定
3. 重新部署專案

---

**重要提醒**: 環境變數是部署成功的關鍵，請確保所有 5 個變數都正確設定！ 