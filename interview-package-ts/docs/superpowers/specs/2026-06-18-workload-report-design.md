# Workload Report API Design

## API Contract

- Method: `GET`
- Endpoint: `/api/reports/workload`
- Success: `200 OK`
- Unexpected error: `500 Internal Server Error`
- Empty result: `{}`

## Response Shape

Each top-level key is a unique teacher email. Its value contains the teacher's display name and a `subjects` array. Every subject contains `subjectCode`, `subjectName`, and the number of distinct classes taught by that teacher for that subject.

## Data Processing

Sequelize groups rows by teacher email, teacher name, subject code, and subject name. MySQL calculates `COUNT(DISTINCT classCode)` so multiple student rows in the same class count once. The service sorts teachers by name and subjects by subject code before shaping the JSON response.

