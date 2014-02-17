
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
    var fs = require('fs'),path=require('path');
    var iconv = require('iconv-lite');//todo simon
    var CONT_REGEX=/<script\s+type="remark-template"\s+id="([\w|-|_|@|#]+?)">([\s|\S]+?)<\/script>/ig;
    function isExist(path){
        return fs.existsSync(path);
    }

    /**
     * 判断路径是否是目录
     * @param path
     * @returns {*}
     */
    function isDirectory(path){
        if(!this.isExist(path)){return false;}
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    }

    /**
     * 同步写入文件内容
     * @param path
     * @param txt
     */
    function writeContentText(path,txt,encoding){
        var data = txt||'';
        encoding=encoding||'utf-8';
        fs.writeFileSync(path, data, encoding);
    }

    /**
     * 同步读文件内容
     * @param path
     * @returns {string}
     */
    function getContentText(path,encoding){
        var txt = '';
        encoding=encoding||'utf-8';
        txt=fs.readFileSync(path,'binary');
        txt = iconv.decode(new Buffer(txt), encoding);
        return txt;
    }

    /**
     * 取到模板片段
     * @param txt
     * @returns {*}
     */
    function filterHtmlContent(txt){
        var _templates = [], _arr;
        //处理已替换的taglib标签
        while ((_arr = CONT_REGEX.exec(txt)) != null) {
            var id=_arr[1];
            var cont=_arr[2];
            _templates.push({id:id,cont:cont});
        }
        return _templates;
    }
    /**
     * 递归处理文件,文件夹
     * @param folder 路径
     * @param floor 层数
     * @param handleFile 文件,文件夹处理函数
     */
    function walk(folder, floor, handleFile,depth) {
        depth=depth||0;
        //console.log('正在遍历的目录'+folder);
        var files= fs.readdirSync(folder);
        for (var i = 0; i < files.length; i++) {
            var _depth=depth||0;
            var tmpPath =path.join(folder , files[i]) ;
            var stats=fs.statSync(tmpPath);
            if ((_depth<floor)&&stats.isDirectory()) {
                _depth++;
                arguments.callee(tmpPath, floor, handleFile,_depth);
            } else {
                handleFile(tmpPath, _depth);
            }
        }
    }
    /**
     * 获取文件夹的子文件夹
     * @param path 路径
     * @returns {Array} 子文件夹
     */
    function getSubFolder(path) {
        var folders=[];
        var files= fs.readdirSync(path);
        for (var i = 0; i < files.length; i++) {
            var tmpPath = path + '/' + files[i];
            var stats=fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                folders.push(files[i]);
            }
        }
        return folders;
    }
    nc.walk=walk;
    nc.isDirectory=isDirectory;
    nc.filterHtmlContent=filterHtmlContent;
    nc.getContentText=getContentText;
    nc.writeContentText=writeContentText;
    nc.getSubFolder=getSubFolder;
    nc.isExist=isExist;
});
