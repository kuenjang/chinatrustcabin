# 🔒 安全設定指南

## ⚠️ 重要安全提醒

**永遠不要將敏感資訊提交到 Git！**

## 📋 環境變數設定

### 1. 本地開發環境

在專案根目錄建立 `.env.local` 檔案：

```bash
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://rjfpddvihfolmmeqcrwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ1MTEsImV4cCI6MjA2ODU1MDUxMX0.VBuB8vOrVKf0tIRDewoCzoayCnVTENebCGnuQIRQciw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3NDUxMSwiZXhwIjoyMDY4NTUwNTExfQ.E7n7Y-vPho_CFiG5rAW4plE_Sn_qybc52jb3E7kzz3A

# Telegram Bot 設定
TELEGRAM_BOT_TOKEN=7906456083:AAHrTaMKuAuvfJo2UP08_GShH8m1bimgclo
TELEGRAM_CHAT_ID=6323783287

# 應用程式設定
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Vercel 部署環境

在 Vercel Dashboard 中設定環境變數：

1. 進入專案設定
2. 前往 **Environment Variables**
3. 新增以下變數：

| 變數名稱 | 值 | 環境 |
|---------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rjfpddvihfolmmeqcrwk.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ1MTEsImV4cCI6MjA2ODU1MDUxMX0.VBuB8vOrVKf0tIRDewoCzoayCnVTENebCGnuQIRQciw` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3NDUxMSwiZXhwIjoyMDY4NTUwNTExfQ.E7n7Y-vPho_CFiG5rAW4plE_Sn_qybc52jb3E7kzz3A` | Production, Preview, Development |
| `TELEGRAM_BOT_TOKEN` | `7906456083:AAHrTaMKuAuvfJo2UP08_GShH8m1bimgclo` | Production, Preview, Development |
| `TELEGRAM_CHAT_ID` | `6323783287` | Production, Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | `https://chinatrustcabin.vercel.app` | Production, Preview, Development |

## 🔍 安全檢查

### 執行安全檢查

```bash
npm run security-check
```

此指令會檢查：
- ✅ `.env.local` 是否在 `.gitignore` 中
- ✅ 是否有敏感檔案被 Git 追蹤
- ✅ 環境變數檔案是否存在
- ✅ 是否包含必要的設定

### 手動檢查

```bash
# 檢查 .env.local 是否被追蹤
git status .env.local

# 如果顯示 "tracked"，立即移除
git rm --cached .env.local
git commit -m "remove sensitive files"
```

## 🛡️ 安全最佳實踐

### 1. Git 安全
- ✅ 確保 `.env.local` 在 `.gitignore` 中
- ✅ 定期檢查是否有敏感檔案被意外提交
- ✅ 使用 `npm run security-check` 進行檢查

### 2. Token 安全
- ✅ 定期更換 Telegram Bot Token
- ✅ 不要在任何公開場所分享 Token
- ✅ 使用環境變數而非硬編碼

### 3. 部署安全
- ✅ 在 Vercel 中設定環境變數
- ✅ 不要將 `.env.local` 上傳到任何公開倉庫
- ✅ 定期檢查部署日誌是否有敏感資訊洩露

## 🚨 緊急處理

如果發現敏感資訊被意外提交：

1. **立即更換 Token**：
   - 前往 @BotFather 重新生成 Bot Token
   - 更新 Supabase Service Role Key

2. **移除敏感檔案**：
   ```bash
   git rm --cached .env.local
   git commit -m "remove sensitive files"
   git push
   ```

3. **檢查 Git 歷史**：
   ```bash
   git log --oneline --all --grep="env"
   ```

4. **清理 Git 歷史**（如果需要）：
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env.local' \
   --prune-empty --tag-name-filter cat -- --all
   ```

## 📞 支援

如果遇到安全問題：
1. 立即更換所有 Token
2. 檢查 Git 歷史
3. 聯繫技術支援 