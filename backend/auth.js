const jwt = require('jsonwebtoken');
const User = require('./user');
const file_log = require('./log')
function authenticate(req, res, next) {
  
  const token = req.headers.authorization;
  if (!token) {
    file_log(req.method + " " + req.originalUrl + " " + "-" + " 401");
    return res.status(401).send({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      file_log(req.method + " " + req.originalUrl + " " + "-" + " 401");
      return res.status(401).send({ message: 'Unauthorized' });
    }
    User.findById(decoded.userId)
    .then((user)=>{
      if (!user) {
        file_log(req.method + " " + req.originalUrl + " " + "-" + " 401");
        return res.status(401).send({ message: 'Unauthorized' });
      }
      // file_log(req.method + " " + req.originalUrl + " " + user._id + " 201");
      req.user = user;
      next();
    })
    .catch((err)=>{
      // file_log(req.method + " " + req.originalUrl + " " + "-" + " 401");
      return next(err);
    })
  });
}

module.exports = authenticate;