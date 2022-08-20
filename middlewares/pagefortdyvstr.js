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

      var todaydate = formatDate();

      try {
       

        if (Object.keys(req.query).length == 3) {
             results.results = await model.find({ $and: [
                { visit_date: todaydate }, 
                { sez_code: req.query.scode }, 
                { $or: [{ checkout: null }, { checkin: null }] }] }).limit(limit).skip(startIndex).exec();
   
                results.count = await model.countDocuments({ $and: [
                    { visit_date: todaydate }, 
                    { sez_code: req.query.scode }, 
                    { $or: [{ checkout: null }, { checkin: null }] }] });
                res.paginatedResults = results
               next()
      
          }
          else if (Object.keys(req.query).length == 4) {
            var todayvisitors = await model.find({ $and: [
                { visit_date: todaydate },
                 { sez_code: req.query.scode },
                  { $or: [{ checkout: null }, { checkin: null }] }] }).limit(limit).skip(startIndex).exec();

            results.results=[];
            for(let v of todayvisitors)
            {
              
              if(v.vehicle_number.toLowerCase().includes(req.query.vehicle_number.toLowerCase()))
              {
                results.results.push(v)
      
              }
            }

            results.count =  results.results.length
            res.paginatedResults = results
            //res.status(500).json({ message: e.message })
            next()
          }
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    // }
    }
  }
  
  function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
  module.exports = paginatedResults