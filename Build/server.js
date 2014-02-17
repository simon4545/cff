var http = require('http'),path=require('path');
var filters = require('./pages')
    fileutil=require('./file'),
    util=require('./util');
var log4js = require('log4js');
global.DEFAULTPAGES = "index.html,Index.html";
var routeRoot=path.join(__dirname, '../');
global.routes=[];

//日志
log4js.configure({
    appenders: [
        { type: 'console' }/*, //控制台输出
         {
         type: 'file', //文件输出
         filename: 'logs/web.log',
         maxLogSize: 102400,
         category: 'normal'
         }*/
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('normal');
logger.setLevel('DEBUG');

fileutil.walk(routeRoot,2,function(_currentPath){
    var fileName=path.basename(_currentPath);
    var folderName=path.dirname(_currentPath);
    if(fileName=='route.json'){
        try{
            var _route=eval('('+fileutil.getContentText(_currentPath)+')');
            _route.forEach(function(rule){

                //如果已传入正则
                if(!(rule.key instanceof RegExp)){
                    rule.key=new RegExp('^'+util.escapeRegExp(rule.key)+'$');
                }
                /*if(!rule.regexp){
                    rule.key=new RegExp('^'+util.escapeRegExp(rule.key)+'$');
                }else{
                    if(!(rule.key instanceof RegExp)){
                        rule.key=new RegExp(rule.key,'i');
                    }
                }*/
                console.log(path.join(folderName,rule.value));
                rule.value=rule.value.indexOf('/')===0?rule.value:path.join(folderName,rule.value);
                global.routes.push(rule);
            })
        }catch(ex){
            console.error('路由配置出错，文件名:'+_currentPath+',信息:'+ex.message);
        }
    }
});
http.createServer(function (request, response) {
    filters.HttpFilters.forEach(function(handler){
        handler(request,response);
    })
}).listen(8006);
