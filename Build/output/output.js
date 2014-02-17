var outputLink = require('./Link.js');
var outputHTML = require('./Html.js');
var outputPHP = require('./PHP.js');
var outputSmarty = require('./Smarty.js');
function output(type){
    switch(type){
        case 'link':
            return new outputLink.Output();
            break;
        case 'html':
            return new outputHTML.Output();
            break;
        case 'php':
            return new outputPHP.Output();
            break;
        case 'smarty':
            return new outputSmarty.Output();
            break;
    }
}
exports.output=output;