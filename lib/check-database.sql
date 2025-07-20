-- 檢查資料庫結構
-- 執行此腳本來驗證資料庫是否正確設定

-- 1. 檢查訂單表結構
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 2. 檢查訂單項目表結構
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- 3. 檢查是否有資料
SELECT COUNT(*) as orders_count FROM orders;
SELECT COUNT(*) as order_items_count FROM order_items;

-- 4. 檢查最新的訂單
SELECT 
    id,
    order_number,
    customer_name,
    customer_phone,
    total_amount,
    status,
    created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5; 