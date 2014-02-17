var OutputBase = require('./OutputBase.js').OutputBase,
    util = require('util'),
    file = require('../file.js'),
    utils = require('../util'),
    path = require('path');


/**
 * 输出外联js&css
 * @constructor
 */
function Link() {
    OutputBase.call(this);
}
util.inherits(Link, OutputBase);
Link.prototype.build = function (taglib, filePath, config) {
    this.comments = taglib.oriValue;
    this.type = taglib.type;
    this.name = taglib.name;
    this.attrStr = taglib.attrStr;
    var targetPath = path.normalize(path.join(config.currentPath, taglib.type, taglib.name));
    file.walk(targetPath, 0, this.handlerFile.bind(this));


    //var appendQueryString=querystring.stringify(taglib.attributes)
    //将得到的html&css&js代码加以处理,生成文件
    this._parseTemplate(this.html);
    //预处理传入参数
    this._setPrepareAttributesJS(taglib);
    //最后输出的js
    var htmljs = ';!function(){\r\n' + this.html + this.js + '\r\n}();';
    file.writeContentText(path.join(targetPath, this.name + '.js'), htmljs,'utf-8');


    //cssTag = '<link rel="stylesheet" type="text/css" href="${url}" />';
    //cssTag = cssTag.replace('${url}',utils.formatUrlSplit(path.normalize(path.join(config.baseUrl, taglib.type, taglib.name, 'style.css'))));
    //如果传入要替换的业务模板
    if (filePath) {
        //替换原来的tablib标签
        var jsPraparedTag = '', jsTag = '';
        //替换原来的tablib标签
        jsPraparedTag = '<script type="text/javascript">${cssFun};${content}</script>';
        var cssFunction = [];
        if (this.css) {
            cssFunction.push('var doc=document;var head = doc.getElementsByTagName("head")[0] || doc.documentElement;var baseElement = head.getElementsByTagName("base")[0];');
            cssFunction.push('var link=document.createElement("link");');
            cssFunction.push('link.setAttribute("rel", "stylesheet");link.setAttribute("type", "text/css");');
            cssFunction.push('link.setAttribute("href", "' + utils.formatUrlSplit(path.normalize(path.join(config.baseUrl, taglib.type, taglib.name, 'style.css'))) + '");');
            cssFunction.push('baseElement?head.insertBefore(link, baseElement) :head.appendChild(link);');
            cssFunction = cssFunction.join('\r\n');
        }
        cssFunction = cssFunction.join('\r\n');
        jsPraparedTag = jsPraparedTag.replace('${cssFun}', cssFunction);
        jsPraparedTag = jsPraparedTag.replace('${content}', this.preparedJS);


        jsTag = '<script src="${url}" type="text/javascript"></script>';
        jsTag = jsTag.replace('${url}', utils.formatUrlSplit(path.normalize(path.join(config.baseUrl, taglib.type, taglib.name, this.name + '.js'))));
        //jsTag=jsTag.replace('${url}',util.appendQuery(path.normalize(path.join(config.baseUrl,taglib.type,taglib.name,this.name+'.js')),appendQueryString));

        var replaced = this.intro() + '\r\n' + jsPraparedTag + '\r\n' + jsTag + this.outro();
        var txt = file.getContentText(filePath,'utf-8');
        txt = txt.replace(this.comments, replaced);
        file.writeContentText(filePath, txt,'utf-8');
    }
};

exports.Output = Link;
