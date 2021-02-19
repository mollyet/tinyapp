// sets up server

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');
const { randomString } = require("./helpers");
const { findEmail } = require("./helpers");
const { findURL } = require("./helpers");
const { users } = require("./helpers");
const { urlDatabase } = require("./helpers");
const app = express();
const PORT = 8080;

//in this house we use ejs as our view engine

app.set("view engine", "ejs");

//initialize middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["skeleton-key", "crypt-key", "fancy-key"],
}));

//globl functions && global objects -- moved to helpers.js


// server functionality-- pages/etc

app.get("/", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (user) {
    res.redirect("/urls");
    return;
  }
  res.render("welcome", templateVars);
});

// renders urls as  json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// main urls page-- displays them in a table
app.get("/urls", (req, res) => {
  const user = req.session.user_id;
  let filteredDatabase = {};
  for (let url in urlDatabase) {
    if (findURL(urlDatabase[url], user)) {
      filteredDatabase[url] = findURL(urlDatabase[url], user);
    }
  }
  if (user) {
    const templateVars = {
      urls: filteredDatabase,
      user: users[req.session.user_id]
    };
    res.render("urls_index", templateVars);
    return;
  }
  res.redirect("/login");
});

//add new url
app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (user) {
    res.render("urls_new", templateVars);
    return;
  } else {
    res.redirect("/login");
  }
});

// assigns new string to short URL
app.post("/urls", (req, res) => {
  const shortURL = randomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

// points to specific short url
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

//redirects shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//edits shortURL
app.post("/urls/:shortURL/edit", (req, res) => {
  const user = req.session.user_id;
  if (user) {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = { longURL: longURL, userID: user };
    res.redirect(`/urls/${shortURL}`);
    return;
  }
  res.redirect("/login");
});

//thank u, next!
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (user) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});



//registration

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
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
      res.redirect("/400");
      return;
    }
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      users[userID] = { id: userID, email: email, password: hash };
      req.session.user_id = userID;
      res.redirect("/urls");
    });
  });
});

// login/logout user functionaltiy

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  for (const user in users) {
    if (findEmail(users[user], email)) {
      if (bcrypt.compareSync(password, users[user].password)) {
        req.session.user_id = users[user].id;
        res.redirect("/urls");
        return;
      }
      res.redirect("403_cred");
    }
  }
  res.redirect("/403_reg");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//error pages

app.get("/403_cred", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(403);
  res.render("403_cred", templateVars);
});

app.get("/403_reg", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(403);
  res.render("403_reg", templateVars);
});

app.get("/400", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(400);
  res.render("400", templateVars);
});

app.get("*", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(404);
  res.render("404", templateVars);
});

// lets server listen, end of server functionality

app.listen(PORT, () => {
  console.log(`Hello from Sunny Port ${PORT}! 🌈 🌞 🌴`);
});