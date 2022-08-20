var express = require('express');
var router = express.Router();
var archive = require('../models/archive');
var User = require('../models/user');

// soft delete 
router.post('/soft-delete', async (req, res) => {
  
  try {
    UserObj = await User.findOne({ username: req.body.username })
    var newuser = new archive(req.body)
    newuser.save()

    res.status(200).send({ "res": "deleted" })
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
})

module.exports = router;