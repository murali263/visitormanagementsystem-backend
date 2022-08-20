var express = require('express');
var router = express.Router();
var Sez = require('../models/sez');
const verifytoken = require("../middlewares/auth");
const paginatedResults = require("../middlewares/pagination");


//specifing the location of the storage of the image
// var storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__basedir,'/asserts/images'))
//     },
//     filename:function(req,file,cb){
//         cb(null,file.originalname+'-'+Date.now())
//     }

// })
// var upload = multer({ storage: storage })

// upload.single('slogo'),
/* GET users listing. */

router.post('/creatingsez', (req, res) => {

  sezdata = req.body
  let sezzingdata = new Sez(sezdata)

  sezzingdata.save((err, sezinf) => {
    if (err) {
      res.status(400).send({ sname: req.body.sname })
    }
    else {
      res.status(200).send({ sezinf })
    }
  })
})



router.post('/create-sez', verifytoken, (req, res) => {

  try {

    var newsez = new Sez()
    newsez.sname = req.body.sname;
    newsez.sezlocation = req.body.sezlocation; 
    newsez.save(function (err) {
      if (err) throw err
      res.status(201).send({ status: 200, message: 'data received', sezobj: newsez })
    })
  } catch (e) {
    res.status(400).send(e)
  }
});




router.get("/get-SezList", verifytoken, paginatedResults(Sez), async (req, res) => {
  try {

    if (Object.keys(req.query).length == 1) {

      var sezList = []
      const sezlistObj = await Sez.find({}, {})

      for (let v of sezlistObj) {

        if (v.sname.toLowerCase().includes(req.query.searchkeyword.toLowerCase())) {
          sezList.push(v)

        }
      }

      res.status(201).send({ status: 200, res: sezList })
    }
    else {

      const count = await Sez.find({}, {})

      sezList = res.paginatedResults
      res.status(201).send({ status: 200, res: sezList, totalCount: count })
    }


  }
  catch (err) {
    res.status(400).send(err)
  }
})



// update the sez details
router.put('/update-sez', verifytoken, async (req, res) => {

  try {

    const Sezs = await Sez.findOneAndUpdate({ scode: req.body.scode }, { $set: req.body }, { returnNewDocument: true, new: true });

    res.status(200).json({ "updated": true, updatedObj: Sezs })

  }
  catch (err) {

    res.status(400).send(err)
  }
});




// delete the user
router.delete('/delete-sez/:scode', verifytoken, async (req, res) => {

  try {

    const users = await Sez.findOneAndDelete({ scode: req.params.scode });
    res.status(200).json({ "message": "success" })
  }
  catch (err) {

    res.status(400).send(err)
  }
});



//dashboard services

//TotalSezs-Dashboard
router.get("/d-TotalSezs", verifytoken, async (req, res) => {


  try {
    if (Object.keys(req.query).length == 1) {
      const sezList = await Sez.find({ scode: req.query.scode }, {})
      res.status(201).send({ status: 200, res: sezList })
    }
    else {
      const sezList = await Sez.find({}, {})
      res.status(201).send({ status: 200, res: sezList })
    }

  }
  catch (err) {
    res.status(400).send(e)
  }
})



//selected Sez Users-Dashboard
router.get("d-getSezUsers", verifytoken, async (req, res) => {
  try {

    const sezList = await Sez.find({ scode: req.query.scode }, {})
    res.status(201).send({ status: 200, res: sezList })
  }
  catch (err) {
    res.status(400).send(e)
  }
})

module.exports = router;
