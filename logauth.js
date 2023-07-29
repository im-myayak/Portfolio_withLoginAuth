const initializePassport = require("./passport-config");
const users = require("./server").users;
initializePassport(passport, (email) => users.find(user.email === email));
