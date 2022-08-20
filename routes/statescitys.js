const express = require('express')
const router = express.Router();
const statescitys = require('../models/statescitys')

router.get('/getcitys', async (req, res) => {
   const statesandcitys = await statescitys.find()
   if (!statesandcitys) {
      res.status(500).json({ success: false })
   }
   res.status(200).send(statesandcitys);

})

module.exports = router