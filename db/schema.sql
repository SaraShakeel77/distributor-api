


CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(150) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS customers_email_unique
ON customers (LOWER(email));




CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    price NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT products_price_positive
    CHECK (price >= 0)
);



CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL
    REFERENCES products(id) ON DELETE CASCADE,

    warehouse VARCHAR(150) NOT NULL,

    available_quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT inventory_available_nonnegative
    CHECK (available_quantity >= 0),

    CONSTRAINT inventory_reserved_nonnegative
    CHECK (reserved_quantity >= 0),

    CONSTRAINT inventory_product_warehouse_unique
    UNIQUE (product_id, warehouse)
);




CREATE INDEX IF NOT EXISTS products_category_idx
ON products(category);

CREATE INDEX IF NOT EXISTS products_status_idx
ON products(status);

CREATE INDEX IF NOT EXISTS inventory_product_id_idx
ON inventory(product_id);

CREATE INDEX IF NOT EXISTS inventory_warehouse_idx
ON inventory(warehouse);