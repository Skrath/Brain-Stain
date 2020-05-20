"use strict";

const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 8080;

const { Neat } = require("@liquid-carrot/carrot");
let neat = new Neat(1, 1, { population_size: 5 });

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Use Handlebars as the view engine
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

var hbs = require('hbs');

var BSUser = require("./classes/BSUser.class.js");
var BSColor = require("./classes/BSColor.class.js");
var tools = require("./utility/tools.js");

hbs.registerPartials(__dirname + '/views/partials', function (err) {});

hbs.localsAsTemplateData(app);

if (require.main === module) {
    tools.loadConfig();
    tools.log('BrainStain app starting');
}

router.use(function (req,res,next) {
    tools.log( [req.hostname, req.protocol, '/' + req.method, req.originalUrl, 'from ' + req.ip].join(' '));

    next();
});
  
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
    tools.log('BrainStain app listening on port '+port+'!');
})