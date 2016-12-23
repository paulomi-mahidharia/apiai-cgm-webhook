/**
 * Created by nubxs54 on 6/8/16.
 */
var express = require('express');
var bodyParser = require('body-parser');
var multer  =   require('multer');
var path = require('path');

var app = express();
app.use(express.static(__dirname));
//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080, function(){
    console.log("Started server at 8080");
}); // http://localhost:8080

app.get('/logan/:infoType', function(req, res) {
  var type = req.params.infoType;
  console.log(type);
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://logancgm.azurewebsites.net/api/v1/entries.json?count=1", false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);
  var parsedResponse = response[0][type];
  if(typeof parsedResponse !== "undefined"){
    var webHookResponse = makeWebhookResult(type, parsedResponse);
    res.json(webHookResponse);
  }else{
    res.json({});
  }

});

function makeWebhookResult(type, parsedResponse){
  var speech = "Logan's " + type + " is " + parsedResponse;

    return {
        "speech": speech,
        "displayText": speech,
        "source": "apiai-cgm-webhook"
    }
}
