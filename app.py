from flask import Flask, jsonify, request
from db import db, cursor
app = Flask(__name__)

@app.route('/')
def home():
    return "College Management Backend Running"

@app.route('/departments', methods=['GET'])
def get_departments():

    query = "SELECT * FROM departments"

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/departments', methods=['POST'])
def add_department():

    data = request.json

    query = """
    INSERT INTO departments
    (
        department_name,
        hod_name,
        department_email,
        office_phone
    )
    VALUES
    (%s, %s, %s, %s)
    """

    values = (
        data['department_name'],
        data['hod_name'],
        data['department_email'],
        data['office_phone']
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Department added successfully"
    })

@app.route('/departments/<int:department_id>', methods=['PUT'])
def update_department(department_id):

    data = request.json

    query = """
    UPDATE departments
    SET
        hod_name = %s,
        office_phone = %s
    WHERE department_id = %s
    """

    values = (
        data['hod_name'],
        data['office_phone'],
        department_id
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Department updated successfully"
    })

@app.route('/students', methods=['GET'])
def get_students():

    query = "SELECT * FROM students"

    cursor.execute(query)

    students = cursor.fetchall()

    return jsonify(students)

@app.route('/students', methods=['POST'])
def add_student():

    data = request.json

    query = """
    INSERT INTO students
    (
        first_name,
        last_name,
        gender,
        date_of_birth,
        email,
        phone,
        address,
        admission_year,
        semester,
        cgpa,
        status,
        department_id
    )
    VALUES
    (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        data['first_name'],
        data['last_name'],
        data['gender'],
        data['date_of_birth'],
        data['email'],
        data['phone'],
        data['address'],
        data['admission_year'],
        data['semester'],
        data['cgpa'],
        data['status'],
        data['department_id']
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Student added successfully"
    })

@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):

    data = request.json

    query = """
    UPDATE students
    SET
        first_name = %s,
        last_name = %s,
        email = %s,
        phone = %s,
        semester = %s,
        cgpa = %s
    WHERE student_id = %s
    """

    values = (
        data['first_name'],
        data['last_name'],
        data['email'],
        data['phone'],
        data['semester'],
        data['cgpa'],
        student_id
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Student updated successfully"
    })

@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):

    query = """
    DELETE FROM students
    WHERE student_id = %s
    """

    cursor.execute(query, (student_id,))

    db.commit()

    return jsonify({
        "message": "Student deleted successfully"
    })

@app.route('/student-courses', methods=['GET'])
def get_student_courses():

    query = """
    SELECT
        s.student_id,
        s.first_name,
        s.last_name,
        c.course_name,
        c.course_code
    FROM enrollments e
    JOIN students s
        ON e.student_id = s.student_id
    JOIN courses c
        ON e.course_id = c.course_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/faculty-courses', methods=['GET'])
def faculty_courses():

    query = """
    SELECT
        f.faculty_id,
        f.first_name,
        f.last_name,
        c.course_name,
        c.course_code
    FROM faculty f
    JOIN courses c
        ON f.faculty_id = c.faculty_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/faculty', methods=['GET'])
def get_faculty():

    query = "SELECT * FROM faculty"

    cursor.execute(query)

    faculty = cursor.fetchall()

    return jsonify(faculty)

@app.route('/faculty', methods=['POST'])
def add_faculty():

    data = request.json

    query = """
    INSERT INTO faculty
    (
        first_name,
        last_name,
        email,
        phone,
        designation,
        salary,
        joining_date,
        department_id
    )
    VALUES
    (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        data['first_name'],
        data['last_name'],
        data['email'],
        data['phone'],
        data['designation'],
        data['salary'],
        data['joining_date'],
        data['department_id']
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Faculty added successfully"
    })

@app.route('/faculty/<int:faculty_id>', methods=['PUT'])
def update_faculty(faculty_id):

    data = request.json

    query = """
    UPDATE faculty
    SET
        first_name = %s,
        last_name = %s,
        designation = %s,
        salary = %s
    WHERE faculty_id = %s
    """

    values = (
        data['first_name'],
        data['last_name'],
        data['designation'],
        data['salary'],
        faculty_id
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Faculty updated successfully"
    })

@app.route('/faculty/<int:faculty_id>', methods=['DELETE'])
def delete_faculty(faculty_id):

    query = """
    DELETE FROM faculty
    WHERE faculty_id = %s
    """

    cursor.execute(query, (faculty_id,))

    db.commit()

    return jsonify({
        "message": "Faculty deleted successfully"
    })

@app.route('/courses', methods=['GET'])
def get_courses():

    query = "SELECT * FROM courses"

    cursor.execute(query)

    courses = cursor.fetchall()

    return jsonify(courses)

@app.route('/courses', methods=['POST'])
def add_course():

    data = request.json

    query = """
    INSERT INTO courses
    (
        course_code,
        course_name,
        credits,
        semester,
        course_type,
        department_id,
        faculty_id
    )
    VALUES
    (%s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        data['course_code'],
        data['course_name'],
        data['credits'],
        data['semester'],
        data['course_type'],
        data['department_id'],
        data['faculty_id']
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Course added successfully"
    })

@app.route('/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):

    data = request.json

    query = """
    UPDATE courses
    SET
        course_name = %s,
        credits = %s,
        semester = %s,
        faculty_id = %s
    WHERE course_id = %s
    """

    values = (
        data['course_name'],
        data['credits'],
        data['semester'],
        data['faculty_id'],
        course_id
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Course updated successfully"
    })

@app.route('/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):

    query = """
    DELETE FROM courses
    WHERE course_id = %s
    """

    cursor.execute(query, (course_id,))

    db.commit()

    return jsonify({
        "message": "Course deleted successfully"
    })

@app.route('/enrollments', methods=['GET'])
def get_enrollments():

    query = """
    SELECT
        e.enrollment_id,
        s.first_name,
        c.course_name,
        e.academic_year
    FROM enrollments e
    JOIN students s
        ON e.student_id = s.student_id
    JOIN courses c
        ON e.course_id = c.course_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/enrollments', methods=['POST'])
def add_enrollment():

    data = request.json

    query = """
    INSERT INTO enrollments
    (
        student_id,
        course_id,
        academic_year,
        semester
    )
    VALUES
    (%s, %s, %s, %s)
    """

    values = (
        data['student_id'],
        data['course_id'],
        data['academic_year'],
        data['semester']
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Enrollment added successfully"
    })

@app.route('/enrollments/<int:enrollment_id>', methods=['DELETE'])
def delete_enrollment(enrollment_id):

    query = """
    DELETE FROM enrollments
    WHERE enrollment_id = %s
    """

    cursor.execute(query, (enrollment_id,))

    db.commit()

    return jsonify({
        "message": "Enrollment deleted successfully"
    })

@app.route('/attendance', methods=['GET'])
def get_attendance():

    query = """
    SELECT
        a.attendance_id,
        s.first_name,
        s.last_name,
        c.course_name,
        a.attendance_date,
        a.status,
        a.remarks
    FROM attendance a
    JOIN students s
        ON a.student_id = s.student_id
    JOIN courses c
        ON a.course_id = c.course_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/attendance', methods=['POST'])
def add_attendance():

    data = request.json

    query = """
    INSERT INTO attendance
    (
        student_id,
        course_id,
        attendance_date,
        status,
        remarks
    )
    VALUES
    (%s, %s, %s, %s, %s)
    """

    values = (
        data['student_id'],
        data['course_id'],
        data['attendance_date'],
        data['status'],
        data['remarks']
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Attendance added successfully"
    })

@app.route('/attendance/<int:attendance_id>', methods=['PUT'])
def update_attendance(attendance_id):

    data = request.json

    query = """
    UPDATE attendance
    SET
        status = %s,
        remarks = %s
    WHERE attendance_id = %s
    """

    values = (
        data['status'],
        data['remarks'],
        attendance_id
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Attendance updated successfully"
    })

@app.route('/results', methods=['GET'])
def get_results():

    query = """
    SELECT
        r.result_id,
        s.first_name,
        s.last_name,
        c.course_name,
        r.internal_marks,
        r.external_marks,
        r.total_marks,
        r.grade,
        r.result_status
    FROM results r
    JOIN students s
        ON r.student_id = s.student_id
    JOIN courses c
        ON r.course_id = c.course_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/results', methods=['POST'])
def add_result():

    data = request.json

    query = """
    INSERT INTO results
    (
        student_id,
        course_id,
        internal_marks,
        external_marks,
        result_status
    )
    VALUES
    (%s, %s, %s, %s, %s)
    """

    values = (
        data['student_id'],
        data['course_id'],
        data['internal_marks'],
        data['external_marks'],
        data['result_status']
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Result added successfully"
    })

@app.route('/results/<int:result_id>', methods=['PUT'])
def update_result(result_id):

    data = request.json

    query = """
    UPDATE results
    SET
        internal_marks = %s,
        external_marks = %s,
        result_status = %s
    WHERE result_id = %s
    """

    values = (
        data['internal_marks'],
        data['external_marks'],
        data['result_status'],
        result_id
    )

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Result updated successfully"
    })

@app.route('/audit-logs', methods=['GET'])
def get_audit_logs():

    query = """
    SELECT * FROM audit_logs
    ORDER BY action_time DESC
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)


@app.route('/student-results', methods=['GET'])
def student_results():

    query = """
    SELECT
        s.first_name,
        s.last_name,
        c.course_name,
        r.internal_marks,
        r.external_marks,
        r.total_marks,
        r.grade
    FROM results r
    JOIN students s
        ON r.student_id = s.student_id
    JOIN courses c
        ON r.course_id = c.course_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)


@app.route('/topper', methods=['GET'])
def topper():

    query = """
    SELECT
        s.first_name,
        s.last_name,
        ROUND(AVG(r.total_marks), 2) AS average_marks

    FROM results r

    JOIN students s
        ON r.student_id = s.student_id

    GROUP BY s.student_id

    ORDER BY average_marks DESC

    LIMIT 1
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)


@app.route('/attendance-percentage', methods=['GET'])
def attendance_percentage():

    query = """
    SELECT
        s.student_id,
        s.first_name,
        ROUND(
            COUNT(
                CASE
                    WHEN a.status = 'Present'
                    THEN 1
                END
            ) * 100.0 / COUNT(*),
            2
        ) AS attendance_percentage

    FROM attendance a

    JOIN students s
        ON a.student_id = s.student_id

    GROUP BY s.student_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/department-stats', methods=['GET'])
def department_stats():

    query = """
    SELECT
        d.department_name,
        COUNT(s.student_id) AS total_students

    FROM departments d

    LEFT JOIN students s
        ON d.department_id = s.department_id

    GROUP BY d.department_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/result-analytics', methods=['GET'])
def result_analytics():

    query = """
    SELECT
        result_status,
        COUNT(*) AS total

    FROM results

    GROUP BY result_status
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/faculty-workload', methods=['GET'])
def faculty_workload():

    query = """
    SELECT
        f.first_name,
        f.last_name,
        COUNT(c.course_id) AS total_courses

    FROM faculty f

    LEFT JOIN courses c
        ON f.faculty_id = c.faculty_id

    GROUP BY f.faculty_id
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/student-profile/<int:student_id>', methods=['GET'])
def student_profile(student_id):

    query = """
    SELECT
        s.first_name,
        s.last_name,
        d.department_name,
        c.course_name,
        r.total_marks,
        r.grade

    FROM students s

    JOIN departments d
        ON s.department_id = d.department_id

    LEFT JOIN results r
        ON s.student_id = r.student_id

    LEFT JOIN courses c
        ON r.course_id = c.course_id

    WHERE s.student_id = %s
    """

    cursor.execute(query, (student_id,))

    data = cursor.fetchall()

    return jsonify(data)

@app.route('/low-attendance', methods=['GET'])
def low_attendance():

    query = """
    SELECT
        s.first_name,
        ROUND(
            COUNT(
                CASE
                    WHEN a.status = 'Present'
                    THEN 1
                END
            ) * 100.0 / COUNT(*),
            2
        ) AS attendance_percentage

    FROM attendance a

    JOIN students s
        ON a.student_id = s.student_id

    GROUP BY s.student_id

    HAVING attendance_percentage < 75
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

