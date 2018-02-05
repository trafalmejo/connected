var express = require('express')
var app = express()
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser); 


app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/process', function (req, res) {


    var start1 = new Date(req.body.start1);
    var start2 = new Date(req.body.start2);
    var start3 = new Date(req.body.start3);
    var start4= new Date(req.body.start4);
    var end1 = new Date(req.body.end1);
    var end2 = new Date(req.body.end2);
    var end3 = new Date(req.body.end3);    
    var end4 = new Date(req.body.end4);
    var range1, range2, range3, range4;
    var partime1 =  Boolean(req.body.partime1);
    var partime2 =  Boolean(req.body.partime2);
    var partime3 =  Boolean(req.body.partime3);
    var partime4 =  Boolean(req.body.partime4);
;


	if(start1.toString() == "Invalid Date" || end1.toString() == "Invalid Date"){
	range1 = 0;
	}
	else{
			range1 = partime1 ? Math.abs(end1 - start1  + 86400000)*.5 : Math.abs(end1 - start1 + 86400000);

	}
		if(start2.toString() == "Invalid Date" || end2.toString() == "Invalid Date"){
	
range2 = 0;

	}else{
			range2 = partime2 ? Math.abs(end2 - start2  + 86400000)*.5 : Math.abs(end2 - start2 + 86400000);

	}
		if(start3.toString() == "Invalid Date" || end3.toString() == "Invalid Date"){
	
range3 = 0;

	}
	else{
			range3 = partime3 ? Math.abs(end3 - start3  + 86400000)*.5 : Math.abs(end3 - start3 + 86400000);

	}
if(start4.toString() == "Invalid Date" || end4.oString() == "Invalid Date"){
range4 = 0;

	}
	else{

			range4 = partime4 ? Math.abs(end4 - start4  + 86400000)*.5 : Math.abs(end4 - start4 + 86400000);

	}
	

    var milliseconds = Math.abs(range1+range2+range3+range4);
    //var milliseconds = Math.abs((end1 - start1))
	var days = 365 - (milliseconds / (1000*60*60*24));
	if(days < 0){
		days = 0 ;
	}

	var data = {opt: {name: "Shawn", number: days}};
    res.render('result.ejs', data);

    //res.send("<html><body><h1>"+ "Little Sunshine" + ", you have: " + days + " days left to do another OPT"+"</h1></body></html>");


})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/somethingelse', function (req, res) {
  res.send('Hello World!');
});