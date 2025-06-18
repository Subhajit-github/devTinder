const express = require('express');
const { adminAuth } = require('./middlewares/auth'); // Importing the adminAuth middleware

const app = express(); //create an instance of express
const port = 3000;

app.use("/admin", adminAuth);

app.get('/admin/getAllData', (req, res) => {
  res.send("Welcome to the admin panel");
});

app.get('/admin/deleteUser', (req, res) => {
  res.send("User deleted successfully");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
