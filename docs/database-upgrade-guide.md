# 資料庫升級指南

## 🔄 升級步驟

### 1. 檢查現有結構
首先執行檢查腳本來了解您目前的資料庫結構：

```sql
-- 在 Supabase SQL Editor 中執行
-- 複製 lib/check-database.sql 的內容並執行
```

### 2. 選擇升級方式

#### 方式一：安全升級（推薦）
如果您有重要資料需要保留：

```sql
-- 在 Supabase SQL Editor 中執行
-- 複製 lib/upgrade-database-fixed.sql 的內容並執行
```

這個腳本會：
- ✅ 自動備份現有資料
- ✅ 保留現有資料
- ✅ 只更新需要的欄位
- ✅ 安全地重命名欄位

#### 方式二：完全重建
如果您不需要保留舊資料：

```sql
-- 在 Supabase SQL Editor 中執行
-- 複製 lib/upgrade-database.sql 的內容並執行
```

⚠️ **警告**：此方式會刪除所有現有資料！

### 3. 驗證升級結果

執行以下查詢確認升級成功：

```sql
-- 檢查 orders 表結構
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 檢查 order_items 表結構
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- 檢查索引
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('orders', 'order_items');

-- 檢查 RLS 政策
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items');
```

## 📋 新舊結構對比

### Orders 表變化

| 舊欄位 | 新欄位 | 說明 |
|--------|--------|------|
| `id` | `id` | 保持不變 |
| `order_number` | `order_number` | 長度從 20 改為 50 |
| `customer_name` | `customer_name` | 保持不變 |
| `customer_phone` | `customer_phone` | 保持不變 |
| `special_notes` | `note` | 重命名 |
| - | `customer_address` | 新增欄位 |
| `total_amount` | `total_amount` | 保持不變 |
| `status` | `status` | 保持不變 |
| `created_at` | `created_at` | 改為 WITH TIME ZONE |
| `updated_at` | `updated_at` | 改為 WITH TIME ZONE |

### Order Items 表變化

| 舊欄位 | 新欄位 | 說明 |
|--------|--------|------|
| `id` | `id` | 保持不變 |
| `order_id` | `order_id` | 保持不變 |
| `item_name` | `menu_item_name` | 重命名 |
| `item_price` | `price` | 重命名 |
| `quantity` | `quantity` | 保持不變 |
| - | `subtotal` | 新增欄位 |
| `created_at` | `created_at` | 改為 WITH TIME ZONE |

## 🔧 故障排除

### 常見問題

1. **欄位重命名失敗**
   ```sql
   -- 手動重命名
   ALTER TABLE order_items RENAME COLUMN item_name TO menu_item_name;
   ALTER TABLE order_items RENAME COLUMN item_price TO price;
   ALTER TABLE orders RENAME COLUMN special_notes TO note;
   ```

2. **外鍵約束錯誤**
   ```sql
   -- 檢查外鍵
   SELECT 
       tc.table_name, 
       kcu.column_name, 
       ccu.table_name AS foreign_table_name,
       ccu.column_name AS foreign_column_name 
   FROM information_schema.table_constraints AS tc 
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   WHERE constraint_type = 'FOREIGN KEY' 
   AND tc.table_name IN ('orders', 'order_items');
   ```

3. **RLS 政策問題**
   ```sql
   -- 重新建立政策
   DROP POLICY IF EXISTS "Allow anonymous insert" ON orders;
   CREATE POLICY "Allow anonymous insert" ON orders
     FOR INSERT WITH CHECK (true);
   ```

### 恢復備份

如果升級失敗，可以恢復備份：

```sql
-- 恢復 orders 表
DROP TABLE IF EXISTS orders;
CREATE TABLE orders AS SELECT * FROM orders_backup;

-- 恢復 order_items 表
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items AS SELECT * FROM order_items_backup;
```

## ✅ 升級完成檢查清單

- [ ] Orders 表結構正確
- [ ] Order_items 表結構正確
- [ ] 索引已建立
- [ ] 觸發器已建立
- [ ] RLS 已啟用
- [ ] RLS 政策已建立
- [ ] 舊資料已備份
- [ ] 新欄位已添加
- [ ] 欄位重命名完成

## 📞 需要幫助？

如果遇到問題：
1. 檢查 Supabase 日誌
2. 確認 SQL 語法正確
3. 檢查權限設定
4. 聯繫技術支援 