CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(100),
    car_brand VARCHAR(50),
    car_model VARCHAR(50),
    car_year INTEGER,
    plate_number VARCHAR(15),
    vin VARCHAR(17)
);

CREATE TABLE parts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    article VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'новый',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    work_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    parts_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_cost DECIMAL(10, 2) NOT NULL
);

CREATE TABLE order_parts (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES parts(id),
    name VARCHAR(100) NOT NULL,
    article VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'master'))
);

INSERT INTO users (login, password, role) VALUES
    ('admin', 'admin123', 'admin'),
    ('master', 'master123', 'master');
