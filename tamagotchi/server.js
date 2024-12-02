import express from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

const app = express();
app.use(express.json());
app.use(cors());
const port = 5001;
const password = '12345678'; // 비밀번호 바꿔서 테스트

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: password,
  database: 'tama',
  socketPath: '/tmp/mysql.sock'
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


app.post('/api/user', (req, res) => {
    const { username, password, profile_image, balance } = req.body;
    if (!username || !password || !profile_image || balance===null) {
        console.error('Missing required fields:', { username, password, profile_image, balance });
        return res.status(400).json({ message: 'Missing required fields' });
    }
    else{
        console.log("not missing");
    }    

    // Check if email already exists
    const checkQuery = 'SELECT * FROM user WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Insert new user
        const insertQuery = 'INSERT INTO user (username, password, profile_image, balance) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [username, password, profile_image, balance], (err, results) => {
            
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Failed to create user...' });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.get('/api/user', (req, res) => {
    const selectQuery = "SELECT * FROM user";
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error("Error in getting register:", err);
            res.status(500).send('Error in getting register...');
            return;
        }
        res.json(results); 
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

// Get user inventory data
app.get('/api/user/:id/inventory', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT item.id, item.type, item.image_source, item.stat, item.buy_price, item.sell_price, user_inventory.quantity
    FROM user_inventory
    JOIN item ON user_inventory.item_id = item.id
    WHERE user_inventory.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching inventory data:', err);
      res.status(500).send('Error fetching inventory data');
      return;
    }

    res.json(results);
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