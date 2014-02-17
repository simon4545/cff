/**
 * Created with JetBrains WebStorm.
 * User: simon
 * Date: 13-12-26
 * Time: 下午3:32
 * To change this template use File | Settings | File Templates.
 */
var path = require('path'),
    file = require('../file.js'),
    util = require('../util'),
    template = require('../jsmart.js');
var iconv = require('iconv-lite');//todo simon
function OutputBase(){
    this.html='';
    this.css='';
    this.js='';
    this.preparedJS= '';

    this.comments = null;
    this.type = null;
    this.name = null;
    this.attrStr = null;
}
OutputBase.prototype={
    intro: function () {
        var _str = '<!--@tagLib::${type} ${attr}-->\r\n';
        _str = _str.replace('${type}', this.type).replace('${name}', this.name).replace('${attr}', this.attrStr);
        return _str;
    },
    /**
     * 多个模板解析为JS语法
     * @param txt
     * @private
     */
    _parseTemplate: function (txt) {
        var _html = [];
        //将得到的html&css&js代码加以处理,生成文件
        if (Array.isArray(this.html)) {
            for (var t = 0; t < this.html.length; t++) {
                _html.push('window.__' + this.html[t].id + '__=function($data){' + template.reMarker.parse(this.html[t].cont) + ';return _out.join("")}\r\n');
            }
        } else if (typeof this.html == 'string') {
            _html.push('window.__template__=function($data){' + template.reMarker.parse(this.html) + ';return _out.join("")}\r\n');
        }

        this.html = _html.length?_html.join('\r\n'):'';
    },
    /**
     * 处理预定义属性
     * @private
     */
    _setPrepareAttributesJS: function (taglib) {
        //处理自定义属性
        var i= 0,objKey=this.type+'_'+this.name;
        var attrOutput = ['var __attr__=__attr__||{};','__attr__["'+objKey+'"]=__attr__["'+objKey+'"]||{}'];
        for (var key in taglib.attributes) {
            if(key!='output'){
                i++;
                attrOutput.push('__attr__["'+objKey+'"]["' + key + '"]=\'' + util.removeUnsafe(taglib.attributes[key]) + '\';');
            }
        }
        //如果没有自定义属性
        if(i==0){
            return;
        }
        attrOutput.push(';');
        attrOutput = attrOutput.join('\r\n');
        this.preparedJS= attrOutput;
    },
    build: function (taglib, filePath, config) {

    },
    handlerFile: function (filePath, floor) {
        //如果当前不是目录
        if (!file.isDirectory(filePath)) {
            var fileName = path.basename(filePath);//filename(path);
            if (fileName == 'index.html') {
                var content = file.getContentText(filePath,'utf-8');
                content = file.filterHtmlContent(content);
                //content = util.removeUnsafe(content);
                this.html = content;
            } else if (fileName == 'style.css') {
                var content = file.getContentText(filePath,'utf-8');
                //content = util.removeUnsafe(content);
                this.css = content;
                //console.log(content);
            } else if (fileName == 'index.js') {
                var content = file.getContentText(filePath,'utf-8');
                this.js = content;
            }
        }
    },
    outro: function () {
        return '\r\n<!--/@tagLib-->';
    }
};
exports.OutputBase=OutputBase;