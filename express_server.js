// sets up server

const express = require("express");
const app = express();
const PORT = 8080;

// middleware soon? 


// global objects (change to class/instanse flavor)

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// server functionality-- pages/etc

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// lets server listen, end of server functionality 

app.listen(PORT, () => {
  console.log(`Hello from sunny port ${PORT}!`);
});