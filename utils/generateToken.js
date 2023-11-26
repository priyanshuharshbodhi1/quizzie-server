const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = generateToken;
