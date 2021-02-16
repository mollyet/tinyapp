// sets up server

const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

// middleware soon? 
app.set("view engine", "ejs"); //in this house we use ejs as our view engine 
app.use(bodyParser.urlencoded({extended: true}));

//globl functions -- move to helper file

const randomString = function () {
  // inspired from this function found on stackoverflow: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/27747377
  // currently hardcoded for a 6 character long string
  
  const abcNums = "abcdefghijklmnopqrstuvwxyzABCEDEGHIJKLMNOPQRSTUVWXYZ1234567890";
  let newString = "";
  for (let i = 0; i < 6; i++) {
    newString += abcNums.charAt(Math.floor(Math.random() * abcNums.length));
  }
  return newString;
};

// global objects (change to class/instanse flavor)

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//test url, from gallica bnf: https://gallica.bnf.fr/ark:/12148/btv1b8449047c/f9.item

// server functionality-- pages/etc

app.get("/", (req, res) => {
  res.send("Hello!");
});

// renders urls as  json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// main urls page-- displays them in a table 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//add new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.post("/urls", (req,res) => {
  const shortURL = randomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// points to specific short url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params.shortURL)
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL)
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL
  console.log(shortURL)
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})


// lets server listen, end of server functionality 

app.listen(PORT, () => {
  console.log(`Hello from Sunny Port ${PORT}! 🌈 🌞 🌴`);
});