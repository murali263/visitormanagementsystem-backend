var express = require("express");
var router = express.Router();
var company = require("../models/comp");
var User = require("../models/user");
// var subcompany = require("../models/subCompany");
var userAuth = require("../models/userAuth");
var subcompanies = require("../models/subCompany");
var bcryptjs = require("bcryptjs");
const { uuid } = require("uuidv4");

router.post("/create-company", async (req, res) => {
  try {
    var newcompany = new company(req.body);
    await newcompany.save(async function (err) {
      if (err) throw err;
    });
    if (newcompany && req.body.spoc.length > 0) {
      let spocObj = {};
      for (let i = 0; i < req.body.spoc.length; i++) {
        spocObj.username = req.body.spoc[i].SpocName;
        spocObj.email = req.body.spoc[i].SpocEmail;
        spocObj.phonenumber = req.body.spoc[i].Spoccontact;
        spocObj.role = req.body.spoc[i].role;
        spocObj.companyId = newcompany.companyId;
        spocObj.password = bcryptjs.hashSync("Welcome@123", 10);
        spocObj.isActive = true;
        spocObj.isDeleted = false;

        spocObj.uid = uuid();
      }

      var newUser = new userAuth(spocObj);
      newUser.save();
    }
    res
      .status(200)
      .send({ status: 200, message: "saved", companyObj: newcompany });
  } catch (e) {
    res.status(400).send({ message: e });
  }
});

router.get("/get-CompanyList", async (req, res) => {
  try {
    const companyList = await company.find({isDeleted:false});
    if (companyList) {
      res.status(201).send(companyList);
    } else {
      res.status(400).send({ message: err });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/updatestatussubcompany", async (req, res) => {
  try {
    const subcom = await subcompanies.findOneAndUpdate(
      { companyId: req.body.companyId },
      { $set: { isActive: req.body.isActive } }
    );
    res.status(200).json({ updated: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/get-TotalCompanyList", async (req, res) => {
  try {
    const companyList = await company.find({}, {});
    res.status(201).send({ status: 200, res: companyList });
  } catch (err) {
    res.status(400).send(err);
  }
});

//dashboard services
router.get("/d-TotalCompanies", async (req, res) => {
  try {
    const companyList = await company.find({}, {});
    res.status(201).send({ status: 200, res: companyList });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/d-getSezCompanies", async (req, res) => {
  try {
    const companyList = await company.find({ scode: req.query.scode }, {});
    res.status(201).send({ status: 200, res: companyList });
  } catch (err) {
    res.status(400).send(err);
  }
});

//companys total count
router.get("/comp/count", async (req, res) => {
  company.countDocuments({}, (err, count) => {
    if (err) {
      res.status(500).send("api is not working");
    } else {
      res.status(200).send({ count });
    }
  });
});

// router.put('/deleted',async (req,res)=>{
//   try{
//     const subcom = await company.findOneAndUpdate(
//       { companyId: req.body.companyId },
//       { $set: { isDeleted: req.body.isDeleted } }
//     );
//     res.status(200).json({ updated: true });
//   }
//   catch(err) {

//     res.status(400).send(err);

//  }
// })

router.put("/parent_update_data", async (req, res) => {
  try {
    if (!req.body.companyId) {
      return res.status(400).send("companyID required");
    } else {
      const parentdata = await company.findOneAndUpdate(
        { companyId: req.body.companyId },
        { $set: req.body },
        { returnNewDocument: true }
      );
      res.status(200).send({ updated: true, updatedObj: parentdata });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// posting subcompany details
router.post("/subCompany", async (req, res) => {
  try {
    if (!req.body.type) {
      return res
        .status(400)
        .json({ message: "type is required for subCompany" });
    }

    var newSubCompany = new subcompanies(req.body);

    await newSubCompany.save();

    if (newSubCompany && req.body.spoc.length > 0) {
      let SubspocObj = {};
      for (let i = 0; i < req.body.spoc.length; i++) {
        SubspocObj.username = req.body.spoc[i].SpocName;
        SubspocObj.email = req.body.spoc[i].SpocEmail;
        SubspocObj.phonenumber = req.body.spoc[i].Spoccontact;
        SubspocObj.role = req.body.spoc[i].role;
        SubspocObj.companyId = newSubCompany.companyId;
        SubspocObj.password = bcryptjs.hashSync("Welcome@123", 10);
        SubspocObj.isDeleted = false;
        SubspocObj.isActive = false;
        SubspocObj.uid = uuid();
      }
      var newUser = new userAuth(SubspocObj);
      newUser.save();
    }
    res.status(200).send({ status: 200, message: "saved" });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

router.put("/updatecompany", async (req, res) => {
  try {
    const updatecom = await company.findOneAndUpdate(
      { companyId: req.body.companyId },
      { $set: { isActive: req.body.isActive } }
    );
    if (updatecom) {
      const userUpdate = await User.findOneAndUpdate(
        { companyId: req.body.companyId },
        { $set: { isActive: req.body.isActive } }
      );
    }
    res.status(200).json({ updated: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/get-subcompanies", async (req, res) => {
  try {
    if (!req.query.companyId) {
      return res.status(400).send("companyID required");
    }

    let filter = {
      parentCompanyId: req.query.companyId,
    };
    const subcompList = await subcompanies.find({
      parentCompanyId: req.query.companyId,
    });

    if (subcompList) {
      res.status(200).send(subcompList);
    } else {
      res.status(400).send({ message: err });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
//  to delete a company

router.post("/deleteCompanys", async (req, res) => {
  try {
    const deletecompay = await company.findOneAndUpdate(
      { companyId: req.body.companyId },
      { $set: { isDeleted: true } }
    );
    // res.status(200).send({ status: 200, msg:"company deleted successfully" });

    if (deletecompay) {
      const deleteUsercompay = await User.findOneAndUpdate(
        { companyId: req.body.companyId },
        { $set: { isDeleted: true } }
      );
      res.status(200).send({ status: 200, msg: "company deleted successfully" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
