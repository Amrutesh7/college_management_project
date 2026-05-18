from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "College Management Backend Running"

@app.route('/departments', methods=['GET'])
def get_departments():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = "SELECT * FROM departments"

        cursor.execute(query)

        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route('/departments', methods=['POST'])
def add_department():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/departments/<int:department_id>', methods=['PUT'])
def update_department(department_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()
@app.route('/students', methods=['GET'])
def get_students():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT
            s.student_id,
            CONCAT(s.first_name, ' ', s.last_name) AS name,
            d.department_name AS department,
            s.semester,
            s.cgpa,
            s.status
            FROM students s
            JOIN departments d
            ON s.department_id = d.department_id """

        cursor.execute(query)

        students = cursor.fetchall()

        return jsonify(students)

    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/students', methods=['POST'])
def add_student():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        DELETE FROM students
        WHERE student_id = %s
        """

        cursor.execute(query, (student_id,))

        db.commit()

        return jsonify({
            "message": "Student deleted successfully"
        })

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/student-courses', methods=['GET'])
def get_student_courses():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/faculty-courses', methods=['GET'])
def faculty_courses():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/faculty', methods=['GET'])
def get_faculty():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """ SELECT
                f.faculty_id,

                CONCAT(f.first_name, ' ', f.last_name) AS name,

                d.department_name AS department,

                GROUP_CONCAT(c.course_name SEPARATOR ', ') AS courses

                FROM faculty f

                JOIN departments d
                ON f.department_id = d.department_id

                LEFT JOIN courses c
                ON f.faculty_id = c.faculty_id

                GROUP BY f.faculty_id """

        cursor.execute(query)

        faculty = cursor.fetchall()

        return jsonify(faculty)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:  
            db.close()
@app.route('/faculty', methods=['POST'])
def add_faculty():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/faculty/<int:faculty_id>', methods=['PUT'])
def update_faculty(faculty_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/faculty/<int:faculty_id>', methods=['DELETE'])
def delete_faculty(faculty_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        DELETE FROM faculty
        WHERE faculty_id = %s
        """

        cursor.execute(query, (faculty_id,))

        db.commit()

        return jsonify({
            "message": "Faculty deleted successfully"
        })

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()
@app.route('/courses', methods=['GET'])
def get_courses():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT
                c.course_id,
                c.course_code,
                c.course_name,
                c.course_type,
                c.credits,
                c.semester,
                c.department_id,
                d.department_name,
                c.faculty_id

            FROM courses c

            LEFT JOIN departments d
            ON c.department_id = d.department_id
            """

        cursor.execute(query)

        courses = cursor.fetchall()

        return jsonify(courses)

    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()
@app.route('/courses', methods=['POST'])
def add_course():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        DELETE FROM courses
        WHERE course_id = %s
        """

        cursor.execute(query, (course_id,))

        db.commit()

        return jsonify({
            "message": "Course deleted successfully"
        })

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/enrollments', methods=['GET'])
def get_enrollments():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        print(e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/enrollments', methods=['POST'])
def add_enrollment():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/enrollments/<int:enrollment_id>', methods=['DELETE'])
def delete_enrollment(enrollment_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        DELETE FROM enrollments
        WHERE enrollment_id = %s
        """

        cursor.execute(query, (enrollment_id,))

        db.commit()

        return jsonify({
            "message": "Enrollment deleted successfully"
        })

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/attendance', methods=['GET'])
def get_attendance():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
                SELECT
                    s.student_id,

                    CONCAT(s.first_name, ' ', s.last_name) AS student_name,

                    c.course_name,

                    SUM(
                        CASE
                            WHEN a.status IN ('Present', 'Late')
                            THEN 1
                            ELSE 0
                        END
                    ) AS classes_attended,

                    COUNT(*) AS total_classes,

                    ROUND(
                        (
                            SUM(
                                CASE
                                    WHEN a.status IN ('Present', 'Late')
                                    THEN 1
                                    ELSE 0
                                END
                            ) * 100.0
                        ) / COUNT(*),
                        1
                    ) AS attendance_percentage

                FROM attendance a

                JOIN students s
                    ON a.student_id = s.student_id

                JOIN courses c
                    ON a.course_id = c.course_id

                GROUP BY s.student_id, c.course_name
                """

        cursor.execute(query)

        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/attendance', methods=['POST'])
def add_attendance():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/attendance/<int:attendance_id>', methods=['PUT'])
def update_attendance(attendance_id):

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/results', methods=['GET'])
def get_results():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/results', methods=['POST'])
def add_result():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/results/<int:result_id>', methods=['PUT'])
def update_result(result_id):

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()  
        if db:
            db.close()

@app.route('/audit-logs', methods=['GET'])
def get_audit_logs():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT * FROM audit_logs
        ORDER BY action_time DESC
        """

        cursor.execute(query)

        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/student-results', methods=['GET'])
def student_results():

    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/topper', methods=['GET'])
def topper():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT
        s.student_id,
        s.first_name,
        s.last_name,
        d.department_name AS department,
        ROUND(AVG(r.total_marks), 2) AS cgpa

    FROM results r

    JOIN students s
        ON r.student_id = s.student_id

    JOIN departments d
        ON s.department_id = d.department_id

    GROUP BY
        s.student_id,
        s.first_name,
        s.last_name,
        d.department_name

    ORDER BY cgpa DESC

    LIMIT 1
        """

        cursor.execute(query)

        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/attendance-percentage', methods=['GET'])
def attendance_percentage():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT
            s.student_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
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

    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/department-stats', methods=['GET'])
def department_stats():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/result-analytics', methods=['GET'])
def result_analytics():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/faculty-workload', methods=['GET'])
def faculty_workload():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/student-profile/<int:student_id>', methods=['GET'])
def student_profile(student_id):

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # STUDENT DETAILS
        student_query = """
        SELECT
            s.student_id,
            CONCAT(s.first_name, ' ', s.last_name) AS name,
            s.semester,
            s.cgpa,
            s.status,
            d.department_name AS department

        FROM students s

        JOIN departments d
            ON s.department_id = d.department_id

        WHERE s.student_id = %s
        """

        cursor.execute(student_query, (student_id,))
        student = cursor.fetchone()

        # COURSES + RESULTS
        course_query = """
        SELECT
            c.course_name,
            r.total_marks,
            r.grade

        FROM results r

        JOIN courses c
            ON r.course_id = c.course_id

        WHERE r.student_id = %s
        """

        cursor.execute(course_query, (student_id,))
        courses = cursor.fetchall()

        # ATTENDANCE
        attendance_query = """
        SELECT
            ROUND(
                COUNT(
                    CASE
                        WHEN status = 'Present'
                        THEN 1
                    END
                ) * 100.0 / COUNT(*),
                2
            ) AS attendance_percentage

        FROM attendance

        WHERE student_id = %s
        """

        cursor.execute(attendance_query, (student_id,))
        attendance = cursor.fetchone()

        return jsonify({
            "student": student,
            "courses": courses,
            "attendance": attendance
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route('/low-attendance', methods=['GET'])
def low_attendance():

    cursor = None

    try:

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if db:
            db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

