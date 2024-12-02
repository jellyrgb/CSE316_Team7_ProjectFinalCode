import express from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';

const app = express();
const port = 5000;
const password = 'leesin'; // 비밀번호 바꿔서 테스트

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: password,
  database: 'tama',
    socketPath: '/tmp/mysql.sock' // 얘 indent 왜이래?
});

app.use(cors());
app.use(express.json());

// Connect to db
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});

// Get user data
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM user WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send('Error fetching user data');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    res.json(results[0]);
  });
});

// Update user balance
app.put('/api/user/:id/balance', (req, res) => {
  const userId = req.params.id;
  const { balance } = req.body;
  const query = 'UPDATE user SET balance = ? WHERE id = ?';

  db.query(query, [balance, userId], (err, results) => {
    if (err) {
      console.error('Error updating user balance:', err);
      res.status(500).send('Error updating user balance');
      return;
    }

    res.sendStatus(200);
  });
});

// Add item to user inventory
app.post('/api/user/:id/inventory', (req, res) => {
  const userId = req.params.id;
  const { itemId, quantity } = req.body;
  const query = 'INSERT INTO user_inventory (user_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?';

  db.query(query, [userId, itemId, quantity, quantity], (err, results) => {
    if (err) {
      console.error('Error adding item to inventory:', err);
      res.status(500).send('Error adding item to inventory');
      return;
    }

    res.sendStatus(200);
  });
});

// Get pet data
app.get('/api/user/:id/tamagotchis', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM tamagotchi WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching pets data:', err);
      res.status(500).send('Error fetching pets data');
      return;
    }

    res.json(results);
  });
});

// Get item data
app.get('/api/items', (req, res) => {
  // TODO: 유저별로 인벤토리 다르게 하는 건 login 이후에 구현
  const query = 'SELECT * FROM item';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching items data:', err);
      res.status(500).send('Error fetching items data');
      return;
    }

    res.json(results);
  });
});

// Initalize server
app.listen(port, () => {
  console.log(`Server is running on ${port}...`);
});