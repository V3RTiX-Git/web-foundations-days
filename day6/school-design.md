# School Database Design

## Tables

### Students

The students table stores each student's ID, name and email address. The ID is the primary key, and the email is required and must be unique so that two students cannot share the same email address.

### Courses

The courses table stores each course's ID, name and teacher. The ID is the primary key, and the name and teacher are required.

### Enrolments

The enrolments table records which student takes which course and the student's grade. Its ID is the primary key. The student_id and course_id columns are foreign keys that reference the students and courses tables. Both are required, and a UNIQUE constraint on the pair prevents a student from enrolling in the same course twice.

## Relationships

A student can have many enrolments, but each enrolment belongs to one student. This is a one-to-many relationship between students and enrolments.

A course can also have many enrolments, but each enrolment belongs to one course. This is a one-to-many relationship between courses and enrolments.

Students and courses therefore have a many-to-many relationship: one student can take several courses, and one course can have several students. The enrolments table is needed as a join table to connect them. It also stores the grade for each student-course combination.

## Index

I would add an index on enrolments.course_id. This can help the database find enrolments for a particular course more efficiently, such as when listing all students on a course or counting students per course.

## SQL or NoSQL?

I would choose SQL for this school system. The data has clear relationships between students, courses and enrolments, and each enrolment must refer to an existing student and course. SQL supports primary keys, foreign keys, unique constraints and JOIN queries, which help keep the data organised and consistent. It is a suitable choice for this structured information.
