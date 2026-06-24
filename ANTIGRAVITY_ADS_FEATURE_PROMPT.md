# AntiGravity Ads Feature - Complete Build Prompt

**Copy & Paste This Entire Prompt to Build the Ads System**

---

## PROJECT CONTEXT

AntiGravity is a FREE, Reddit-like community platform for hardware discussions and testing (CPU/GPU/Thermal benchmarking). We have:

- ✅ User authentication (signup/login/sessions)
- ✅ Hardware testing tools (CPU/GPU stress tests)
- ✅ Communities (r/MacBooks, r/Gaming, r/Thermal, etc)
- ✅ Posts/threads system
- ✅ Comments with nested replies
- ✅ Voting system (upvote/downvote)
- ✅ Karma system

We need to add: **Ads system (ads for guests, NO ads for logged-in members)**

---

## FEATURE REQUIREMENTS

### Core Logic

1. **Authentication Check**
   - Detect if user is logged in (via auth token/session)
   - Render ads ONLY for non-logged-in users (guests)
   - Logged-in users see ZERO ads

2. **Ad Placement**
   - Between posts: Every 5th post in feed (show ad banner)
   - Sidebar: Right sidebar ad banner (guests only)
   - Footer: Bottom of page ad banner (guests only)
   - NOT in comments, moderation areas, or user profiles

3. **Ad Types**
   - Google AdSense (display ads)
   - Affiliate links (Amazon hardware products)
   - Native ads (contextual to subreddit)

4. **User Experience**
   - Ads are dismissible/collapsible
   - "Sign up to remove ads" CTA visible
   - No popups or modals
   - No autoplay video
   - No sound ads
   - Non-intrusive styling

---

## DATABASE SCHEMA

### New Tables to Create

```sql
-- Track ad impressions
CREATE TABLE ad_impressions (
  id VARCHAR(36) PRIMARY KEY,
  guest_session_id VARCHAR(36),  -- NULL for unknown guests
  ad_type VARCHAR(50),  -- 'sidebar', 'between_posts', 'footer', 'affiliate'
  ad_network VARCHAR(50),  -- 'google_adsense', 'affiliate', 'native'
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 1,
  revenue DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_session (guest_session_id),
  INDEX idx_created (created_at DESC)
);

-- Track affiliate links
CREATE TABLE affiliate_links (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200),  -- "Corsair Cooling Pad"
  url VARCHAR(500),  -- Amazon affiliate link
  category VARCHAR(50),  -- "cooling", "thermal_paste", "accessories"
  commission_rate DECIMAL(5, 2),  -- 3.5%
  active BOOLEAN DEFAULT TRUE,
  clicks INT DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_category (category),
  INDEX idx_active (active)
);

-- Site settings
CREATE TABLE site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSON,  -- {"ad_network": "google_adsense", "enabled": true, "cpm": 3}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## BACKEND API ENDPOINTS

### New Endpoints to Create

```
POST   /api/ads/impression              - Log ad impression (guest visit)
POST   /api/ads/click                   - Log ad click
POST   /api/ads/affiliate/:id/click     - Log affiliate link click
GET    /api/ads/config                  - Get ad config (guest vs member)
GET    /api/ads/stats                   - Get ad stats (mod only)
PUT    /api/ads/settings                - Update ad settings (admin only)
```

### Endpoint Implementations

```javascript
// GET /api/ads/config - Check if user is logged in, return ad config
app.get('/api/ads/config', (req, res) => {
  const isLoggedIn = req.cookies.auth_token ? true : false;
  
  res.json({
    showAds: !isLoggedIn,  // Show ads only if NOT logged in
    userId: isLoggedIn ? req.user.id : null,
    sessionId: req.sessionID
  });
});

// POST /api/ads/impression - Log impression
app.post('/api/ads/impression', (req, res) => {
  const { adType, adNetwork, sessionId } = req.body;
  
  // Insert into ad_impressions table
  db.query(
    'INSERT INTO ad_impressions (guest_session_id, ad_type, ad_network) VALUES (?, ?, ?)',
    [sessionId, adType, adNetwork]
  );
  
  res.json({ success: true });
});

// POST /api/ads/click - Log click
app.post('/api/ads/click', (req, res) => {
  const { impressionId } = req.body;
  
  db.query(
    'UPDATE ad_impressions SET clicks = clicks + 1 WHERE id = ?',
    [impressionId]
  );
  
  res.json({ success: true });
});
```

---

## FRONTEND COMPONENTS

### 1. Ad Banner Component (React)

```javascript
// components/AdBanner.js
import React, { useEffect, useState } from 'react';
import { auth } from '../auth';

const AdBanner = ({ type = 'sidebar' }) => {
  const [shouldShowAds, setShouldShowAds] = useState(false);
  const [adConfig, setAdConfig] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = auth.isAuthenticated;
    setShouldShowAds(!isLoggedIn);

    // Get ad config from server
    fetch('/api/ads/config', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setAdConfig(data);
        
        // Log impression
        if (!isLoggedIn && !dismissed) {
          fetch('/api/ads/impression', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              adType: type,
              adNetwork: 'google_adsense',
              sessionId: data.sessionId
            })
          });
        }
      });
  }, [dismissed]);

  if (!shouldShowAds || dismissed) {
    return null;
  }

  return (
    <div className="ad-banner" style={{
      background: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '15px',
      margin: '15px 0',
      position: 'relative'
    }}>
      {/* Google AdSense placeholder */}
      <div id={`ad-${type}`} className="adsbygoogle" 
        style={{ display: 'inline-block', width: '100%', height: '250px' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot="xxxxxxxx"
        data-ad-format="auto">
      </div>

      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
        ✕
      </button>

      {/* Signup CTA */}
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        💡 <a href="/signup" style={{ color: '#0066cc' }}>Sign up free</a> to remove ads
      </div>
    </div>
  );
};

export default AdBanner;
```

### 2. Post Feed with Ad Slots (React)

```javascript
// components/PostFeed.js
import AdBanner from './AdBanner';
import PostCard from './PostCard';

const PostFeed = ({ posts, communityId }) => {
  const isLoggedIn = auth.isAuthenticated;

  return (
    <div className="post-feed">
      {posts.map((post, index) => (
        <React.Fragment key={post.id}>
          <PostCard post={post} />
          
          {/* Ad slot every 5th post for guests */}
          {!isLoggedIn && index > 0 && index % 5 === 0 && (
            <AdBanner type="between_posts" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PostFeed;
```

### 3. Sidebar with Ad (React)

```javascript
// components/Sidebar.js
import AdBanner from './AdBanner';

const Sidebar = () => {
  const isLoggedIn = auth.isAuthenticated;

  return (
    <div className="sidebar">
      {!isLoggedIn && <AdBanner type="sidebar" />}
      
      {/* Community info, etc */}
      <div className="community-info">
        {/* ... */}
      </div>
    </div>
  );
};

export default Sidebar;
```

### 4. Affiliate Link Component (React)

```javascript
// components/AffiliateLink.js
import React from 'react';

const AffiliateLink = ({ affiliateId, text, url }) => {
  const handleClick = async () => {
    // Log click
    await fetch('/api/ads/affiliate/' + affiliateId + '/click', {
      method: 'POST'
    });
    
    // Redirect
    window.open(url, '_blank');
  };

  return (
    <a 
      href="#" 
      onClick={(e) => { e.preventDefault(); handleClick(); }}
      style={{ color: '#0066cc', cursor: 'pointer' }}>
      {text}
    </a>
  );
};

export default AffiliateLink;
```

---

## GOOGLE ADSENSE SETUP

### Steps to Integrate

1. Sign up at google.com/adsense
2. Get ad client code: `ca-pub-xxxxxxxxxxxxxxxx`
3. Create ad units (get slot IDs)
4. Add to React components:

```html
<!-- Load AdSense script in public/index.html -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
  crossorigin="anonymous"></script>
```

5. Push ads:
```javascript
window.adsbygoogle = window.adsbygoogle || [];
window.adsbygoogle.push({});
```

---

## AFFILIATE LINKS SETUP

### Amazon Associates

1. Sign up at amazon.com/associates
2. Create affiliate links for products
3. Store in database `affiliate_links` table
4. Use AffiliateLink component to render

### Example Products

```
Cooling pads
  → Amazon ASIN: B08SOMETHING
  → Commission: 4%

Thermal paste
  → Amazon ASIN: B09SOMETHING
  → Commission: 3%

Laptop stands
  → Amazon ASIN: B07SOMETHING
  → Commission: 5%
```

---

## IMPLEMENTATION CHECKLIST

### Database
- [ ] Create `ad_impressions` table
- [ ] Create `affiliate_links` table
- [ ] Create `site_settings` table
- [ ] Add indexes for performance

### Backend
- [ ] Implement `/api/ads/config` endpoint
- [ ] Implement `/api/ads/impression` endpoint
- [ ] Implement `/api/ads/click` endpoint
- [ ] Implement `/api/ads/affiliate/:id/click` endpoint
- [ ] Implement `/api/ads/settings` endpoint (admin)

### Frontend
- [ ] Create AdBanner component
- [ ] Update PostFeed to include ad slots
- [ ] Update Sidebar to include ad
- [ ] Create AffiliateLink component
- [ ] Add auth check (isLoggedIn) to all ad components
- [ ] Add "Sign up to remove ads" CTA

### Google AdSense
- [ ] Sign up for Google AdSense
- [ ] Get client code and ad slots
- [ ] Add script to HTML
- [ ] Configure ad units

### Affiliate
- [ ] Sign up for Amazon Associates
- [ ] Create affiliate links database
- [ ] Update AffiliateLink component
- [ ] Test tracking

### Testing
- [ ] Test ads show for guests
- [ ] Test ads DON'T show for logged-in users
- [ ] Test ad click tracking
- [ ] Test affiliate link tracking
- [ ] Test ad dismissal
- [ ] Test on mobile responsive

### Moderation & Analytics
- [ ] Create admin dashboard for ad stats
- [ ] Show impressions, clicks, revenue
- [ ] Allow mods to manage ad settings
- [ ] Transparent reporting

---

## CONFIGURATION

### site_settings Table Entries

```sql
-- Google AdSense config
INSERT INTO site_settings (setting_key, setting_value) VALUES (
  'google_adsense_config',
  JSON_OBJECT(
    'enabled', true,
    'client_code', 'ca-pub-xxxxxxxxxxxxxxxx',
    'cpm', 3,
    'show_for_guests', true,
    'show_for_members', false
  )
);

-- Affiliate config
INSERT INTO site_settings (setting_key, setting_value) VALUES (
  'affiliate_config',
  JSON_OBJECT(
    'enabled', true,
    'networks', JSON_ARRAY('amazon'),
    'commission_share', 50,
    'transparent_labeling', true
  )
);

-- Ad frequency config
INSERT INTO site_settings (setting_key, setting_value) VALUES (
  'ad_frequency',
  JSON_OBJECT(
    'show_between_posts', true,
    'between_posts_interval', 5,
    'show_sidebar', true,
    'show_footer', true,
    'dismissible', true
  )
);
```

---

## STYLE & UX

### CSS for Ad Components

```css
.ad-banner {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
  position: relative;
  transition: opacity 0.2s;
}

.ad-banner:hover {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.ad-banner-close {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  transition: color 0.2s;
}

.ad-banner-close:hover {
  color: #333;
}

.ad-banner-signup-cta {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

.ad-banner-signup-cta a {
  color: #0066cc;
  text-decoration: none;
}

.ad-banner-signup-cta a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .ad-banner {
    padding: 10px;
    margin: 10px 0;
  }
  
  .adsbygoogle {
    height: 180px !important;
  }
}
```

---

## DEPLOYMENT

### Phase 1: Setup
- Set up Google AdSense account
- Get client code and ad unit IDs
- Create affiliate links database

### Phase 2: Development
- Build components (2-3 days)
- Integrate with auth system
- Test all ad placements

### Phase 3: Testing
- Test with real AdSense ads
- Test affiliate link tracking
- Monitor CPM and click-through rates

### Phase 4: Launch
- Deploy to production
- Monitor ad performance
- Gather user feedback

---

## MONITORING & REVENUE

### Analytics to Track

```
Daily:
├─ Impressions (per ad type)
├─ Clicks (per ad type)
├─ Click-through rate (CTR)
└─ Estimated revenue

Weekly:
├─ Revenue trends
├─ Best-performing ads
├─ Ad types ROI
└─ Affiliate revenue

Monthly:
├─ Total revenue
├─ CPM trends
├─ Growth rate
└─ Business sustainability
```

### Admin Dashboard

Create `/admin/ads` page showing:
- Live impressions counter
- Revenue this month
- Top performing ad slots
- Affiliate link clicks
- User feedback/complaints

---

## COMMUNITY TRUST

### Transparency Requirements

- [ ] Clear labeling: "Ad", "Sponsored", "Affiliate"
- [ ] Privacy policy explains ads
- [ ] Community guidelines on ad content
- [ ] Mod ability to report/remove ads
- [ ] User feedback mechanism
- [ ] Public ad stats

### Community Moderation

Allow community to vote on:
- Ad types allowed
- Frequency
- Content restrictions
- Affiliate partnerships

---

## THIS IS YOUR COMPLETE BUILD PROMPT

**Copy everything above and send to Claude (or your developer) to build the entire ads system.**

The prompt includes:
✅ Database schema
✅ Backend API endpoints
✅ Frontend React components
✅ Google AdSense setup
✅ Affiliate links setup
✅ CSS styling
✅ Implementation checklist
✅ Monitoring & analytics
✅ Deployment plan

**Everything needed to add ads to AntiGravity.**
