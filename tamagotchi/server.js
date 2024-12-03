import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { hashutil } from './src/hashutil/Hashutil.js';

const port = 5001;
const password = '12345678'; // 비밀번호 바꿔서 테스트

dotenv.config(); 

const app = express();
app.use(express.json());
app.use(cors());

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: password,
  database: 'tama',
  socketPath: '/tmp/mysql.sock'
});

// User sign up
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [existingUser] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = hashutil(username, password);

    const query = 'INSERT INTO user (username, password) VALUES (?, ?)';
    const values = [username, hashedPassword];
    const [result] = await db.query(query, values);

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error signing up:', err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// User sign in
app.post('/api/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    const user = users[0];
    const hashedPassword = hashutil(username, password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    res.json({
      id: user.id,
      username: user.username,
      profile_image: user.profile_image,
      creation_date: user.creation_date,
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Get user data
app.get('/api/user/:id', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, profile_image, balance, creation_date FROM user WHERE id = ?', [req.params.id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user balance
app.put('/api/user/:id/balance', async (req, res) => {
  const userId = req.params.id;
  const { balance } = req.body;

  try {
    const query = 'UPDATE user SET balance = ? WHERE id = ?';
    await db.query(query, [balance, userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating balance:', err);
    res.status(500).json({ error: 'Failed to update balance' });
  }
});

// Get user inventory data
app.get('/api/user/:id/inventory', async (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT item.id, item.type, item.image_source, item.stat, item.buy_price, item.sell_price, user_inventory.quantity
    FROM user_inventory
    JOIN item ON user_inventory.item_id = item.id
    WHERE user_inventory.user_id = ?
  `;

  try {
    const [results] = await db.query(query, [userId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching inventory data:', err);
    res.status(500).send('Error fetching inventory data');
  }
});

// Add item to inventory
app.post('/api/user/:id/inventory', async (req, res) => {
  const userId = req.params.id;
  const { itemId, quantity } = req.body;

  try {
    const [existingItem] = await db.query('SELECT * FROM user_inventory WHERE user_id = ? AND item_id = ?', [userId, itemId]);
    
    if (existingItem.length > 0) {
      const query = 'UPDATE user_inventory SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?';
      await db.query(query, [quantity, userId, itemId]);
      return res.sendStatus(200);
    }

    const query = 'INSERT INTO user_inventory (user_id, item_id, quantity) VALUES (?, ?, ?)';
    await db.query(query, [userId, itemId, quantity]);
    res.sendStatus(201);
  } catch (err) {
    console.error('Error adding item to inventory:', err);
    res.status(500).json({ error: 'Failed to add item to inventory' });
  }
});

// Remove item from inventory
app.put('/api/user/:id/inventory/use', async (req, res) => {
  const userId = req.params.id;
  const { itemId } = req.body;

  try {
    const [existingItem] = await db.query('SELECT quantity FROM user_inventory WHERE user_id = ? AND item_id = ?', [userId, itemId]);
    
    if (existingItem.length === 0) {
      return res.status(404).json({ error: 'Item not found in inventory' });
    }

    const currentQuantity = existingItem[0].quantity;

    if (currentQuantity > 1) {
      const query = 'UPDATE user_inventory SET quantity = quantity - 1 WHERE user_id = ? AND item_id = ?';
      await db.query(query, [userId, itemId]);
    } else {
      const query = 'DELETE FROM user_inventory WHERE user_id = ? AND item_id = ?';
      await db.query(query, [userId, itemId]);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// Get pet data
app.get('/api/user/:id/tamagotchis', async (req, res) => {
  const userId = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM tamagotchi WHERE user_id = ?', [userId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching pets data:', err);
    res.status(500).send('Error fetching pets data');
  }
});

// Update pet status
app.put('/api/pet/:id/status', async (req, res) => {
  const petId = req.params.id;
  const { hunger, clean, fun, is_sick } = req.body;

  try {
    const query = 'UPDATE tamagotchi SET hunger = ?, clean = ?, fun = ?, is_sick = ? WHERE id = ?';
    await db.query(query, [hunger, clean, fun,is_sick, petId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating pet status:', err);
    res.status(500).json({ error: 'Failed to update pet status' });
  }
});

// Get item data
app.get('/api/items', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM item');
    res.json(items);
  } catch (err) {
    console.error('Error fetching items data:', err);
    res.status(500).send('Error fetching items data');
  }
});

// Get tamagochi templates data
app.get('/api/tamagotchi_templates', async (req, res) => {
  try{
    const [results] = await db.query('SELECT * FROM tamagotchi_templates');
    res.json(results);
  }
  catch{
      console.error('Error fetching tamagotchi_templates data:', err);
      res.status(500).send('Error fetching tamagotchi_templates data');
  }

});

// Post pet data
app.post('/api/user/:id/tamagotchis', async (req, res) => {
  const userId = req.params.id;
  const { name, image_source, hunger,clean,fun,is_sick,adoption_date,is_active,user_id } = req.body;

  try {
    const [results] = await db.query('INSERT INTO tamagotchi (name, image_source, hunger,clean,fun,is_sick,adoption_date,is_active,user_id) VALUES (?, ?, ?,?,?,?,?,?,?)', [name, image_source, hunger,clean,fun,is_sick,adoption_date,is_active,user_id]);
    res.sendStatus(200);
  } catch (err) {
      console.error('Error adding tama to inventory:', err);
      res.status(500).send('Error adding tama to inventory');
  }
});

// Change profile image
app.put('/api/user/:id/profile-image', async (req, res) => {
  const userId = req.params.id;
  const { profile_image } = req.body;

  try {
    const query = 'UPDATE user SET profile_image = ? WHERE id = ?';
    await db.query(query, [profile_image, userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating profile image:', err);
    res.status(500).json({ error: 'Failed to update profile image' });
  }
});

// Change password
app.put('/api/user/:id/change-password', async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    const hashedCurrentPassword = hashutil(user.username, currentPassword);
    if (user.password !== hashedCurrentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = hashutil(user.username, newPassword);

    const query = 'UPDATE user SET password = ? WHERE id = ?';
    await db.query(query, [hashedNewPassword, userId]);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get jobs data
app.get('/api/jobList', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM jobList');
    res.json(result);
  } catch (err) {
    console.error('Error fetching jobsList data:', err);
    res.status(500).send('Error fetching jobsList data');
  }
});

// Update tama's is_sick
app.put('/api/user/:id/is_sick', async (req, res) => {
  const userId = req.params.id;
  const { is_sick } = req.body;

  try {
    const query = 'UPDATE tamagotchi SET is_sick = ? WHERE user_id = ?';
    await db.query(query, [is_sick, userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating is_sick:', err);
    res.status(500).json({ error: 'Failed to update is_sick' });
  }
});

// Update tama's status
app.put('/api/user/:id/statusChange', async (req, res) => {
  const userId = req.params.id;
  const { hunger, clean, fun } = req.body;

  try {
    const query = 'UPDATE tamagotchi SET hunger = ?, clean = ?, fun = ? WHERE id = ?';
    await db.query(query, [hunger, clean, fun, userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Post working data
app.post('/api/user/:id/jobs', async (req, res) => {
  const userId = req.params.id;
  const { user_id, job_name, duration, reward} = req.body;
  try {
    const [results] = await db.query('INSERT INTO jobs (user_id, job_name, duration, reward) VALUES (?, ?, ?,?)', [userId, job_name, duration, reward]);
    res.sendStatus(200);
  } catch (err) {
      console.error('Error adding jobs:', err);
      res.status(500).send('Error adding jobs');
  }
});

// Get working data
app.get('/api/user/:id/jobs', async (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT id, job_name, TIMESTAMPDIFF(SECOND, start_time, CURRENT_TIMESTAMP) AS time_elapsed, duration, reward
    FROM jobs
    WHERE user_id = ?;
  `;

  try {
    const [results] = await db.query(query, [userId]);
    //console.log(results);
    res.json(results);
  } catch (err) {
    console.error('Error to find a diff data:', err);
    res.status(500).send('Error to find a diff data');
  }
});

// Delete working data
app.delete('/api/user/:id/jobs', async (req, res) => {
  const userId = req.params.id;

  try {
    const query= `DELETE FROM jobs WHERE user_id = ?`;
    const result = await db.query(query, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Job not found.');
    }

    res.send('Job completed and deleted.');
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).send('Database error');
  }
});

// Get active tamagotchi
app.get('/api/user/:id/active-tamagotchi', async (req, res) => {
  const userId = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM tamagotchi WHERE user_id = ? AND is_active = true', [userId]);
    if (results.length > 0) {
      return res.json({ hasActiveTamagotchi: true });
    } else {
      return res.json({ hasActiveTamagotchi: false });
    }
  } catch (err) {
    console.error('Error fetching active tamagotchi:', err);
    res.status(500).send('Error fetching active tamagotchi');
  }
});


// Initalize server
app.listen(port, () => {
  console.log(`Server is running on ${port}...`);
});