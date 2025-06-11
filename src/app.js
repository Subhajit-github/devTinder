const express = require('express');

const app = express(); //create an instance of express
const port = 3000;

app.use("/user",
  (req, res, next) => {
    console.log("Middleware for /user route");
    next(); // Call the next middleware or route handler
  },
  (req, res, next) => {
    console.log("Second Handler");
    next();
    // res.send("User route accessed");
  },
  (req, res) => {
    res.send("Sending response from third block of middleware");
  }
)


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
