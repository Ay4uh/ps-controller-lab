const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 8099;

// Database Setup
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      karma INTEGER DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration: Add email column if it doesn't exist
  db.run("ALTER TABLE users ADD COLUMN email TEXT", (err) => {
    // Suppress error if column already exists
  });

  // Posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      community TEXT NOT NULL,
      author TEXT NOT NULL,
      time TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Votes table
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      username TEXT,
      post_id TEXT,
      vote_type TEXT,
      PRIMARY KEY (username, post_id)
    )
  `);

  // Ad impressions table
  db.run(`
    CREATE TABLE IF NOT EXISTS ad_impressions (
      id TEXT PRIMARY KEY,
      guest_session_id TEXT,
      ad_type TEXT,
      ad_network TEXT,
      clicks INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 1,
      revenue REAL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Affiliate link clicks
  db.run(`
    CREATE TABLE IF NOT EXISTS affiliate_clicks (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      purchased INTEGER DEFAULT 0,
      commission REAL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default posts if empty
  db.get("SELECT COUNT(*) as count FROM posts", (err, row) => {
    if (row && row.count === 0) {
      const defaultPosts = [
        {
          id: 'post_1',
          community: 'r/MacBooks',
          author: 'MacFixerPro',
          time: '2h ago',
          title: 'MacBook Air M1 Screen flickering after update',
          content: 'My screen started flickering green lines after the macOS Sonoma update. I already tried resetting NVRAM/SMC (which doesn\'t exist on Apple Silicon anyway). Should I open it up or is this software? For cleaning connectors, I usually use <a href="https://www.amazon.com/CRC-05103-Electronic-Cleaner-MicroFibers/dp/B000BXOGNI" target="_blank" class="affiliate-link" data-product-id="crc_cleaner">CRC Electronic Cleaner</a>.',
          votes: 42,
          comments: 8
        },
        {
          id: 'post_2',
          community: 'r/Gaming',
          author: 'DualSenseRepairer',
          time: '4h ago',
          title: 'PS5 Stick Drift DIY Potentiometer Replacement',
          content: 'If you have PS5 DualSense controller drift, don\'t buy a new controller yet! You can clean or replace the potentiometer discs. Use this <a href="https://www.amazon.com/DeoxIT-D5S-6-Contact-Cleaner-Rejuvenator/dp/B0002BBV4G" target="_blank" class="affiliate-link" data-product-id="deoxit_cleaner">CAIG DeoxIT D5 Spray</a> to clean it first. Here is my complete guide below...',
          votes: 18,
          comments: 3
        },
        {
          id: 'post_3',
          community: 'r/Thermal',
          author: 'Overclocker99',
          time: '1d ago',
          title: 'GPU repasting: Honeywell PTM7950 vs Arctic MX-6',
          content: 'Just repasted my RTX 3080. The hot spot temp dropped by 15°C! Highly recommend the <a href="https://www.amazon.com/Arctic-MX-6-Carbon-Based-Performance-Durability/dp/B09VDNKY14" target="_blank" class="affiliate-link" data-product-id="mx6_paste">ARCTIC MX-6 Thermal Paste</a>. Let\'s discuss thermal conductivity benchmarks here.',
          votes: 89,
          comments: 24
        }
      ];
      defaultPosts.forEach(p => {
        db.run(
          'INSERT INTO posts (id, community, author, time, title, content, votes, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [p.id, p.community, p.author, p.time, p.title, p.content, p.votes, p.comments]
        );
      });
    }
  });
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Simple memory session store mapping token -> user metadata
const activeSessions = new Map();

// Helper to hash passwords using built-in PBKDF2
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === checkHash;
}

// Session resolver
function getLoggedInUser(req) {
  const token = req.cookies.auth_token;
  if (token && activeSessions.has(token)) {
    return activeSessions.get(token);
  }
  return null;
}

// ================= AUTH API ENDPOINTS =================

// Signup
app.post('/api/auth/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Enforce password rules: 6 characters, 1 uppercase, 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters and contain at least 1 capital letter and 1 special character' 
    });
  }

  // Validate email if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
  }

  // Check if username already exists
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, userByUsername) => {
    if (err) return res.status(500).json({ error: err.message });
    if (userByUsername) {
      return res.status(400).json({ error: 'Username is already taken. Please choose another one.' });
    }

    const checkEmailAndInsert = () => {
      if (email) {
        db.get('SELECT id FROM users WHERE email = ?', [email], (err, userByEmail) => {
          if (err) return res.status(500).json({ error: err.message });
          if (userByEmail) {
            return res.status(400).json({ error: 'Email is already taken. Please choose another one.' });
          }
          doInsert();
        });
      } else {
        doInsert();
      }
    };

    const doInsert = () => {
      const id = 'usr_' + crypto.randomBytes(8).toString('hex');
      const passHash = hashPassword(password);

      db.run(
        'INSERT INTO users (id, username, email, password_hash, karma) VALUES (?, ?, ?, ?, 100)',
        [id, username, email || null, passHash],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              if (err.message.toLowerCase().includes('email')) {
                return res.status(400).json({ error: 'Email is already taken. Please choose another one.' });
              }
              return res.status(400).json({ error: 'Username is already taken. Please choose another one.' });
            }
            return res.status(500).json({ error: err.message });
          }

          const token = 'token_' + crypto.randomBytes(16).toString('hex');
          const user = { id, username, karma: 100 };
          activeSessions.set(token, user);
          
          res.cookie('auth_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
          res.json({ success: true, user: { username, karma: 100 } });
        }
      );
    };

    checkEmailAndInsert();
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(400).json({ error: 'Invalid username/email or password' });
    }

    const token = 'token_' + crypto.randomBytes(16).toString('hex');
    activeSessions.set(token, { id: user.id, username: user.username, karma: user.karma });
    
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { username: user.username, karma: user.karma } });
  });
});

// Auth Status check
app.get('/api/auth/status', (req, res) => {
  const user = getLoggedInUser(req);
  res.json({
    isLoggedIn: !!user,
    user: user ? { username: user.username, karma: user.karma } : null
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies.auth_token;
  if (token) {
    activeSessions.delete(token);
  }
  res.clearCookie('auth_token');
  res.json({ success: true });
});

// ================= FORUM API ENDPOINTS =================

// Fetch Posts
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Fetch User's Active Vote Types
app.get('/api/users/votes', (req, res) => {
  const user = getLoggedInUser(req);
  if (!user) return res.json({});

  db.all('SELECT post_id, vote_type FROM votes WHERE username = ?', [user.username], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const votesMap = {};
    rows.forEach(r => {
      votesMap[r.post_id] = r.vote_type;
    });
    res.json(votesMap);
  });
});

// Create Post
app.post('/api/posts', (req, res) => {
  const user = getLoggedInUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in.' });

  const { community, title, content } = req.body;
  if (!community || !title || !content) {
    return res.status(400).json({ error: 'Community, title and content are required' });
  }

  const id = 'post_' + crypto.randomBytes(8).toString('hex');
  db.run(
    'INSERT INTO posts (id, community, author, time, title, content, votes, comments) VALUES (?, ?, ?, ?, ?, ?, 1, 0)',
    [id, community, user.username, 'Just now', title, content],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Auto upvote by creator
      db.run(
        'INSERT INTO votes (username, post_id, vote_type) VALUES (?, ?, ?)',
        [user.username, id, 'up'],
        (err2) => {
          res.json({ success: true });
        }
      );
    }
  );
});

// Vote Thread
app.post('/api/posts/:id/vote', (req, res) => {
  const user = getLoggedInUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in.' });

  const postId = req.params.id;
  const { type } = req.body; // 'up' or 'down'

  if (type !== 'up' && type !== 'down') {
    return res.status(400).json({ error: 'Invalid vote type' });
  }

  db.get('SELECT * FROM votes WHERE username = ? AND post_id = ?', [user.username, postId], (err, existingVote) => {
    if (err) return res.status(500).json({ error: err.message });

    let voteDiff = 0;
    let query = '';
    let params = [];

    if (existingVote) {
      if (existingVote.vote_type === type) {
        // Cancel vote
        voteDiff = type === 'up' ? -1 : 1;
        query = 'DELETE FROM votes WHERE username = ? AND post_id = ?';
        params = [user.username, postId];
      } else {
        // Change vote direction
        voteDiff = type === 'up' ? 2 : -2;
        query = 'UPDATE votes SET vote_type = ? WHERE username = ? AND post_id = ?';
        params = [type, user.username, postId];
      }
    } else {
      // New vote
      voteDiff = type === 'up' ? 1 : -1;
      query = 'INSERT INTO votes (username, post_id, vote_type) VALUES (?, ?, ?)';
      params = [user.username, postId, type];
    }

    db.serialize(() => {
      db.run(query, params, (errRun) => {
        if (errRun) return res.status(500).json({ error: errRun.message });
        
        db.run('UPDATE posts SET votes = votes + ? WHERE id = ?', [voteDiff, postId], (errUpdate) => {
          if (errUpdate) return res.status(500).json({ error: errUpdate.message });
          
          db.get('SELECT votes FROM posts WHERE id = ?', [postId], (errSelect, row) => {
            if (errSelect) return res.status(500).json({ error: errSelect.message });
            res.json({
              success: true,
              votes: row ? row.votes : 0,
              userVote: existingVote && existingVote.vote_type === type ? null : type
            });
          });
        });
      });
    });
  });
});

// ================= ADMETRICS API ENDPOINTS =================

// Impression log
app.post('/api/ads/impression', (req, res) => {
  const { adType, adNetwork, sessionId } = req.body;
  const id = 'imp_' + crypto.randomBytes(8).toString('hex');
  const cpm = 2.50;
  const mockRevenue = adNetwork === 'google_adsense' ? (cpm / 1000.0) : 0.0;

  db.run(
    'INSERT INTO ad_impressions (id, guest_session_id, ad_type, ad_network, impressions, revenue) VALUES (?, ?, ?, ?, 1, ?)',
    [id, sessionId, adType, adNetwork, mockRevenue],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Click log
app.post('/api/ads/click', (req, res) => {
  const { adType, adNetwork, sessionId } = req.body;
  const id = 'clk_' + crypto.randomBytes(8).toString('hex');
  const cpc = 0.15;

  db.run(
    'INSERT INTO ad_impressions (id, guest_session_id, ad_type, ad_network, clicks, impressions, revenue) VALUES (?, ?, ?, ?, 1, 1, ?)',
    [id, sessionId, adType, adNetwork, cpc],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Affiliate click log
app.post('/api/ads/affiliate-click', (req, res) => {
  const { productId } = req.body;
  const id = 'aff_clk_' + crypto.randomBytes(8).toString('hex');
  const isSale = Math.random() < 0.10; // 10% conversion chance
  const commission = isSale ? 4.50 : 0.00;

  db.run(
    'INSERT INTO affiliate_clicks (id, product_id, purchased, commission) VALUES (?, ?, ?, ?)',
    [id, productId, isSale ? 1 : 0, commission],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, purchased: isSale, commission });
    }
  );
});

// Get Dashboard stats
app.get('/api/ads/stats', (req, res) => {
  db.get(`
    SELECT 
      SUM(impressions) as total_impressions,
      SUM(clicks) as total_clicks,
      SUM(revenue) as total_revenue
    FROM ad_impressions
  `, (err, adStats) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(`
      SELECT 
        COUNT(*) as total_aff_clicks,
        SUM(purchased) as total_aff_sales,
        SUM(commission) as total_aff_commission
      FROM affiliate_clicks
    `, (err2, affStats) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        totalImpressions: adStats ? (adStats.total_impressions || 0) : 0,
        totalClicks: adStats ? (adStats.total_clicks || 0) : 0,
        totalRevenue: adStats ? (adStats.total_revenue || 0) : 0.00,
        totalAffClicks: affStats ? (affStats.total_aff_clicks || 0) : 0,
        totalAffSales: affStats ? (affStats.total_aff_sales || 0) : 0,
        totalAffCommission: affStats ? (affStats.total_aff_commission || 0.00) : 0.00
      });
    });
  });
});

// Reset Dashboard stats
app.post('/api/ads/reset-stats', (req, res) => {
  db.serialize(() => {
    db.run('DELETE FROM ad_impressions');
    db.run('DELETE FROM affiliate_clicks');
    res.json({ success: true });
  });
});

// Browser console error logging endpoint (backwards-compatibility)
app.post('/log', (req, res) => {
  const logData = req.body;
  console.log("\n--- BROWSER CONSOLE ERROR LOGGED ---");
  console.log("Message:", logData.message);
  console.log("Source:", logData.source);
  console.log("Line:", logData.lineno, "Col:", logData.colno);
  if (logData.error) {
    console.log("Stack Trace:\n", logData.error);
  }
  console.log("------------------------------------\n");
  res.send('ok');
});

// Serve Static Files
app.use(express.static(__dirname));

// Serve index.html for undefined routes (fallback routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Launch server
app.listen(PORT, () => {
  console.log(`Diagnostics & Forum Server running at http://localhost:${PORT}`);
});
