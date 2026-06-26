const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

class AuthManager {
  constructor(db) {
    this.db = db;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';
    this.jwtExpiry = '24h';
    this.refreshTokenExpiry = '7d';
    
    // Mailer configuration (SMTP config via environment variables)
    this.transporter = null;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }

  // Helper: query role permissions
  async getRolePermissions(roleName) {
    const roles = await this.db.query('SELECT permissions FROM roles WHERE name = ?', [roleName]);
    if (roles.length > 0) {
      try {
        return JSON.parse(roles[0].permissions);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // ===== SIGNUP =====
  async signup(email, username, password, displayName) {
    if (!email || !username || !password) {
      throw new Error('Email, username, and password are required');
    }

    // Check if user exists
    const existing = await this.db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      throw new Error('Email or username already exists');
    }

    // Validate password strength (min 6 chars, 1 uppercase, 1 number, 1 special character)
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      throw new Error('Password must be at least 6 characters with 1 uppercase letter, 1 number, and 1 special character');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = crypto.randomUUID();
    
    // Default permissions list for member
    const defaultPermissions = JSON.stringify(['read:posts', 'read:comments', 'create:posts', 'create:comments', 'vote:posts', 'vote:comments', 'update:own_posts', 'delete:own_posts', 'update:profile']);

    await this.db.query(
      `INSERT INTO users (id, email, username, password_hash, display_name, role, permissions, total_karma) 
       VALUES (?, ?, ?, ?, ?, 'member', ?, 100)`,
      [userId, email, username, passwordHash, displayName || username, defaultPermissions]
    );

    // Send verification email
    const verRes = await this.sendVerificationEmail(userId, email);

    return {
      userId,
      email,
      username,
      verifyUrl: verRes.verifyUrl,
      message: 'User created. Please check your email to verify your account.'
    };
  }

  // ===== LOGIN =====
  async login(emailOrUsername, password, ipAddress, userAgent) {
    // Find user
    const users = await this.db.query(
      `SELECT * FROM users WHERE email = ? OR username = ?`,
      [emailOrUsername, emailOrUsername]
    );

    if (users.length === 0) {
      throw new Error('Invalid email/username or password');
    }

    const user = users[0];

    // Check if user is banned
    if (user.is_banned === 1) {
      throw new Error(`Account banned. Reason: ${user.ban_reason}`);
    }

    // Check if user is active
    if (user.is_active === 0) {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email/username or password');
    }

    // Check if email is verified
    if (user.email_verified === 0) {
      throw new Error('Please verify your email before logging in');
    }

    // Get permissions
    const permissions = await this.getRolePermissions(user.role);

    // Create session
    const sessionId = crypto.randomUUID();
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: permissions
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, sessionId },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    // Save session
    await this.db.query(
      `INSERT INTO sessions (id, user_id, token, refresh_token, ip_address, user_agent, last_activity, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '+7 days'))`,
      [sessionId, user.id, accessToken, refreshToken, ipAddress, userAgent]
    );

    // Update last login
    await this.db.query(
      'UPDATE users SET last_login = datetime("now"), last_login_ip = ? WHERE id = ?',
      [ipAddress, user.id]
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        karma: user.total_karma,
        avatar: user.avatar_url
      }
    };
  }

  // ===== LOGOUT =====
  async logout(accessToken) {
    // Invalidate session
    await this.db.query(
      'UPDATE sessions SET is_active = 0 WHERE token = ?',
      [accessToken]
    );
    return { message: 'Logged out successfully' };
  }

  // ===== VERIFY EMAIL =====
  async sendVerificationEmail(userId, email) {
    const token = crypto.randomBytes(32).toString('hex');
    const verificationId = crypto.randomUUID();
    
    await this.db.query(
      `INSERT INTO email_verifications (id, user_id, token, expires_at) 
       VALUES (?, ?, ?, datetime('now', '+24 hours'))`,
      [verificationId, userId, token]
    );

    // Send email
    const verifyUrl = `https://ay5uh.com/verify-email?token=${token}`;
    const emailContent = `
      <h2>Verify Your AntiGravity Account</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `;

    await this.sendEmail(email, 'Verify Your Email', emailContent);
    return { message: 'Verification email sent', verifyUrl };
  }

  async verifyEmail(token) {
    const verification = await this.db.query(
      `SELECT * FROM email_verifications WHERE token = ? AND is_verified = 0`,
      [token]
    );

    if (verification.length === 0) {
      throw new Error('Invalid or expired verification token');
    }

    const ver = verification[0];

    // Check if expired
    const expiresAt = new Date(ver.expires_at.replace(' ', 'T') + 'Z');
    if (new Date() > expiresAt) {
      throw new Error('Verification token expired');
    }

    // Mark as verified
    await this.db.query(
      `UPDATE email_verifications SET is_verified = 1, verified_at = datetime('now') WHERE id = ?`,
      [ver.id]
    );

    // Update user
    await this.db.query(
      `UPDATE users SET email_verified = 1, email_verified_at = datetime('now') WHERE id = ?`,
      [ver.user_id]
    );

    return { message: 'Email verified successfully' };
  }

  // ===== PASSWORD RESET =====
  async forgotPassword(email) {
    const users = await this.db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      // Don't reveal if email exists
      return { message: 'If email exists, a reset link will be sent' };
    }

    const userId = users[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const resetId = crypto.randomUUID();
    
    await this.db.query(
      `INSERT INTO password_resets (id, user_id, token, expires_at) 
       VALUES (?, ?, ?, datetime('now', '+1 hour'))`,
      [resetId, userId, token]
    );

    // Send email
    const resetUrl = `https://ay5uh.com/reset-password?token=${token}`;
    const emailContent = `
      <h2>Reset Your AntiGravity Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `;

    await this.sendEmail(email, 'Reset Your Password', emailContent);
    return { message: 'If email exists, a reset link will be sent' };
  }

  async resetPassword(token, newPassword) {
    const reset = await this.db.query(
      `SELECT * FROM password_resets WHERE token = ? AND is_used = 0`,
      [token]
    );

    if (reset.length === 0) {
      throw new Error('Invalid or expired reset token');
    }

    const resetRecord = reset[0];

    // Check if expired
    const expiresAt = new Date(resetRecord.expires_at.replace(' ', 'T') + 'Z');
    if (new Date() > expiresAt) {
      throw new Error('Password reset token expired');
    }

    // Validate password
    if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      throw new Error('Password must be at least 6 characters with 1 uppercase letter, 1 number, and 1 special character');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user password
    await this.db.query(
      'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?',
      [passwordHash, resetRecord.user_id]
    );

    // Mark reset as used
    await this.db.query(
      `UPDATE password_resets SET is_used = 1, used_at = datetime('now') WHERE id = ?`,
      [resetRecord.id]
    );

    // Invalidate all sessions
    await this.db.query(
      'UPDATE sessions SET is_active = 0 WHERE user_id = ?',
      [resetRecord.user_id]
    );

    return { message: 'Password reset successfully. Please log in again.' };
  }

  // ===== REFRESH TOKEN =====
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      
      // Get session
      const sessions = await this.db.query(
        'SELECT * FROM sessions WHERE user_id = ? AND refresh_token = ? AND is_active = 1',
        [decoded.userId, refreshToken]
      );

      if (sessions.length === 0) {
        throw new Error('Invalid refresh token');
      }

      // Get user
      const users = await this.db.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
      if (users.length === 0) {
        throw new Error('User not found');
      }
      const user = users[0];

      if (user.is_banned === 1 || user.is_active === 0) {
        throw new Error('User account is banned or inactive');
      }

      const permissions = await this.getRolePermissions(user.role);

      // Create new access token
      const newAccessToken = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: permissions
        },
        this.jwtSecret,
        { expiresIn: this.jwtExpiry }
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // ===== VERIFY TOKEN =====
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // ===== HELPER: SEND EMAIL =====
  async sendEmail(to, subject, htmlContent) {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"AntiGravity Community" <${process.env.EMAIL_USER}>`,
          to,
          subject,
          html: htmlContent
        });
        console.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}`);
        return;
      } catch (err) {
        console.error('Failed to send SMTP email, falling back to console log:', err);
      }
    }
    console.log(`\n=================== [EMAIL LOG] ===================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:`);
    console.log(htmlContent);
    console.log(`===================================================\n`);
  }
}

module.exports = AuthManager;
