-- 中信小屋資料庫安全升級腳本
-- 此腳本會檢查現有結構，只更新需要的部分，保留現有資料

-- 1. 檢查並備份現有資料
DO $$
BEGIN
    -- 如果 orders 表存在，建立備份
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
        CREATE TABLE IF NOT EXISTS orders_backup AS SELECT * FROM orders;
        RAISE NOTICE 'Orders table backed up to orders_backup';
    END IF;
    
    -- 如果 order_items 表存在，建立備份
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'order_items') THEN
        CREATE TABLE IF NOT EXISTS order_items_backup AS SELECT * FROM order_items;
        RAISE NOTICE 'Order_items table backed up to order_items_backup';
    END IF;
END $$;

-- 2. 更新 orders 表結構
DO $$
BEGIN
    -- 如果 orders 表不存在，建立新表
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            order_number VARCHAR(50) UNIQUE NOT NULL,
            customer_name VARCHAR(100) NOT NULL,
            customer_phone VARCHAR(20) NOT NULL,
            customer_address TEXT,
            note TEXT,
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created new orders table';
    ELSE
        -- 如果表存在，檢查並添加缺少的欄位
        -- 檢查 order_number 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
            ALTER TABLE orders ADD COLUMN order_number VARCHAR(50);
            RAISE NOTICE 'Added order_number column to orders table';
        END IF;
        
        -- 檢查 customer_name 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
            ALTER TABLE orders ADD COLUMN customer_name VARCHAR(100);
            RAISE NOTICE 'Added customer_name column to orders table';
        END IF;
        
        -- 檢查 customer_phone 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
            ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(20);
            RAISE NOTICE 'Added customer_phone column to orders table';
        END IF;
        
        -- 檢查 customer_address 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_address') THEN
            ALTER TABLE orders ADD COLUMN customer_address TEXT;
            RAISE NOTICE 'Added customer_address column to orders table';
        END IF;
        
        -- 檢查 note 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'note') THEN
            ALTER TABLE orders ADD COLUMN note TEXT;
            RAISE NOTICE 'Added note column to orders table';
        END IF;
        
        -- 檢查 total_amount 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total_amount') THEN
            ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2);
            RAISE NOTICE 'Added total_amount column to orders table';
        END IF;
        
        -- 檢查 status 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'status') THEN
            ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
            RAISE NOTICE 'Added status column to orders table';
        END IF;
        
        -- 檢查 updated_at 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'updated_at') THEN
            ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added updated_at column to orders table';
        END IF;
        
        RAISE NOTICE 'Updated existing orders table structure';
    END IF;
END $$;

-- 3. 更新 order_items 表結構
DO $$
BEGIN
    -- 如果 order_items 表不存在，建立新表
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'order_items') THEN
        CREATE TABLE order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
            menu_item_name VARCHAR(100) NOT NULL,
            quantity INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created new order_items table';
    ELSE
        -- 如果表存在，檢查並添加缺少的欄位
        -- 檢查 menu_item_name 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'menu_item_name') THEN
            -- 如果存在 item_name，重命名為 menu_item_name
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'item_name') THEN
                ALTER TABLE order_items RENAME COLUMN item_name TO menu_item_name;
                RAISE NOTICE 'Renamed item_name to menu_item_name in order_items table';
            ELSE
                ALTER TABLE order_items ADD COLUMN menu_item_name VARCHAR(100);
                RAISE NOTICE 'Added menu_item_name column to order_items table';
            END IF;
        END IF;
        
        -- 檢查 price 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'price') THEN
            -- 如果存在 item_price，重命名為 price
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'item_price') THEN
                ALTER TABLE order_items RENAME COLUMN item_price TO price;
                RAISE NOTICE 'Renamed item_price to price in order_items table';
            ELSE
                ALTER TABLE order_items ADD COLUMN price DECIMAL(10,2);
                RAISE NOTICE 'Added price column to order_items table';
            END IF;
        END IF;
        
        -- 檢查 subtotal 欄位
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'subtotal') THEN
            ALTER TABLE order_items ADD COLUMN subtotal DECIMAL(10,2);
            RAISE NOTICE 'Added subtotal column to order_items table';
        END IF;
        
        RAISE NOTICE 'Updated existing order_items table structure';
    END IF;
END $$;

-- 4. 建立或更新索引
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 5. 建立或更新觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 啟用 RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 7. 建立或更新 RLS 政策
-- 刪除舊的政策（如果存在）
DROP POLICY IF EXISTS "Allow anonymous insert" ON orders;
DROP POLICY IF EXISTS "Allow anonymous insert" ON order_items;
DROP POLICY IF EXISTS "Service role full access" ON orders;
DROP POLICY IF EXISTS "Service role full access" ON order_items;

-- 建立新的政策
CREATE POLICY "Allow anonymous insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access" ON orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON order_items
  FOR ALL USING (auth.role() = 'service_role');

-- 8. 顯示升級完成訊息
SELECT 'Database upgrade completed successfully!' as message; 