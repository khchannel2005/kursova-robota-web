const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'default_secret';

// Налаштування бази даних
const dbPath = process.env.DATABASE_URL || './backend/food_delivery.db';
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(bodyParser.json());

// Реєстрація
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function (err) {
    if (err) return res.status(400).json({ message: 'Користувач вже існує' });
    res.json({ message: 'Реєстрація успішна' });
  });
});

// Логін
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Користувача не знайдено' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Неправильний пароль' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
    res.json({ token });
  });
});

// Middleware для перевірки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401); // Не авторизований, якщо немає токена

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Не авторизований, якщо токен не дійсний
    req.user = user;
    next();
  });
}

// Створити замовлення
app.post('/orders', authenticateToken, (req, res) => {
  const { name, address, food } = req.body;
  const user_id = req.user.id;

  const time = new Date().toISOString();
  const status = 'нове';

  db.run(
    `INSERT INTO orders (user_id, name, address, food, status, time) VALUES (?, ?, ?, ?, ?, ?)`,

    [user_id, name, address, food, status, time],
    function (err) {
      if (err) return res.status(500).json({ message: 'Помилка при створенні замовлення' });
      res.json({ message: 'Замовлення створено', orderId: this.lastID });
    }
  );
});

// Переглянути замовлення користувача
app.get('/orders', authenticateToken, (req, res) => {
  const user_id = req.user.id;

  db.all(`SELECT * FROM orders WHERE user_id = ?`, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Помилка при завантаженні замовлень' });
    res.json(rows);
  });
});

// Змінити статус замовлення
app.put('/orders/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  const user_id = req.user.id;

  // Перевірка, чи є користувач адміністратором
  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
    if (err || !order) return res.status(404).json({ message: 'Замовлення не знайдено' });

    if (order.user_id !== user_id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Ви не маєте прав на зміну цього замовлення' });
    }

    db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, id], function (err) {
      if (err) return res.status(500).json({ message: 'Помилка при оновленні статусу' });
      res.json({ message: 'Статус оновлено' });
    });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
