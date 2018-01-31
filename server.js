var express = require('express')
var app = express()
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser); 


app.use(express.static('public'));


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/process', function (req, res) {

    var name = req.body.username;

    var start1 = new Date(req.body.start1);
    var start2 = new Date(req.body.start2);
    var start3 = new Date(req.body.start3);
    var end1 = new Date(req.body.end1);
    var end2 = new Date(req.body.end2);
    var end3 = new Date(req.body.end3);

	//var days = Math.abs(start1-end1) / (1000*60*60*24);

	// var days = (int) (milliseconds / (1000*60*60*24));
	if(name == " "){
		name = "Hey little sunshine";
	}
	if(start1.toString() == "Invalid Date" || end1.toString() == "Invalid Date"){
		start1 = 0;
		end1 = 0;
	}
		if(start2.toString() == "Invalid Date" || end2.toString() == "Invalid Date"){
		start2 = 0;
		end2 = 0;
	}
		if(start3.toString() == "Invalid Date" || end3.toString() == "Invalid Date"){
		start3 = 0;
		end3 = 0;
	}

     var milliseconds = Math.abs((end1 - start1)+(end2 - start2)+(end3 - start3))
    //var milliseconds = Math.abs((end1 - start1))
	var days = 365 - Math.floor((milliseconds / (1000*60*60*24)));



    res.write("<html><body><h1>"+name + ", your have: " + days + " days left to do another OPT"+"</h1></body></html>");

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/somethingelse', function (req, res) {
  res.send('Hello World!');
});