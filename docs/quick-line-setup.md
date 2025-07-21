# 🚀 Line 通知快速設定指南

## 您已經有的資訊
- ✅ Channel Access Token: `/mJhQ/MKTPKsCmTLgcyhWD5NybEFnFBZ9iAeAI04xFqO1G8P+R1dqXhMl7VQ6tclsuV2AwnN0Vy7JTBwIg+kL3lreGqWJZqRzk5tJGOACrqCL+qZRgWP0goS/7EiFH9YmQ7DhLdLKaj229KB7Eh0JAdB04t89/1O/w1cDnyilFU=`

## 接下來需要做的步驟

### 1. 取得您的 Line User ID

#### 方法一：使用 Line Bot 取得（推薦）
1. 前往您的 Line Bot 設定頁面
2. 找到 QR Code
3. 使用 Line App 掃描 QR Code 加入您的 Bot
4. 發送任何訊息給 Bot（例如：「測試」）
5. 在 Line Developers Console 中查看 Webhook 事件日誌
6. 找到您的 User ID（格式如：U1234567890abcdef1234567890abcdef）

#### 方法二：使用 Line ID 查詢工具
1. 在 Line App 中，前往「設定」>「個人資料」
2. 找到您的 Line ID

### 2. 設定環境變數

在您的 `.env.local` 檔案中加入：

```env
# Line Bot 設定
LINE_CHANNEL_ACCESS_TOKEN=/mJhQ/MKTPKsCmTLgcyhWD5NybEFnFBZ9iAeAI04xFqO1G8P+R1dqXhMl7VQ6tclsuV2AwnN0Vy7JTBwIg+kL3lreGqWJZqRzk5tJGOACrqCL+qZRgWP0goS/7EiFH9YmQ7DhLdLKaj229KB7Eh0JAdB04t89/1O/w1cDnyilFU=
LINE_USER_ID=您的_Line_User_ID
```

### 3. 測試設定

1. 重新啟動開發伺服器：
   ```bash
   npm run dev
   ```

2. 前往測試頁面：
   ```
   http://localhost:3000/test-line
   ```

3. 點擊「發送測試訊息」按鈕

4. 檢查您的 Line 是否收到測試訊息

### 4. 驗證訂單通知

1. 建立一個測試訂單
2. 檢查是否同時收到 Telegram 和 Line 通知

## 常見問題

### Q: 收不到 Line 通知？
A: 請檢查：
- Bot 是否已加入好友
- Line User ID 是否正確
- 環境變數是否已重新載入

### Q: 如何確認 Bot 已加入好友？
A: 在 Line App 中搜尋您的 Bot 名稱，確認已加入好友。

### Q: 可以發送到群組嗎？
A: 可以，將 Bot 加入群組後，使用群組 ID 替代 User ID。

## 完成！

設定完成後，每次有新訂單時，您都會同時收到：
- 📱 Telegram 通知
- 💬 Line 通知

這樣您就不會錯過任何訂單了！ 