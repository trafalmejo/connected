/*
	Simple HTTP/HTTPS request example
	created 9 Jan 2015
	by Tom Igoe
	based on node.js and stackoverflow examples
*/

// you can do this with http or https:
var https = require('https');


//curl -i -X POST -H 'Content-Type: application/json' -d '{"macAddress":"B8:27:EB:D5:2F:C3", "sessionKey": "c2e5b2fa-2c4c-4c66-9509-7b61bb5c36d9", "data": {"temp":"76"}}' https://connected-devices-itp.herokuapp.com/add
/*
 set up the options for the request.
 the full URL in this case is:
 https://dweet.io:443/get/latest/dweet/for/equable-men
*/
var options = {
  host: 'https://connected-devices-itp.herokuapp.com',
  port: 443,
  path: '/add'
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
    console.log(result);
  });
}

function addTemp(){
  // make the actual request:
var request = https.request(options, callback); // start it
request.end();    

}

setInterval(addTemp, 1000);
//setInterval(addTemp, 1000 * 60 * 60);

