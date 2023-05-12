require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('./user');

async function login(req, res, next) {
  const { email, password } = req.body;
  await User.findOne({ email: email })
  .then((user)=>{
    if (!user) {
      file_log(req.method + " " + req.originalUrl + " " + id + " 401");
      return res.status(401).send({ message: 'No user with this email' });      
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        file_log(req.method + " " + req.originalUrl + " " + id + " 401");
        return next(err);
      }
      if (!isMatch) {
        file_log(req.method + " " + req.originalUrl + " " + id + " 401");
        return res.status(401).send({ message: 'Invalid password' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      file_log(req.method + " " + req.originalUrl + " " + id + " 200");
      res.send({ token });
    });
  })
  .catch((err)=>{
    if (err) {
      file_log(req.method + " " + req.originalUrl + " " + id + " 401");
      console.log(err);
      return next(err);
    }
  })
}

module.exports = { login };
