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

db.query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const upper = sql.trim().toUpperCase();
    if (upper.startsWith('SELECT') || upper.startsWith('PRAGMA')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    }
  });
};

db.serialize(() => {
  // Check if users table needs migration (e.g. lacks is_active column)
  db.all("PRAGMA table_info(users)", (err, columns) => {
    const hasIsActive = columns && columns.some(c => c.name === 'is_active');
    if (columns && columns.length > 0 && !hasIsActive) {
      console.log("Migrating users table by dropping old simple schema...");
      db.run("DROP TABLE users", () => {
        initializeSchema();
      });
    } else {
      initializeSchema();
    }
  });
});

function initializeSchema() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT,
        bio TEXT,
        avatar_url TEXT,
        header_image_url TEXT,
        email_verified INTEGER DEFAULT 0,
        email_verified_at TEXT,
        is_active INTEGER DEFAULT 1,
        is_banned INTEGER DEFAULT 0,
        ban_reason TEXT,
        ban_date TEXT,
        role TEXT DEFAULT 'member',
        permissions TEXT DEFAULT '{}',
        post_karma INTEGER DEFAULT 0,
        comment_karma INTEGER DEFAULT 0,
        total_karma INTEGER DEFAULT 0,
        posts_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        followers_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        last_login TEXT,
        last_login_ip TEXT,
        two_factor_enabled INTEGER DEFAULT 0,
        two_factor_secret TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT
      )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_username ON users(username)");
    db.run("CREATE INDEX IF NOT EXISTS idx_email ON users(email)");
    db.run("CREATE INDEX IF NOT EXISTS idx_role ON users(role)");
    db.run("CREATE INDEX IF NOT EXISTS idx_created ON users(created_at DESC)");

    // 2. Sessions Table
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        token_type TEXT DEFAULT 'bearer',
        ip_address TEXT,
        user_agent TEXT,
        device_type TEXT,
        refresh_token TEXT,
        refresh_token_expires_at TEXT,
        is_active INTEGER DEFAULT 1,
        last_activity TEXT,
        expires_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_session_user ON sessions(user_id)");
    db.run("CREATE INDEX IF NOT EXISTS idx_session_token ON sessions(token)");
    db.run("CREATE INDEX IF NOT EXISTS idx_session_expires ON sessions(expires_at DESC)");

    // 3. Email Verification Table
    db.run(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        is_verified INTEGER DEFAULT 0,
        sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT,
        verified_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_email_ver_user ON email_verifications(user_id)");
    db.run("CREATE INDEX IF NOT EXISTS idx_email_ver_token ON email_verifications(token)");

    // 4. Password Reset Table
    db.run(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        is_used INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT,
        used_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_pwd_reset_user ON password_resets(user_id)");
    db.run("CREATE INDEX IF NOT EXISTS idx_pwd_reset_token ON password_resets(token)");

    // 5. Roles Table
    db.run(`
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        permissions TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name)");

    // Pre-populate roles
    db.run(`
      INSERT OR IGNORE INTO roles (id, name, description, permissions) VALUES
      ('role-member', 'member', 'Regular community member', '["read:posts", "read:comments", "create:posts", "create:comments", "vote:posts", "vote:comments", "update:own_posts", "delete:own_posts", "update:profile"]'),
      ('role-mod', 'moderator', 'Community moderator', '["read:posts", "read:comments", "create:posts", "create:comments", "vote:posts", "vote:comments", "update:own_posts", "delete:own_posts", "update:profile", "moderate:posts", "moderate:comments", "ban:users", "manage:community"]'),
      ('role-admin', 'admin', 'Platform administrator', '["*"]')
    `);

    // 6. User Bans Table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_bans (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        banned_by_user_id TEXT,
        reason TEXT,
        ban_type TEXT,
        banned_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT,
        appeal_token TEXT,
        appeal_status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (banned_by_user_id) REFERENCES users(id)
      )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_bans_user ON user_bans(user_id)");
    db.run("CREATE INDEX IF NOT EXISTS idx_bans_expires ON user_bans(expires_at)");

    // 7. User Follows Table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_follows (
        id TEXT PRIMARY KEY,
        follower_id TEXT NOT NULL,
        following_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (follower_id) REFERENCES users(id),
        FOREIGN KEY (following_id) REFERENCES users(id),
        UNIQUE (follower_id, following_id)
      )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_follows_follower ON user_follows(follower_id)");
    db.run("CREATE INDEX IF NOT EXISTS idx_follows_following ON user_follows(following_id)");

    // 8. Posts table
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

    // 9. Votes table
    db.run(`
      CREATE TABLE IF NOT EXISTS votes (
        username TEXT,
        post_id TEXT,
        vote_type TEXT,
        PRIMARY KEY (username, post_id)
      )
    `);

    // 10. Ad impressions table
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

    // 11. Affiliate link clicks
    db.run(`
      CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        purchased INTEGER DEFAULT 0,
        commission REAL DEFAULT 0.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 12. Global stats table
    db.run(`
      CREATE TABLE IF NOT EXISTS global_stats (
        key TEXT PRIMARY KEY,
        value INTEGER DEFAULT 0
      )
    `, () => {
      db.run("INSERT OR IGNORE INTO global_stats (key, value) VALUES ('devices_tested', 0)");
      db.run("UPDATE global_stats SET value = 0 WHERE key = 'devices_tested'");
      db.run("DELETE FROM device_test_ips");
    });

    // 13. Device Test IPs table
    db.run(`
      CREATE TABLE IF NOT EXISTS device_test_ips (
        ip TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 14. Seed default posts if empty
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
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AuthManager = require('./auth');
const authManager = new AuthManager(db);
const { verifyToken, optionalAuth, requireRole, requireAdmin, requirePermission } = require('./middleware/auth')(db);

// Session resolver (stateless JWT decoding for backwards-compatibility with existing routes)
function getLoggedInUser(req) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.auth_token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-prod');
    return {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      permissions: decoded.permissions
    };
  } catch (error) {
    return null;
  }
}

// ================= AUTH API ENDPOINTS =================

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body;
    const result = await authManager.signup(email, username, password, displayName);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.get('user-agent');
    
    const result = await authManager.login(username, password, ipAddress, userAgent);
    
    // Set HTTP-only cookie
    res.cookie('auth_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', verifyToken, async (req, res) => {
  try {
    await authManager.logout(req.token);
    res.clearCookie('auth_token');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Auth Status check (backwards-compatibility)
app.get('/api/auth/status', (req, res) => {
  const user = getLoggedInUser(req);
  res.json({
    isLoggedIn: !!user,
    user: user ? { username: user.username, karma: 100 } : null
  });
});

// Get Current User (authenticated)
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, username, email, display_name, bio, avatar_url, role, total_karma, post_karma, comment_karma, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify Email
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    const result = await authManager.verifyEmail(token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resend Verification
app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const users = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    await authManager.sendVerificationEmail(users[0].id, email);
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authManager.forgotPassword(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await authManager.resetPassword(token, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Refresh Token
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authManager.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Change Password (authenticated)
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const users = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(oldPassword, users[0].password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid old password' });
    }
    
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase and number' });
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.query('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?', [passwordHash, req.user.userId]);
    
    // Invalidate sessions
    await db.query('UPDATE sessions SET is_active = 0 WHERE user_id = ? AND token != ?', [req.user.userId, req.token]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ================= USER PROFILE ENDPOINTS =================

// Get profile (either by ID or username)
app.get('/api/users/:identifier', optionalAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // 1. Try by ID
    let users = await db.query(
      `SELECT id, username, email, display_name, bio, avatar_url, header_image_url, role, 
              total_karma, post_karma, comment_karma, posts_count, comments_count, 
              followers_count, following_count, created_at 
       FROM users WHERE id = ?`,
      [identifier]
    );
    
    // 2. Try by Username
    if (users.length === 0) {
      users = await db.query(
        `SELECT id, username, email, display_name, bio, avatar_url, header_image_url, role, 
                total_karma, post_karma, comment_karma, posts_count, comments_count, 
                followers_count, following_count, created_at 
         FROM users WHERE username = ?`,
        [identifier]
      );
    }
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's posts
app.get('/api/users/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    
    const users = await db.query('SELECT username FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const posts = await db.query('SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC', [users[0].username]);
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's comments
app.get('/api/users/:id/comments', async (req, res) => {
  res.json([]);
});

// Update profile
app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const { displayName, bio, avatarUrl, headerImageUrl } = req.body;
    
    await db.query(
      `UPDATE users SET 
        display_name = COALESCE(?, display_name), 
        bio = COALESCE(?, bio), 
        avatar_url = COALESCE(?, avatar_url), 
        header_image_url = COALESCE(?, header_image_url),
        updated_at = datetime('now')
       WHERE id = ?`,
      [displayName, bio, avatarUrl, headerImageUrl, id]
    );
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Follow user
app.post('/api/users/:id/follow', verifyToken, async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.id;
    
    if (followerId === followingId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }
    
    const users = await db.query('SELECT id FROM users WHERE id = ?', [followingId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const followId = crypto.randomUUID();
    await db.query(
      'INSERT INTO user_follows (id, follower_id, following_id) VALUES (?, ?, ?)',
      [followId, followerId, followingId]
    );
    
    await db.query('UPDATE users SET following_count = following_count + 1 WHERE id = ?', [followerId]);
    await db.query('UPDATE users SET followers_count = followers_count + 1 WHERE id = ?', [followingId]);
    
    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Unfollow user
app.delete('/api/users/:id/follow', verifyToken, async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.id;
    
    const result = await db.query(
      'DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );
    
    if (result.changes > 0) {
      await db.query('UPDATE users SET following_count = max(0, following_count - 1) WHERE id = ?', [followerId]);
      await db.query('UPDATE users SET followers_count = max(0, followers_count - 1) WHERE id = ?', [followingId]);
      res.json({ success: true, message: 'Unfollowed successfully' });
    } else {
      res.status(400).json({ error: 'Not following this user' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get followers
app.get('/api/users/:id/followers', async (req, res) => {
  try {
    const { id } = req.params;
    const followers = await db.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url 
       FROM user_follows f 
       JOIN users u ON f.follower_id = u.id 
       WHERE f.following_id = ?`,
      [id]
    );
    res.json(followers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get following
app.get('/api/users/:id/following', async (req, res) => {
  try {
    const { id } = req.params;
    const following = await db.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url 
       FROM user_follows f 
       JOIN users u ON f.following_id = u.id 
       WHERE f.follower_id = ?`,
      [id]
    );
    res.json(following);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ================= ADMIN ENDPOINTS =================

// List users
app.get('/api/admin/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { role, status } = req.query;
    let sql = 'SELECT id, username, email, display_name, role, is_active, is_banned, created_at FROM users WHERE 1=1';
    const params = [];
    
    if (role && role !== 'all') {
      sql += ' AND role = ?';
      params.push(role);
    }
    
    if (status && status !== 'all') {
      if (status === 'active') {
        sql += ' AND is_active = 1 AND is_banned = 0';
      } else if (status === 'banned') {
        sql += ' AND is_banned = 1';
      } else if (status === 'inactive') {
        sql += ' AND is_active = 0';
      }
    }
    
    const users = await db.query(sql, params);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user details
app.get('/api/admin/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user details
app.put('/api/admin/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive, displayName, bio } = req.body;
    
    await db.query(
      `UPDATE users SET 
        role = COALESCE(?, role), 
        is_active = COALESCE(?, is_active), 
        display_name = COALESCE(?, display_name), 
        bio = COALESCE(?, bio),
        updated_at = datetime('now')
       WHERE id = ?`,
      [role, isActive, displayName, bio, id]
    );
    
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ban user
app.post('/api/admin/users/:id/ban', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, banType } = req.body;
    
    const banId = crypto.randomUUID();
    await db.query(
      `INSERT INTO user_bans (id, user_id, banned_by_user_id, reason, ban_type) 
       VALUES (?, ?, ?, ?, ?)`,
      [banId, id, req.user.userId, reason || 'Admin action', banType || 'permanent']
    );
    
    await db.query(
      'UPDATE users SET is_banned = 1, ban_reason = ?, ban_date = datetime("now") WHERE id = ?',
      [reason || 'Admin action', id]
    );
    
    await db.query('UPDATE sessions SET is_active = 0 WHERE user_id = ?', [id]);
    
    res.json({ success: true, message: 'User banned successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unban user
app.delete('/api/admin/users/:id/ban', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('UPDATE users SET is_banned = 0, ban_reason = NULL, ban_date = NULL WHERE id = ?', [id]);
    await db.query('DELETE FROM user_bans WHERE user_id = ?', [id]);
    
    res.json({ success: true, message: 'User unbanned successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List bans
app.get('/api/admin/bans', verifyToken, requireAdmin, async (req, res) => {
  try {
    const bans = await db.query(
      `SELECT b.*, u.username, admin.username as banned_by_username 
       FROM user_bans b
       JOIN users u ON b.user_id = u.id
       LEFT JOIN users admin ON b.banned_by_user_id = admin.id`
    );
    res.json(bans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List active sessions
app.get('/api/admin/sessions', verifyToken, requireAdmin, async (req, res) => {
  try {
    const sessions = await db.query(
      `SELECT s.*, u.username 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.is_active = 1`
    );
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Invalidate session
app.delete('/api/admin/sessions/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE sessions SET is_active = 0 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Session invalidated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get admin dashboard stats
app.get('/api/admin/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const userCount = await db.query('SELECT COUNT(*) as count FROM users');
    const bannedCount = await db.query('SELECT COUNT(*) as count FROM users WHERE is_banned = 1');
    const sessionCount = await db.query('SELECT COUNT(*) as count FROM sessions WHERE is_active = 1');
    const verifiedCount = await db.query('SELECT COUNT(*) as count FROM users WHERE email_verified = 1');
    const avgKarma = await db.query('SELECT AVG(total_karma) as avg_karma FROM users');
    
    res.json({
      totalUsers: userCount[0].count,
      bannedUsers: bannedCount[0].count,
      activeSessions: sessionCount[0].count,
      verifiedUsers: verifiedCount[0].count,
      averageKarma: Math.round(avgKarma[0].avg_karma || 0)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

// Get Devices Tested stats
app.get('/api/stats/devices', (req, res) => {
  db.get("SELECT value FROM global_stats WHERE key = 'devices_tested'", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const count = row ? row.value : 0;
    res.json({ count });
  });
});

// Increment Devices Tested stats (IP-uniqueness enforced)
app.post('/api/stats/increment-devices', (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ip = rawIp === '::1' ? '127.0.0.1' : rawIp;

  db.run("INSERT INTO device_test_ips (ip) VALUES (?)", [ip], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        // IP already tested, return current count
        db.get("SELECT value FROM global_stats WHERE key = 'devices_tested'", (err3, row) => {
          if (err3) return res.status(500).json({ error: err3.message });
          const count = row ? row.value : 0;
          return res.json({ success: true, count, isNewIp: false });
        });
      } else {
        return res.status(500).json({ error: err.message });
      }
    } else {
      // New IP: increment counter
      db.run("UPDATE global_stats SET value = value + 1 WHERE key = 'devices_tested'", function(err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get("SELECT value FROM global_stats WHERE key = 'devices_tested'", (err3, row) => {
          if (err3) return res.status(500).json({ error: err3.message });
          const count = row ? row.value : 0;
          res.json({ success: true, count, isNewIp: true });
        });
      });
    }
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
