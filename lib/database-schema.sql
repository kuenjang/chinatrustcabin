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

-- 建立訂單表
CREATE TABLE IF NOT EXISTS orders (
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

-- 建立訂單項目表
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- 建立更新時間的觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 