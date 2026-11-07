from functools import wraps
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    session,
    flash,
    jsonify,
)
from database import (
    get_db_connection,
    init_db,
    generate_password_hash,
    check_password_hash,
)

app = Flask(__name__)
app.secret_key = "student_progress_tracker_secret_key_2026"

# Ensure database is initialized on startup
init_db()


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            flash("Please log in to access this page.", "warning")
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return decorated_function


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("role") != "admin":
            flash("Administrator privileges required.", "danger")
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return decorated_function


def get_student_summary(conn, student_id):
    student = conn.execute(
        "SELECT * FROM Students WHERE id = ?", (student_id,)
    ).fetchone()
    subjects = conn.execute("SELECT * FROM Subjects ORDER BY subject_code").fetchall()

    # Attendance calculation
    attendance_rows = conn.execute(
        """
        SELECT sub.id AS subject_id, sub.subject_code, sub.subject_name, sub.instructor,
               COALESCE(att.classes_attended, 0) AS classes_attended,
               COALESCE(att.classes_conducted, 0) AS classes_conducted,
               att.last_updated
        FROM Subjects sub
        LEFT JOIN Attendance att ON sub.id = att.subject_id AND att.student_id = ?
        ORDER BY sub.subject_code
        """,
        (student_id,),
    ).fetchall()

    total_attended = sum(r["classes_attended"] for r in attendance_rows)
    total_conducted = sum(r["classes_conducted"] for r in attendance_rows)
    overall_attendance_pct = (
        round((total_attended / total_conducted) * 100, 1)
        if total_conducted > 0
        else 0.0
    )

    # Examination marks calculation
    exam_rows = conn.execute(
        """
        SELECT e.*, s.subject_code, s.subject_name
        FROM Examination e
        JOIN Subjects s ON e.subject_id = s.id
        WHERE e.student_id = ?
        ORDER BY s.subject_code, e.exam_date DESC
        """,
        (student_id,),
    ).fetchall()

    total_marks_obtained = sum(r["marks_obtained"] for r in exam_rows)
    total_max_marks = sum(r["max_marks"] for r in exam_rows)
    avg_exam_pct = (
        round((total_marks_obtained / total_max_marks) * 100, 1)
        if total_max_marks > 0
        else 0.0
    )

    # Assignments calculation
    assignment_rows = conn.execute(
        """
        SELECT a.id, a.title, a.description, a.due_date, a.max_marks,
               s.subject_code, s.subject_name,
               COALESCE(sub.status, 'Pending') AS status,
               sub.submitted_date, sub.marks_awarded, sub.submission_note
        FROM Assignments a
        JOIN Subjects s ON a.subject_id = s.id
        LEFT JOIN Assignment_Submissions sub
               ON a.id = sub.assignment_id AND sub.student_id = ?
        ORDER BY a.due_date ASC
        """,
        (student_id,),
    ).fetchall()

    total_assignments = len(assignment_rows)
    completed_assignments = sum(
        1 for r in assignment_rows if r["status"] == "Completed"
    )
    pending_assignments = total_assignments - completed_assignments
    assignment_completion_pct = (
        round((completed_assignments / total_assignments) * 100, 1)
        if total_assignments > 0
        else 0.0
    )

    # Study Goals calculation
    goals_rows = conn.execute(
        """
        SELECT * FROM Study_Goals
        WHERE student_id = ?
        ORDER BY is_completed ASC, target_date ASC
        """,
        (student_id,),
    ).fetchall()

    total_goals = len(goals_rows)
    completed_goals = sum(1 for g in goals_rows if g["is_completed"] == 1)
    goal_completion_pct = (
        round((completed_goals / total_goals) * 100, 1) if total_goals > 0 else 0.0
    )

    # Overall composite performance index
    overall_performance = round(
        (avg_exam_pct * 0.5)
        + (overall_attendance_pct * 0.25)
        + (assignment_completion_pct * 0.25),
        1,
    )

    if overall_performance >= 90:
        grade_letter = "A+"
    elif overall_performance >= 80:
        grade_letter = "A"
    elif overall_performance >= 70:
        grade_letter = "B+"
    elif overall_performance >= 60:
        grade_letter = "B"
    else:
        grade_letter = "C"

    return {
        "student": student,
        "subjects": subjects,
        "total_subjects": len(subjects),
        "attendance_rows": attendance_rows,
        "total_attended": total_attended,
        "total_conducted": total_conducted,
        "overall_attendance_pct": overall_attendance_pct,
        "exam_rows": exam_rows,
        "total_marks_obtained": total_marks_obtained,
        "total_max_marks": total_max_marks,
        "avg_exam_pct": avg_exam_pct,
        "assignment_rows": assignment_rows,
        "total_assignments": total_assignments,
        "completed_assignments": completed_assignments,
        "pending_assignments": pending_assignments,
        "assignment_completion_pct": assignment_completion_pct,
        "goals_rows": goals_rows,
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "goal_completion_pct": goal_completion_pct,
        "overall_performance": overall_performance,
        "grade_letter": grade_letter,
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        role = request.form.get("role", "student")
        identifier = request.form.get("identifier", "").strip()
        password = request.form.get("password", "")

        conn = get_db_connection()
        if role == "admin":
            admin = conn.execute(
                "SELECT * FROM Admin WHERE username = ? OR email = ?",
                (identifier, identifier),
            ).fetchone()
            conn.close()
            if admin and check_password_hash(admin["password_hash"], password):
                session["user_id"] = admin["id"]
                session["role"] = "admin"
                session["user_name"] = admin["full_name"]
                flash("Welcome back, Administrator!", "success")
                return redirect(url_for("admin_dashboard"))
            flash("Invalid admin username/email or password.", "danger")
        else:
            student = conn.execute(
                "SELECT * FROM Students WHERE email = ? OR roll_no = ?",
                (identifier, identifier),
            ).fetchone()
            conn.close()
            if student and check_password_hash(student["password_hash"], password):
                session["user_id"] = student["id"]
                session["role"] = "student"
                session["user_name"] = student["full_name"]
                session["roll_no"] = student["roll_no"]
                flash(f"Welcome back, {student['full_name']}!", "success")
                return redirect(url_for("dashboard"))
            flash("Invalid student roll number/email or password.", "danger")

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        roll_no = request.form.get("roll_no", "").strip()
        full_name = request.form.get("full_name", "").strip()
        email = request.form.get("email", "").strip().lower()
        department = request.form.get("department", "Computer Science & Engineering").strip()
        semester = int(request.form.get("semester", 5))
        phone = request.form.get("phone", "").strip()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not roll_no or not full_name or not email or not password:
            flash("All required fields must be filled out.", "danger")
            return render_template("register.html")

        if password != confirm_password:
            flash("Passwords do not match.", "danger")
            return render_template("register.html")

        conn = get_db_connection()
        existing = conn.execute(
            "SELECT id FROM Students WHERE email = ? OR roll_no = ?",
            (email, roll_no),
        ).fetchone()
        if existing:
            conn.close()
            flash("A student with that Roll Number or Email already exists.", "danger")
            return render_template("register.html")

        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO Students (roll_no, full_name, email, password_hash, department, semester, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                roll_no,
                full_name,
                email,
                generate_password_hash(password),
                department,
                semester,
                phone,
            ),
        )
        new_student_id = cursor.lastrowid

        # Initialize default attendance & assignment rows for the new student
        subjects = conn.execute("SELECT id FROM Subjects").fetchall()
        for sub in subjects:
            conn.execute(
                "INSERT INTO Attendance (student_id, subject_id, classes_attended, classes_conducted) VALUES (?, ?, 0, 0)",
                (new_student_id, sub["id"]),
            )
        assignments = conn.execute("SELECT id FROM Assignments").fetchall()
        for asg in assignments:
            conn.execute(
                "INSERT INTO Assignment_Submissions (assignment_id, student_id, status) VALUES (?, ?, 'Pending')",
                (asg["id"], new_student_id),
            )

        conn.commit()
        conn.close()
        flash("Registration successful! Please log in with your credentials.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out safely.", "info")
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    if session.get("role") == "admin":
        return redirect(url_for("admin_dashboard"))
    conn = get_db_connection()
    data = get_student_summary(conn, session["user_id"])
    conn.close()
    return render_template("dashboard.html", **data)


@app.route("/attendance")
@login_required
def attendance():
    student_id = request.args.get("student_id", session["user_id"], type=int)
    conn = get_db_connection()
    data = get_student_summary(conn, student_id)
    conn.close()
    return render_template("attendance.html", **data)


@app.route("/performance", methods=["GET", "POST"])
@login_required
def performance():
    student_id = session["user_id"]
    conn = get_db_connection()

    if request.method == "POST":
        subject_id = int(request.form.get("subject_id"))
        exam_type = request.form.get("exam_type", "Midterm Exam").strip()
        marks_obtained = float(request.form.get("marks_obtained", 0))
        max_marks = float(request.form.get("max_marks", 100))
        remarks = request.form.get("remarks", "").strip()

        conn.execute(
            """
            INSERT INTO Examination (student_id, subject_id, exam_type, marks_obtained, max_marks, remarks)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (student_id, subject_id, exam_type, marks_obtained, max_marks, remarks),
        )
        conn.commit()
        flash("Examination score recorded successfully.", "success")

    data = get_student_summary(conn, student_id)
    conn.close()
    return render_template("performance.html", **data)


@app.route("/assignments", methods=["GET", "POST"])
@login_required
def assignments():
    student_id = session["user_id"]
    conn = get_db_connection()

    if request.method == "POST":
        assignment_id = int(request.form.get("assignment_id"))
        new_status = request.form.get("status", "Completed")
        submission_note = request.form.get("submission_note", "Submitted via portal").strip()

        existing = conn.execute(
            "SELECT id FROM Assignment_Submissions WHERE assignment_id = ? AND student_id = ?",
            (assignment_id, student_id),
        ).fetchone()

        if existing:
            conn.execute(
                """
                UPDATE Assignment_Submissions
                SET status = ?, submitted_date = CURRENT_DATE, submission_note = ?
                WHERE id = ?
                """,
                (new_status, submission_note, existing["id"]),
            )
        else:
            conn.execute(
                """
                INSERT INTO Assignment_Submissions (assignment_id, student_id, status, submitted_date, submission_note)
                VALUES (?, ?, ?, CURRENT_DATE, ?)
                """,
                (assignment_id, student_id, new_status, submission_note),
            )
        conn.commit()
        flash("Assignment status updated.", "success")

    data = get_student_summary(conn, student_id)
    conn.close()
    return render_template("assignments.html", **data)


@app.route("/goals", methods=["GET", "POST"])
@login_required
def goals():
    student_id = session["user_id"]
    conn = get_db_connection()

    if request.method == "POST":
        action = request.form.get("action", "create")
        if action == "create":
            title = request.form.get("title", "").strip()
            goal_type = request.form.get("goal_type", "Weekly")
            target_hours = float(request.form.get("target_hours", 5))
            target_date = request.form.get("target_date", "2026-11-15")
            if title:
                conn.execute(
                    """
                    INSERT INTO Study_Goals (student_id, title, goal_type, target_hours, completed_hours, target_date, is_completed)
                    VALUES (?, ?, ?, ?, 0, ?, 0)
                    """,
                    (student_id, title, goal_type, target_hours, target_date),
                )
                conn.commit()
                flash("New study goal added.", "success")
        elif action == "toggle":
            goal_id = int(request.form.get("goal_id"))
            goal = conn.execute(
                "SELECT * FROM Study_Goals WHERE id = ? AND student_id = ?",
                (goal_id, student_id),
            ).fetchone()
            if goal:
                new_done = 0 if goal["is_completed"] == 1 else 1
                new_hours = goal["target_hours"] if new_done == 1 else goal["completed_hours"]
                conn.execute(
                    "UPDATE Study_Goals SET is_completed = ?, completed_hours = ? WHERE id = ?",
                    (new_done, new_hours, goal_id),
                )
                conn.commit()
                flash("Study goal status updated.", "success")
        elif action == "delete":
            goal_id = int(request.form.get("goal_id"))
            conn.execute(
                "DELETE FROM Study_Goals WHERE id = ? AND student_id = ?",
                (goal_id, student_id),
            )
            conn.commit()
            flash("Study goal removed.", "info")

    data = get_student_summary(conn, student_id)
    conn.close()
    return render_template("goals.html", **data)


@app.route("/reports")
@login_required
def reports():
    student_id = request.args.get("student_id", session["user_id"], type=int)
    conn = get_db_connection()
    data = get_student_summary(conn, student_id)
    conn.close()
    return render_template("reports.html", **data)


@app.route("/admin", methods=["GET", "POST"])
@admin_required
def admin_dashboard():
    conn = get_db_connection()

    if request.method == "POST":
        form_type = request.form.get("form_type")

        if form_type == "add_student":
            roll_no = request.form.get("roll_no", "").strip()
            full_name = request.form.get("full_name", "").strip()
            email = request.form.get("email", "").strip()
            department = request.form.get("department", "Computer Science & Engineering")
            semester = int(request.form.get("semester", 5))
            phone = request.form.get("phone", "").strip()
            password = request.form.get("password", "student123")
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO Students (roll_no, full_name, email, password_hash, department, semester, phone)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (roll_no, full_name, email, generate_password_hash(password), department, semester, phone),
            )
            new_stu_id = cursor.lastrowid
            for sub in conn.execute("SELECT id FROM Subjects").fetchall():
                conn.execute(
                    "INSERT INTO Attendance (student_id, subject_id, classes_attended, classes_conducted) VALUES (?, ?, 0, 0)",
                    (new_stu_id, sub["id"]),
                )
            conn.commit()
            flash(f"Student {full_name} added successfully.", "success")

        elif form_type == "delete_student":
            stu_id = int(request.form.get("student_id"))
            conn.execute("DELETE FROM Students WHERE id = ?", (stu_id,))
            conn.commit()
            flash("Student record deleted.", "info")

        elif form_type == "add_subject":
            subject_code = request.form.get("subject_code", "").strip()
            subject_name = request.form.get("subject_name", "").strip()
            credits = int(request.form.get("credits", 4))
            semester = int(request.form.get("semester", 5))
            instructor = request.form.get("instructor", "").strip()
            conn.execute(
                """
                INSERT INTO Subjects (subject_code, subject_name, credits, semester, instructor)
                VALUES (?, ?, ?, ?, ?)
                """,
                (subject_code, subject_name, credits, semester, instructor),
            )
            conn.commit()
            flash(f"Subject {subject_code} added.", "success")

        elif form_type == "update_attendance":
            stu_id = int(request.form.get("student_id"))
            sub_id = int(request.form.get("subject_id"))
            attended = int(request.form.get("classes_attended", 0))
            conducted = int(request.form.get("classes_conducted", 0))
            conn.execute(
                """
                INSERT INTO Attendance (student_id, subject_id, classes_attended, classes_conducted, last_updated)
                VALUES (?, ?, ?, ?, CURRENT_DATE)
                ON CONFLICT(student_id, subject_id)
                DO UPDATE SET classes_attended = excluded.classes_attended,
                              classes_conducted = excluded.classes_conducted,
                              last_updated = CURRENT_DATE
                """,
                (stu_id, sub_id, attended, conducted),
            )
            conn.commit()
            flash("Attendance updated.", "success")

        elif form_type == "add_exam":
            stu_id = int(request.form.get("student_id"))
            sub_id = int(request.form.get("subject_id"))
            exam_type = request.form.get("exam_type", "Midterm Exam")
            marks = float(request.form.get("marks_obtained", 0))
            max_marks = float(request.form.get("max_marks", 100))
            remarks = request.form.get("remarks", "")
            conn.execute(
                """
                INSERT INTO Examination (student_id, subject_id, exam_type, marks_obtained, max_marks, remarks)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (stu_id, sub_id, exam_type, marks, max_marks, remarks),
            )
            conn.commit()
            flash("Examination marks recorded.", "success")

        elif form_type == "add_assignment":
            sub_id = int(request.form.get("subject_id"))
            title = request.form.get("title", "").strip()
            description = request.form.get("description", "").strip()
            due_date = request.form.get("due_date", "2026-11-25")
            max_marks = int(request.form.get("max_marks", 25))
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO Assignments (subject_id, title, description, due_date, max_marks)
                VALUES (?, ?, ?, ?, ?)
                """,
                (sub_id, title, description, due_date, max_marks),
            )
            asg_id = cursor.lastrowid
            for stu in conn.execute("SELECT id FROM Students").fetchall():
                conn.execute(
                    "INSERT INTO Assignment_Submissions (assignment_id, student_id, status) VALUES (?, ?, 'Pending')",
                    (asg_id, stu["id"]),
                )
            conn.commit()
            flash("Assignment published to all students.", "success")

    students = conn.execute("SELECT * FROM Students ORDER BY roll_no").fetchall()
    subjects = conn.execute("SELECT * FROM Subjects ORDER BY subject_code").fetchall()
    assignments = conn.execute(
        """
        SELECT a.*, s.subject_code, s.subject_name
        FROM Assignments a
        JOIN Subjects s ON a.subject_id = s.id
        ORDER BY a.due_date ASC
        """
    ).fetchall()

    student_summaries = [get_student_summary(conn, s["id"]) for s in students]
    conn.close()

    return render_template(
        "admin.html",
        students=students,
        subjects=subjects,
        assignments=assignments,
        student_summaries=student_summaries,
    )


@app.route("/api/chart-data/<int:student_id>")
def chart_data(student_id):
    conn = get_db_connection()
    summary = get_student_summary(conn, student_id)
    conn.close()

    subject_labels = [r["subject_code"] for r in summary["attendance_rows"]]
    attendance_percentages = [
        round((r["classes_attended"] / r["classes_conducted"]) * 100, 1)
        if r["classes_conducted"] > 0
        else 0
        for r in summary["attendance_rows"]
    ]

    exam_labels = [
        f"{r['subject_code']} ({r['exam_type']})" for r in summary["exam_rows"]
    ]
    exam_percentages = [
        round((r["marks_obtained"] / r["max_marks"]) * 100, 1)
        if r["max_marks"] > 0
        else 0
        for r in summary["exam_rows"]
    ]

    return jsonify(
        {
            "subject_labels": subject_labels,
            "attendance_percentages": attendance_percentages,
            "exam_labels": exam_labels,
            "exam_percentages": exam_percentages,
            "completed_assignments": summary["completed_assignments"],
            "pending_assignments": summary["pending_assignments"],
            "overall_performance": summary["overall_performance"],
        }
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
