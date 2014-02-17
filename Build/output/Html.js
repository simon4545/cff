
var OutputBase = require('./OutputBase.js').OutputBase,
    util = require('util'),
    file = require('../file.js'),
    utils = require('../util'),
    path = require('path');
/**
 * 输出外联html,并将css打入js中
 * <script>css-buildin</script>
 * @constructor
 */
function HTML() {
    OutputBase.call(this);
}
util.inherits(HTML, OutputBase);
HTML.prototype.build = function (taglib, filePath, config) {
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

    //替换原来的tablib标签
    var cssFunction = [];

    if (this.css) {
        var cssFunction = [];
        cssFunction.push('var doc=document;var head = doc.getElementsByTagName("head")[0] || doc.documentElement;var baseElement = head.getElementsByTagName("base")[0];');
        cssFunction.push('var _css_=\'' + utils.removeComment(utils.removeUnsafe(this.css)) + '\';');
        cssFunction.push('var style=document.createElement("style");style.type="text/css";');
        cssFunction.push('try{style.appendChild(document.createTextNode(_css_));}catch(ex){style.styleSheet.cssText=_css_;};');
        cssFunction.push('baseElement?head.insertBefore(style, baseElement) :head.appendChild(style);');
    }
    cssFunction = cssFunction.join('\r\n');
    //最后输出的js
    var htmljs = ';!function(){\r\n' + cssFunction + this.preparedJS + this.html + this.js + '\r\n}();';


    jsTag = '<script type="text/javascript">${content}</script>';
    jsTag = jsTag.replace('${content}', htmljs);


    var replaced = this.intro() + '\r\n' + jsTag + '\r\n' + this.outro();
    file.writeContentText(path.join(targetPath, this.name + '.html'), replaced);
    //如果传入要替换的业务模板
    if (filePath) {
        var txt = file.getContentText(filePath);
        txt = txt.replace(this.comments, replaced);
        file.writeContentText(filePath, txt);
    }
};

exports.Output = HTML;
