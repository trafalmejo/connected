var WeMo = require('wemo.js');

WeMo.discover(function(wemos) {

  console.log(wemos);
});

var client = WeMo.createClient('128.122.6.159'); // x.x.x.x being the IP of the WeMo obtained in the previous step

client.state(function(err,state) {

  if (state===1) {
    // WeMo if on, turn it off
    client.off();
  } else {
    // WeMo is off, turn it on
    client.on();
  }
});
