// sets up server

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { randomString } = require("./helpers");
const { findEmail } = require("./helpers");
const { findURL } = require("./helpers")
const app = express();
const PORT = 8080;

// middleware soon? 
app.set("view engine", "ejs"); //in this house we use ejs as our view engine 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//globl functions -- move to helper file



// global objects (change to class/instanse flavor)

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID:"Lola" },
  "QoLQWw":	{ longURL: "http://jsforcats.com/", userID: "Lola" },
  "9sm5xK": { longURL: "https://gallica.bnf.fr/ark:/12148/btv1b8449047c/f9.item", userID: "Jimmy" },
  "Nt1QmP":	{ longURL: "https://archivesetmanuscrits.bnf.fr/ark:/12148/cc779445", userID: "Jimmy"}
};

//both of Jimmy's url are  from Bibliotheque Nationale France, onse show a manuscript image of
// Chiristine de Pizan presumably writing this Manuscript, BnF Francais 835, f. 1r . 
//The other is the actual libary info/ write up for said MS; 

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
};


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
  const user = req.cookies.user_id
  let filteredDatabase = {}
 for (let url in urlDatabase){
    if (findURL(urlDatabase[url], user)){
     filteredDatabase[url] = findURL(urlDatabase[url], user)
     };
   }

console.log("filterd database: ", filteredDatabase);
 const templateVars = {
  urls: filteredDatabase,
  user: users[req.cookies["user_id"]]
 }
  res.render("urls_index", templateVars);
//  res.redirect("/login")
});

//add new url
app.get("/urls/new", (req, res) => {
  const user = req.cookies.user_id
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  if(user){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});
app.post("/urls", (req, res) => {
  const shortURL = randomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies.user_id};
  res.redirect(`/urls/${shortURL}`);
});

// points to specific short url
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params.shortURL)
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  // console.log(longURL)
  // console.log(req.body)
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// login/logout user functionaltiy 
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  for (const user in users) {
    if (findEmail(users[user], email)) {
      if (users[user].password === password) {
        res.cookie("user_id", users[user].id);
        res.redirect("/urls");
      }
      res.redirect("403_cred");
    } 
  }
  res.redirect("/403_reg");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//registration

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const userID = randomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.redirect("/400");
  }
  for (const user in users) {
    if (findEmail(users[user], email)) {
      res.redirect("/403_cred");
      return;
    }
  }
  users[userID] = { id: userID, email: email, password: password };
  console.log((users[userID]));
  console.log(users);
  res.cookie("user_id", userID);
  res.redirect("/urls");
});
//error pages

app.get("/403_cred", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.status(403);
  res.render("403_cred", templateVars);
});

app.get("/403_reg", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.status(403);
  res.render("403_reg", templateVars);
});

app.get("/400", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.status(400);
  res.render("400", templateVars);
});

app.get("*", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.status(404);
  res.render("404", templateVars);
});

// lets server listen, end of server functionality 

app.listen(PORT, () => {
  console.log(`Hello from Sunny Port ${PORT}! 🌈 🌞 🌴`);
});