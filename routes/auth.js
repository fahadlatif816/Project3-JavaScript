let express = require('express');
let User = require('../model/users');
let nodemailer = require('nodemailer');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

let router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
    if(req.session.email===undefined)
    {
        res.render('login');
    }
    else {
        res.redirect('/dashboard');
    }
});

router.post('/postLogin',function (req,res,next) {
    let query={username:req.body.username,password:req.body.password};

    User.find(query, (err, users)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(users.length>0)
            {
                req.session.name=users[0].name;
                req.session.email=users[0].email;
                req.session.userId=users[0]._id;
                res.redirect('/dashboard');
            }
            else
            {
                res.send("Incorrect Username or Password.");
            }
        }
    });
});


router.get('/logout',function(req,res,next){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });

});

router.get('/changePassword',function(req,res,next){
    if(req.session.email===undefined)
    {
        res.redirect('sessionOut');
    }
    else
    {
        res.render('changePassword',{name:req.session.name});
    }
});

router.get('/sessionOut',function(req,res,next){
    res.render('sessionOut');
});

router.post('/postChangePassword',function (req,res,next) {

    let query={_id:req.session.userId,password: req.body.oldpwd};
    User.findOne(query,function (err,user) {
        if(err){
            console.log(err);
        }
        if(user)
        {
            if(req.body.newpwd===req.body.confirmnewpwd){
                user.password=req.body.newpwd;
                user.save((err,user)=>{
                    res.redirect("/dashboard");
                });
            }
        }
        else {
            res.send("Incorrect Old Password.");
        }
    });

});


router.get('/ForgetPassword',(req,res,next)=>{
    if(req.session.email===undefined)
    {
        res.render('sendMail');
    }
    else
    {
        res.redirect('/dashboard');
    }
});


router.post('/postForgetPassword',(req,res,next)=>{
   let query = {email:req.body.emailAddress};
    User.findOne(query,(err,data)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(data)
            {
                let encryptedEmail = encrypt(req.body.emailAddress.toString());
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'fahadlatif816@gmail.com',
                        pass: 'PakistaNN123#'
                    }
                });
                let mailOptions = {
                    from: 'fahadlatif816@gmail.com',
                    to: req.body.emailAddress,
                    subject: 'Reset Password | Folio3 Attendance System',
                    html: '<p> Click the <a href="http://localhost:3000/auth/resetPassword?email=' +encryptedEmail.encryptedData+'&iv='+encryptedEmail.iv + '">link</a>' + ' to reset the password </p>'
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        res.send('Email sent: ' + info.response);
                    }
                });
            }
            else
            {
                res.send("The email you typed doesnt belongs to any records.")
            }
        }
    })
});

router.get('/resetPassword',(req,res,next)=>{
    if(req.session.email===undefined)
    {
        let encryptedEmail = {
            iv:req.query.iv,
            encryptedData:req.query.email
        };

        let decryptedEmail = decrypt(encryptedEmail);

        let encryptEmailAgain = encrypt(decryptedEmail);

        console.log(decryptedEmail);

        let query={email:decryptedEmail};
        User.findOne(query,(err,data)=>{
            if(err)
            {
                console.log(err)
            }
            if(data)
            {
                res.render("resetPassword",{email:encryptEmailAgain});
            }
            else {
                res.send("User with email is not registered!!");
            }
        })
    }
    else
    {
        res.redirect("/dashboard");
    }

});


router.post('/postResetPassword',(req,res,next)=>{
    let email = req.body.encryptedData;
    let iv = req.body.iv;


    let encryptedEmail = {
        iv:iv,
        encryptedData:email
    };

    let decryptedEmail = decrypt(encryptedEmail);



    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;

    if(newPassword===confirmPassword)
    {
        let query = {email:decryptedEmail};
        User.findOne(query,(err,data)=>{
            if(err)
            {
                console.log(err)
            }
            if (data)
            {
                data.password=newPassword;
                data.save();
                res.redirect('/');
            }
            else
            {
                res.send("User Not Found");
            }

        })
    }
    else {
        res.send("Passwords didnt matched.")
    }
});

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = router;