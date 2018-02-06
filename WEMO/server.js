


// var Wemo = require('wemo-client');
// var wemo = new Wemo();

// wemo.discover(function(err, deviceInfo) {
//   console.log('Wemo Device Found: %j', deviceInfo);
 
//   // Get the client for the found device
//   var client = wemo.client(deviceInfo);
 
//   // You definitely want to listen to error events (e.g. device went offline),
//   // Node will throw them as an exception if they are left unhandled  
//   client.on('error', function(err) {
//     console.log('Error: %s', err.code);
//   });
 
//   // Handle BinaryState events
//   client.on('binaryState', function(value) {
//     console.log('Binary State changed to: %s', value);
//   });
 
//   // Turn the switch on
//   client.setBinaryState(1);
// });


// // Repeat discovery as some devices may appear late
// setInterval(function() {
//   console.log("Happening every 15 seconds");
//   wemo.discover();
// }, 15000);


var SetupURL = "http://device_ip:device_port/setup.xml";
var ip = "128.122.6.159";
var port = 49153;
var route = "/upnp/control/basicevent1";  // API route
var soap;                        // string for the SOAP request
var wemoState = 1;              // whether the WeMo is on or off
var soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
  soap += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\"";
  soap += "s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">";
  soap += "<s:Body>";
  soap += "<u:SetBinaryState xmlns:u=\"urn:Belkin:service:basicevent:1\">";
  soap += "<BinaryState>1</BinaryState></u:SetBinaryState>";
  soap += "</s:Body></s:Envelope>";

var Wemo = require('wemo-client');
var wemo = new Wemo();
var client;
var deviceWe;
var stateActual = 'off';
var binaryState;


function cb(err, device) {

  if (device.deviceType === Wemo.DEVICE_TYPE.Switch) {
    deviceWe = device;
    console.log('Wemo Switch found: %s', device.friendlyName);

   client = this.client(device);
   client.getBinaryState(state);
  console.log('Switch %s is %s', deviceWe.deviceType, binaryState);
  if(binaryState == 1){
      stateActual = "on"; 
   }else{
      stateActual = "off"; 
  }
  }
}

 // client.on('binaryState', function(value) {
 //    console.log('Binary State changed to: %s', value);
 //  });


     // Toggle the switch every two seconds
    setInterval(function() {
 if(binaryState == 1){
client.setBinaryState(0);
 }else{
client.setBinaryState(1);
  }
        client.setBinaryState(stateActual === 'on' ? 0 : 1);
        console.log(stateActual);

    }, 500);

    wemo.load("http://128.122.6.170:49153/setup.xml", cb);


    function state(err, value){
     binaryState = value;
      console.log("error %s", err);
    }