# Line Bot 設定指南

## 概述
本指南將幫助您設定 Line Bot 來接收訂餐通知。

## 步驟 1：建立 Line Bot

1. 前往 [Line Developers Console](https://developers.line.biz/)
2. 登入您的 Line 帳號
3. 點擊「Create New Provider」
4. 填寫 Provider 名稱（例如：您的餐廳名稱）
5. 點擊「Create」

## 步驟 2：建立 Channel

1. 在 Provider 頁面中，點擊「Create Channel」
2. 選擇「Messaging API」
3. 填寫以下資訊：
   - Channel name: 您的 Bot 名稱
   - Channel description: Bot 描述
   - Category: 選擇「Food & Drink」
   - Subcategory: 選擇「Restaurant」
4. 同意服務條款並點擊「Create」

## 步驟 3：取得 Channel Access Token

1. 在 Channel 設定頁面中，點擊「Messaging API」標籤
2. 找到「Channel access token」區塊
3. 點擊「Issue」按鈕
4. 複製生成的 Channel Access Token

## 步驟 4：取得您的 Line User ID

### 方法一：使用 Line Bot 取得
1. 在 Channel 設定頁面中，找到「QR Code」
2. 使用 Line App 掃描 QR Code 加入您的 Bot
3. 發送任何訊息給 Bot
4. 在 Channel 設定頁面的「Messaging API」標籤中，點擊「Webhook URL」旁的「Verify」按鈕
5. 查看 Webhook 事件日誌，找到您的 User ID

### 方法二：使用 Line ID 查詢工具
1. 在 Line App 中，前往「設定」>「個人資料」
2. 找到您的 Line ID（格式如：U1234567890abcdef1234567890abcdef）

## 步驟 5：設定環境變數

在您的 `.env.local` 檔案中加入以下設定：

```env
# Line Bot 設定
LINE_CHANNEL_ACCESS_TOKEN=您的_Channel_Access_Token
LINE_USER_ID=您的_Line_User_ID
```

## 步驟 6：測試設定

1. 重新啟動您的開發伺服器
2. 建立一個測試訂單
3. 檢查是否收到 Line 通知

## 常見問題

### Q: 為什麼收不到 Line 通知？
A: 請檢查：
- Channel Access Token 是否正確
- Line User ID 是否正確
- Bot 是否已加入好友
- 環境變數是否已正確設定

### Q: 如何取得群組 ID？
A: 如果您想發送到群組：
1. 將 Bot 加入群組
2. 在群組中發送訊息
3. 查看 Webhook 事件日誌中的 Group ID

### Q: 可以同時發送到多個用戶嗎？
A: 可以，您可以在程式碼中設定多個 User ID，或使用群組 ID。

## 安全提醒

1. 永遠不要將 Channel Access Token 提交到 Git
2. 定期更換 Channel Access Token
3. 在生產環境中使用環境變數
4. 監控 Bot 的使用情況

## 進階設定

### 自訂訊息格式
您可以在 `app/api/orders/route.ts` 中修改 `orderMessage` 變數來自訂訊息格式。

### 加入圖片或按鈕
Line API 支援多種訊息類型，包括圖片、按鈕等。您可以參考 [Line Messaging API 文件](https://developers.line.biz/en/docs/messaging-api/) 來擴展功能。 