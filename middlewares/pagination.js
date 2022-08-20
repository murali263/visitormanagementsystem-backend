function paginatedResults(model) {
  // console.log("model", model)
  return async (req, res, next) => {
  // console.log("req query", req.query)
//  if(req.query.searchkeyword)

//   {
//     console.log("else executed",req.query)
//     next()
//   }
//   else
//  {
    // console.log("search keyword",req.query.searchkeyword);
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    // console.log("page", page);
    // console.log("limit", limit);

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
      //  console.log("end",endIndex);
      //  console.log("start",startIndex);
    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      // var users
      if (Object.keys(req.query).length == 3) {
      //  console.log(req.query);
        // users = await User.find({ role: req.query.role });
        results.results = await model.find({ role: req.query.role }).limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      }
      else if (Object.keys(req.query).length == 4) {
      //  console.log(req.query);
        results.results = await model.find({ role: req.query.role, scode: req.query.scode }).limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      }
      else 
      {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        // console.log("results",results);
        next()
      }
      // console.log("pagination",results);


      // console.log(results);
      // next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  // }
  }
}

module.exports = paginatedResults