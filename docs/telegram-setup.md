# Telegram 訂單通知設定

## 設定步驟

### 1. 建立 Telegram Bot

1. 在 Telegram 中搜尋 `@BotFather`
2. 發送 `/newbot` 指令
3. 輸入 Bot 名稱（例如：餐廳訂單通知）
4. 輸入 Bot 用戶名（例如：restaurant_order_bot）
5. 複製收到的 Bot Token

### 2. 取得 Chat ID

#### 方法一：個人聊天
1. 在 Telegram 中搜尋你剛建立的 Bot
2. 發送 `/start` 指令
3. 在瀏覽器中訪問：`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. 找到 `chat.id` 欄位，複製數字

#### 方法二：群組聊天
1. 將 Bot 加入群組
2. 在群組中發送 `/start` 指令
3. 訪問：`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. 找到群組的 `chat.id`（通常是負數）

### 3. 設定環境變數

在專案根目錄建立 `.env.local` 檔案：

```env
# Telegram Bot 設定
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# 網站基礎 URL (可選)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. 測試設定

1. 重新啟動開發伺服器
2. 建立一個測試訂單
3. 檢查 Telegram 是否收到通知

## 常見問題

### 問題：收不到通知
- 檢查 Bot Token 是否正確
- 檢查 Chat ID 是否正確
- 確認 Bot 有權限發送訊息到該聊天室
- 檢查瀏覽器控制台的錯誤訊息

### 問題：Bot 無法加入群組
- 確保 Bot 是公開的
- 群組管理員需要手動加入 Bot

### 問題：環境變數不生效
- 重新啟動開發伺服器
- 確認檔案名稱為 `.env.local`
- 確認變數名稱正確

## 通知格式

成功設定後，你會收到如下格式的通知：

```
🆕 新訂單通知！

📋 訂單號：20241201-ON-001
🍽️ 取餐方式：內用
💰 總金額：$180

📝 餐點明細：
豪華版爆香蝦獅粉 x1
涼拌黃瓜木耳 x1

⏰ 時間：2024/12/1 下午 2:30:45
``` 