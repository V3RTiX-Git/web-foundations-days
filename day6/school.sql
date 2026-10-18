
-- Day 6 Assignment: School Database

-- Remove existing tables so the script can be run again.
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- 1. Create the students table.
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table.
CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    teacher TEXT NOT NULL
);

-- 3. Create the enrolments table.
CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE (student_id, course_id)
);

-- 4. Insert sample students.
INSERT INTO students (id, name, email) VALUES
(1, 'Amina Banda', 'amina@example.com'),
(2, 'Brian Phiri', 'brian@example.com'),
(3, 'Chipo Zulu', 'chipo@example.com'),
(4, 'David Mwansa', 'david@example.com');

-- 5. Insert sample courses.
INSERT INTO courses (id, name, teacher) VALUES
(1, 'Mathematics', 'Mr. Tembo'),
(2, 'English', 'Mrs. Phiri'),
(3, 'Computer Science', 'Mr. Banda');

-- 6. Insert sample enrolments.
INSERT INTO enrolments (id, student_id, course_id, grade) VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'B'),
(4, 2, 3, 'A'),
(5, 3, 2, 'A');

-- QUERY 1: All courses for one student, by name.
SELECT students.name AS student_name, courses.name AS course_name
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses ON courses.id = enrolments.course_id
WHERE students.name = 'Amina Banda';

-- QUERY 2: All students enrolled on one course.
SELECT students.name AS student_name, courses.name AS course_name
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses ON courses.id = enrolments.course_id
WHERE courses.name = 'Mathematics';

-- QUERY 3: Number of students per course, including courses with no enrolments.
SELECT courses.name AS course_name,
       COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id, courses.name;

-- QUERY 4: Students who have no enrolments.
SELECT students.name
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.id IS NULL;

-- QUERY 5: Update one enrolment's grade.
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 2 AND course_id = 1;

-- Check the updated grade.
SELECT students.name AS student_name,
       courses.name AS course_name,
       enrolments.grade
FROM enrolments
JOIN students ON students.id = enrolments.student_id
JOIN courses ON courses.id = enrolments.course_id
WHERE student_id = 2 AND course_id = 1;

-- INDEX: Helps find enrolments for a particular course faster.
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
