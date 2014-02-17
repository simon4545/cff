var path = require('path'),fs = require('fs'),url=require('url');
var log4js = require('log4js'),iconv=require('iconv-lite');
var fileutil = require('./file'),util=require('./util');
var smarty = require('./jsmart');
var async = require('async');
//日志
log4js.configure({
    appenders: [
        {
            type: 'console',
            category: 'pageHandler'
        }/*, //控制台输出
         {
         type: 'file', //文件输出
         filename: 'logs/web.log',
         maxLogSize: 102400,
         category: 'normal'
         }*/
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('pageHandler');
logger.setLevel('DEBUG');

var mimetype = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'svg': 'image/svg+xml'
}

/**
 * 处理smarty模板文件
 * @param input
 * @param filename
 * @returns {*}
 * @constructor
 */
function HTMLFilter(input, filename) {
    var data;
    logger.trace('Smarty模板路径:' + filename);
    var _path = path.dirname(filename);
    if (fileutil.isExist(path.join(_path, 'data.json'))) {
        try {
            data = global.eval('(' + fileutil.getContentText(path.join(_path, 'data.json'), 'utf-8') + ")");
        } catch (ex) {
            data = {};
            logger.error('Mock数据有误');
        }
    }
    var _html = '';
    try {
        var reMarker = new smarty.reMarker();
        reMarker.setBasePath(global.BasePath);

        _html = reMarker.proc(input, data || {});
    } catch (ex) {
        logger.error('模板文件有错误,文件名:%s,错误信息:%s', filename,ex.message);
    }
    return _html;
}
/**
 * 处理smarty模板文件
 * @param input
 * @param filename
 * @returns {*}
 * @constructor
 */
function JavaScriptFilter(input, filename) {
    var data;
    var _path = path.dirname(filename);
    if (fileutil.isExist(path.join(_path, 'index.js'))) {
        input+='<script type="text/javascript">'+fileutil.getContentText(path.join(_path, 'index.js'))+'</script>';
    }
    return input;
}

//Http请求过滤
var HttpFilters=[];
function PathHandler(req,res){
    var uri = url.parse(req.url).pathname;
    logger.debug('转换后请求网址目录路径:' + uri);
    //生成本地文件映射
    var filename =req.ori_url?req.url: path.join(req.basePath, uri);
    logger.debug('本地路径:' + filename);
    //如果传入的是目录，则找到默认页
    if (fileutil.isDirectory(filename)) {
        var defaultPages = global.DEFAULTPAGES.split(',');
        async.forEachSeries(defaultPages, function (page, callback) {
            if (fileutil.isExist(path.join(filename, page))) {
                filename = path.join(filename, page);
                callback();
            } else {
                callback()
            }
        }, function (err) {
            req.localFile=filename;
            renderRes(req, res);
        });
    }else {
        req.localFile=filename;
        renderRes(req, res);
    }
}

/**
 * 日志过滤器
 * @param req
 * @param res
 * @constructor
 */
function LogHandle(req,res){
    var uri = url.parse(req.url).pathname;
    req.basePath=path.join(__dirname, '../');
    logger.debug('请求网址目录路径:' + uri);
}
/**
 * 路由控制器
 * @param req
 * @param res
 * @constructor
 */
function RouteHandler(req,res){
    global.routes.every(function(item){
        if(req.url.match(item.key)){
            req.ori_url=req.url;
            req.url=req.url.replace(item.key,item.value);
            console.debug('路由转换后的URL:%s,原始的URL:%s',req.url,req.ori_url);
            return false;
        }
        return true;
    });
}
/**
 * AJAX请求过滤器
 * @param req
 * @param res
 * @constructor
 */
function AJAXProxyHandler(req,res){
    var isAjax=false;
    if(req.headers['x-requested-with']=='XMLHttpRequest'){
        isAjax=true;
    }
}
/**
 * 输出资源
 * @param filename
 */
function renderRes(req, res) {
    var filename=req.localFile;
    logger.trace('完整本地路径:' + filename);
    fs.exists(filename, function (exists) {
        if (!exists) {
            logger.error('找不到资源:' + filename);
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found\n");
            res.end();
            return;
        }

        fs.readFile(filename, 'binary', function (err, file) {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write(err + "\n");
                res.end();
                return;
            }

            var contentType = 'none';
            var ext = path.extname(filename);
            contentType = mimetype[ext.substring(1)] || 'text/plain';

            var _output;
            var header = {
                'Content-Type': contentType,
                'Server': 'Node.JS'
            };
            if (ext == '.html' || ext == '.htm') {
                file = iconv.decode(new Buffer(file), 'utf-8');
                _output = HTMLFilter(file, filename);
                header['Content-Length'] = Buffer.byteLength(_output, 'binary');

            } else {
                _output = file;//.toString();
                header['Content-Length'] = _output.length;
            }
            res.writeHead(200, header);
            res.write(_output, 'binary');
            res.end();
        });
    });
}

HttpFilters.push(LogHandle);
HttpFilters.push(RouteHandler);
HttpFilters.push(PathHandler);
HttpFilters.push(AJAXProxyHandler);
exports.HttpFilters=HttpFilters;
