/*
	Simple HTTP/HTTPS request example
	Demonstrates a POST request with the body sent as JSON
	created 19 April 2015
	by Tom Igoe
	based on node.js and stackoverflow examples
*/

// you can do this with http or https:
var http = require('https');

var serialport = require('serialport');// include the library
// get port name from the command line:
//var portName = process.argv[2];
var portName = "/dev/ttyACM0";

var tempeture = 25;

var myPort = new serialport(portName);

var Readline = serialport.parsers.Readline; // make instance of Readline parser
var parser = new Readline(); // make a new parser to read ASCII lines
myPort.pipe(parser); // pipe the serial stream to the parser

myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.baudRate);
}
 
function readSerialData(data) {
   //console.log(data);
   tempeture = 25;

}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}


// make the POST data a JSON object and stringify it:
var postData =JSON.stringify(
  {"macAddress":"B8:27:EB:D5:2F:C3", "sessionKey": "c2e5b2fa-2c4c-4c66-9509-7b61bb5c36d9", "data": {"temp":"25"}}
  );

/*
 set up the options for the request.
 the full URL in this case is:
 http://example.com:443/login
*/

var options = {
  host: 'connected-devices-itp.herokuapp.com',
  port: 443,
  path: '/add',
	method: 'POST',
	headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

/*
	the callback function to be run when the response comes in.
	this callback assumes a chunked response, with several 'data'
	events and one final 'end' response.
*/
function callback(response) {
  var result = '';		// string to hold the response

  // as each chunk comes in, add it to the result string:
  response.on('data', function (data) {
    result += data;
  });

  // when the final chunk comes in, print it out:
  response.on('end', function () {
    console.log('result: ' + result);
  });
}

// make the actual request:
function addTemp(){
console.log("tempeture: " + tempeture);
var request = http.request(options, callback);  // start it
request.write(postData);              // send the data
request.end();  
}

 if(typeof tempeture == 'undefined'){
console.log("ERROR: tempeture is undefined");
  }else{
//console.log("tempeture: " + tempeture);
//addTemp();
setInterval(addTemp, 1000*60*60);
}