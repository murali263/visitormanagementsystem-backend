function paginatedResults1(model) {
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
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        // console.log("page", page);
        // console.log("limit", limit);

        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        var todaydate = formatDate();

        const results = {}
        // console.log("end", endIndex);
        // console.log("start", startIndex);
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

            if (Object.keys(req.query).length == 5) {

                results.results = await model.find({
                    $and: [
                        { sez_code: req.query.scode },
                        { visit_date: { $gte: req.query.start_date, $lte: req.query.end_date } },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }
                    ]
                }).limit(limit).skip(startIndex).exec();
                // console.log("datefilter",visitorslog);
                results.count =  await model.countDocuments({
                    $and: [
                        { sez_code: req.query.scode },
                        { visit_date: { $gte: req.query.start_date, $lte: req.query.end_date } },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }
                    ]
                });
                res.paginatedResults = results;
                next()
            }
            else if (Object.keys(req.query).length == 6) {
                results.results = await model.find({
                    $and: [
                        { sez_code: req.query.scode },
                        { company_code: req.query.company_code },
                        { visit_date: { $gte: req.query.start_date, $lte: req.query.end_date } },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }]
                }).limit(limit).skip(startIndex).exec();

                results.count = await model.countDocuments({
                    $and: [
                        { sez_code: req.query.scode },
                        { company_code: req.query.company_code },
                        { visit_date: { $gte: req.query.start_date, $lte: req.query.end_date } },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }]
                });
                res.paginatedResults = results;
                next()
            }
            else if (Object.keys(req.query).length == 4) {
                results.results = await model.find({
                    $and: [
                        { sez_code: req.query.scode },
                        { company_code: req.query.company_code },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }]
                }).limit(limit).skip(startIndex).exec();
                
                results.count = await model.countDocuments({
                    $and: [
                        { sez_code: req.query.scode },
                        { company_code: req.query.company_code },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }]
                });

                res.paginatedResults = results;
                next()
            }
            else if (Object.keys(req.query).length == 3) {

                // console.log("query",req.query);

                results.results = await model.find({
                    $and: [
                        { sez_code: req.query.scode },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }]
                }).limit(limit).skip(startIndex).exec();

                
                results.count = await model.countDocuments({
                    $and: [
                        { sez_code: req.query.scode },
                        { checkout: { $ne: null } },
                        { checkin: { $ne: null } }]
                });
                
                res.paginatedResults = results;
    // console.log("model", "ajay")

                // console.log(results);
                next()
            }







        } catch (e) {
            res.status(500).json({ message: e.message })
        }

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

module.exports = paginatedResults1