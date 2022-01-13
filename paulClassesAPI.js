// Lodash to process the data
var _ = require("lodash");
// Importing MySQL driver
var mysql = require("mysql");
// For extracting information from secret .env file.
const dotenv = require("dotenv");
dotenv.config();

//$ Connecting to AWS RDS database

var connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  port: process.env.port,
  database: process.env.database,
});

// Checking connection

connection.connect((err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("Connection successfully established\n");
});

// Importing node-fetch to enable data fetching

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// To handle POST and GET requests
const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(
  cors({
    origin: ["https://www.section.io", "http://localhost:4200"],
  })
);

app.use(express.json());

// $ POST request to save student registration details

app.post("/studentRegistrationDetails", (req, res) => {
  console.log(req.body);

  // * Query to create studentsDatabase if it does not exist

  connection.query(
    `CREATE DATABASE IF NOT EXISTS studentsDatabase`,
    (error, result) => {
      if (error) throw error;
    }
  );

  // * Query to use studentsDatabase

  connection.query(`USE studentsDatabase`, (error, result) => {
    if (error) throw error;
  });

  // * Query to create the registrationDetails table if it does not exists

  connection.query(
    `CREATE TABLE IF NOT EXISTS registrationDetails(student_name VARCHAR(100), student_class VARCHAR(100), student_mail_id VARCHAR(100), student_address VARCHAR(300), student_contact_number VARCHAR(20), date_of_joining VARCHAR(10), deposit_pattern ENUM('Monthly', 'Yearly'), description VARCHAR(500))`,
    (error, result) => {
      if (error) throw error;
    }
  );

  // * Query to insert to registration data to registrationDetails table

  connection.query(
    `INSERT INTO registrationDetails VALUES('${req.body.studentName}', '${req.body.studentClass}', '${req.body.studentMailId}', '${req.body.studentAddress}', '${req.body.studentContactNumber}', '${req.body.studentDOJ}', '${req.body.studentDepositPattern}', '${req.body.studentDescription}')`,
    (error, result) => {
      if (error) throw error;
    }
  );

  // Sending the status and message
  res.status(200).send({ message: "Success" });
});

// $ GET request to send names of all classes to application

app.get("/getClassNames", (req, res) => {
  console.log(`Sending the names of all classes`);
  // Fetching data
  fetch("http://names.drycodes.com/20")
    .then((response) => response.json())
    .then((data) => {
      // Processing the data through lodash
      data = data.map((element) => _.startCase(element));
      // Sending the data
      res.send(data);
    })
    .catch((err) => console.log(err));
});

// $ GET request to send student names of a given class

app.get("/getStudentNames/:className", (req, res) => {
  const { className } = req.params;

  console.log(`Sending the names of all student of ${className}`);
  // Fetching data
  fetch("http://names.drycodes.com/100?nameOptions=boy_names")
    .then((response) => response.json())
    .then((data) => {
      // Processing the data through lodash
      data = data.map((element) => _.startCase(element));
      // Sending the data
      res.send(data);
    })
    .catch((err) => console.log(err));
});

// $ GET request to send the details of a student given his name and class

app.get("/getStudentRecords/:studentName/:studentClass", (req, res) => {
  var { studentName, studentClass } = req.params;

  // Replace % with a space

  studentName = studentName.replace("%", " ");
  studentClass = studentClass.replace("%", " ");

  // JSON to store all the data being fetched
  var studentsData = {};

  // Fetching the data
  fetch("https://randomuser.me/api/?inc=name,nat,email,location,phone,dob")
    .then((response) => response.json())
    .then((data) => {
      studentsData["name"] = studentName;
      console.log(studentName);
      studentsData["address"] =
        data.results[0].location.street.number +
        ", " +
        data.results[0].location.street.name +
        ", " +
        data.results[0].location.city +
        ", " +
        data.results[0].location.state +
        ", " +
        data.results[0].location.country;
      studentsData["school"] = "Shishukunj International School";
      studentsData["Class"] = studentClass;
      studentsData["email"] = data.results[0].email;
      studentsData["contactNumber"] = data.results[0].phone;
      studentsData["dateOfJoining"] = data.results[0].dob.date;
      studentsData["description"] =
        "Good student but needs to concentrate more";

      res.send(studentsData);
    })
    .catch((err) => console.log(err));
});

// Configuring the port to keep it listening there
app.listen(PORT, () => {
  console.log(`it's alive on http://localhost:${PORT}`);
});
