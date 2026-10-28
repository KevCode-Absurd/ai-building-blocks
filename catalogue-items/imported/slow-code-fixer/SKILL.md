---
name: performance-optimizer
description: "Identifies and fixes performance bottlenecks in code, databases, and APIs. Measures before and after to prove improvements."
category: development
risk: safe
source: community
date_added: "2026-03-05"
---

# Performance Optimizer

Find and fix performance bottlenecks. Measure, optimize, verify. Make it fast.

## Before you start

Gather these first. If one is missing, ask for it before you change any code:

1. The slow code or query.
2. A current timing of the slow step (or permission to time it).
3. The database or framework in use.

## When to Use This Skill

- App is slow or laggy
- User complains about performance
- Page load times are high
- API responses are slow
- Database queries take too long
- User mentions "slow", "lag", "performance", or "optimize"

## The Optimization Process

### 1. Measure First

Never optimize without measuring:

```javascript
// Measure execution time
console.time('operation');
await slowOperation();
console.timeEnd('operation'); // operation: 2341ms
```

**What to measure:**
- Page load time
- API response time
- Database query time
- Function execution time
- Memory usage
- Network requests

### 2. Find the Bottleneck

Use profiling tools to find the slow parts:

**Browser:**
```
DevTools → Performance tab → Record → Stop
Look for long tasks (red bars)
```

**Node.js:**
```bash
node --prof app.js
node --prof-process isolate-*.log > profile.txt
```

**Database:**
```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### 3. Optimize

Fix the slowest thing first (biggest impact).

## Common Optimizations

### Database Queries

**Problem: N+1 Queries**
```javascript
// Bad: N+1 queries
const users = await db.users.find();
for (const user of users) {
  user.posts = await db.posts.find({ userId: user.id }); // N queries
}

// Good: Single query with JOIN
const users = await db.users.find()
  .populate('posts'); // 1 query
```

**Problem: Missing Index**
```sql
-- Check slow query
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- Shows: Seq Scan (bad)

-- Add index
CREATE INDEX idx_users_email ON users(email);

-- Check again
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- Shows: Index Scan (good)
```

**Problem: SELECT ***
```javascript
// Bad: Fetches all columns
const users = await db.query('SELECT * FROM users');

// Good: Only needed columns
const users = await db.query('SELECT id, name, email FROM users');
```

**Problem: No Pagination**
```javascript
// Bad: Returns all records
const users = await db.users.find();

// Good: Paginated
const users = await db.users.find()
  .limit(20)
  .skip((page - 1) * 20);
```

### API Performance

**Problem: No Caching**
```javascript
// Bad: Hits database every time
app.get('/api/stats', async (req, res) => {
  const stats = await db.stats.calculate(); // Slow
  res.json(stats);
});

// Good: Cache for 5 minutes
const cache = new Map();
app.get('/api/stats', async (req, res) => {
  const cached = cache.get('stats');
  if (cached && Date.now() - cached.time < 300000) {
    return res.json(cached.data);
  }
  
  const stats = await db.stats.calculate();
  cache.set('stats', { data: stats, time: Date.now() });
  res.json(stats);
});
```

**Problem: Sequential Operations**
```javascript
// Bad: Sequential (slow)
const user = await getUser(id);
const posts = await getPosts(id);
const comments = await getComments(id);
// Total: 300ms + 200ms + 150ms = 650ms

// Good: Parallel (fast)
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id)
]);
// Total: max(300ms, 200ms, 150ms) = 300ms
```

**Problem: Large Payloads**
```javascript
// Bad: Returns everything
res.json(users); // 5MB response

// Good: Only needed fields
res.json(users.map(u => ({
  id: u.id,
  name: u.name,
  email: u.email
}))); // 500KB response
```

### Frontend Performance

**Problem: Unnecessary Re-renders**
```javascript
// Bad: Re-renders on every parent update
function UserList({ users }) {
  return users.map(user => <UserCard user={user} />);
}

// Good: Memoized
const UserCard = React.memo(({ user }) => {
  return <div>{user.name}</div>;
});
```

**Problem: Large Bundle**
```javascript
// Bad: Imports entire library
import _ from 'lodash'; // 70KB

// Good: Import only what you need
import debounce from 'lodash/debounce'; // 2KB
```

**Problem: No Code Splitting**
```javascript
// Bad: Everything in one bundle
import HeavyComponent from './HeavyComponent';

// Good: Lazy load
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

**Problem: Unoptimized Images**
```html
<!-- Bad: Large image -->
<img src="photo.jpg" /> <!-- 5MB -->

<!-- Good: Optimized and responsive -->
<img 
  src="photo-small.webp" 
  srcset="photo-small.webp 400w, photo-large.webp 800w"
  loading="lazy"
  width="400"
  height="300"
/> <!-- 50KB -->
```

### Algorithm Optimization

**Problem: Inefficient Algorithm**
```javascript
// Bad: O(n²) - nested loops
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) duplicates.push(arr[i]);
    }
  }
  return duplicates;
}

// Good: O(n) - single pass with Set
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }
  return Array.from(duplicates);
}
```

**Problem: Repeated Calculations**
```javascript
// Bad: Calculates every time
function getTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
// Called 100 times in render

// Good: Memoized
const getTotal = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [items]);
```

### Memory Optimization

**Problem: Memory Leak**
```javascript
// Bad: Event listener not cleaned up
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  // Memory leak!
}, []);

// Good: Cleanup
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**Problem: Large Data in Memory**
```javascript
// Bad: Loads entire file into memory
const data = fs.readFileSync('huge-file.txt'); // 1GB

// Good: Stream it
const stream = fs.createReadStream('huge-file.txt');
stream.on('data', chunk => process(chunk));
```

## Measuring Impact

Always measure before and after:

```javascript
// Illustrative timings only, not measured results
// Before optimization
console.time('query');
const users = await db.users.find();
console.timeEnd('query');
// query: 2341ms

// After optimization (added index)
console.time('query');
const users = await db.users.find();
console.timeEnd('query');
// query: 23ms

// Your own numbers will differ. Always measure your own code.
```

## Performance Budgets

Set targets:

```
Page Load: < 2 seconds
API Response: < 200ms
Database Query: < 50ms
Bundle Size: < 200KB
Time to Interactive: < 3 seconds
```

## Tools

**Browser:**
- Chrome DevTools Performance tab
- Lighthouse (audit)
- Network tab (waterfall)

**Node.js:**
- `node --prof` (profiling)
- `clinic` (diagnostics)
- `autocannon` (load testing)

**Database:**
- `EXPLAIN ANALYZE` (query plans)
- Slow query log
- Database profiler

**Monitoring (paid services; this skill works without them):**
- New Relic
- Datadog
- Sentry Performance

## Quick Wins by bottleneck

Only try a quick win that matches the bottleneck you measured:

- **Slow database query:** add an index on the columns it filters or sorts on, or use pagination instead of loading all rows.
- **Repeated expensive work:** add caching for that operation.
- **Heavy page load:** lazy load images and heavy components, compress and resize images (WebP, proper sizing), minify JavaScript and CSS, remove unused dependencies.
- **Slow transfer of static files:** enable gzip on the server, use a CDN, enable HTTP/2.

If the measurement points somewhere else, do not apply these. Fix what the numbers show.

## Optimization Checklist

- [ ] Measured current performance
- [ ] Identified bottleneck
- [ ] Applied optimization
- [ ] Measured improvement
- [ ] Verified functionality still works
- [ ] No new bugs introduced
- [ ] Documented the change

## When NOT to Optimize

Skip it when the code is already fast enough or when nothing has been timed yet. Do not trade readable code for a gain of a few milliseconds.

## Key Principles

- Measure before optimizing
- Fix the biggest bottleneck first
- Measure after to prove improvement
- Don't sacrifice readability for tiny gains
- Profile in production-like environment
- Consider the 80/20 rule (20% of code causes 80% of slowness)

## Related Skills

- If the problem is a bug and not speed, use the bug root cause finder in the AI Blocks library.

If no timing exists yet, stop and ask for one before you change any code.

## What you hand back

Give the result in these six parts:

1. **Bottleneck:** the slowest part, and how you found it.
2. **Change made:** the fix, aimed at that part.
3. **Before time:** the timing before the change.
4. **After time:** the timing after, measured the same way.
5. **Kept or rejected:** which changes helped and stayed, and which were dropped.
6. **Checklist:** the Optimization Checklist above, ticked.

Use only timings that were measured. Never write an estimated time as if it were measured.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Bug root cause finder](https://useaiblocks.com/skills/bug-root-cause-finder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
