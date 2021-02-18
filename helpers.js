// helper f(x)s for express_server.js

//

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


module.exports = { findEmail, randomString }