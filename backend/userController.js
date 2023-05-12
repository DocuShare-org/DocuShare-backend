const User = require('./user');
const Document = require('./Document');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
const file_log = require('./log');

async function register(req, res, next) {
  const { email, password, name } = req.body;
  const user = new User({ email, password, name });
  await user.save()
    .then((obj)=>{
      console.log(obj)
      file_log(req.method + " " + req.originalUrl + " " + id + " 200");
      res.send({ message: 'User registered successfully' });
    })
    .catch((err)=>{
      console.log(err)
      file_log(req.method + " " + req.originalUrl + " " + id + " 400");
      res.status(400).send({ message: 'Duplicate email' });
    })
}

async function get_doc_list(uid) {
  const doc_list  = await Document.find({ uid: uid })
  return doc_list;
}

async function get_uid(token) {
  if (!token) {
    return 'Unauthorized';
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.userId)
  return user._id.toString();      
}

async function add_access(uid, did, access_email) {
  const user = await User.findOne({email : access_email})
  if(user==undefined) return 'User with this email doesnot exist'
  access_uid = user._id;
  const doc = await Document.findOne({_id : did})
  if(doc == undefined) return 'Document does not exist'
  if(doc.uid === uid)
  {
    const doc = await Document.updateOne(
      { _id: did },
      { $push: { access: access_uid } 
    })
    if(doc == undefined) return "Some error!"
    else return 'Done'
  }
  else return 'This document does not belong to given user id';  
}

async function get_access_list(uid, did) {
  const doc = await Document.findOne({_id : did})
  if(doc == undefined) return 'Document does not exist'
  else if(doc.uid != uid) return 'did doesnot belong to uid'
  else{
    const res = []
    for(let i = 0;i<doc.access.length;i++)
    {
      const oid = new mongoose.Types.ObjectId(doc.access[i])
      const usr = await User.findOne({_id : oid});
      res.push(usr.email);
    }
    return res;
  } 
}

async function check_access (uid,did) {
  const doc = await Document.findOne({_id : did})
  if(doc == undefined) return false
  else{
    if(doc.access.includes(uid)) return true
    else return false
  } 
}
module.exports = { register,get_uid, get_doc_list, add_access , get_access_list, check_access};
