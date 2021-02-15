// sets up server

const express = require("express");
const app = express();
const PORT = 8080;

// middleware soon? 
app.set("view engine", "ejs"); //in this house we use ejs as our view engine 

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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


// lets server listen, end of server functionality 

app.listen(PORT, () => {
  console.log(`Hello from sunny port ${PORT}!`);
});