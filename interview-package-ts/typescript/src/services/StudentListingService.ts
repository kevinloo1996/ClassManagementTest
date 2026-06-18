import axios from 'axios';
import TeachingRecord from '../models/TeachingRecord';

const EXTERNAL_STUDENT_API_URL = 'http://localhost:5000/students';
const EXTERNAL_STUDENT_FETCH_LIMIT = 1000;

interface ExternalStudent {
  id: number;
  name: string;
  email: string;
}

interface StudentListingItem {
  id: number;
  name: string;
  email: string;
  isExternal: boolean;
}

interface StudentListingResponse {
  count: number;
  students: StudentListingItem[];
}

//sorting by using student name
const studentComparator = (student1: StudentListingItem, student2: StudentListingItem): number => {
  return student1.name.localeCompare(student2.name, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const getLocalStudents = async (classCode: string): Promise<StudentListingItem[]> => {
  const records = await TeachingRecord.findAll({
    attributes: ['id', 'studentEmail', 'studentName'],
    where: { classCode },
    order: [['studentName', 'ASC']],
  });

  const studentsByEmail = new Map<string, StudentListingItem>();
  records.forEach((record) => {
    studentsByEmail.set(record.studentEmail, {
      id: record.id,
      name: record.studentName,
      email: record.studentEmail,
      isExternal: false,
    });
  });

  return Array.from(studentsByEmail.values());
};

const getExternalStudents = async (classCode: string): Promise<StudentListingItem[]> => {
  const response = await axios.get(EXTERNAL_STUDENT_API_URL, {
    params: {
      class: classCode,
      offset: 0,
      limit: EXTERNAL_STUDENT_FETCH_LIMIT,
    },
  });

  return response.data.students.map((student: ExternalStudent) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    isExternal: true,
  }));
};

export const getStudentsByClass = async (
  classCode: string,
  offset: number,
  limit: number,
): Promise<StudentListingResponse> => {
  const [localStudents, externalStudents] = await Promise.all([
    getLocalStudents(classCode),
    getExternalStudents(classCode),
  ]);

  const students = [...localStudents, ...externalStudents].sort(studentComparator);

  return {
    count: students.length,
    students: students.slice(offset, offset + limit),
  };
};
