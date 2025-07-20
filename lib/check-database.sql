-- 檢查現有資料庫結構
-- 執行此腳本來查看當前的資料表結構

-- 檢查現有的資料表
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'order_items', 'order_channels', 'queue_numbers', 'daily_counters')
ORDER BY table_name;

-- 檢查 orders 表的結構（如果存在）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
        RAISE NOTICE 'Orders table exists. Checking structure...';
        
        -- 顯示 orders 表的欄位
        PERFORM 
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        ORDER BY ordinal_position;
    ELSE
        RAISE NOTICE 'Orders table does not exist.';
    END IF;
END $$;

-- 檢查 order_items 表的結構（如果存在）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'order_items') THEN
        RAISE NOTICE 'Order_items table exists. Checking structure...';
        
        -- 顯示 order_items 表的欄位
        PERFORM 
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        ORDER BY ordinal_position;
    ELSE
        RAISE NOTICE 'Order_items table does not exist.';
    END IF;
END $$;

-- 檢查現有的索引
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, indexname;

-- 檢查現有的觸發器
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table IN ('orders', 'order_items')
ORDER BY event_object_table, trigger_name;

-- 檢查 RLS 政策
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname; 