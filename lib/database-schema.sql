-- 訂餐系統資料庫結構
-- 適用於線上點餐和現場點餐雙通道系統

-- 1. 訂餐通道表
CREATE TABLE order_channels (
    id SERIAL PRIMARY KEY,
    channel_code VARCHAR(10) UNIQUE NOT NULL, -- 通道代碼 (ON, WA)
    channel_name VARCHAR(50) NOT NULL, -- 通道名稱
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 訂單主表
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL, -- 訂單號 (YYYYMMDD-CH-001)
    channel_id INTEGER REFERENCES order_channels(id),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, cancelled
    payment_method VARCHAR(20) DEFAULT 'cash', -- cash, card, online
    delivery_type VARCHAR(20) DEFAULT 'dine_in', -- dine_in, takeaway
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. 訂單明細表
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    item_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 叫號系統表
CREATE TABLE queue_numbers (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    queue_number VARCHAR(10) NOT NULL, -- 叫號號碼
    status VARCHAR(20) DEFAULT 'waiting', -- waiting, called, completed
    called_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. 每日序號計數器
CREATE TABLE daily_counters (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    channel_code VARCHAR(10) NOT NULL,
    counter INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 插入預設通道資料（只保留線上點餐和現場點餐）
INSERT INTO order_channels (channel_code, channel_name) VALUES
('ON', '線上點餐'),
('WA', '現場點餐');

-- 建立索引
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_channel_id ON orders(channel_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_queue_numbers_status ON queue_numbers(status);
CREATE INDEX idx_daily_counters_date_channel ON daily_counters(date, channel_code); 