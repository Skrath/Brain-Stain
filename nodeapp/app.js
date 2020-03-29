const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 8080;

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});
  
router.get('/', function(req,res){
    res.sendFile(path + 'index.html');
});
  
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