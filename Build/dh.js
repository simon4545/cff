/*
 AMD模块化加载器，精减版
 作者：陈鑫
 区分所有的jS加载等级，所有不存在依赖关系的文件为最顶级文件，会一次性加载
 其后的所有文件按其依赖关系依次执行
 */
;;(function () {
    //如果页面中已经存在
    if (window.DH) {
        var _DH_ = window.DH;
        window._DH_ = _DH_;
    }
    var ie= !-[1,];
    var ObjProto = Object.prototype,
        ArrayProto = Array.prototype,
        hasOwnProperty = ObjProto.hasOwnProperty,
        toString = ObjProto.toString,
        slice = Array.prototype.slice,
        nativeForEach = ArrayProto.forEach,
        nativeKeys = Object.keys;


    var doc = document, urlBase = 'http://www.test.com/rscs.php?r=';
    var testNode = doc.createElement('script'), fnOnload, node;
    // 打断循环体的object对象
    var breaker = {};

    var currentScript;

    var head = doc.getElementsByTagName('head')[0] || doc.documentElement;
    var baseElement = head.getElementsByTagName("base")[0];
    var _xhr=function(){
        return window.XMLHttpRequest ? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP")
    }
    fnOnload = testNode.readyState ? function (node, callback) {
        node.onreadystatechange = function () {
            var rs = node.readyState;
            if (rs === 'loaded' || rs === 'complete') {
                // handle memory leak in IE
                node.onreadystatechange = null;
                callback.call(this);
            }
        };
    } : function (node, callback) {
        node.onload = callback;
    };

    var _lib = ['jquery-min'];//依赖库
    var _loaded = {};//已加载完成
    var _imports = [];//所有需要加载的js文件，不去重
    var _readyCallback = [];
    var _importsIn={};//已加载，去重复
    //主函数
    function dhtml() {
        var args = slice.call(arguments, 0);
        _excute(_lib.concat(args));
    }

    function _excute(args) {
        each(args, function (value, index, object) {
            _calc(value);
        });
        dequeue();
    }

    /**
     * 将传入的参数导入待下载数组
     * @param arg 待下载文件参数
     * @private
     */
    function _calc(arg) {
        var i = 0, item;
        //如果传入依赖类
        if (arg.requires) {
            if(!arg.requires){

                if(isArray(arguments[1])){
                    arguments[1].push({name:arg.name,callback:arg.callback});
                    var inherit=arguments[1].reverse(),inheritLength=arguments[1].length;
                    for(var i=0;i<inherit.length;i++){
                        if(i<inheritLength-1){
                            var ss=inherit[i+1];
                            var callback=inherit[i].callback;
                            inherit[i].callback=(function(d,c){return function(){
                                c&&c();
                                _imports.push(d);
                            }
                            })(ss,callback);
                        }
                    }
                    //当所有的遍历结束后，会把已放入临时数据的遍历体中所有的一级script节点统一放在_imports里
                    _imports.push(inherit[0]);
                }else{
                    //arguments:'js file'
                    _imports.push({name: arg.name,callback:isFunction(arg.callback)?arg.callback:null});
                }

            }else{
                var isTextRequire=isString(arg.requires);
                //arguments[1]-->[{n:arg.name},{n:arg.name}]
                var param={
                    name:isTextRequire?arg.requires:arg.requires.name,
                    requires:isTextRequire?null:arg.requires.requires,
                    callback:isTextRequire?null:arg.requires.callback
                };
                arguments.callee(
                    param,
                    isArray(arguments[1])?
                        arguments[1].concat([{name:arg.name,callback:arg.callback}]):
                        [{name:arg.name,callback:arg.callback}]
                        /*前N层*/
                );
            }
            arguments.callee(arg.requires);
            _imports.push({n: arg.name,callback:isFunction(arg.callback)?arg.callback:null});
        }
        else if (isString(arg)) {
            //仅传入非依赖类
            _imports.push({n: arg.name,callback:isFunction(arg.callback)?arg.callback:null});
        }
        else if (isFunction(arg)) {
            arg();
            //以后添加，在domReady时再加载
            //_readyCallback.push(arg);
        }
        else {
        }
    }

    /**
     * 出队
     * @param url 出队的文件
     * @param callback 可选,出队后的回调
     * @param charset 可选,编码
     */
    function dequeue(url, callback, charset) {
        //顺序出队入口，仅是一个外观，内部还是要调用dequeue，并传参
        if ((url == undefined) || (url && url.type)) {
            currentScript = _imports.shift();
            //正在加载中
            if (_loaded[currentScript.n]) {
                return;
            }

            if (currentScript) {
                function plugins() {
                    //currentScript.callback();
                    _loaded[currentScript.n] = true;
                    dequeue();
                }
                dequeue(currentScript.n, plugins, 'utf-8');
            }
        }
        else {
            _scriptLoad(url,callback,charset)
        }
    }

    function _scriptLoad(url,callback,charset){
        var head = doc.getElementsByTagName('head')[0] || doc.documentElement, node = doc.createElement('script');
        node.async=true;
        node.src =url;//+'?'+new Date();
        if (charset)
            node.charset = 'utf-8';
        if (isFunction(callback)) {
            fnOnload(node, callback);
        }
        //http://paulirish.com/2011/surefire-dom-element-insertion/
        // ref: #185 & http://dev.jquery.com/ticket/2709
        baseElement ?head.insertBefore(node, baseElement) :head.appendChild(node);
    }

    function _globalEval(data, context){
        if (data && /\S/.test(data)) {
            context = context || document;
            var script = context.createElement("script");
            script.type = "text/javascript";
            script.text = data;
            head.insertBefore(script, head.firstChild);
            //head.removeChild(script);
            return true;
        }
        return false;
    }

    function each(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            var keys = _keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
            }
        }
    }

    //检索对象的键名.
    var _keys = nativeKeys || function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_has(obj, key)) keys.push(key);
        return keys;
    };

    function _indexOf(obj,it){
        var i=0,item;
        for(;item=obj[i++];){
            if(item.name&&item.name==it){
                return i-1;
            }
        }
        return -1;
    }
    //对象是否具有键名
    var _has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    window.DH = dhtml;
})();
