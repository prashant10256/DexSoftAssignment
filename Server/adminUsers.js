const credentials = {
  user1: "password1",
  user2: "password2",
};

function authenticate(username, password) {
  return credentials[username] === password;
}

module.exports = {
  credentials,
  authenticate,
};
