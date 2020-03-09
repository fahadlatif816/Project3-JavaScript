let express = require('express');
let router = express.Router();
let Attendance = require('../model/attendance');

router.post('/markTimeIn', function(req, res, next) {
  if(req.session.userId===undefined)
  {
    res.redirect('/auth/sessionOut');
  }
  else
  {
    let today = new Date();
    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let query={userId:req.session.userId,currDate:date};
    Attendance.findOne(query,(err,data)=>{
      if(err)
      {
        console.log(err);
      }
      if(data.timeIn===undefined)
      {
        data.timeIn=Date.now();
        data.save();
      }
      res.redirect('/dashboard');
  });
  }
});

router.post('/markTimeOut', function(req, res, next) {
  if(req.session.userId===undefined)
  {
    res.redirect('/auth/sessionOut');
  }
  else
  {
    let today = new Date();
    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let query={userId:req.session.userId,currDate:date};
    Attendance.findOne(query,(err,data)=>{
      if(err)
      {
        console.log(err);
      }
      data.timeOut=Date.now();
      data.save();
      console.log(data);
      res.redirect('/dashboard');
    });
  }
});

router.post('/ViewReport',(req,res,next)=>{
  if(req.session.email===undefined)
  {
    res.redirect('/auth/sessionOut');
  }
  else
  {
    let fDate = Date.parse(req.body.fromViewCalendarReport);
    let tDate = Date.parse(req.body.toViewCalendarReport);

    let month = [];
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    let days = [];
    days[1] = "Monday";
    days[2] = "Tuesday";
    days[3] = "Wednesday";
    days[4] = "Thursday";
    days[5] = "Friday";
    days[6] = "Saturday";
    days[0] = "Sunday";

    let fromDate = month[new Date(req.body.fromViewCalendarReport).getMonth()] + " " + new Date(req.body.fromViewCalendarReport).getDate() + ", " + new Date(req.body.fromViewCalendarReport).getFullYear();
    let toDate = month[new Date(req.body.toViewCalendarReport).getMonth()] + " " + new Date(req.body.toViewCalendarReport).getDate() + ", " + new Date(req.body.toViewCalendarReport).getFullYear();

    let query = {userId:req.session.userId};
    Attendance.find(query,(err,data)=>{
      if(data)
      {
        let dataArray=[];
        for(let i = 0; i<data.length;i++)
        {
          let currDateSplit = data[i].currDate.split('-');
          let currDate = Date.parse(currDateSplit[2]+"-"+currDateSplit[1]+"-"+currDateSplit[0]) ;
          let timeOutHours,timeOutMinutes,timeOutSeconds;
          let timeInHours,timeInMinutes,timeInSeconds;
          if(data[i].timeOut!==undefined && data[i].timeOut!==null)
          {
            timeOutHours = data[i].timeOut.getHours()<10 ? "0"+data[i].timeOut.getHours():data[i].timeOut.getHours();
            timeOutMinutes = data[i].timeOut.getMinutes()<10 ? "0"+data[i].timeOut.getMinutes():data[i].timeOut.getMinutes();
            timeOutSeconds = data[i].timeOut.getSeconds()<10 ? "0"+data[i].timeOut.getSeconds():data[i].timeOut.getSeconds();
          }
          else {
            timeOutHours="00";
            timeOutMinutes="00";
            timeOutSeconds="00";
          }

          if(data[i].timeIn!==undefined && data[i].timeIn!==null)
          {
            timeInHours = data[i].timeIn.getHours()<10 ? "0"+data[i].timeIn.getHours():data[i].timeIn.getHours();
            timeInMinutes = data[i].timeIn.getMinutes()<10 ? "0"+data[i].timeIn.getMinutes():data[i].timeIn.getMinutes();
            timeInSeconds = data[i].timeIn.getSeconds()<10 ? "0"+data[i].timeIn.getSeconds():data[i].timeIn.getSeconds();
          }
          else {
            timeInHours="00";
            timeInMinutes="00";
            timeInSeconds="00";
          }

          if(currDate+86400000 >fDate && currDate<=tDate)
          {
            let d1 = (new Date("04/03/2020 "+ timeOutHours+':'+ timeOutMinutes +':'+ timeOutSeconds));
            let d2 = (new Date("04/03/2020 "+ timeInHours+':'+ timeInMinutes +':'+ timeInSeconds));


            let obj ={
              timeIn: data[i].timeIn === undefined ? "-" : timeInHours+':'+ timeInMinutes +':'+ timeInSeconds ,
              timeOut:data[i].timeOut === undefined ? "-" : timeOutHours+':'+timeOutMinutes+':'+timeOutSeconds ,
              currDate:data[i].currDate,
              day: days[(new Date(currDateSplit[2]+"-"+currDateSplit[1]+"-"+currDateSplit[0])).getDay()],
              month: month[parseInt(currDateSplit[1])-1],
              date:currDateSplit[0],
              year:currDateSplit[2],
              timeDiff: data[i].timeIn===undefined || data[i].timeOut===undefined ? "-" : parseMillisecondsIntoReadableTime(d1-d2)
            };
            dataArray.push(obj);

          }

        }
        dataArray=dataArray.reverse();
        res.render("ViewReport",{data:dataArray,fromDate:fromDate,toDate:toDate,name:req.session.name});
      }

    });
  }

});



router.post('/MarkMissing',(req,res,next)=>{
  if(req.session.email===undefined)
  {
    res.redirect('/auth/sessionOut');
  }
  else
  {
    let fDate = Date.parse(req.body.fromViewCalendarReport1);
    let tDate = Date.parse(req.body.toViewCalendarReport1);

    let month = [];
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    let days = [];
    days[1] = "Monday";
    days[2] = "Tuesday";
    days[3] = "Wednesday";
    days[4] = "Thursday";
    days[5] = "Friday";
    days[6] = "Saturday";
    days[0] = "Sunday";

    let query = {userId:req.session.userId};
    Attendance.find(query,(err,data)=>{
      if(data)
      {
        let dataArray=[];
        for(let i = 0; i<data.length;i++)
        {
          let currDateSplit = data[i].currDate.split('-');
          let currDate = Date.parse(currDateSplit[2]+"-"+currDateSplit[1]+"-"+currDateSplit[0]) ;
          let timeOutHours,timeOutMinutes,timeOutSeconds;
          let timeInHours,timeInMinutes,timeInSeconds;
          if(data[i].timeOut!==undefined && data[i].timeOut!==null)
          {
            timeOutHours = data[i].timeOut.getHours()<10 ? "0"+data[i].timeOut.getHours():data[i].timeOut.getHours();
            timeOutMinutes = data[i].timeOut.getMinutes()<10 ? "0"+data[i].timeOut.getMinutes():data[i].timeOut.getMinutes();
            timeOutSeconds = data[i].timeOut.getSeconds()<10 ? "0"+data[i].timeOut.getSeconds():data[i].timeOut.getSeconds();
          }
          else {
            timeOutHours="00";
            timeOutMinutes="00";
            timeOutSeconds="00";
          }

          if(data[i].timeIn!==undefined && data[i].timeIn!==null)
          {
            timeInHours = data[i].timeIn.getHours()<10 ? "0"+data[i].timeIn.getHours():data[i].timeIn.getHours();
            timeInMinutes = data[i].timeIn.getMinutes()<10 ? "0"+data[i].timeIn.getMinutes():data[i].timeIn.getMinutes();
            timeInSeconds = data[i].timeIn.getSeconds()<10 ? "0"+data[i].timeIn.getSeconds():data[i].timeIn.getSeconds();
          }
          else {
            timeInHours="00";
            timeInMinutes="00";
            timeInSeconds="00";
          }

          if(currDate+86400000 >fDate && currDate<=tDate)
          {
            let d1 = (new Date("04/03/2020 "+ timeOutHours+':'+ timeOutMinutes +':'+ timeOutSeconds));
            let d2 = (new Date("04/03/2020 "+ timeInHours+':'+ timeInMinutes +':'+ timeInSeconds));


            let obj ={
              timeIn: data[i].timeIn === undefined ? "-" : timeInHours+':'+ timeInMinutes,
              timeOut:data[i].timeOut === undefined ? "-" : timeOutHours+':'+timeOutMinutes ,
              currDate:data[i].currDate,
              day: days[(new Date(currDateSplit[2]+"-"+currDateSplit[1]+"-"+currDateSplit[0])).getDay()],
              month: month[parseInt(currDateSplit[1])-1],
              date:currDateSplit[0],
              year:currDateSplit[2],
              reqIn:data[i].reqIn,
              reqOut:data[i].reqOut,
              id:data[i]._id
            };
            dataArray.push(obj);
          }

        }
        dataArray=dataArray.reverse();
        res.render("MarkMissing",{data:dataArray,name:req.session.name,
          fromMissing:req.body.fromViewCalendarReport1,toMissing:req.body.toViewCalendarReport1});
      }

    });
  }

});


router.post('/postMarkMissing',(req,res)=>{

  if(req.session.email===undefined)
  {
    res.redirect('/auth/sessionOut');
  }
  else {
    console.log(req.body);
    for (let i=0;i<req.body.Att_id.length;i++)
    {
      Attendance.findOne({_id:req.body.Att_id[i]},(err,data)=>{
        if(req.body.in[i]!="-")
        {
          let d = new Date();
          let currDateSplit = data.currDate.split('-');
          let timeSplit = req.body.in[i].split(":");
          d.setFullYear(currDateSplit[2],currDateSplit[1],currDateSplit[0]);
          d.setHours(timeSplit[0],timeSplit[1],0);
          data.timeIn=d;
        }
        else {
          data.timeIn=undefined;
        }

        if(req.body.out[i]!="-")
        {
          let d = new Date();
          let currDateSplit = data.currDate.split('-');
          let timeSplit = req.body.out[i].split(":");
          d.setFullYear(currDateSplit[2],currDateSplit[1],currDateSplit[0]);
          d.setHours(timeSplit[0],timeSplit[1],0);
          data.timeOut=d;
        }
        else {
          data.timeOut=undefined;
        }

        data.save();

      });
    }

  }
  res.redirect('/');
  }
);

function parseMillisecondsIntoReadableTime(milliseconds){
  //Get hours from milliseconds
  let hours = milliseconds / (1000*60*60);
  let absoluteHours = Math.floor(hours);
  let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

  //Get remainder from hours and convert to minutes
  let minutes = (hours - absoluteHours) * 60;
  let absoluteMinutes = Math.floor(minutes);
  let m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  let seconds = (minutes - absoluteMinutes) * 60;
  let absoluteSeconds = Math.floor(seconds);
  let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

  console.log(h + ':' + m + ':' + s);
  return h + ':' + m + ':' + s;
}

module.exports = router;
