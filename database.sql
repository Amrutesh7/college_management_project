create database college_management_system;
use college_management_system;

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    hod_name VARCHAR(100),
    department_email VARCHAR(100) UNIQUE,
    office_phone VARCHAR(15)
);

CREATE TABLE faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) UNIQUE,
    designation VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2),
    joining_date DATE,
    department_id INT,
    
    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) UNIQUE,
    address TEXT,
    admission_year YEAR,
    semester INT CHECK (semester BETWEEN 1 AND 8),
    cgpa DECIMAL(3,2) CHECK (cgpa BETWEEN 0 AND 10),
    status VARCHAR(20) DEFAULT 'Active',
    department_id INT,

    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    credits INT CHECK (credits BETWEEN 1 AND 6),
    semester INT CHECK (semester BETWEEN 1 AND 8),
    course_type ENUM('Theory', 'Lab'),
    department_id INT,
    faculty_id INT,

    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

    FOREIGN KEY (faculty_id)
    REFERENCES faculty(faculty_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    academic_year VARCHAR(20),
    semester INT CHECK (semester BETWEEN 1 AND 8),

    FOREIGN KEY (student_id)
    REFERENCES students(student_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    FOREIGN KEY (course_id)
    REFERENCES courses(course_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    remarks VARCHAR(255),

    FOREIGN KEY (student_id)
    REFERENCES students(student_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    FOREIGN KEY (course_id)
    REFERENCES courses(course_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    internal_marks DECIMAL(5,2),
    external_marks DECIMAL(5,2),
    total_marks DECIMAL(5,2),
    grade CHAR(2),
    result_status VARCHAR(20),

    FOREIGN KEY (student_id)
    REFERENCES students(student_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    FOREIGN KEY (course_id)
    REFERENCES courses(course_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50),
    action_type VARCHAR(20),
    record_id INT,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO departments 
(department_name, hod_name, department_email, office_phone)
VALUES
('Computer Science', 'Dr. Sharma', 'cse@college.com', '9876543210'),
('Electronics', 'Dr. Rao', 'ece@college.com', '9876543211');

INSERT INTO faculty
(first_name, last_name, email, phone, designation, salary, joining_date, department_id)
VALUES
('Amit', 'Verma', 'amit@college.com', '9991112222',
 'Professor', 85000, '2020-06-15', 1);
 
INSERT INTO students
(first_name, last_name, gender, date_of_birth, email,
 phone, address, admission_year, semester, cgpa,
 status, department_id)
VALUES
('Rahul', 'Kumar', 'Male', '2004-05-12',
 'rahul@college.com', '8887776666',
 'Bangalore', 2023, 3, 8.5,
 'Active', 1);
 
 INSERT INTO courses
(course_code, course_name, credits, semester,
 course_type, department_id, faculty_id)
VALUES
('CS301', 'Database Management System',
 4, 3, 'Theory', 1, 1);
 
 INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES
(1, 1, '2025-2026', 3);

INSERT INTO attendance
(student_id, course_id, attendance_date, status, remarks)
VALUES
(1, 1, '2026-05-12', 'Present', 'On time');

INSERT INTO results
(student_id, course_id, internal_marks, external_marks, result_status)
VALUES
(1, 1, 28, 55, 'Pass');

SELECT * FROM students;
SELECT * FROM courses;
SELECT * FROM enrollments;
SELECT * FROM results;

SELECT 
    s.first_name,
    s.last_name,
    d.department_name
FROM students s
JOIN departments d
ON s.department_id = d.department_id;

SELECT 
    s.first_name,
    c.course_name
FROM enrollments e
JOIN students s
ON e.student_id = s.student_id
JOIN courses c
ON e.course_id = c.course_id;

SELECT
    f.first_name,
    c.course_name
FROM faculty f
JOIN courses c
ON f.faculty_id = c.faculty_id;

DELIMITER $$

CREATE TRIGGER before_result_insert
BEFORE INSERT ON results
FOR EACH ROW
BEGIN

    -- Calculate total marks
    SET NEW.total_marks = 
        NEW.internal_marks + NEW.external_marks;

    -- Assign grade
    IF NEW.total_marks >= 90 THEN
        SET NEW.grade = 'A';

    ELSEIF NEW.total_marks >= 75 THEN
        SET NEW.grade = 'B';

    ELSEIF NEW.total_marks >= 60 THEN
        SET NEW.grade = 'C';

    ELSE
        SET NEW.grade = 'F';

    END IF;

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER before_result_update
BEFORE UPDATE ON results
FOR EACH ROW
BEGIN

    -- Recalculate total
    SET NEW.total_marks =
        NEW.internal_marks + NEW.external_marks;

    -- Reassign grade
    IF NEW.total_marks >= 90 THEN
        SET NEW.grade = 'A';

    ELSEIF NEW.total_marks >= 75 THEN
        SET NEW.grade = 'B';

    ELSEIF NEW.total_marks >= 60 THEN
        SET NEW.grade = 'C';

    ELSE
        SET NEW.grade = 'F';

    END IF;

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_student_delete
AFTER DELETE ON students
FOR EACH ROW
BEGIN

    INSERT INTO audit_logs
    (table_name, action_type, record_id, description)

    VALUES
    (
        'students',
        'DELETE',
        OLD.student_id,
        CONCAT('Student deleted: ', OLD.first_name, ' ', OLD.last_name)
    );

END$$

DELIMITER ;

INSERT INTO results
(student_id, course_id, internal_marks, external_marks, result_status)
VALUES
(1, 1, 35, 50, 'Pass');

select *from results;

UPDATE results
SET internal_marks = 45,
    external_marks = 48
WHERE result_id = 1;

DELETE FROM students
WHERE student_id = 1;

select *from audit_logs;
select*from faculty;
 
INSERT INTO departments
(department_name, hod_name, department_email, office_phone)
VALUES

('Computer Science Engineering', 'Dr. Anil Kumar', 'cse@college.edu', '9876501001'),

('Artificial Intelligence & Machine Learning', 'Dr. Priya Sharma', 'aiml@college.edu', '9876501002'),

('Electronics & Communication Engineering', 'Dr. Ravi Verma', 'ece@college.edu', '9876501003'),

('Mechanical Engineering', 'Dr. Sandeep Rao', 'mech@college.edu', '9876501004'),

('Civil Engineering', 'Dr. Meena Joshi', 'civil@college.edu', '9876501005'),

('Information Science Engineering', 'Dr. Karthik Reddy', 'ise@college.edu', '9876501006');

SET SQL_SAFE_UPDATES = 0;
DELETE FROM courses;
ALTER TABLE courses AUTO_INCREMENT = 1;

INSERT INTO faculty
(first_name, last_name, email, phone,
 designation, salary, joining_date, department_id)
VALUES

-- CSE
('Anil', 'Kumar', 'anil.kumar@college.edu', '9000000001',
 'HOD', 150000, '2015-06-10', 1),

('Sneha', 'Patil', 'sneha.patil@college.edu', '9000000002',
 'Professor', 120000, '2017-08-12', 1),

('Rahul', 'Mehta', 'rahul.mehta@college.edu', '9000000003',
 'Assistant Professor', 75000, '2021-01-15', 1),

-- AIML
('Priya', 'Sharma', 'priya.sharma@college.edu', '9000000004',
 'HOD', 155000, '2014-04-18', 2),

('Arjun', 'Reddy', 'arjun.reddy@college.edu', '9000000005',
 'Associate Professor', 95000, '2019-07-20', 2),

('Neha', 'Kapoor', 'neha.kapoor@college.edu', '9000000006',
 'Assistant Professor', 78000, '2022-02-10', 2),

-- ECE
('Ravi', 'Verma', 'ravi.verma@college.edu', '9000000007',
 'HOD', 145000, '2013-09-15', 3),

('Pooja', 'Nair', 'pooja.nair@college.edu', '9000000008',
 'Professor', 115000, '2018-11-11', 3),

-- MECH
('Sandeep', 'Rao', 'sandeep.rao@college.edu', '9000000009',
 'HOD', 148000, '2012-05-25', 4),

('Vikram', 'Singh', 'vikram.singh@college.edu', '9000000010',
 'Assistant Professor', 72000, '2021-03-14', 4),

-- CIVIL
('Meena', 'Joshi', 'meena.joshi@college.edu', '9000000011',
 'HOD', 142000, '2011-12-19', 5),

('Aakash', 'Iyer', 'aakash.iyer@college.edu', '9000000012',
 'Associate Professor', 92000, '2019-06-17', 5),

-- ISE
('Karthik', 'Reddy', 'karthik.reddy@college.edu', '9000000013',
 'HOD', 152000, '2014-10-05', 6),

('Divya', 'Menon', 'divya.menon@college.edu', '9000000014',
 'Professor', 118000, '2018-01-22', 6);
 
 select *from faculty;
 
 INSERT INTO courses
(course_code, course_name, credits,
 semester, course_type,
 department_id, faculty_id)
VALUES

-- CSE
('CS301', 'Database Management System', 4, 3,
 'Theory', 1, 1),

('CS302', 'Operating Systems', 4, 4,
 'Theory', 1, 2),

('CS303', 'Computer Networks', 4, 5,
 'Theory', 1, 3),

('CS304', 'Data Structures', 4, 2,
 'Theory', 1, 2),

-- AIML
('AI301', 'Machine Learning', 4, 5,
 'Theory', 2, 4),

('AI302', 'Deep Learning', 4, 6,
 'Theory', 2, 5),

('AI303', 'Natural Language Processing', 4, 7,
 'Theory', 2, 6),

-- ECE
('EC301', 'Digital Electronics', 4, 3,
 'Theory', 3, 7),

('EC302', 'Embedded Systems', 4, 5,
 'Theory', 3, 8),

-- MECH
('ME301', 'Thermodynamics', 4, 3,
 'Theory', 4, 9),

('ME302', 'Fluid Mechanics', 4, 4,
 'Theory', 4, 10),

-- CIVIL
('CV301', 'Structural Analysis', 4, 4,
 'Theory', 5, 11),

('CV302', 'Surveying', 3, 3,
 'Theory', 5, 12),

-- ISE
('IS301', 'Cloud Computing', 4, 5,
 'Theory', 6, 13),

('IS302', 'Cyber Security', 4, 6,
 'Theory', 6, 14);
 
 select * from courses;
 
 SELECT
    c.course_name,
    d.department_name,
    f.first_name,
    f.designation
FROM courses c
JOIN departments d
    ON c.department_id = d.department_id
JOIN faculty f
    ON c.faculty_id = f.faculty_id;

-- all are CSE students 
INSERT INTO students
(first_name, last_name, gender, date_of_birth,
 email, phone, address,
 admission_year, semester,
 cgpa, status, department_id)
VALUES

('Rahul', 'Kumar', 'Male', '2004-05-12',
 'rahul.kumar@college.edu', '9100000001',
 'Bangalore', 2023, 3,
 8.5, 'Active', 1),

('Sneha', 'Reddy', 'Female', '2003-11-20',
 'sneha.reddy@college.edu', '9100000002',
 'Mysore', 2022, 5,
 9.1, 'Active', 1),

('Arjun', 'Patil', 'Male', '2004-02-14',
 'arjun.patil@college.edu', '9100000003',
 'Hubli', 2023, 4,
 7.8, 'Active', 1),

('Divya', 'Sharma', 'Female', '2005-01-10',
 'divya.sharma@college.edu', '9100000004',
 'Bangalore', 2024, 2,
 8.9, 'Active', 1),

('Karthik', 'Nair', 'Male', '2003-07-09',
 'karthik.nair@college.edu', '9100000005',
 'Mangalore', 2022, 6,
 7.2, 'Active', 1),

('Pooja', 'Iyer', 'Female', '2004-03-18',
 'pooja.iyer@college.edu', '9100000006',
 'Chennai', 2023, 3,
 8.0, 'Active', 1),

('Vikram', 'Joshi', 'Male', '2003-12-01',
 'vikram.joshi@college.edu', '9100000007',
 'Pune', 2022, 5,
 6.9, 'Active', 1),

('Neha', 'Kapoor', 'Female', '2005-04-25',
 'neha.kapoor@college.edu', '9100000008',
 'Delhi', 2024, 2,
 9.3, 'Active', 1),

('Aditya', 'Singh', 'Male', '2004-08-16',
 'aditya.singh@college.edu', '9100000009',
 'Hyderabad', 2023, 4,
 7.6, 'Active', 1),

('Meera', 'Verma', 'Female', '2003-09-28',
 'meera.verma@college.edu', '9100000010',
 'Mumbai', 2022, 6,
 8.7, 'Active', 1);
 
delete from students ;

alter table students auto_increment = 1;
select *from students;

SELECT
    first_name,
    semester,
    cgpa,
    department_id
FROM students
WHERE department_id = 1;

-- all are AIML students 
INSERT INTO students
(first_name, last_name, gender, date_of_birth,
 email, phone, address,
 admission_year, semester,
 cgpa, status, department_id)
VALUES

('Aarav', 'Shetty', 'Male', '2004-06-11',
 'aarav.shetty@college.edu', '9100000011',
 'Bangalore', 2023, 4,
 8.8, 'Active', 2),

('Riya', 'Malhotra', 'Female', '2003-10-03',
 'riya.malhotra@college.edu', '9100000012',
 'Delhi', 2022, 6,
 9.4, 'Active', 2),

('Nikhil', 'Bhat', 'Male', '2005-02-22',
 'nikhil.bhat@college.edu', '9100000013',
 'Udupi', 2024, 2,
 7.9, 'Active', 2),

('Sanjana', 'Rao', 'Female', '2004-09-15',
 'sanjana.rao@college.edu', '9100000014',
 'Mysore', 2023, 3,
 8.3, 'Active', 2),

('Harsh', 'Agarwal', 'Male', '2003-12-30',
 'harsh.agarwal@college.edu', '9100000015',
 'Mumbai', 2022, 5,
 7.1, 'Active', 2),

('Ananya', 'Kulkarni', 'Female', '2004-07-19',
 'ananya.kulkarni@college.edu', '9100000016',
 'Pune', 2023, 4,
 9.0, 'Active', 2),

('Rohit', 'Menon', 'Male', '2005-03-05',
 'rohit.menon@college.edu', '9100000017',
 'Kochi', 2024, 2,
 7.4, 'Active', 2),

('Ishita', 'Saxena', 'Female', '2003-08-08',
 'ishita.saxena@college.edu', '9100000018',
 'Noida', 2022, 6,
 8.6, 'Active', 2),

('Yash', 'Pillai', 'Male', '2004-01-17',
 'yash.pillai@college.edu', '9100000019',
 'Chennai', 2023, 5,
 8.1, 'Active', 2);
 
-- ECE students 
INSERT INTO students
(first_name, last_name, gender, date_of_birth,
 email, phone, address,
 admission_year, semester,
 cgpa, status, department_id)
VALUES

('Tejas', 'Rane', 'Male', '2004-04-10',
 'tejas.rane@college.edu', '9100000020',
 'Goa', 2023, 3,
 7.8, 'Active', 3),

('Lavanya', 'Iyer', 'Female', '2003-11-25',
 'lavanya.iyer@college.edu', '9100000021',
 'Chennai', 2022, 5,
 8.9, 'Active', 3),

('Manoj', 'Naik', 'Male', '2004-02-18',
 'manoj.naik@college.edu', '9100000022',
 'Hubli', 2023, 4,
 7.2, 'Active', 3),

('Keerthi', 'Joshi', 'Female', '2005-01-07',
 'keerthi.joshi@college.edu', '9100000023',
 'Belgaum', 2024, 2,
 8.4, 'Active', 3),

('Abhishek', 'Roy', 'Male', '2003-09-14',
 'abhishek.roy@college.edu', '9100000024',
 'Kolkata', 2022, 6,
 6.8, 'Active', 3),

('Nandini', 'Prasad', 'Female', '2004-05-29',
 'nandini.prasad@college.edu', '9100000025',
 'Bangalore', 2023, 3,
 9.2, 'Active', 3),

('Sahil', 'Deshmukh', 'Male', '2005-03-09',
 'sahil.deshmukh@college.edu', '9100000026',
 'Pune', 2024, 2,
 7.5, 'Active', 3),

('Priyanka', 'Das', 'Female', '2003-07-16',
 'priyanka.das@college.edu', '9100000027',
 'Hyderabad', 2022, 5,
 8.0, 'Active', 3);
 
 -- MECH students
 INSERT INTO students
(first_name, last_name, gender, date_of_birth,
 email, phone, address,
 admission_year, semester,
 cgpa, status, department_id)
VALUES

('Rakesh', 'Shekar', 'Male', '2004-03-11',
 'rakesh.shekar@college.edu', '9100000028',
 'Bangalore', 2023, 4,
 7.0, 'Active', 4),

('Deepak', 'Kulal', 'Male', '2003-10-22',
 'deepak.kulal@college.edu', '9100000029',
 'Mangalore', 2022, 6,
 8.2, 'Active', 4),

('Aishwarya', 'Naidu', 'Female', '2005-02-03',
 'aishwarya.naidu@college.edu', '9100000030',
 'Mysore', 2024, 2,
 8.7, 'Active', 4),

('Naveen', 'Pai', 'Male', '2004-08-27',
 'naveen.pai@college.edu', '9100000031',
 'Udupi', 2023, 3,
 6.9, 'Active', 4),

('Bhavana', 'Reddy', 'Female', '2003-06-19',
 'bhavana.reddy@college.edu', '9100000032',
 'Hyderabad', 2022, 5,
 8.5, 'Active', 4),

('Kiran', 'Mishra', 'Male', '2005-01-15',
 'kiran.mishra@college.edu', '9100000033',
 'Delhi', 2024, 2,
 7.6, 'Active', 4),

('Snehal', 'Patwardhan', 'Female', '2004-09-09',
 'snehal.patwardhan@college.edu', '9100000034',
 'Pune', 2023, 4,
 9.0, 'Active', 4);
 
-- CIVIL students 
INSERT INTO students
(first_name, last_name, gender, date_of_birth,
 email, phone, address,
 admission_year, semester,
 cgpa, status, department_id)
VALUES

('Tarun', 'Gowda', 'Male', '2004-05-21',
 'tarun.gowda@college.edu', '9100000035',
 'Mysore', 2023, 3,
 7.7, 'Active', 5),

('Shreya', 'Bose', 'Female', '2003-12-13',
 'shreya.bose@college.edu', '9100000036',
 'Kolkata', 2022, 5,
 8.8, 'Active', 5),

('Vivek', 'Sharma', 'Male', '2005-01-08',
 'vivek.sharma@college.edu', '9100000037',
 'Delhi', 2024, 2,
 6.7, 'Active', 5),

('Pallavi', 'Kulkarni', 'Female', '2004-07-17',
 'pallavi.kulkarni@college.edu', '9100000038',
 'Pune', 2023, 4,
 8.4, 'Active', 5),

('Darshan', 'Hegde', 'Male', '2003-03-14',
 'darshan.hegde@college.edu', '9100000039',
 'Udupi', 2022, 6,
 7.5, 'Active', 5),

('Ritu', 'Mohan', 'Female', '2005-04-02',
 'ritu.mohan@college.edu', '9100000040',
 'Chennai', 2024, 2,
 9.1, 'Active', 5),

('Aman', 'Verghese', 'Male', '2004-10-26',
 'aman.verghese@college.edu', '9100000041',
 'Kochi', 2023, 3,
 8.0, 'Active', 5);
 
-- ISE students 
INSERT INTO students
(first_name, last_name, gender, date_of_birth,
 email, phone, address,
 admission_year, semester,
 cgpa, status, department_id)
VALUES

('Siddharth', 'Pai', 'Male', '2004-06-28',
 'siddharth.pai@college.edu', '9100000042',
 'Bangalore', 2023, 4,
 8.6, 'Active', 6),

('Nisha', 'Kadam', 'Female', '2003-09-11',
 'nisha.kadam@college.edu', '9100000043',
 'Mumbai', 2022, 5,
 9.2, 'Active', 6),

('Pranav', 'Rao', 'Male', '2005-02-20',
 'pranav.rao@college.edu', '9100000044',
 'Mangalore', 2024, 2,
 7.3, 'Active', 6),

('Kavya', 'Srinivas', 'Female', '2004-01-31',
 'kavya.srinivas@college.edu', '9100000045',
 'Mysore', 2023, 3,
 8.7, 'Active', 6),

('Harshit', 'Malik', 'Male', '2003-11-05',
 'harshit.malik@college.edu', '9100000046',
 'Delhi', 2022, 6,
 7.8, 'Active', 6),

('Aditi', 'Bhatia', 'Female', '2004-08-13',
 'aditi.bhatia@college.edu', '9100000047',
 'Noida', 2023, 4,
 9.0, 'Active', 6),

('Rohan', 'Dixit', 'Male', '2005-03-27',
 'rohan.dixit@college.edu', '9100000048',
 'Pune', 2024, 2,
 6.9, 'Active', 6),

('Simran', 'Gill', 'Female', '2003-07-22',
 'simran.gill@college.edu', '9100000049',
 'Chandigarh', 2022, 5,
 8.3, 'Active', 6),

('Akshay', 'Kuldeep', 'Male', '2004-04-18',
 'akshay.kuldeep@college.edu', '9100000050',
 'Hyderabad', 2023, 3,
 8.1, 'Active', 6);
 
SELECT department_id, COUNT(*) AS total_students
FROM students
GROUP BY department_id;

INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

-- Semester 2 students
(4, 4, '2025-2026', 2),
(8, 4, '2025-2026', 2),

-- Semester 3 students
(1, 1, '2025-2026', 3),
(6, 1, '2025-2026', 3),

-- Semester 4 students
(3, 2, '2025-2026', 4),
(9, 2, '2025-2026', 4),

-- Semester 5 students
(2, 3, '2025-2026', 5),
(7, 3, '2025-2026', 5),

-- Semester 6 students
(5, 14, '2025-2026', 6),
(10, 15, '2025-2026', 6);

INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(13, 4, '2025-2026', 2),
(17, 4, '2025-2026', 2),

(14, 5, '2025-2026', 3),

(11, 5, '2025-2026', 4),
(16, 5, '2025-2026', 4),

(15, 6, '2025-2026', 5),
(19, 6, '2025-2026', 5),

(12, 7, '2025-2026', 6),
(18, 7, '2025-2026', 6);

INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(23, 4, '2025-2026', 2),

(26, 8, '2025-2026', 3),
(20, 8, '2025-2026', 3),

(22, 9, '2025-2026', 4),

(21, 9, '2025-2026', 5),
(27, 9, '2025-2026', 5),

(24, 15, '2025-2026', 6);

SELECT * FROM students
WHERE student_id = 24;

SELECT * FROM courses
WHERE course_id = 15;

SELECT
    student_id,
    first_name,
    department_id,
    semester
FROM students
ORDER BY student_id;

DELETE FROM enrollments;
ALTER TABLE enrollments AUTO_INCREMENT = 1;

INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(4, 4, '2025-2026', 2),
(8, 4, '2025-2026', 2),

(1, 1, '2025-2026', 3),
(6, 1, '2025-2026', 3),

(3, 2, '2025-2026', 4),
(9, 2, '2025-2026', 4),

(2, 3, '2025-2026', 5),
(7, 3, '2025-2026', 5),

(5, 15, '2025-2026', 6),
(10, 15, '2025-2026', 6);
INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(13, 4, '2025-2026', 2),
(17, 4, '2025-2026', 2),

(14, 5, '2025-2026', 3),

(11, 5, '2025-2026', 4),
(16, 5, '2025-2026', 4),

(15, 6, '2025-2026', 5),
(19, 6, '2025-2026', 5),

(12, 15, '2025-2026', 6),
(18, 15, '2025-2026', 6);
INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(41, 4, '2025-2026', 2),
(44, 8, '2025-2026', 2),

(38, 8, '2025-2026', 3),
(43, 8, '2025-2026', 3),

(40, 9, '2025-2026', 4),

(39, 9, '2025-2026', 5),
(45, 9, '2025-2026', 5),

(42, 15, '2025-2026', 6);
INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(48, 4, '2025-2026', 2),
(51, 4, '2025-2026', 2),

(49, 10, '2025-2026', 3),

(46, 11, '2025-2026', 4),
(52, 11, '2025-2026', 4),

(50, 14, '2025-2026', 5),

(47, 15, '2025-2026', 6);
INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(55, 4, '2025-2026', 2),
(58, 4, '2025-2026', 2),

(53, 13, '2025-2026', 3),
(59, 13, '2025-2026', 3),

(56, 12, '2025-2026', 4),

(54, 14, '2025-2026', 5),

(57, 15, '2025-2026', 6);
INSERT INTO enrollments
(student_id, course_id, academic_year, semester)
VALUES

(62, 4, '2025-2026', 2),
(66, 4, '2025-2026', 2),

(63, 1, '2025-2026', 3),
(68, 1, '2025-2026', 3),

(60, 2, '2025-2026', 4),
(65, 2, '2025-2026', 4),

(61, 14, '2025-2026', 5),
(67, 14, '2025-2026', 5),

(64, 15, '2025-2026', 6);
SELECT
    s.student_id,
    s.first_name,
    s.semester,
    c.course_name,
    c.semester AS course_semester
FROM enrollments e
JOIN students s
    ON e.student_id = s.student_id
JOIN courses c
    ON e.course_id = c.course_id
ORDER BY s.student_id;

SELECT COUNT(*) AS total_enrollments
FROM enrollments;

INSERT INTO attendance
(student_id, course_id, attendance_date,
 status, remarks)
VALUES

-- Rahul → DBMS
(1, 1, '2026-01-10', 'Present', 'Attended regularly'),
(1, 1, '2026-01-12', 'Late', 'Arrived 10 minutes late'),

-- Sneha → CN
(2, 3, '2026-01-10', 'Present', 'Good participation'),
(2, 3, '2026-01-12', 'Present', 'On time'),

-- Arjun → OS
(3, 2, '2026-01-11', 'Absent', 'Medical leave'),
(3, 2, '2026-01-13', 'Present', 'Recovered and attended'),

-- Divya → DS
(4, 4, '2026-01-10', 'Present', 'Active in class'),
(4, 4, '2026-01-12', 'Present', 'Completed lab work'),

-- Karthik → Cyber Security
(5, 15, '2026-01-09', 'Late', 'Traffic issue'),
(5, 15, '2026-01-11', 'Present', 'Improved punctuality'),

-- Pooja → DBMS
(6, 1, '2026-01-10', 'Present', 'Answered questions'),
(6, 1, '2026-01-12', 'Present', 'Regular attendance'),

-- Vikram → CN
(7, 3, '2026-01-10', 'Absent', 'Family function'),
(7, 3, '2026-01-12', 'Present', 'Returned to class'),

-- Neha → DS
(8, 4, '2026-01-11', 'Present', 'Good coding skills'),
(8, 4, '2026-01-13', 'Present', 'Completed assignment'),

-- Aditya → OS
(9, 2, '2026-01-10', 'Late', 'Bus delay'),
(9, 2, '2026-01-12', 'Present', 'On time'),

-- Meera → Cyber Security
(10, 15, '2026-01-11', 'Present', 'Excellent participation'),
(10, 15, '2026-01-13', 'Present', 'Very attentive');
SELECT
    s.first_name,
    c.course_name,
    a.attendance_date,
    a.status
FROM attendance a
JOIN students s
    ON a.student_id = s.student_id
JOIN courses c
    ON a.course_id = c.course_id
ORDER BY a.attendance_id;
show triggers;
INSERT INTO results
(student_id, course_id,
 internal_marks, external_marks,
 result_status)
VALUES

-- Rahul → DBMS
(1, 1, 38, 50, 'Pass'),

-- Sneha → CN
(2, 3, 42, 48, 'Pass'),

-- Arjun → OS
(3, 2, 28, 35, 'Pass'),

-- Divya → DS
(4, 4, 45, 44, 'Pass'),

-- Karthik → Cyber Security
(5, 15, 25, 30, 'Fail'),

-- Pooja → DBMS
(6, 1, 39, 46, 'Pass'),

-- Vikram → CN
(7, 3, 22, 31, 'Fail'),

-- Neha → DS
(8, 4, 44, 49, 'Pass'),

-- Aditya → OS
(9, 2, 34, 40, 'Pass'),

-- Meera → Cyber Security
(10, 15, 43, 47, 'Pass');

SELECT
    student_id,
    internal_marks,
    external_marks,
    total_marks,
    grade
FROM results;
UPDATE results
SET
    internal_marks = 48,
    external_marks = 45
WHERE result_id = 3;
select *from results; 
SELECT
    result_id,
    internal_marks,
    external_marks,
    total_marks,
    grade
FROM results
WHERE result_id = 3;

delete from  results;
alter table results auto_increment = 1;