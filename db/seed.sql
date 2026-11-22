
-- Task 4: Product Seed Data

INSERT INTO products (sku, name, category, price, status)
VALUES
('BEV-001', 'Mineral Water', 'Beverages', 1.50, 'ACTIVE'),
('BEV-002', 'Orange Juice', 'Beverages', 3.50, 'ACTIVE'),
('BEV-003', 'Apple Juice', 'Beverages', 3.75, 'ACTIVE'),
('BEV-004', 'Green Tea', 'Beverages', 5.00, 'ACTIVE'),
('BEV-005', 'Cold Coffee', 'Beverages', 4.50, 'INACTIVE'),

('SNK-001', 'Potato Chips', 'Snacks', 2.00, 'ACTIVE'),
('SNK-002', 'Chocolate Cookies', 'Snacks', 3.00, 'ACTIVE'),
('SNK-003', 'Salted Peanuts', 'Snacks', 2.50, 'ACTIVE'),
('SNK-004', 'Popcorn', 'Snacks', 1.75, 'ACTIVE'),
('SNK-005', 'Chocolate Bar', 'Snacks', 2.25, 'INACTIVE'),

('HOM-001', 'Dishwashing Liquid', 'Household', 6.50, 'ACTIVE'),
('HOM-002', 'Laundry Detergent', 'Household', 12.00, 'ACTIVE'),
('HOM-003', 'Floor Cleaner', 'Household', 8.00, 'ACTIVE'),
('HOM-004', 'Hand Wash', 'Household', 4.00, 'ACTIVE'),
('HOM-005', 'Paper Towels', 'Household', 5.50, 'INACTIVE');


-- Inventory for two warehouses

INSERT INTO inventory
(product_id, warehouse, available_quantity, reserved_quantity)

SELECT
    p.id,
    w.warehouse,
    w.available_quantity,
    w.reserved_quantity
FROM products p
CROSS JOIN (
    VALUES
        ('Lahore Warehouse', 100, 10),
        ('Karachi Warehouse', 80, 5)
) AS w(warehouse, available_quantity, reserved_quantity)
WHERE p.sku LIKE 'BEV-%'
   OR p.sku LIKE 'SNK-%'
   OR p.sku LIKE 'HOM-%';
