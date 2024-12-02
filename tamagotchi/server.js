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

// Initalize server
app.listen(port, () => {
  console.log(`Server is running on ${port}...`);
});