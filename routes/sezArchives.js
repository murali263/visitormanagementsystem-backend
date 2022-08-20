var express = require('express');
var router = express.Router();
var SezArchive = require('../models/sezArchive')
var Sez = require('../models/sez')



// soft delete 
router.post('/soft-delete_sez', async (req, res) => {
  try {
    UserObj = await Sez.findOne({ scode: req.body.scode })
    var newuser = new SezArchive(req.body)
    newuser.save()

    res.status(200).send({ "res": "archived" })
  }
  catch (err) {
    res.status(400).send(err)
  }
})






module.exports = router;