# STUDENT PROGRESS TRACKER – ACADEMIC PERFORMANCE MANAGEMENT SYSTEM

A full-stack college major project built using **HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js, Python Flask, and SQLite**.

---

## Project Architecture

```text
student_progress_tracker/
│
├── app.py                     # Main Flask web server & route controllers
├── database.py                # SQLite schema definition & sample data seeder
├── requirements.txt           # Python dependencies
│
├── database/
│   └── student_tracker.db     # Auto-generated SQLite relational database
│
├── templates/
│   ├── index.html             # Landing page & project overview
│   ├── login.html             # Student & Admin unified login portal
│   ├── register.html          # Student registration form with validation
│   ├── dashboard.html         # Student analytics dashboard with Chart.js
│   ├── attendance.html        # Subject-wise attendance tracker & status calculator
│   ├── performance.html       # Examination marks ledger & performance graphs
│   ├── assignments.html       # Assignment deadline & submission manager
│   ├── goals.html             # Daily & weekly study goal tracker
│   ├── reports.html           # Printable & downloadable PDF progress report card
│   └── admin.html             # Complete Admin control panel (Students, Subjects, Marks, Attendance)
│
├── static/
│   ├── css/
│   │   └── style.css          # Custom styling & print PDF layout rules
│   ├── js/
│   │   └── script.js          # Client-side validation, Chart.js rendering & PDF export
│   └── images/
│
└── README.md
```

---

## Database Schema (8 Relational Tables)

1. **`Students`**: `id`, `roll_no`, `full_name`, `email`, `password_hash`, `department`, `semester`, `phone`, `created_at`
2. **`Admin`**: `id`, `username`, `email`, `password_hash`, `full_name`
3. **`Subjects`**: `id`, `subject_code`, `subject_name`, `credits`, `semester`, `instructor`
4. **`Attendance`**: `id`, `student_id`, `subject_id`, `classes_attended`, `classes_conducted`, `last_updated`
5. **`Examination`**: `id`, `student_id`, `subject_id`, `exam_type`, `marks_obtained`, `max_marks`, `exam_date`, `remarks`
6. **`Assignments`**: `id`, `subject_id`, `title`, `description`, `due_date`, `max_marks`
7. **`Assignment_Submissions`**: `id`, `assignment_id`, `student_id`, `status`, `submitted_date`, `marks_awarded`, `submission_note`
8. **`Study_Goals`**: `id`, `student_id`, `title`, `goal_type`, `target_hours`, `completed_hours`, `target_date`, `is_completed`

---

## How to Run Locally (Python Flask)

1. **Install dependencies**:
   ```bash
   cd student_progress_tracker
   pip install -r requirements.txt
   ```

2. **Initialize the SQLite database**:
   ```bash
   python database.py
   ```

3. **Start the Flask server**:
   ```bash
   python app.py
   ```

4. **Open in browser**:
   Navigate to `http://127.0.0.1:5000`

---

## Default Demo Credentials

- **Student Login**:
  - Roll No / Email: `CS2026-001` or `aarav@college.edu`
  - Password: `student123`
- **Admin Login**:
  - Username / Email: `admin` or `admin@college.edu`
  - Password: `admin123`
