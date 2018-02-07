
var Wemo = require('wemo-client');
var wemo = new Wemo();
var client;
var deviceWe;
var stateActual = 'OFF';
var binaryState;
var connected;

//EXPRESS SERVER
var express = require('express')
var app = express()

app.use(express.static('public'))

//EJS LIBRARY
app.set('view engine', 'ejs');

// MAIN ROUTE TO INDEX
app.get('/', function (req, res) {
  var data = {data: {value: stateActual}};
  res.render('index.ejs', data);
})

//SERVER LISTENING ON PORT 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

//Toggle route redirect to the same INDEX
app.get('/toggle', function(req, res) {
  //res.send("<html><html>");
  toggle();
  res.redirect('/');
//res.send("Pressed");

});

//TOGGLE CHECK IF THE BULB IS ON OR OF AND TURN IT ON OR OFF ACCORDINLY
function toggle(){
  if(connected){
   if(stateActual == "ON"){
    client.setBinaryState(0);
  }else{
    client.setBinaryState(1);
  }
}
}
//CALLBACK FUNCTION TO KNOW WHAT IS OUR DEVICE
//ONCE IT IS CONNECTED. IT IS NOT GONNA HAPPEN AGAIN
function connectMe(err, device) {

  if (device.deviceType === Wemo.DEVICE_TYPE.Switch) {
    deviceWe = device;
    connected = true;
    console.log('Wemo Switch found: %s', device.friendlyName);
    client = this.client(device);
    console.log('Switch %s:', deviceWe.deviceType);
  }
  else {
    connected = false;
    console.log("Nothing connected");
  }
}

//CATCH ERR AND VALUE OF getBinaryState()
function state(err, value){
 binaryState = value;
 if(binaryState == 1){
  stateActual = "ON"; 
}else{
  stateActual = "OFF"; 
}
// AM I RECEIVING ANYTHING?
// console.log("Error %s", err);
// console.log("Value %s", value);
}

//TRY TO CONNECT ME TO THIS SERVER
wemo.load("http://128.122.6.170:49153/setup.xml", connectMe);

//YOU SHOULD CHECK THE STATUS OF THE BULB EVERY N SECONDS BECAUSE UDP IS NOT RELIALABLE
setInterval(function() { if(connected){
  client.getBinaryState(state);
}}, 500);
