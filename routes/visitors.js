const express = require("express");
const router = express.Router();
const Visitor = require("../models/visitor");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const visitor = require("../models/visitor");
const { uuid } = require("uuidv4");
const company = require("../models/comp");
const e = require("express");

router.post("/visitordatainsert", async (req, res) => {
  let verificationCode;
  let obj = {};
  crypto.randomInt(0, 10000, (err, n) => {
    if (err) throw err;
    verificationCode = n.toString().padStart(4, "0");
    console.log(verificationCode)
    req.body.verificationCode = verificationCode;
  });

  Visitor.findOne({ phoneNumber: Number(req.body.phoneNumber) }, function (err, visitor) {
    if (err) {
      return res.status(500).json({ msg: err.message });
    } else if (visitor) {
      return res.json({
        success: false,
        message: "mobile number is already existed with another pass ",
      });
    } else {
      obj.visitorName = req.body.visitorName;
      obj.referenceBy = req.body.referenceBy;
      obj.phoneNumber = req.body.phoneNumber;
      obj.visitDate = req.body.visitDate;
      obj.vehicleNumber = req.body.vehicleNumber;
      obj.visitingFrom = req.body.visitingFrom;
      obj.members = req.body.members;
      obj.email = req.body.email;
      obj.visitTime = req.body.visitTime;
      obj.AdditionalInfo = req.body.AdditionalInfo;
      obj.companyId = req.body.companyId;
      obj.verificationCode = req.body.verificationCode;
      obj.checkin = "";
      obj.checkout = "";
      obj.checkinUid = "";
      obj.checkoutUid = "";
      obj.uid = uuid();
      visitor = new Visitor(obj);
      var transporter = nodemailer.createTransport({
        host: "webmail.prospectatech.com",
        port: 587,
        secure: false,
        auth: {
          user: "cloudi_mailer@prospectatech.com",
          pass: "Welc0me@cloudi21",
        },
        tls: { rejectUnauthorized: false },
      });
      var mailOptions = {
        from: "cloudi_mailer@prospectatech.com",
        to: visitor.email,
        subject: "User Activation",
        html:
          '<body style="backgroud-color:white;margin-left:30px;"><div class="container"><p style="font-size:16px;color:green">Hello Mr/Mrs ' +
          req.body.visitorName +
          " your visit is scheduled on" +
          '<style="font-size:16px;color:red">' +
          req.body.visitDate +
          " at " +
          '<style="font-size:16px;color:red">' +
          req.body.visitTime +
          "<p> Here is your verification code " +
          verificationCode +
          "</p></div><body>",
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return res
            .status(400)
            .json({ message: " Please try again after some time." });
        }
        return res.status(200).json({
          success: true,
          message:
            "A verification email has been sent to " +
            req.body.email +
            ". It will be valid upto 24 hours.",
        });
      });
    }
    visitor.save((err, visitor) => {
      if (err) {
        return res.json({ message: err.message });
      } else {
        return res.status(200).json({ success: true });
      }
    });
  }
  );
});

router.get("/get-vistor", async (req, res) => {

  try {
    let filter;

    if (!req.query.companyId) {
      return res.status(400).send("companyID required");
    }

    if (req.query.visitDate) {
      filter = {
        companyId: req.query.companyId,
        visitDate: new Date(req.query.visitDate),
      };
    } else {
      filter = {
        companyId: req.query.companyId,
      };
    }
    companyCollection = company;
    let filters = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "companyId",
          as: "companyData",
          pipeline: [
            {
              $project: {
                _id: 0,
                companyname: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$companyData" },
      { $sort : {visitDate: -1}}
      
    ];
    let visitorsList = await visitor.aggregate(filters);
    let finalvistorsData = [];
    if(!req.query.Action){
      for (let i = 0; i < visitorsList.length; i++) {
        if (visitorsList[i].checkoutUid == "" ) {
          finalvistorsData.push(visitorsList[i]);
        }
      }
    
    }else {
      finalvistorsData = visitorsList;
    
    }
    if (finalvistorsData) {
      res.status(200).send(finalvistorsData);
    } else {
      res.status(400).send({ message: err });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/visitor_update_data", async (req, res) => {
  try {
    if (!req.body.companyId) {
      return res.status(400).send("companyID required");
    } else {
      const visitordata = await Visitor.findOneAndUpdate(
        { companyId: req.body.companyId },
        { $set: req.body },
        { returnNewDocument: true }
      );
      res.status(200).send({ updated: true, updatedObj: visitordata });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

//---------------------------------------check in -----------------------------//
router.post("/check_in", async (req, res) => {
  try {
    otp = req.body.verificationCode;
    checkinUid = req.body.checkinUid;
    phoneNumber = req.body.phoneNumber;
    var d = new Date();
    let chcekinvisitor = d.toTimeString().split(" ")[0];
    data = await Visitor.find({
      phoneNumber: req.body.phoneNumber,
    });

    if (data != null) {
      if (data[0].verificationCode == otp) {
        x = await Visitor.findOneAndUpdate(
          { phoneNumber: req.body.phoneNumber },
          {
            $set: {
              checkin: chcekinvisitor,
              checkout: "",
              checkinUid: checkinUid,
            },
          }
        );
        res.status(200).json({ message: "updated", success: true });
      } else {
        res.status(400).json({ message: "enter valid otp" });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//--------------------------------------checkout-------------------------------------//

router.post("/check_out", async (req, res) => {
  try {
    otp = req.body.verificationCode;
    checkoutUid = req.body.checkoutUid;
    phoneNumber = req.body.phoneNumber;
    var date = new Date();
    checkoutvisitor = date.toTimeString().split(" ")[0];
    data = await Visitor.find({
      phoneNumber: req.body.phoneNumber,
    });
    if (data != null) {
      if (data[0].verificationCode == otp) {
        x = await Visitor.findOneAndUpdate(
          { phoneNumber: req.body.phoneNumber },
          { $set: { checkout: checkoutvisitor, checkoutUid: checkoutUid } }
        );
        res.status(201).send({ status: 200, res: "updated", success: true });
      } else {
        res.status(400).json({ message: "enter valid otp" });
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "Please checkin first" });
  }
});

router.delete("/delete-visitor", async (req, res) => {
  try {
    await Visitor.findOneAndDelete({ companyId: req.query.companyId });
    res.status(201).send({ status: 200, delete: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

//------------------------visitor-list-----------------------------//

router.post("/visitor-list", async (req, res) => {
  try {

    if (!req.body.companyId) {
      res.status(400).send({ msg: "Company Id required" })
    }

    let date = new Date();
    let firstday = new Date(date.getFullYear(), date.getMonth(), 1)
    let lastday = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    let filter, startDate, endDate;

    if (!req.body.startDate && !req.body.endDate) {
      startDate = new Date(firstday),
        endDate = new Date(lastday)
    } else {

      startDate = new Date(req.body.startDate),
        endDate = new Date(req.body.endDate)

    }

    filter = [{
      $match: {
        companyId: req.body.companyId,
        visitDate: {
          $gte: startDate,
          $lte: endDate
        },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "companyId",
        as: "companyData",
        pipeline: [
          {
            $project: {
              _id: 0,
              companyname: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$companyData" },
    ];

    
    let data = await Visitor.aggregate(filter);
    res.status(200).send(data);

  } catch (err) {
    console.log("err", err);
    res.status(400).send(err);
  }
});

//-------------------search--------------------------//

router.post("/search", async (req, res) => {
  try {
    let filter;
    if (typeof req.body.searchkeyword == "string") {
      filter = {
        visitorName: req.body.searchkeyword,
      };
    } else if (typeof req.body.searchkeyword == "number") {
      filter = {
        $or: [
          { phoneNumber: req.body.searchkeyword },
          {
            verificationCode: req.body.searchkeyword,
          },
        ],
      };
    }
    let data = await Visitor.find(filter);

    let arrr = [];
    for (let i = 0; i < data.length; i++) {
      arrr.push(data[i]);
    }
    res.status(200).send(data);
  } catch (error) {
    console.log("err", error);

    res.status(400).send(error);
  }
});

module.exports = router;
