CREATE TABLE teaching_records (
  id INT AUTO_INCREMENT PRIMARY KEY,

  teacherEmail VARCHAR(255) NOT NULL,
  teacherName VARCHAR(255) NOT NULL,

  studentEmail VARCHAR(255) NOT NULL,
  studentName VARCHAR(255) NOT NULL,

  classCode VARCHAR(100) NOT NULL,
  className VARCHAR(255) NOT NULL,

  subjectCode VARCHAR(100) NOT NULL,
  subjectName VARCHAR(255) NOT NULL,

  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_teaching_record (
    teacherEmail,
    studentEmail,
    classCode,
    subjectCode
  )
);
