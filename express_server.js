// sets up server

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

// middleware soon? 
app.set("view engine", "ejs"); //in this house we use ejs as our view engine 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

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
  "9sm5xK": "https://gallica.bnf.fr/ark:/12148/btv1b8449047c/f9.item"
};

const users = {
  "Jimmy": {
    id: "Jimmy",
    email: "jimmy@dude.com",
    password: "dude"
  },
  "Lola": {
    id: "Lola",
    email: "lola@meow.com",
    password: "meow"
  }
}

//test url is from Bibliotheque Nationale France, and shows a manuscript image of
// Chiristine de Pizan presumably writing this Manuscript. BnF Francais 835, f. 1r https://archivesetmanuscrits.bnf.fr/ark:/12148/cc779445

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
  const templateVars = { 
    urls: urlDatabase,  
      user_id: req.cookies["user_id"]
  };
  res.render("urls_index", templateVars);
});

//add new url
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user_id: req.cookies["user_id"]
  }
  res.render("urls_new", templateVars);
});
app.post("/urls", (req,res) => {
  const shortURL = randomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// points to specific short url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
      user_id: req.cookies["user_id"]
  };
  // console.log(urlDatabase)
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params.shortURL)
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL)
});

app.post("/urls/:shortURL/edit", (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL
  // console.log(longURL)
  // console.log(req.body)
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

// login/logout user functionaltiy 

app.post("/login", (req, res) => {
  const username = req.body.username;
  // console.log(username)
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
})

//registration

app.get("/register", (req, res) => {
  const templateVars = { 
    user_id: req.cookies["user_id"]
  }
  res.render("register", templateVars)
})

app.post("/register", (req,res) => {
  const userID = req.body.username
  const email = req.body.email
  const password = req.body.password
  users[userID] = { id: userID, email: email, password: password };
  console.log(users[userID]);
  res.cookie(user_id, users[userID]);
  res.redirect("/urls");
})
//error pages

app.get("*", (req,res) => {
  const templateVars = { 
    user_id: req.cookies["user_id"]
  }
  res.status(404)
  res.render("404", templateVars)
});

// lets server listen, end of server functionality 

app.listen(PORT, () => {
  console.log(`Hello from Sunny Port ${PORT}! 🌈 🌞 🌴`);
});