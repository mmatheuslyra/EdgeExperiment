const mongoose = require('mongoose');

const MonitorOrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
        monitoringOrder: { 
        words: [String]
    },
    dateTime:String
});

module.exports = mongoose.model('MonitorOrder', MonitorOrderSchema);