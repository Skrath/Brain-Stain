"use strict";

const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 8080;

const { Neat } = require("@liquid-carrot/carrot");
let neat = new Neat(1, 1, { population_size: 5 });

var Color = require('color');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Use Handlebars as the view engine
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

var hbs = require('hbs');
var geoip = require('geoip-lite');
var uaParser = require('ua-parser-js');
var languageParser = require('accept-language-parser');
var moment = require('moment-timezone');

hbs.registerPartials(__dirname + '/views/partials', function (err) {});

hbs.localsAsTemplateData(app);

router.use(function (req,res,next) {
    console.log( [req.hostname, req.protocol, '/' + req.method, req.originalUrl, 'from ' + req.ip].join(' '));

    next();
});
  
function collectUserInfo(req) {
    
    }

router.get('/', function(req,res){
    res.sendFile(path + 'index.html');
});

router.get('/css/:file', function(req,res){
    res.sendFile(path + 'css/' + req.params.file);
});

router.get('/js/testing.js', function(req,res){
    res.sendFile(path + 'js/testing.js');
});

router.get('/js/node-vis.js', function(req,res){
    res.sendFile(path + 'js/node-vis.js');
});

router.get('/admin', function(req, res) {
    res.render(path + 'admin/layout.html');
});

router.get('/result', function(req, res) {
    console.log(req.query.color);

    var inputColor = new BSColor('#'+req.query.color);

    res.send( JSON.stringify(activateNextNode(inputColor)) );
});

router.post('/submitscore', function(req, res) {
    console.log(req.body);

    if (neat.generation === Number(req.body.generation)) {

        var score = Number(req.body.legible) + Number(req.body.aesthetic);

        neat.population[Number(req.body.index)].score = score;
    }

    let scored = neat.population.every(function (brain) {
        return typeof brain.score !== 'undefined';
    });

    if(scored) {
        console.log('Evolving...');
        neat.evolve();
        console.log('Generation '+neat.generation);
    }

    res.send('1');
});

function activateNextNode(inputColor) {
    if( typeof activateNextNode.index == 'undefined' ) {
        activateNextNode.index = 0;
    } else {
        activateNextNode.index++
        if (activateNextNode.index >= neat.population.length) activateNextNode.index = 0;
    }

    var output = neat.population[activateNextNode.index].activate([inputColor.nodeValue]);
    var outputColor = new BSColor();

    outputColor.nodeValue = output;

    return {
        reference: {
            generation: neat.generation,
            index: activateNextNode.index,
            brain: neat.population[activateNextNode.index].toJSON()
        }, 
        value: outputColor.color.hex()
    };
}
  
app.use('/', router);

app.listen(port, function () {
    console.log('Example app listening on port '+port+'!');
})

class BSUser {
    constructor(req) {
        var ua = uaParser(req.headers['user-agent']);
        var languages = languageParser.parse(req.headers['accept-language']);
        
        this.ip = req.ip;
        var geo = geoip.lookup(this.ip);

        if ( (ua !== null) && (ua !== undefined)) {
            this.browserName = ua.browser.name;
            this.browserMajorVersion = ua.browser.major;
            this.browserVersion = ua.browser.version;
            this.osName = ua.os.name;
            this.osVersion = ua.os.version;
            this.cpuArchitecture = ua.cpu.architecture;
        }

        if ( (geo !== null) && (geo !== undefined )) {
            this.country = geo.country;
            this.region = geo.region;
            // look up what geo.eu is
            this.timezone = geo.timezone;
            this.city = geo.city;
            this.latitude = geo.ll[0];
            this.longitude = geo.ll[1];
            this.metro = geo.metro;
            this.area = geo.area;
        }

        if ( (languages !== null) && (languages !== undefined)) {
            // We're only going to deal with the top result
            this.languageCode = languages[0].code;
            this.languageRegion = languages[0].region;
        }

        if (this.timezone !== undefined) {
            var currentTime = moment().tz(this.timezone);
            this.day = currentTime.format('DD');
            this.month = currentTime.format('MM');
            this.year = currentTime.format('YYYY');
            this.hour = currentTime.format('HH');
            this.minute = currentTime.format('mm');
        }
    }
}
class BSColor {
    constructor(input) {
        this.ratioValue = 16777215;
        this.color = Color(input);
    }

    set nodeValue(input) {
        var newColor = input * this.ratioValue;
        this.color = Color(newColor);
    }

    get nodeValue() {
        if (this.color.rgbNumber() == 0) return 0;
        return  this.color.rgbNumber() / this.ratioValue;
    }
}