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

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});
  
router.get('/', function(req,res){
    res.sendFile(path + 'index.html');
});

router.get('/css/styles.css', function(req,res){
    res.sendFile(path + 'css/styles.css');
});

router.get('/js/testing.js', function(req,res){
    res.sendFile(path + 'js/testing.js');
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
        }, 
        value: outputColor.color.hex()
    };
}
  
app.use('/', router);

app.listen(port, function () {
    console.log('Example app listening on port '+port+'!');
})

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