const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до бази даних
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce',
});

db.connect((err) => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err);
  } else {
    console.log('Підключено до бази даних MySQL');
  }
});

// Маршрут для отримання категорій
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Помилка виконання запиту:', err);
      res.status(500).send('Помилка сервера');
    } else {
      res.json(results);
    }
  });
});

// Маршрут для отримання підкатегорій 
app.get('/subcategories/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const query = 'SELECT * FROM subcategories WHERE category_id = ?';
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Помилка виконання запиту:', err);
      res.status(500).send('Помилка сервера');
    } else {
      res.json(results);
    }
  });
});


// Маршрут для отримання товарів
app.get('/products/:subcategoryId', (req, res) => {
  const { subcategoryId } = req.params;
  const query = 'SELECT * FROM products WHERE subcategory_id = ?';
  db.query(query, [subcategoryId], (err, results) => {
    if (err) {
      console.error('Помилка виконання запиту:', err);
      res.status(500).send('Помилка сервера');
    } else {
      res.json(results);
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});