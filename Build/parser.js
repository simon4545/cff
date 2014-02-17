!function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var target = module['exports'] || exports;
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        define(['exports'], factory);
    } else {
        factory(window['NC'] = {});
    }
}(function (exports) {
    var nc = typeof exports !== 'undefined' ? exports : {};
    var file = require('./file.js'), util = require('./util.js'), defaultConfig = require('./config.js');
    var outputFactory = require('./output/output.js');
    var TAGLIB_REGEX = /<@tagLib::(\w+)\s+([^>]+?)>([\s|\S]*?)<\/@tagLib>/ig;
    var REPLACE_REGEX = /<!--@tagLib::(\w+)\s+([^>]+?)-->([\s|\S]*?)<!--\/@tagLib-->/ig;

    /**
     * TagLib标签类
     * @constructor
     */
    function TagLib() {
        this.type = '';
        this.name = '';
        this.oriValue = '';
        this.attributes = {};
    }

    /**
     * 解析模板中的tablib标签
     * @param filePath 模板路径
     * @returns {Array}
     */
    function parseTagLib(filePath) {
        var txt = file.getContentText(filePath);
        var tags = _parse(txt);
        return tags;

    }

    /**
     * 根据传入的tablib生成相应的代码
     * @param taglib tablib标签对象
     * @param filePath 模板路径
     * @param config 全局配置
     */
    function buildTagLib(taglib, filePath, config) {

        var factory = new outputFactory.output(taglib.attributes.output);
        switch (taglib.attributes.output) {
            case 'link'://外联js文件
                factory.build(taglib, filePath, config);
                break;
            case 'html'://内嵌入式html代码
                factory.build(taglib, filePath, config);
                break;
            case 'buildin-js'://内嵌入式js代码
                break;
            case 'php'://内嵌入式php编译
                factory.build(taglib, filePath, config);
                break;
            case 'smarty'://内嵌入式smarty编译
                factory.build(taglib, filePath, config);
                break;
            default:
                break;
        }
    }

    /**
     * 解析模板中的tablib标签
     * @param txt 模板内容
     * @returns {Array}
     * @private
     */
    function _parse(txt) {
        var tags = [], arr;
        //处理已替换的taglib标签
        while ((arr = REPLACE_REGEX.exec(txt)) != null) {
            console.log(arr + "<br/>");
            var tag = new TagLib();
            tag.type = arr[1];
            tag.oriValue = arr[0];
            tag.attrStr = arr[2];
            //tag.oriValue='<@tagLib::'+tag.type+' '+arr[2]+'><\/@tabLib>';
            //tag.oriValue.replace('<!--','<').replace('-->','>');
            if (arr[2]) {
                attrs = arr[2].split(' ');
                attrs = util.removeEmpty(attrs);
                for (var k = 0; k < attrs.length; k++) {
                    var _keyvaluePair = attrs[k].split('=');
                    if (_keyvaluePair.length != 2) {
                        continue;
                    }
                    if (_keyvaluePair[0] == 'name') {
                        tag.name = util.removeUnvalue(_keyvaluePair[1]);
                    } else {
                        tag.attributes[_keyvaluePair[0]] = util.removeUnvalue(_keyvaluePair[1]);
                    }

                }
                tags.push(tag);
            } else {
                continue;
            }

        }
        //处理taglib标签
        while ((arr = TAGLIB_REGEX.exec(txt)) != null) {
            console.log(arr + "<br/>");
            var tag = new TagLib();
            tag.type = arr[1];
            tag.oriValue = arr[0];
            tag.attrStr = arr[2];
            if (arr[2]) {
                attrs = arr[2].split(' ');
                attrs = util.removeEmpty(attrs);
                for (var k = 0; k < attrs.length; k++) {
                    var _keyvaluePair = attrs[k].split('=');
                    if (_keyvaluePair[0] == 'name') {
                        tag.name = util.removeUnvalue(_keyvaluePair[1]);
                    } else {
                        tag.attributes[_keyvaluePair[0]] = util.removeUnvalue(_keyvaluePair[1]);
                    }
                }
                tags.push(tag);
            } else {
                continue;
            }

        }


        /*
         var mat=txt.match(TAGLIB_REGEX),matchedList;
         for(var i=0;i<mat.length;i++){
         var attrs,matchedTag;
         matchedTag=mat[i];
         var test=TAGLIB_REGEX.exec(matchedTag);
         matchedList=test;
         if(matchedList){
         var tag=new TagLib();
         tag.type=matchedList[1];
         if(matchedList[2]){
         attrs=matchedList[2].split(' ');
         for(var k=0;k<attrs.length;k++){
         var _keyvaluePair=attrs[k].split('=');
         if(_keyvaluePair[0]=='name'){
         tag.name=util.removeUnvalue(_keyvaluePair[1]);
         }else{
         tag.attributes[_keyvaluePair[0]]=util.removeUnvalue(_keyvaluePair[1]);
         }
         }
         }
         tags.push(tag);
         }
         }
         */
        return tags;
    }

    nc.parseTagLib = parseTagLib;
    nc.buildTagLib = buildTagLib;
});
