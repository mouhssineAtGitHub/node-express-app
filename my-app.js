// Nodejs built-in modules
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const os = require("os");
const path = require("path");
// Mailing service module to install before importation
const nodemailer = require("nodemailer");

//My modules
const dt = require("./modules");
const { myPass } = require("./pass");

const app = express();

app.set("trust proxy", true);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



const getContent = (req, page) => {
  //data to append into the tracking file
  const username = os.hostname();
  const ip = req.ip;
  const pageUrl = page;
  const checkingTime = dt.displayDateTime();

  return (content = `User: ${username} User ip:${ip}  Time:${checkingTime} Checked page: ${pageUrl} \r\n`);
};

const trackUser = (req, pageName) => {
  fs.appendFile("track.user.txt", getContent(req, pageName), function(err) {
    if (err) throw err;
    console.log("User Tracking Updated!");
  });
};


app.get("/", function(req, res) {
  trackUser(req, "Home page");
  res.sendFile(path.join(__dirname + "/home.html"));
});

app.get("/home", function(req, res) {
  trackUser(req, "Home page");
  res.sendFile(path.join(__dirname + "/home.html"));
});

app.get("/about", function(req, res) {
  trackUser(req, "About page");
  res.sendFile(path.join(__dirname + "/about.html"));
});

app.get("/contact", function(req, res) {
  trackUser(req, "Contact page");
  res.sendFile(path.join(__dirname + "/contact.html"));
});

app.post("/contact", (req, res) => {
  trackUser(req, "Contact submission page");
  let { firstname, lastname, email, message } = req.body;
  const info = `<h1>Express Node Application</h1>
    <h3>Email sent by mouhssine</h3>
    <p>
    <h3>Form details:</h3>
        firstname: ${firstname}
        <br/> lastname: ${lastname}
        <br/> email: ${email}
        <br/> message: ${message}
        <br/>
        <p>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mouhssineidrissiakhelij1982@gmail.com",
      pass: myPass.pass
    }
  });

  var mailOptions = {
    from: "mouhssineidrissiakhelij1982@gmail.com",
    to: "asabeneh@gmail.com, mouhssineidrissiakhelij1982@gmail.com",
    subject: "Sending Email using Node.js and Express",
    html: "<p>" + info + "</p>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      res.send(error);
    } else {
      res.send("Email sent: " + info.response);
    }
  });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
