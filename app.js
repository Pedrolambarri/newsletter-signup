import express from "express";
import https from "https";
import bodyParser from "body-parser";
import request from "request";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// {"email_address": "$user_email","status": "subscribed","merge_fields": {"FNAME": "$user_fname" "LNAME": "$user_lname"}}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/a6e1377581";

  const options = {
    method: "POST",
    auth: process.env.my_key,
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(3000, (req, res) => {
  console.log("app listening on port 3000");
});

// API c6ea6a9421cdebb22ea22904bc706121-us5

// List ID

// a6e1377581
