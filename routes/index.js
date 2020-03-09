let express = require('express');
let router = express.Router();
let Attendance = require('../model/attendance');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/auth/login');
});

router.get('/dashboard', function(req, res, next) {
  if(req.session.email===undefined)
  {
    res.redirect('/auth/sessionOut');
  }
  else {
    let today = new Date();
    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let query={userId:req.session.userId,currDate:date};
    Attendance.findOne(query,function (err,data) {
      let timeIn;
      let timeOut;
      if(!data)
      {
        data = new Attendance();
        data.userId=req.session.userId;
        data.currDate=date;
        data.timeIn=undefined;
        data.timeOut=undefined;
        data.save();
      }

      if(data.timeIn===undefined)
      {
        timeIn = " - ";
      }
      else {
        timeIn=data.timeIn.getHours()+':'+(data.timeIn.getMinutes())+':'+data.timeIn.getSeconds();
      }

      if(data.timeOut===undefined)
      {
        timeOut = " - ";
      }
      else {
        timeOut = data.timeOut.getHours()+':'+(data.timeOut.getMinutes())+':'+data.timeOut.getSeconds();
      }
      res.render("Dashboard",{name:req.session.name,timeIn:timeIn,timeOut:timeOut});

    });
  }
});

module.exports = router;
