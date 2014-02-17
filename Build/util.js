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
    var fs = require('fs');
    var DIRNAME_RE = /[^?#]*\//;

    var DOT_RE = /\/\.\//g;
    var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
    var DOUBLE_SLASH_RE = /([^:/])\/\//g;

    function currentpath(path) {
        return fs.realpathSync(path);
    }

    // Extract the directory portion of a path
    // dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
    // ref: http://jsperf.com/regex-vs-split/2
    function dirname(path) {
        return path.match(DIRNAME_RE)[0]
    }
    function filename(path){
        return path.substr(path.lastIndexOf('/')+1);
    }
    // Canonicalize a path
    // realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
    function realpath(path) {
        // /a/b/./c/./d ==> /a/b/c/d
        path = path.replace(DOT_RE, "/")

        // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, "/")
        }

        // a//b/c  ==>  a/b/c
        path = path.replace(DOUBLE_SLASH_RE, "$1/")

        return path
    }

    // Normalize an id
    // normalize("path/to/a") ==> "path/to/a.js"
    // NOTICE: substring is faster than negative slice and RegExp
    function normalize(path) {
        var last = path.length - 1
        var lastC = path.charAt(last)

        // If the uri ends with `#`, just return it without '#'
        if (lastC === "#") {
            return path.substring(0, last)
        }

        return (path.substring(last - 2) === ".js" ||
            path.indexOf("?") > 0 ||
            path.substring(last - 3) === ".css" ||
            lastC === "/") ? path : path + ".js"
    }
    /**
     * 移除不安全代码
     * @param html
     * @returns {*|void}
     */
    function removeUnsafe(html) {
        var _templ = html.replace(/[\r|\n|\t]/ig, '');
        _templ = _templ.replace(/\'/ig, "\\'");
        return _templ;
    }

    /**
     * 移除数据中的空数据
     * @param array 传入的数组
     * @returns {Array}
     */
    function removeEmpty(array) {
        return array.join(',').replace(',,', ',').split(',');
    }

    /**
     * 解决linux和window下的路径不一致
     * @param url
     * @returns {XML|string|void}
     */
    function formatUrlSplit(url){
        return url.replace(/\\/ig,'/');
    }
    /**
     * 移除空格
     * @param str
     * @returns {XML|string|void}
     */
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    /**
     * 移除左侧空格
     * @param str
     * @returns {XML|string|void}
     */
    function lTrim(str) {
        return str.replace(/(^\s*)/g, "");
    }

    /**
     * 追加Query值到URL里
     * @param url 待追加的URL地址
     * @param query 追加的URL params
     */
    function appendQuery(url,query){
        if(url.indexOf('?')!=-1){
            url+='&'+query;
        }else{
            url+='?'+query;
        }
        return url;
    }
    /**
     * 移除右侧空格
     * @param str
     * @returns {XML|string|void}
     */
    function rTrim(str) {
        return str.replace(/(\s*$)/g, "");
    }

    function removeComment(str){
        return str.replace(/\/\*([\s|\S]*?)\*\//ig,function(ar){
            return '';
        });
    }

    /**
     * 正则关键词转义
     * @param string
     * @returns {XML|string|void}
     */
    function escapeRegExp(string) {
        return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    /**
     * 移除不安全代码
     * @param html
     * @returns {*|void}
     */
    function removeUnvalue(html) {
        var _templ = html.replace(/[\r|\n|\t]/ig, '');
        _templ = _templ.replace(/\'|\"/ig, "");
        return _templ;
    }
    nc.realpath = realpath;
    nc.dirname = dirname;
    nc.currentpath = currentpath;
    nc.filename=filename;
    nc.removeUnsafe=removeUnsafe;
    nc.removeUnvalue=removeUnvalue;
    nc.trim=trim;
    nc.removeEmpty=removeEmpty;
    nc.lTrim=lTrim;
    nc.rTrim=rTrim;
    nc.appendQuery=appendQuery;
    nc.formatUrlSplit=formatUrlSplit;
    nc.removeComment=removeComment;
    nc.escapeRegExp=escapeRegExp;
});
