const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('food_delivery.db');

db.serialize(() => {
  // Таблиця користувачів
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Таблиця замовлень
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    address TEXT,
    food TEXT,
    status TEXT,
    time TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Таблиця ресторанів (опційно)
  db.run(`CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT
  )`);

  // Таблиця страв (опційно)
  db.run(`CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    restaurant_id INTEGER,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
  )`);

  // Таблиця товарів у замовленні (опційно)
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    meal_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (meal_id) REFERENCES meals(id)
  )`);

  console.log("✅ Базу food_delivery.db ініціалізовано");
});

module.exports = db;