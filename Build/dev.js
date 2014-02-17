var configFile = require('./config.js'),
    util = require('./util.js'),
    file = require('./file.js'),
    parser = require('./parser.js'),
    path = require('path');


//当前目录
var currentPath = util.currentpath('./');
console.log('当前目录' + currentPath);

configFile.currentPath = currentPath;
var modules = ['Module','Component'];// 'Component'
var outType = [ 'smarty'];//'link',
for (var i = 0; i < modules.length; i++) {
    var _templPath = path.normalize(util.realpath(currentPath + '/' + modules[i]));
    if (file.isExist(_templPath) && file.isDirectory(_templPath)) {
        var folders = file.getSubFolder(_templPath);
        for (var d = 0; d < folders.length; d++) {
            if (folders[d] !== 'global') {
                for (var o = 0; o < outType.length; o++) {
                    var taglib = {
                        type: modules[i],
                        name: folders[d],
                        attrStr: 'output=' + outType[o],
                        attributes: {output: outType[o]}
                    };
                    parser.buildTagLib(taglib, null, configFile);
                }
            }
        }
    }
}
