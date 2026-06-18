# Interview Assignment (v1.0.4)

This package contains the base code for the interview assignment.<br>
You can add additional library that will aid you in fulfiling the requirements.
<br>
<br>
Please read through NodeJS_Assessment.pdf carefully before you attempt.

__Please do not include Ufinity name in your repository name or README.md__

## Prerequisites
- NodeJS v12.x.x
- Docker

<br>

## Package Structure
| S/N | Name | Type | Description |
|-----|------|------|-------------|
| 1 | external | dir | This holds the code for building external system which is required for question 2.<br><b>There is no need to modify anything inside or start it manually</b>
| 2 | typescript | dir | This holds the base code which you should extend in order to fulfil the requirements |
| 3 | NodeJS_Assessment.pdf | file | The specification for the assignment |
| 4 | README.md | file | This file |
| 5 | data.sample.csv | file | Sample csv for question 1 |
| 6 | school-administration-system.postman_collection.json | file | Postman script for uploading file |

<br>

## Exposed Port
| S/N | Application | Exposed Port |
|-----|-------------|--------------|
| 1 | database | 33306 |
| 2 | external | 5000 |
| 3 | applicaiton | 3000 |

<br>

## Commands
All the commands listed should be ran in ./typescript directory.

### Installing dependencies
```bash
npm install
```

<br>

### Starting Project
Starting the project in local environment.
This will start all the dependencies services i.e. database and external (folder).
```bash
npm start
```

<br>

### Running in watch mode
This will start the application in watch mode.
```bash
npm run start:dev
```

<br>

### Check local application is started
You should be able to call (GET) the following endpoint and get a 200 response

```
http://localhost:3000/api/healthcheck
```

<br>

### Check external system is started
You should be able to call (POST) the following endpoint and get a 200 response
```
  http://localhost:5000/students?class=2&offset=1&limit=2
```

<br>

## Extras

### Database
You can place your database migration scripts in typescript/database folder. <br>
It will be ran the first time MySQL docker container is first initialised. <br><br>
Please provide the instruction on how to initialise the database if you are not using the above method.

<br>

## FAQ

### Error when starting up
If you encounter the following error when running ```npm start```, it is due to the slow startup of your database container.<br>
Please run ```npm start``` again.

```
[server.js]	ERROR	SequelizeConnectionError: Connection lost: The server closed the connection.
[server.js]	ERROR	Unable to start application
```

<br>

### How do I upload file to /api/upload?
You can import the included postman script (school-administration-system.postman_collection.json) into your postman.


<br>


## API Usage

You may reimport the included postman script (school-administration-system.postman_collection.json) into your postman.

Complete the installation and startup steps above before calling these endpoints. The application should be available at `http://localhost:3000`.

### Data Upload

Uploads a CSV file containing teacher, student, class, and subject relationships.

```http
POST http://localhost:3000/api/upload
Content-Type: multipart/form-data
```

In Postman, select **Body > form-data**, use `data` as the field name, and select the CSV file. Re-select the file if Postman loses the local file reference after importing the collection.

### Student Listing

Returns the local and external students for a class in a single paginated list.

```http
GET http://localhost:3000/api/class/P1-1/students?offset=0&limit=50
```

| Query parameter | Description |
|-----------------|-------------|
| `offset` | Number of students to skip |
| `limit` | Maximum number of students to return |

No request body is required.

### Update Class Name

Updates the display name of every record with the specified class code.

```http
PUT http://localhost:3000/api/class/P1-1
Content-Type: application/json
```

Request body:

```json
{
  "className": "P1 Updated"
}
```

A successful request returns `204 No Content`.

### Workload Report

Returns the number of distinct classes taught by each teacher for each subject.

```http
GET http://localhost:3000/api/reports/workload
```

No request body or query parameters are required.

## Unit Tests

Run all commands from the `typescript` directory:

```bash
cd typescript
```

Run the complete test suite:

```bash
npm test -- --runInBand
```

Run an individual controller test:

```bash
npm test -- --runInBand src/controllers/unitTest/DataImportController.test.js
npm test -- --runInBand src/controllers/unitTest/StudentListingController.test.js
npm test -- --runInBand src/controllers/unitTest/UpdateClassNameController.test.js
npm test -- --runInBand src/controllers/unitTest/WorkloadReportController.test.js
```


