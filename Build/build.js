var configFile = require('./config.js'),
    util = require('./util.js'),
    file = require('./file.js'),
    parser = require('./parser.js'),
    path=require('path');


//当前目录
var currentPath = util.currentpath('./');
console.log('当前目录' + currentPath);

var defaultConfig = configFile.config;
configFile.currentPath = currentPath;
//遍历目录生成文件
var templates = defaultConfig.templates,
    templateFiles;
//如果没有需要替换的模板
if (!templates) {
    templates = '';
    console.log('找不到需要替换的模板');
    return;
}
templateFiles = templates.split(',');
//遍历所有待替换的主文件
for (var f = 0; f < templateFiles.length; f++) {
    var templPath = util.realpath(currentPath + '/' + templateFiles[f]);
    file.walk(templPath, 1000000, function (_currentPath, floor) {
        if (path.basename(_currentPath)=='index.html') {
            console.log(_currentPath);
            //根据模板中要求的输出类型不同生成不同的文件
            var tags = parser.parseTagLib(_currentPath);
            for (var t = 0; t < tags.length; t++) {
                var tag = tags[t];
                parser.buildTagLib(tag, _currentPath, configFile);
            }
        }
    })
}

