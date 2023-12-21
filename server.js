const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const nodemailer = require('nodemailer')


const app = express();
app.use(bodyparser.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

// MongoDB Databases
const connexion = require('./connexion')
const Login  = require('./Schemas/Login')
const Forms = require('./Schemas/Forms')

// node mailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anitsedusphere2000@gmail.com',
        pass: 'bmlsiuptkwcbfcis',
    },
});

app.post('/login',(req,res) => {
    const uname = req.body.uname
    const pwd = req.body.pwd
    Login.find({username:uname,password:pwd})
    .then(response => {
      console.log(response);
        if(response.length>0){
            res.status(200).send({login:true,role:response[0].role,fname:response[0].fullname})
        }else{
            res.status(200).send({login:false})
        }
    }) 
    .catch(err => {
        console.log(err);
        res.status(404).send({login:false})
    })
})


app.post('/getforms',async (req,res) => {
  const role = req.body.role;
  await Forms.find({role:role},{_id:1,formname:1})
  .then(response => {
    res.status(200).send(response)
  })
  .catch(err => {
    res.status(404).send(err)
  })
})

app.post('/getform',async (req,res) => {
  const id = req.body.id;
  await Forms.findById(id)
  .then(response => {
    res.status(200).send(response)
  })
  .catch(err => {
    res.status(404).send(err)
  })
})

app.post('/forgotpassword',(req,res) => {
    Login.find({username:req.body.uname})
    .then(res1 => {
        if(res1.length > 0) {
            const mailOptions = {
                from : 'anitsedusphere2000@gmail.com',
                to : res1[0].username,
                subject : 'Password Recovery Mail',
                html: `<!DOCTYPE html>
                <html>
                <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    text-align: center;
                    margin-bottom: 20px;
                  }
                  .header img {
                    max-width: 200px;
                    height: auto;
                  }
                  .content {
                    padding: 20px;
                    border-top: 1px solid #e0e0e0;
                  }
                  .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                  }
                </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <img src="https://onlinesystem.anits.edu.in/images/logo.png" alt="Logo">
                      <h1 class="">Password Reset</h1>
                    </div>
                    <div class="content">
                      <p>Hello,</p> 
                      <p>We received a request to reset your password. To proceed, click the button below:</p>
                      <p style="color:'white'"><a class="btn" href="http://localhost:3000/sreset/${req.body.euname}">Reset Password</a></p>
                      <p>If you didn't request a password reset, please ignore this email.</p>
                      <p>Best regards,<br>Anits Edusphere</p>
                    </div>
                  </div>
                </body>
                </html>
                ` 
            };  
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
                    return error.message
                }
            });    
            res.status(200).json(true);
        }
        else{
            res.status(200).json(false);
        }
    })
    .catch((err) => {
      res.status(500).json(false);
    })
})

app.post('/resetpassword',(req,res) => {
    console.log(req.body);
    const uname = req.body.uname;
    const pass = req.body.pass;
    Login.updateOne({username:uname},{$set:{password:pass}})
    .then((response) => {
        response.acknowledged ? res.status(200).json(true)  : res.status(404).json(false);
        console.log(response);
    })
})

app.listen(8000,() => {
    console.log("Listening on 8000");
})
