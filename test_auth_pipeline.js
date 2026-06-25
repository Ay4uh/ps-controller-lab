const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const BASE_URL = 'http://localhost:8099';

async function runTests() {
  console.log('=== STARTING AUTHENTICATION PIPELINE INTEGRATION TESTS ===\n');

  const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));
  const dbQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  };

  // Helper to run raw database modification
  const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  try {
    // Clean up test users first
    await dbRun("DELETE FROM users WHERE username IN ('fixer_bob', 'fixer_alice')");
    await dbRun("DELETE FROM email_verifications");
    await dbRun("DELETE FROM user_bans");
    await dbRun("DELETE FROM user_follows");
    await dbRun("DELETE FROM sessions");

    console.log('1. Testing password strength validation on signup...');
    const signupFailResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bob@example.com',
        username: 'fixer_bob',
        password: 'weak'
      })
    });
    const signupFailData = await signupFailResponse.json();
    if (signupFailResponse.status === 400 && signupFailData.error.includes('Password must be')) {
      console.log('   ✅ Password strength validation correctly rejected weak password.');
    } else {
      throw new Error(`Password strength validation failed: Status ${signupFailResponse.status}, Error: ${JSON.stringify(signupFailData)}`);
    }

    console.log('2. Testing successful user signup...');
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bob@example.com',
        username: 'fixer_bob',
        password: 'Password123',
        displayName: 'Bob the Fixer'
      })
    });
    const signupData = await signupResponse.json();
    if (signupResponse.status === 200 && signupData.success) {
      console.log('   ✅ Signup succeeded. Message:', signupData.message);
    } else {
      throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
    }

    console.log('3. Testing login failure before email verification...');
    const loginFailResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'fixer_bob',
        password: 'Password123'
      })
    });
    const loginFailData = await loginFailResponse.json();
    if (loginFailResponse.status === 401 && loginFailData.error.includes('verify your email')) {
      console.log('   ✅ Login correctly blocked for unverified email.');
    } else {
      throw new Error(`Blocked login test failed: Status ${loginFailResponse.status}, Error: ${JSON.stringify(loginFailData)}`);
    }

    console.log('4. Extracting verification token and verifying email...');
    const verifications = await dbQuery("SELECT token FROM email_verifications");
    if (verifications.length === 0) {
      throw new Error('No email verification token created in database!');
    }
    const token = verifications[0].token;
    
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const verifyData = await verifyResponse.json();
    if (verifyResponse.status === 200 && verifyData.message.includes('verified successfully')) {
      console.log('   ✅ Email verified successfully.');
    } else {
      throw new Error(`Email verification failed: ${JSON.stringify(verifyData)}`);
    }

    console.log('5. Testing login with verified credentials...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'fixer_bob',
        password: 'Password123'
      })
    });
    const loginData = await loginResponse.json();
    if (loginResponse.status === 200 && loginData.accessToken) {
      console.log('   ✅ Login succeeded. Received JWT.');
    } else {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    
    const bobToken = loginData.accessToken;
    const bobId = loginData.user.id;

    console.log('6. Testing authenticated /api/auth/me profile retrieval...');
    const meResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    const meData = await meResponse.json();
    if (meResponse.status === 200 && meData.username === 'fixer_bob') {
      console.log(`   ✅ Retained session profile. User role: ${meData.role}`);
    } else {
      throw new Error(`Profile retrieval failed: ${JSON.stringify(meData)}`);
    }

    console.log('7. Setting up second user (Alice) for interaction checks...');
    // Create Alice
    await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        username: 'fixer_alice',
        password: 'Password123'
      })
    });
    // Verify Alice directly in DB to save time
    const aliceUsers = await dbQuery("SELECT id FROM users WHERE username = 'fixer_alice'");
    const aliceId = aliceUsers[0].id;
    await dbRun("UPDATE users SET email_verified = 1 WHERE id = ?", [aliceId]);
    console.log('   ✅ User Alice created and verified.');

    console.log('8. Testing follow / unfollow pipeline...');
    const followResponse = await fetch(`${BASE_URL}/api/users/${aliceId}/follow`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    const followData = await followResponse.json();
    if (followResponse.status === 200 && followData.success) {
      const followers = await dbQuery("SELECT followers_count, following_count FROM users WHERE id = ?", [aliceId]);
      const bobCounts = await dbQuery("SELECT followers_count, following_count FROM users WHERE id = ?", [bobId]);
      console.log(`   ✅ Bob followed Alice. Alice followers: ${followers[0].followers_count}, Bob following: ${bobCounts[0].following_count}`);
    } else {
      throw new Error(`Follow failed: ${JSON.stringify(followData)}`);
    }

    console.log('9. Testing permissions checks and administration controls...');
    // Try admin stats as Bob (regular member role) - should fail with 403
    const statsFailResponse = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    if (statsFailResponse.status === 403) {
      console.log('   ✅ Access rejected to admin endpoint for regular member.');
    } else {
      throw new Error(`Admin stats rejection failed. Expected 403, got ${statsFailResponse.status}`);
    }

    // Elevate Bob to admin directly in the database
    await dbRun("UPDATE users SET role = 'admin' WHERE id = ?", [bobId]);
    
    // Log Bob in again to issue a new JWT containing the admin role
    const adminLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'fixer_bob',
        password: 'Password123'
      })
    });
    const adminLoginData = await adminLoginResponse.json();
    const bobAdminToken = adminLoginData.accessToken;

    // Check stats again - should succeed
    const statsResponse = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${bobAdminToken}` }
    });
    const statsData = await statsResponse.json();
    if (statsResponse.status === 200 && statsData.totalUsers !== undefined) {
      console.log(`   ✅ Admin stats retrieved successfully. Total Platform Users: ${statsData.totalUsers}`);
    } else {
      throw new Error(`Admin stats retrieval failed: ${JSON.stringify(statsData)}`);
    }

    console.log('10. Testing user ban/appeal constraints...');
    const banResponse = await fetch(`${BASE_URL}/api/admin/users/${aliceId}/ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bobAdminToken}`
      },
      body: JSON.stringify({ reason: 'Inappropriate controller modification advice' })
    });
    const banData = await banResponse.json();
    if (banResponse.status === 200 && banData.success) {
      // Try to login as banned Alice - should fail
      const aliceLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'fixer_alice',
          password: 'Password123'
        })
      });
      const aliceLoginData = await aliceLoginResponse.json();
      if (aliceLoginResponse.status === 401 && aliceLoginData.error.includes('Account banned')) {
        console.log(`   ✅ Login rejected for banned user. Reason: "${aliceLoginData.error}"`);
      } else {
        throw new Error(`Banned login test failed: Status ${aliceLoginResponse.status}, Error: ${JSON.stringify(aliceLoginData)}`);
      }
    } else {
      throw new Error(`Ban failed: ${JSON.stringify(banData)}`);
    }

    console.log('\n==========================================================');
    console.log('🎉 ALL AUTHENTICATION PIPELINE INTEGRATION TESTS PASSED!');
    console.log('==========================================================');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILURE:');
    console.error(err);
    process.exit(1);
  } finally {
    db.close();
  }
}

runTests();
