import os
import sqlite3
import hashlib

try:
    from werkzeug.security import generate_password_hash, check_password_hash
except ImportError:
    def generate_password_hash(password: str) -> str:
        salt = "student_tracker_salt_2026"
        dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return f"pbkdf2:sha256:{salt}${dk.hex()}"

    def check_password_hash(pwhash: str, password: str) -> bool:
        return pwhash == generate_password_hash(password)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "database")
DB_PATH = os.path.join(DB_DIR, "student_tracker.db")


def get_db_connection():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Students Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roll_no TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            department TEXT NOT NULL,
            semester INTEGER NOT NULL DEFAULT 5,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    # 2. Admin Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL
        );
        """
    )

    # 3. Subjects Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_code TEXT UNIQUE NOT NULL,
            subject_name TEXT NOT NULL,
            credits INTEGER NOT NULL DEFAULT 4,
            semester INTEGER NOT NULL DEFAULT 5,
            instructor TEXT NOT NULL
        );
        """
    )

    # 4. Attendance Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            subject_id INTEGER NOT NULL,
            classes_attended INTEGER NOT NULL DEFAULT 0,
            classes_conducted INTEGER NOT NULL DEFAULT 0,
            last_updated DATE DEFAULT CURRENT_DATE,
            UNIQUE(student_id, subject_id),
            FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE
        );
        """
    )

    # 5. Examination Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Examination (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            subject_id INTEGER NOT NULL,
            exam_type TEXT NOT NULL,
            marks_obtained REAL NOT NULL,
            max_marks REAL NOT NULL DEFAULT 100,
            exam_date DATE DEFAULT CURRENT_DATE,
            remarks TEXT,
            FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE
        );
        """
    )

    # 6. Assignments Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            due_date DATE NOT NULL,
            max_marks INTEGER NOT NULL DEFAULT 25,
            FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE
        );
        """
    )

    # 7. Assignment_Submissions Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Assignment_Submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assignment_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            submitted_date DATE,
            marks_awarded REAL,
            submission_note TEXT,
            UNIQUE(assignment_id, student_id),
            FOREIGN KEY (assignment_id) REFERENCES Assignments(id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
        );
        """
    )

    # 8. Study_Goals Table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS Study_Goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            goal_type TEXT NOT NULL DEFAULT 'Weekly',
            target_hours REAL NOT NULL DEFAULT 5,
            completed_hours REAL NOT NULL DEFAULT 0,
            target_date DATE NOT NULL,
            is_completed INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
        );
        """
    )

    # Seed Admin if empty
    admin_count = cursor.execute("SELECT COUNT(*) FROM Admin").fetchone()[0]
    if admin_count == 0:
        cursor.execute(
            """
            INSERT INTO Admin (username, email, password_hash, full_name)
            VALUES (?, ?, ?, ?)
            """,
            (
                "admin",
                "admin@college.edu",
                generate_password_hash("admin123"),
                "Dr. Eleanor Vance (Academic Dean)",
            ),
        )

    # Seed Subjects if empty
    subject_count = cursor.execute("SELECT COUNT(*) FROM Subjects").fetchone()[0]
    if subject_count == 0:
        subjects = [
            ("CS501", "Database Management Systems", 4, 5, "Prof. R. K. Sharma"),
            ("CS502", "Operating Systems & Kernel Design", 4, 5, "Dr. Alan Turing"),
            ("CS503", "Design & Analysis of Algorithms", 4, 5, "Prof. Maya Lin"),
            ("CS504", "Computer Networks & Security", 3, 5, "Dr. Vikram Patel"),
            ("CS505", "Full-Stack Web Engineering", 3, 5, "Prof. Elena Rostova"),
        ]
        cursor.executemany(
            """
            INSERT INTO Subjects (subject_code, subject_name, credits, semester, instructor)
            VALUES (?, ?, ?, ?, ?)
            """,
            subjects,
        )

    # Seed Sample Students if empty
    student_count = cursor.execute("SELECT COUNT(*) FROM Students").fetchone()[0]
    if student_count == 0:
        sample_students = [
            (
                "CS2026-001",
                "Aarav Sharma",
                "aarav@college.edu",
                generate_password_hash("student123"),
                "Computer Science & Engineering",
                5,
                "+91 98765 43210",
            ),
            (
                "CS2026-002",
                "Maya Lin-kovsky",
                "maya@college.edu",
                generate_password_hash("student123"),
                "Computer Science & Engineering",
                5,
                "+1 (415) 891-4402",
            ),
            (
                "CS2026-003",
                "Marcus Vance",
                "marcus@college.edu",
                generate_password_hash("student123"),
                "Computer Science & Engineering",
                5,
                "+1 (415) 309-8821",
            ),
        ]
        cursor.executemany(
            """
            INSERT INTO Students (roll_no, full_name, email, password_hash, department, semester, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            sample_students,
        )

        # Fetch IDs for seeding related records
        students_rows = cursor.execute("SELECT id FROM Students ORDER BY id").fetchall()
        subjects_rows = cursor.execute("SELECT id FROM Subjects ORDER BY id").fetchall()

        # Seed Attendance
        attendance_Matrix = [
            # Student 1
            (students_rows[0]["id"], subjects_rows[0]["id"], 38, 42),
            (students_rows[0]["id"], subjects_rows[1]["id"], 35, 40),
            (students_rows[0]["id"], subjects_rows[2]["id"], 40, 44),
            (students_rows[0]["id"], subjects_rows[3]["id"], 30, 36),
            (students_rows[0]["id"], subjects_rows[4]["id"], 36, 38),
            # Student 2
            (students_rows[1]["id"], subjects_rows[0]["id"], 41, 42),
            (students_rows[1]["id"], subjects_rows[1]["id"], 39, 40),
            (students_rows[1]["id"], subjects_rows[2]["id"], 43, 44),
            (students_rows[1]["id"], subjects_rows[3]["id"], 35, 36),
            (students_rows[1]["id"], subjects_rows[4]["id"], 37, 38),
            # Student 3
            (students_rows[2]["id"], subjects_rows[0]["id"], 29, 42),
            (students_rows[2]["id"], subjects_rows[1]["id"], 28, 40),
            (students_rows[2]["id"], subjects_rows[2]["id"], 33, 44),
            (students_rows[2]["id"], subjects_rows[3]["id"], 25, 36),
            (students_rows[2]["id"], subjects_rows[4]["id"], 31, 38),
        ]
        cursor.executemany(
            """
            INSERT INTO Attendance (student_id, subject_id, classes_attended, classes_conducted)
            VALUES (?, ?, ?, ?)
            """,
            attendance_Matrix,
        )

        # Seed Examination Marks
        exams_data = [
            (students_rows[0]["id"], subjects_rows[0]["id"], "Midterm Exam", 88, 100, "2026-10-15", "Strong normalization design"),
            (students_rows[0]["id"], subjects_rows[1]["id"], "Midterm Exam", 82, 100, "2026-10-17", "Good deadlock analysis"),
            (students_rows[0]["id"], subjects_rows[2]["id"], "Midterm Exam", 91, 100, "2026-10-19", "Optimal DP derivation"),
            (students_rows[0]["id"], subjects_rows[3]["id"], "Midterm Exam", 79, 100, "2026-10-21", "Review subnetting masks"),
            (students_rows[0]["id"], subjects_rows[4]["id"], "Midterm Exam", 94, 100, "2026-10-23", "Outstanding REST architecture"),

            (students_rows[1]["id"], subjects_rows[0]["id"], "Midterm Exam", 96, 100, "2026-10-15", "Top score in B+ trees"),
            (students_rows[1]["id"], subjects_rows[1]["id"], "Midterm Exam", 92, 100, "2026-10-17", "Excellent paging simulation"),
            (students_rows[1]["id"], subjects_rows[2]["id"], "Midterm Exam", 95, 100, "2026-10-19", "Flawless graph proofs"),
            (students_rows[1]["id"], subjects_rows[3]["id"], "Midterm Exam", 89, 100, "2026-10-21", "Great TLS handshake writeup"),
            (students_rows[1]["id"], subjects_rows[4]["id"], "Midterm Exam", 97, 100, "2026-10-23", "Exemplary full-stack project"),

            (students_rows[2]["id"], subjects_rows[0]["id"], "Midterm Exam", 74, 100, "2026-10-15", "Practice SQL joins"),
            (students_rows[2]["id"], subjects_rows[1]["id"], "Midterm Exam", 71, 100, "2026-10-17", "Revise CPU scheduling"),
            (students_rows[2]["id"], subjects_rows[2]["id"], "Midterm Exam", 78, 100, "2026-10-19", "Good greedy approach"),
            (students_rows[2]["id"], subjects_rows[3]["id"], "Midterm Exam", 68, 100, "2026-10-21", "Needs OSI layer review"),
            (students_rows[2]["id"], subjects_rows[4]["id"], "Midterm Exam", 83, 100, "2026-10-23", "Solid frontend implementation"),
        ]
        cursor.executemany(
            """
            INSERT INTO Examination (student_id, subject_id, exam_type, marks_obtained, max_marks, exam_date, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            exams_data,
        )

        # Seed Assignments
        assignments_seed = [
            (subjects_rows[0]["id"], "ER Modeling & BCNF Normalization Schema", "Design a 3NF/BCNF relational schema for a university hospital.", "2026-11-10", 25),
            (subjects_rows[1]["id"], "POSIX Threads & Mutex Producer-Consumer Lab", "Implement bounded-buffer synchronization in C.", "2026-11-12", 25),
            (subjects_rows[2]["id"], "Dijkstra & Bellman-Ford Benchmark Report", "Empirical runtime comparison on sparse and dense graphs.", "2026-11-15", 25),
            (subjects_rows[3]["id"], "Wireshark TCP Congestion Control Capture", "Analyze slow start and AIMD window scaling.", "2026-11-18", 25),
            (subjects_rows[4]["id"], "Flask + SQLite Academic Tracker Architecture", "Build a modular full-stack web application with authentication.", "2026-11-22", 25),
        ]
        cursor.executemany(
            """
            INSERT INTO Assignments (subject_id, title, description, due_date, max_marks)
            VALUES (?, ?, ?, ?, ?)
            """,
            assignments_seed,
        )

        asg_rows = cursor.execute("SELECT id FROM Assignments ORDER BY id").fetchall()
        for s_idx, stu in enumerate(students_rows):
            for a_idx, asg in enumerate(asg_rows):
                is_done = (a_idx < 4) if s_idx == 0 else (a_idx < 5 if s_idx == 1 else a_idx < 2)
                status = "Completed" if is_done else "Pending"
                sub_date = "2026-11-05" if is_done else None
                marks = (23 if s_idx == 0 else (25 if s_idx == 1 else 20)) if is_done else None
                note = "Submitted via student portal." if is_done else ""
                cursor.execute(
                    """
                    INSERT INTO Assignment_Submissions (assignment_id, student_id, status, submitted_date, marks_awarded, submission_note)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (asg["id"], stu["id"], status, sub_date, marks, note),
                )

        # Seed Study Goals
        goals_seed = [
            (students_rows[0]["id"], "Complete B+ Tree & Indexing Problem Set", "Weekly", 6.0, 6.0, "2026-11-08", 1),
            (students_rows[0]["id"], "Revise Linux Virtual Memory Paging", "Daily", 3.0, 2.0, "2026-11-09", 0),
            (students_rows[0]["id"], "Practice 15 Dynamic Programming Problems", "Weekly", 8.0, 5.5, "2026-11-14", 0),
            (students_rows[0]["id"], "Finish Wireshark Packet Trace Lab", "Daily", 2.5, 2.5, "2026-11-07", 1),
            (students_rows[1]["id"], "Master Red-Black Tree Rotations", "Weekly", 5.0, 5.0, "2026-11-08", 1),
            (students_rows[2]["id"], "Catch up on SQL Joins & Subqueries", "Weekly", 6.0, 3.0, "2026-11-10", 0),
        ]
        cursor.executemany(
            """
            INSERT INTO Study_Goals (student_id, title, goal_type, target_hours, completed_hours, target_date, is_completed)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            goals_seed,
        )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print(f"Database initialized successfully at {DB_PATH}")
