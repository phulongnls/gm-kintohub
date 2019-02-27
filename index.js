var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')
var fs = require('fs')
, gm = require('gm').subClass({imageMagick: true});
require('dotenv').config()
const IMAGES = './images/';
const PORT = process.env.PORT || '8000'

/**
 * @api {get} /env  Prints "Hello "
 * @apiName env
 * @apiParam (Url) {String} name the name to print
 * @apiSuccess (200) {String} message the hello {name} message
 */

 // create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

 app.get('/resize/:width/:height', function (req, res) {
 	let width = req.params.width;
 	let height = req.params.height;
 	let source = './images/origin/1.jpg';
 	let target = './images/resize/1';
 	let check_resize = resizeImage (source,target,width,height);
 	if (check_resize) {		 

 		res.send ('Resize Image success!');
 	}
 })

 app.get ('/', function (req,res){
 	res.send ('Welcome to Gm demo in KintoBlock ');
 })

 app.get ('/env', function (req,res){
 	res.send ('ENV: AUTO_ORIENT ' + process.env.AUTO_ORIENT + ' | DEFAULT_IMAGE_TYPE: ' + process.env.DEFAULT_IMAGE_TYPE);
 })
// resize and remove EXIF profile data

app.post ('/check_size', urlencodedParser, function (req,res) {
	 if (!req.body) return res.sendStatus(400)
	let image_url =  req.body.image_url;
	console.log (image_url);
	download(image_url, './download/temp_image', function(value){
		console.log('Success download and check size');	
		res.setHeader('Content-Type', 'application/json');
  		res.end(JSON.stringify(value));		
	});	
})
function resizeImage (source,target,width,height) {
	gm(source).resize(width, height,"!").setFormat(process.env.DEFAULT_IMAGE_TYPE).write(target, function (err) {
		if (!err) {
			console.log('resize image done');  }
		});
	return true;
}
var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
		let data = { image_type : res.headers['content-type'], image_size:  res.headers['content-length'] } ;		
		request(uri).pipe(fs.createWriteStream(filename)).on('close', function () {
			gm(filename).size(function(err, value){
				if (!err) {
					return callback(value);					
				}
				
			})
		});
	});
};

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
