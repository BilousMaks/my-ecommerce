const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key'; // Замініть на власний секретний ключ

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

// Обробник POST для реєстрації
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ message: 'Всі поля обов’язкові!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Помилка перевірки email:', err);
      return res.status(500).send({ message: 'Помилка сервера' });
    }

    if (results.length > 0) {
      return res.status(400).send({ message: 'Ця електронна пошта вже зареєстрована!' });
    }

    const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Помилка вставки:', err);
        return res.status(500).send({ message: 'Помилка сервера' });
      }
      res.send({ message: 'Реєстрація успішна' });
    });
  });
});

// Обробник POST для входу
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Всі поля обов’язкові!' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Помилка виконання запиту:', err);
      return res.status(500).send({ message: 'Помилка сервера' });
    }

    if (results.length === 0) {
      return res.status(401).send({ message: 'Неправильний email або пароль' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Помилка перевірки пароля:', err);
        return res.status(500).send({ message: 'Помилка сервера' });
      }

      if (!isMatch) {
        return res.status(401).send({ message: 'Неправильний email або пароль' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      res.send({ message: 'Вхід успішний', token });
    });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
