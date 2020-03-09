let mongoose = require('mongoose');

let attendanceSchema = mongoose.Schema({
    timeIn:{
        type:Date,
    },
    timeOut:{
        type:Date,
    },
    currDate:{
        type:String,
        required: true
    },
    userId:{
        type:Object,
        required: true
    }
});


module.exports = mongoose.model('attendance', attendanceSchema);