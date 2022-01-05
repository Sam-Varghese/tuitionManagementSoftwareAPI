var _ = require("lodash");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
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

// GET request to send student details to application

app.get("/getStudentRecords/:className", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`it's alive on http://localhost:${PORT}`);
});
