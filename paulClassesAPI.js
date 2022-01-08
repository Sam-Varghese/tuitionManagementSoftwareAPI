// Lodash to process the data
var _ = require("lodash");

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

// POST request to save student registration details

app.post("/studentRegistrationDetails", (req, res) => {
  const { studentName, studentClass } = req.body;

  if (!studentName || !studentClass) {
    res.status(418).send({ message: "Didn't get either the name or class" });
  }

  res.send({ message: `Got the info of ${studentName} sir.` });
});

// GET request to send names of all classes to application
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

// GET request to send student names of a given class

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

// GET request to send the details of a student given his name and class

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

app.listen(PORT, () => {
  console.log(`it's alive on http://localhost:${PORT}`);
});
