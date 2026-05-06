# Faculty Consultation Routine Scheduler

A complete web-based system that allows students to search for faculty consultation hours, build their weekly routines, and request consultations. Faculty members can manage their information and approve/decline student requests.

## Features

### For Students:
- Search faculty by course name or faculty name
- View consultation hours with day, time, and location
- Build weekly consultation routine with visual 7-day grid
- Prevent time conflicts automatically
- Color-coded courses for easy identification
- Download routine as PDF
- Submit consultation requests to faculty
- Local storage persistence for routines

### For Faculty:
- Register and login securely
- Update profile information (name, department, phone)
- View all student consultation requests
- Approve or decline requests
- Email notifications sent to students (logged for demo)

## Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher  
- Node.js 18+ and npm
- XAMPP, MAMP, or LAMP stack (recommended)

## Key Features

- **Faculty Dashboard**: Manage consultation slots and student requests.
- **Student Portal**: Search faculty by department or name and request consultations.
- **Email Notifications**: Real-time email updates for request approvals and denials.
- **Routine Management**: Students can save consultation slots to their personal routine.
- **MVC Architecture**: Clean separation of concerns for maintainability.

## Installation

### 1. Clone or Download the Project

```bash
cd /path/to/htdocs/  # For XAMPP  on macOS: /Applications/XAMPP/htdocs/
# Extract or place the FAC folder here
```

### 2. Database Setup

1. Start MySQL (via XAMPP or standalone)
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Create a new database named `faculty_consultation_db`
4. Import the database schema:
   - Click on `faculty_consultation_db`
   - Go to "Import" tab
   - Select `/FAC/backend/database.sql`
   - Click "Go"

### 3. Backend Configuration

The backend is already configured for local development:
- Database: `localhost`
- DB Name: `faculty_consultation_db`
- User: `root`
- Password: `` (empty)

If you need different credentials, edit `/FAC/backend/config/database.php`

### 4. Frontend Setup

```bash
cd /path/to/htdocs/FAC/frontend
npm install
```

## Running the Application

### Start the Backend (PHP)

Make sure XAMPP/MAMP Apache and MySQL are running.

Test backend:
```bash
# Test database connection
curl http://localhost/FAC/backend/api/search/course.php?course_name=Data
```

### Start the Frontend (React)

```bash
cd /path/to/htdocs/FAC/frontend
npm run dev
```

The app will open at: **http://localhost:5173**

## Usage Guide

### Student Workflow

1. Open http://localhost:5173
2. Use the search bar to find faculty:
   - Search by **Course Name** (e.g., "Data Structures")
   - Search by **Faculty Name** (e.g., "Sarah")
3. View faculty results with consultation hours
4. Click the **+** button to add consultations to your routine
5. View your routine in the weekly grid
6. Click **Download PDF** to export your routine
7. Click **Request Consultation** to send a request to faculty

### Faculty Workflow

1. Click **"Faculty Login"** in the top right
2. If new, click **"Register"** and create an account
3. Login with your credentials
4. **Manage Info** tab: Update your profile
5. **Student Requests** tab: View pending requests
6. Click **Approve** or **Decline** for each request
7. Email notifications are logged to console (demo mode)

## Project Structure

```
FAC/
├── backend/
│   ├── config/
│   │   ├── database.php       # Database connection
│   │   └── cors.php            # CORS headers
│   ├── utils/
│   │   └── email.php           # Email utility (mock for demo)
│   ├── api/
│   │   ├── faculty/
│   │   │   ├── register.php    # Faculty registration
│   │   │   ├── login.php       # Faculty login
│   │   │   └── update.php      # Update faculty info
│   │   ├── search/
│   │   │   ├── course.php      # Search by course
│   │   │   └── faculty.php     # Search by faculty name
│   │   ├── consultations/
│   │   │   ├── create.php      # Create consultation
│   │   │   └── update.php      # Update location
│   │   └── requests/
│   │       ├── create.php      # Submit request
│   │       ├── faculty.php     # Get faculty requests
│   │       ├── approve.php     # Approve request
│   │       └── decline.php     # Decline request
│   ├── database.sql            # Database schema with sample data
│   └── .htaccess               # Apache configuration
└── frontend/
    ├── src/
    │   ├── App.jsx             # Main React application
    │   └── main.jsx            # React entry point
    ├── public/
    ├── index.html              # HTML template
    ├── package.json            # Dependencies
    └── vite.config.js          # Vite configuration
```

## Database Schema

### Tables:
- **faculty** - Faculty member information
- **courses** - Course catalog
- **consultations** - Faculty consultation hours
- **consultation_requests** - Student requests  
- **routine_items** - Saved student routines (optional)

## Sample Data

The database comes with sample data:

**Faculty:**
- Dr. Sarah Johnson (`sarah.j@university.edu` / password: `password123`)
- Prof. Michael Chen (`michael.c@university.edu` / password: `password123`)
- Dr. Emily Rodriguez (`emily.r@university.edu` / password: `password123`)
- Prof. James Wilson (`james.w@university.edu` / password: `password123`)

**Courses:**
- Data Structures (CSE101)
- Algorithms (CSE201)
- Database Systems (CSE301)
- And more...

## Troubleshooting

### Backend Issues

**Error: "Connection refused"**
- Make sure Apache and MySQL are running in XAMPP/MAMP
- Check that port 80 is not blocked

**Error: "Access denied for user 'root'"**
- Update credentials in `/backend/config/database.php`

**CORS errors**
- Ensure `.htaccess` is present in `/backend/`
- Check that  Apache has `mod_headers` and `mod_rewrite` enabled

### Frontend Issues

**Error: "fetch failed" or "network error"**
- Make sure backend is running
- Check Vite proxy configuration in `vite.config.js`
- Verify API path matches: `/FAC/backend/api`

**Blank screen**
- Check browser console for errors
- Run `npm install` again
- Try clearing browser cache

## Customization

### Change Database Credentials

Edit `/backend/config/database.php`:
```php
private $host = "your-host";
private $db_name = "your-database";
private $username = "your-username";
private $password = "your-password";
```

### Add Real Email Sending

Replace the mock email function in `/backend/utils/email.php` with PHPMailer or similar SMTP library.

## Building for Production

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`. Copy these files to your web server.

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Check browser console and PHP error logs

---

**Built with:** React, Vite, PHP, MySQL, Tailwind CSS
e in `frontend/dist/`. Copy these files to your web server.

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Check browser console and PHP error logs

---

**Built with:** React, Vite, PHP, MySQL, Tailwind CSS
