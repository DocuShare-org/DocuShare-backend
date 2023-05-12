const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('./authController');
const userController = require('./userController');
const authenticate = require('./auth');
const file_log = require('./log');

const router = express.Router();

router.post('/login', authController.login);

router.post('/register', userController.register);

router.get('/get_docs', authenticate, function(req, res) {
  userController.get_doc_list(String(req.user._id))
  .then((doc_list)=>{
    file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 200");
    res.send(doc_list)
  })
  .catch((err)=>{
    file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 400");
    res.status(400).send(err)
  });
  
});

router.post('/check_access', authenticate, function(req, res) {
  userController.check_access(String(req.user._id), req.body.did)
  .then((flag)=>{
    if(flag) {
      file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 200");
      res.status(200).send(flag);
    }
    else {
      file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 400");
      return res.status(400).send(err);
    }
  })
  .catch((err)=>{
    file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 400");
    res.status(400).send(err)
  });
});

router.post('/add_access', authenticate, function(req, res) {
  userController.add_access(String(req.user._id), req.body.did, req.body.access_email)
  .then((flag)=>{
    if(flag==='Done') {
      file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 200");
      res.status(200).send(flag);
    }
    else {
      file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 400");
      return res.status(400).send(err);
    }
  })
  .catch((err)=>{
    file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 400");
    res.status(400).send(err)
  });
});

router.post('/get_access_list', authenticate, function(req, res) {
  userController.get_access_list(String(req.user._id), req.body.did)
  .then((flag)=>{
    if(typeof(flag) == String || typeof(flag) == 'String') {
      file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 200");
      res.status(400).send(flag);
    }
    else {
      file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 400");
      res.send(flag)
    }
  })
  .catch((err)=>{
    file_log(req.method + " " + req.originalUrl + " " + req.user._id + " 400");
    res.status(400).send(err)
  });
});


router.get('/profile', authenticate, function(req, res) {
  res.send(req.user);
});

module.exports = router;
