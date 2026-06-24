require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'autoservice',
  password: process.env.DB_PASSWORD || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
});

function dbError(err) {
  if (err.code === '28P01') return 'Неверный пароль в .env';
  if (err.code === '3D000') return 'База не найдена. Выполните schema.sql';
  if (err.code === 'ECONNREFUSED') return 'PostgreSQL не запущен';
  if (err.code === '23505') return 'Такой артикул или телефон уже есть';
  return 'Ошибка базы данных';
}

app.use(cors());
app.use(express.json());

app.get('/api/parts', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM parts ORDER BY name');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.post('/api/parts', async (req, res) => {
  const { name, article, price } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO parts (name, article, price) VALUES ($1, $2, $3) RETURNING *',
      [name, article, price]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM services ORDER BY category, name');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.post('/api/services', async (req, res) => {
  const { category, name, price } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO services (category, name, price) VALUES ($1, $2, $3) RETURNING *',
      [category, name, price]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.get('/api/orders', async (req, res) => {
  const { client_id } = req.query;
  try {
    let sql = `
      SELECT o.*, c.name AS client_name, c.plate_number, c.vin, c.car_brand, c.car_model
      FROM orders o JOIN clients c ON o.client_id = c.id
    `;
    const params = [];
    if (client_id) {
      sql += ' WHERE o.client_id = $1';
      params.push(client_id);
    }
    sql += ' ORDER BY o.date DESC, o.id DESC';
    const orders = await pool.query(sql, params);
    const result = [];
    for (const o of orders.rows) {
      const p = await pool.query('SELECT * FROM order_parts WHERE order_id = $1', [o.id]);
      result.push({ ...o, parts: p.rows });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.post('/api/orders', async (req, res) => {
  const { client_id, title, work_cost, parts } = req.body;
  const partsList = parts || [];
  const workCost = Number(work_cost) || 0;
  const partsCost = partsList.reduce((s, p) => s + Number(p.price) * (p.quantity || 1), 0);

  if (!title || (workCost === 0 && partsList.length === 0)) {
    return res.status(400).json({ error: 'Добавьте услуги или запчасти' });
  }

  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const order = await db.query(
      `INSERT INTO orders (client_id, title, work_cost, parts_cost, total_cost)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [client_id, title, workCost, partsCost, workCost + partsCost]
    );
    const orderId = order.rows[0].id;

    for (const p of partsList) {
      let partId = p.part_id || null;
      let name = p.name;
      let article = p.article;
      let price = p.price;

      if (partId) {
        const found = await db.query('SELECT * FROM parts WHERE id = $1', [partId]);
        name = found.rows[0].name;
        article = found.rows[0].article;
        price = found.rows[0].price;
      } else {
        const ins = await db.query(
          'INSERT INTO parts (name, article, price) VALUES ($1, $2, $3) RETURNING id',
          [name, article, price]
        );
        partId = ins.rows[0].id;
      }

      await db.query(
        `INSERT INTO order_parts (order_id, part_id, name, article, price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, partId, name, article, price, p.quantity || 1]
      );
    }

    await db.query('COMMIT');
    res.status(201).json(order.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: dbError(err) });
  } finally {
    db.release();
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const r = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [req.body.status, req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Заказ не найден' });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT id, name, phone, car_brand, car_model, car_year, plate_number, vin FROM clients WHERE id = $1',
      [req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Не найден' });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT id, name, phone, car_brand, car_model, car_year, plate_number, vin FROM clients ORDER BY name'
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.post('/api/clients', async (req, res) => {
  const { name, phone, car_brand, car_model, car_year, plate_number, vin } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO clients (name, phone, car_brand, car_model, car_year, plate_number, vin)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, phone, car_brand, car_model, car_year, plate_number, vin]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  const { car_brand, car_model, car_year, plate_number, vin } = req.body;
  try {
    const r = await pool.query(
      `UPDATE clients SET car_brand=$1, car_model=$2, car_year=$3, plate_number=$4, vin=$5
       WHERE id=$6 RETURNING *`,
      [car_brand, car_model, car_year, plate_number, vin, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, phone, password, car_brand, car_model, car_year, plate_number, vin } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM clients WHERE phone = $1', [phone]);
    if (exists.rows.length) return res.status(400).json({ error: 'Телефон уже занят' });
    const r = await pool.query(
      `INSERT INTO clients (name, phone, password, car_brand, car_model, car_year, plate_number, vin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, name, phone`,
      [name, phone, password, car_brand, car_model, car_year, plate_number, vin]
    );
    res.status(201).json({ ...r.rows[0], role: 'client' });
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const staff = await pool.query(
      'SELECT id, login, role FROM users WHERE login = $1 AND password = $2',
      [login, password]
    );
    if (staff.rows.length) return res.json(staff.rows[0]);

    const client = await pool.query(
      'SELECT id, name, phone FROM clients WHERE phone = $1 AND password = $2',
      [login, password]
    );
    if (client.rows.length) return res.json({ ...client.rows[0], role: 'client' });

    res.status(401).json({ error: 'Неверный логин или пароль' });
  } catch (err) {
    res.status(500).json({ error: dbError(err) });
  }
});

pool.query('SELECT 1')
  .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
  .catch((err) => {
    console.error(dbError(err));
    process.exit(1);
  });
