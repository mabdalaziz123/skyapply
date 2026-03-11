import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skyapply_fallback_secret';

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('error', (err) => { console.error('Unexpected DB error', err); process.exit(-1); });

// Multer config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ─── Auth Middleware ──────────────────────────────────────────────────────────

function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'غير مصرح' });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token غير صالح' });
  }
}

function requireAdmin(req: any, res: any, next: any) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'هذه العملية للمدير فقط' });
    next();
  });
}

// ─── DB Init + Seed ───────────────────────────────────────────────────────────

async function initDb() {
  try {
    console.log('Initializing database schema...');
    const schemaFile = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaFile)) {
      const sql = fs.readFileSync(schemaFile, 'utf8');
      await pool.query(sql);
      console.log('Database schema initialized.');
    }

    // Seed default admin if no users exist
    const { rows } = await pool.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(rows[0].count) === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3)',
        ['admin', hash, 'admin']
      );
      console.log('Default admin user created: admin / admin123');
    }
  } catch (err: any) {
    console.error('DB init error:', err.message);
  }
}

// ─── Auth Routes ─────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'الرجاء إدخال البيانات' });

    const { rows } = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    return res.json({ valid: true, user: decoded });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ─── Admin Users Management ───────────────────────────────────────────────────

app.get('/api/admin/users', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, role, created_at FROM admin_users ORDER BY created_at ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    if (!['admin', 'blogger'].includes(role)) return res.status(400).json({ error: 'دور غير صالح' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username, hash, role]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'اسم المستخدم موجود مسبقاً' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/users/:id', requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) return res.status(400).json({ error: 'لا يمكنك حذف حسابك الخاص' });
    await pool.query('DELETE FROM admin_users WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Image Upload ─────────────────────────────────────────────────────────────

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const publicUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ publicUrl });
});

// ─── Universities ─────────────────────────────────────────────────────────────

app.get('/api/universities', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM universities ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/api/universities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const universityRes = await pool.query('SELECT * FROM universities WHERE id = $1', [id]);
    if (universityRes.rows.length === 0) return res.status(404).json({ error: 'University not found' });

    const university = universityRes.rows[0];
    const collegesRes = await pool.query('SELECT * FROM colleges WHERE university_id = $1', [id]);
    const colleges = collegesRes.rows;
    for (let college of colleges) {
      const branchesRes = await pool.query('SELECT * FROM branches WHERE faculty_id = $1', [college.id]);
      (college as any).branches = branchesRes.rows;
    }
    university.colleges = colleges;
    res.json(university);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/universities', requireAuth, async (req, res) => {
  try {
    const {
      name, name_en, name_tr,
      country, country_en, country_tr,
      city, city_en, city_tr,
      description, description_en, description_tr,
      image, logo, ranking, students,
      type, type_en, type_tr,
      founded, website_url, features
    } = req.body;
    if (!name) return res.status(400).json({ error: 'University name is required' });
    const { rows } = await pool.query(
      `INSERT INTO universities
        (name, name_en, name_tr, country, country_en, country_tr, city, city_en, city_tr, description, description_en, description_tr, image, logo, ranking, students, type, type_en, type_tr, founded, website_url, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) RETURNING *`,
      [
        name, name_en, name_tr,
        country, country_en, country_tr,
        city, city_en, city_tr,
        description, description_en, description_tr,
        image, logo, ranking, students,
        type, type_en, type_tr,
        founded, website_url, JSON.stringify(features || [])
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) { console.error(err); res.status(500).json({ error: 'Internal server error', details: err.message }); }
});

app.put('/api/universities/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, name_en, name_tr,
      country, country_en, country_tr,
      city, city_en, city_tr,
      description, description_en, description_tr,
      image, logo, ranking, students,
      type, type_en, type_tr,
      founded, website_url, features
    } = req.body;
    const { rows } = await pool.query(
      `UPDATE universities SET
        name=$1, name_en=$2, name_tr=$3,
        country=$4, country_en=$5, country_tr=$6,
        city=$7, city_en=$8, city_tr=$9,
        description=$10, description_en=$11, description_tr=$12,
        image=$13, logo=$14, ranking=$15, students=$16,
        type=$17, type_en=$18, type_tr=$19,
        founded=$20, website_url=$21, features=$22,
        updated_at=CURRENT_TIMESTAMP
       WHERE id=$23 RETURNING *`,
      [
        name, name_en, name_tr,
        country, country_en, country_tr,
        city, city_en, city_tr,
        description, description_en, description_tr,
        image, logo, ranking, students,
        type, type_en, type_tr,
        founded, website_url, JSON.stringify(features || []),
        id
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'University not found' });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.delete('/api/universities/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM universities WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// ─── Faculties ────────────────────────────────────────────────────────────────

app.get('/api/faculties/:universityId', async (req, res) => {
  try {
    const { rows: colleges } = await pool.query('SELECT * FROM colleges WHERE university_id = $1 ORDER BY created_at ASC', [req.params.universityId]);
    for (let college of colleges) {
      const { rows: branches } = await pool.query('SELECT * FROM branches WHERE faculty_id = $1', [college.id]);
      (college as any).branches = branches;
    }
    res.json(colleges);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/faculties', requireAuth, async (req, res) => {
  try {
    const { university_id, name, name_en, name_tr } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO colleges (university_id, name, name_en, name_tr) VALUES ($1, $2, $3, $4) RETURNING *',
      [university_id, name, name_en || null, name_tr || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.delete('/api/faculties/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM colleges WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// ─── Branches ────────────────────────────────────────────────────────────────

app.get('/api/branches', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT b.*, c.name as college_name, c.name_en as college_name_en, c.name_tr as college_name_tr,
             u.id as university_id, u.name as university_name, u.name_en as university_name_en, u.name_tr as university_name_tr,
             u.country as university_country
      FROM branches b
      JOIN colleges c ON b.faculty_id = c.id
      JOIN universities u ON c.university_id = u.id
    `);
    const formatted = rows.map(r => ({
      ...r,
      colleges: {
        name: r.college_name,
        name_en: r.college_name_en,
        name_tr: r.college_name_tr,
        universities: {
          id: r.university_id,
          name: r.university_name,
          name_en: r.university_name_en,
          name_tr: r.university_name_tr,
          country: r.university_country
        }
      }
    }));
    res.json(formatted);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/branches', requireAuth, async (req, res) => {
  try {
    const {
      faculty_id, name, name_en, name_tr,
      language, language_en, language_tr,
      duration, duration_en, duration_tr,
      degree, degree_en, degree_tr
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO branches 
        (faculty_id, name, name_en, name_tr, language, language_en, language_tr, duration, duration_en, duration_tr, degree, degree_en, degree_tr) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        faculty_id, name, name_en || null, name_tr || null,
        language, language_en || null, language_tr || null,
        duration, duration_en || null, duration_tr || null,
        degree, degree_en || null, degree_tr || null
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.delete('/api/branches/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM branches WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// ─── Blog ────────────────────────────────────────────────────────────────────

app.get('/api/blog', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/blog', requireAuth, async (req, res) => {
  try {
    const { title, title_en, title_tr, content, content_en, content_tr, author, image, read_time, date } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO blog_posts (title, title_en, title_tr, content, content_en, content_tr, author, image, read_time, date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [title, title_en || null, title_tr || null, content, content_en || null, content_tr || null, author, image, read_time, date]
    );
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.put('/api/blog/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, title_en, title_tr, content, content_en, content_tr, author, image, read_time, date } = req.body;
    const { rows } = await pool.query(
      'UPDATE blog_posts SET title=$1, title_en=$2, title_tr=$3, content=$4, content_en=$5, content_tr=$6, author=$7, image=$8, read_time=$9, date=$10 WHERE id=$11 RETURNING *',
      [title, title_en || null, title_tr || null, content, content_en || null, content_tr || null, author, image, read_time, date, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.delete('/api/blog/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// ─── Start Server ────────────────────────────────────────────────────────────

initDb().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
