const mongoose = require('mongoose');
const statescitys = new mongoose.Schema({
    state: {
        type: String
    },
    districts: {
        type: Array
    }

})
const StatesData = mongoose.model('StatesData', statescitys, 'StatesData')
module.exports = StatesData