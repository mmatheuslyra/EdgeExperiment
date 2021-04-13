const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    deviceId:String,
    deviceParameter: String,
    deviceValue: Number,
    dateTime:String
});

module.exports = mongoose.model('DeviceModel', DeviceSchema);