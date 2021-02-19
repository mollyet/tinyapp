// fine importables from helpers.js

const { randomString } = require("../helpers");
const { findEmail } = require("../helpers");
const { findURL } = require("../helpers");
const { users } = require("../helpers");
const { urlDatabase } = require("../helpers");

//

const { assert } = require("chai");

//

// actual tests

describe("randomString", () => {
  it("should return a random six character string", () => {
    const string = randomString();
    const expectedLength = string.length;
    assert.strictEqual(expectedLength, 6);
  });
  it("each string should not equal the last one", () => {
    const stringOne = randomString();
    const stringTwo = randomString();
    assert.notStrictEqual(stringOne, stringTwo);
  });
});

describe("findEmail", () => {
  it("should return true when passed an existing email in the user object", () => {
    const email = "lola@meow.com";
    let found = false;
    for (let user in users) {
      if (findEmail(users[user], email)) {
        found = true;
        return found;
      }
    }
    assert.isTrue(found);
  });
  it("should return false when passed an email not in the user object", () => {
    const email = "gouda@cheese.com";
    let found = false;
    for (let user in users) {
      if (findEmail(users[user], email)) {
        found = true;
        return found;
      }
    }
    assert.isFalse(found);
  });
});

describe("findURL", () => {
  it("should return an URL object when passed a corresponding userID", () => {
    const userID = "Lola";
    let found = {};
    for (let url in urlDatabase) {
      if (findURL(urlDatabase[url], userID)) {
        let found = urlDatabase[url];
        return found;
      }
    }
    assert.propertyVal(found, userID);
  });
  it("should return undefined if passed a userID thats not in the urlDatabase", () => {
    const userID = "Spock";
    let found = {};
    for (let url in urlDatabase) {
      if (findURL(urlDatabase[url], userID)) {
        let found = urlDatabase[url];
        return found;
      } else {
        found = undefined;
        return found;
      }
    }
    assert.isUndefined(found);
  });
});