const express = require('express');

const app = express(); //create an instance of express
const port = 3000;

app.use("/hello", (req, res) => {
  res.send('Hello from the server!');})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
