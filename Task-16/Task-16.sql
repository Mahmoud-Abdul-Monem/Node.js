CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT null,
    country varchar(255)
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT null,
    price DECIMAL(10, 2) NOT null,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS customers(
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT null
);

CREATE TABLE IF NOT EXISTS orders(
    id SERIAL PRIMARY KEY,
    ordered_at timestamp DEFAULT CURRENT_TIMESTAMP,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_item(
    quantity INT DEFAULT 1,
    cost DECIMAL(10, 2) NOT null,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    book_id INT REFERENCES books(id) ON DELETE SET NULL,
    PRIMARY KEY (order_id, book_id)
);


-- INSERT INTO authors (name, country) VALUES
-- ('أحمد خالد توفيق', 'Egypt'),
-- ('نجيب محفوظ', 'Egypt'),
-- ('رضوى عاشور', 'Egypt'),
-- ('جورج أورويل', 'UK'),
-- ('ستيفن كينج', 'USA'),
-- ('مؤلف بدون كتب', 'Saudi Arabia');

-- INSERT INTO books (title, price, author_id) VALUES
-- ('يوتوبيا', 150.00, 1),
-- ('فانتازيا', 120.00, 1),
-- ('سلسلة ما وراء الطبيعة 1', 80.00, 1),
-- ('سلسلة ما وراء الطبيعة 2', 80.00, 1),
-- ('الثلاثية', 300.00, 2),
-- ('ثلاثية غرناطة', 250.00, 3),
-- ('1984', 200.00, 4),
-- ('مزرعة الحيوان', 180.00, 4),
-- ('كتاب لم يطلب أبداً', 90.00, 5);

-- INSERT INTO customers (name) VALUES
-- ('محمد علي'),
-- ('أحمد حسن'),
-- ('سارة محمود'),
-- ('عمر خالد'),
-- ('عميل بدون طلبات');

-- INSERT INTO orders (customer_id) VALUES
-- (1), 
-- (1), 
-- (2), 
-- (3), 
-- (4); 

-- INSERT INTO order_item (order_id, book_id, quantity, cost) VALUES
-- (1, 1, 2, 150.00),
-- (1, 2, 1, 120.00),
-- (1, 5, 1, 300.00),

-- (2, 6, 1, 250.00),

-- (3, 7, 3, 200.00),

-- (4, 3, 1, 80.00),

-- (5, 4, 1, 80.00);


SELECT 
    a.id, 
    a.name, 
    COUNT(b.id) AS total_books
FROM authors a
LEFT JOIN books b ON a.id = b.author_id
GROUP BY a.id, a.name;



SELECT 
    a.id, 
    a.name, 
    COUNT(b.id) AS total_books
FROM authors a
JOIN books b ON a.id = b.author_id
GROUP BY a.id, a.name
HAVING COUNT(b.id) > 3;




SELECT 
    country, 
    COUNT(id) AS total_authors
FROM authors
WHERE country IS NOT NULL
GROUP BY country
HAVING COUNT(id) > 1;







SELECT 
    c.id, 
    c.name, 
    SUM(oi.quantity * oi.cost) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_item oi ON o.id = oi.order_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 5;


SELECT 
    c.id, 
    c.name, 
    SUM(oi.quantity * oi.cost) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_item oi ON o.id = oi.order_id
GROUP BY c.id, c.name
HAVING SUM(oi.quantity * oi.cost) > 100;



SELECT 
    c.id, 
    c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

SELECT 
    b.id, 
    b.title
FROM books b
LEFT JOIN order_item oi ON b.id = oi.book_id
WHERE oi.book_id IS NULL;


SELECT 
    b.id, 
    b.title, 
    a.name AS author_name, 
    SUM(oi.quantity) AS total_quantity_sold
FROM books b
JOIN authors a ON b.author_id = a.id
JOIN order_item oi ON b.id = oi.book_id
GROUP BY b.id, b.title, a.name
ORDER BY total_quantity_sold DESC
LIMIT 5;



SELECT 
    a.country, 
    SUM(oi.quantity * oi.cost) AS total_sales_amount
FROM authors a
JOIN books b ON a.id = b.author_id
JOIN order_item oi ON b.id = oi.book_id
WHERE a.country IS NOT NULL
GROUP BY a.country;





SELECT 
    c.id, 
    c.name, 
    COUNT(o.id) AS total_orders
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
HAVING COUNT(o.id) < 2;




SELECT 
    order_id, 
    COUNT(DISTINCT book_id) AS distinct_books_count
FROM order_item
GROUP BY order_id
HAVING COUNT(DISTINCT book_id) >= 3;