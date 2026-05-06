# Quick Setup Guide

## Step 1: Install XAMPP (if not already installed)

1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP to `/Applications/XAMPP` (macOS) or `C:\xampp` (Windows)
3. Start Apache and MySQL from XAMPP Control Panel

## Step 2: Setup Database

1. Open http://localhost/phpmyadmin in your browser
2. Click "New" to create a database
3. Name it: `faculty_consultation_db`
4. Click "Import" tab
5. Choose file: `/FAC/backend/database.sql`
6. Click "Go" to import

✅ You should see 5 tables created with sample data

## Step 3: Place Project Files

**macOS XAMPP:**
```bash
# Move FAC folder to XAMPP htdocs
mv FAC /Applications/XAMPP/htdocs/
```

**Windows XAMPP:**
```
# Move FAC folder to:
C:\xampp\htdocs\FAC
```

## Step 4: Install Frontend Dependencies

```bash
# Navigate to frontend folder
cd /Applications/XAMPP/htdocs/FAC/frontend   # macOS
# OR
cd C:\xampp\htdocs\FAC\frontend               # Windows

# Install Node.js dependencies
npm install
```

## Step 5: Start the Application

### Terminal 1: Frontend React Server
```bash
cd /Applications/XAMPP/htdocs/FAC/frontend
npm run dev
```

### Terminal 2: Test Backend
```bash
# Test API is working
curl "http://localhost/FAC/backend/api/search/course.php?course_name=Data"
```

## Step 6: Open Application

Open your browser and go to:
**http://localhost:5173**

## 🎉 You're Done!

### Test It Out:

1. **Search for a course**: Type "Data Structures" and click Search
2. **Add to routine**: Click the + button on a consultation
3. **View routine**: See it in the weekly grid
4. **Faculty login**: Click "Faculty Login" button
   - Email: `sarah.j@university.edu`
   - Password: `password123`

## Common Issues

### Issue: "Cannot GET /api/..."
**Fix:** Make sure XAMPP Apache is running

### Issue: "npm: command not found"
**Fix:** Install Node.js from https://nodejs.org

### Issue: "Access denied for user 'root'"
**Fix:** Check MySQL is running in XAMPP

### Issue: Frontend shows blank page
**Fix:** Run `npm install` in the frontend folder again

---

## File Structure Checklist

Make sure your structure looks like this:

```
/Applications/XAMPP/htdocs/FAC/
├── backend/
│   ├── config/
│   ├── api/
│   ├── utils/
│   ├── database.sql
│   └── .htaccess
└── frontend/
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

**Need Help?** Check the main README.md for detailed troubleshooting.
