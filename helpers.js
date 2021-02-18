// fine exportables for express_server.js

// global f(x)s for testing, from express_server.js

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
    password: "$2a$10$u2lwwwhXo/qyEzBsl1br3.Nkw1LHE2fU7a4fcagP1cXVt5D20B8V6"
  },
  "Lola": {
    id: "Lola",
    email: "lola@meow.com",
    password: "$2a$10$LN4332ZB7ToT4U5c1WCxTO2M//q8DVm/SnGOw2Vopvm4kU3et03VW"
  }
};

// helper f(x)s

//modifed "findKeyByValue f(x) from lotide project"
const findEmail = function(obj, value) {
  for (let key of Object.keys(obj)) {
    if (obj[key] === value) {
      return true;
    }
  }
  return false;
};

//

const findURL = function(obj, value) {
  for (let key of Object.keys(obj)) {
    if (obj[key] === value) {
      return obj;
    }
  }
};

//

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


// const test = { id: 'hjHgro', email: 'lola@meow.com', password: 'meow' }
// const yikes = "jimmy@meow.com"
// const oof = "lola@meow.com"

// console.log(findEmail(test, yikes)) //false
// console.log(findEmail(test, oof)) //true


module.exports = { findEmail, randomString, findURL, urlDatabase, users }