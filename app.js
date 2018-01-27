let fs = require('fs');
const https = require("https");
const CronJob = require('cron').CronJob;

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(port, () => console.log(`App listening on port ${port}!`));

let spotURL = "https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0hN62C8mlLHPINqVLLi8qAv2qonI9biev/message.json?limit=10"
const googleElevation = "https://maps.googleapis.com/maps/api/elevation/json?key=AIzaSyCaatjrKpdC3wvr_5AFLmA-ssobawWVAmo";

updateData();
new CronJob('0 */5 * * * *', () => {
  updateData();
}, null, true, 'Europe/Warsaw');

function addData(newData) {
    fs.readFile('public/data.json', 'utf8', function(err, contents) {
        let data = JSON.parse(contents);

        let messages = newData.response.feedMessageResponse.messages.message
        let oldMessages = data.response.feedMessageResponse.messages.message
        console.log(messages.length);
        messages = messages.filter((m) => !(oldMessages.some((element) => element.unixTime === m.unixTime)))
        console.log(messages.length);

        let locations = "&locations=";

        messages.forEach(msg => {
            locations += (msg.latitude + "," + msg.longitude + "|")
        });
        locations = locations.slice(0, -1);

        https.get(googleElevation + locations, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
              body += data;
            });
            res.on("end", () => {
                let elevations = JSON.parse(body).results;
                console.log(elevations);
                for (let i = 0; i < elevations.length; i++) {
                    console.log(elevations[i].elevation);
                    messages[i].altitude = elevations[i].elevation
                }

                data.response.feedMessageResponse.messages.message = [...messages, ...oldMessages]
                fs.writeFile('public/data_elevation.json', JSON.stringify(data), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            });
        });
    });

    
}

function updateData() {

    https.get(spotURL, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", () => {
          let data = body;
          if (body.indexOf("messages") != -1) {
            console.log(body);
            addData(JSON.parse(body));
          } else {
            console.log("ERR" + body);
          }
        });
    });
}

updateData();