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

  // Шукаємо користувача в базі даних за email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).send('Server error');
    
    if (result.length === 0) {
      return res.status(400).send('Невірний email або пароль');
    }
    
    const user = result[0];
    
    // Перевіряємо пароль
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Server error');
      if (!isMatch) {
        return res.status(400).send('Невірний email або пароль');
      }

      // Якщо пароль вірний, генеруємо токен (наприклад, JWT)
      const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key');
      res.json({ token, userId: user.id });
    });
  });
});
// Маршрут для отримання профілю користувача
app.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT * FROM users WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Помилка виконання запиту:', err);
      return res.status(500).send('Помилка сервера');
    }

    if (results.length === 0) {
      return res.status(404).send('Користувача не знайдено');
    }

    res.json(results[0]); // Відправляємо знайденого користувача
  });
});

// Маршрут для отримання деталей товару
app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Помилка виконання запиту:', err);
      res.status(500).send('Помилка сервера');
    } else {
      res.json(result[0]);
    }
  });
});

app.get('/recommendations/:userId', (req, res) => {
  const { userId } = req.params;

  // Отримати останні взаємодії користувача
  const interactionQuery = `
    SELECT p.* 
    FROM user_behavior ub
    JOIN products p ON ub.product_id = p.id
    WHERE ub.user_id = ?
    ORDER BY ub.interaction_time DESC
    LIMIT 5
  `;

  db.query(interactionQuery, [userId], (err, recentProducts) => {
    if (err || recentProducts.length === 0) {
      console.log('Помилка або немає взаємодій. Використовується fallback.');
      return fallbackRecommendations(res);
    }

    // Генерація рекомендацій на основі підкатегорій
    const subcategoryIds = recentProducts
      .map((p) => p.subcategory_id)
      .filter((id) => id !== null); // Виключення порожніх значень

    if (subcategoryIds.length === 0) {
      console.log('Підкатегорії продуктів порожні. Використовується fallback.');
      return fallbackRecommendations(res);
    }

    const recommendationQuery = `
      SELECT * FROM products
      WHERE subcategory_id IN (?)
      AND id NOT IN (?)
      LIMIT 5
    `;

    const excludedProductIds = recentProducts.map((p) => p.id);

    db.query(
      recommendationQuery,
      [subcategoryIds, excludedProductIds],
      (err, recommendations) => {
        if (err || recommendations.length === 0) {
          console.log('Рекомендацій немає. Використовується fallback.');
          return fallbackRecommendations(res);
        }
        res.json(recommendations);
      }
    );
  });

  function fallbackRecommendations(res) {
    const fallbackQuery = 'SELECT * FROM products ORDER BY RAND() LIMIT 5';
    db.query(fallbackQuery, (err, products) => {
      if (err) {
        console.error('Помилка fallback-запиту:', err);
        return res.status(500).send('Помилка сервера');
      }
      res.json(products);
    });
  }
});



app.post('/user-interaction', (req, res) => {
  const { userId, productId, interactionType } = req.body;

  const query = `
    INSERT INTO user_behavior (user_id, product_id, interaction_type)
    VALUES (?, ?, ?)
  `;
  db.query(query, [userId, productId, interactionType], (err) => {
    if (err) {
      console.error('Помилка додавання взаємодії:', err);
      return res.status(500).json({ message: 'Помилка сервера' });
    }
    // Відправити правильну відповідь
    res.status(200).json({ message: 'Взаємодію збережено' });
  });
});


// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});