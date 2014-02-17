/*
AMD模块化加载器，开发中
作者：陈鑫
区分所有的jS加载等级，所有不存在依赖关系的文件为最顶级文件，会一次性加载
其后的所有文件按其依赖关系依次执行
*/
(function(){
	//如果页面中已经存在，则不重复执行
	if (window.$script) {return;}
	//http:///www.test.com/rscs.php?id=
	var _toString = Object.prototype.toString, FUNCTION_CLASS = '[object Function]', STRING_CLASS = '[object String]';
	var doc = document,_excute;
	var _xhr=function(){return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();};
	var testNode = doc.createElement('script'), fn, node;
	fn = testNode.readyState ? function(node, callback){
		node.onreadystatechange = function(){
			var rs = node.readyState;
			if (rs === 'loaded' || rs === 'complete') {
				// handle memory leak in IE
				node.onreadystatechange = null;
				callback.call(this);
			}
		};
	} : function(node, callback){
		node.onload = callback;
	};
	var ie= !-[1,];
	var _firstRun=true;
	var _lib = ['http://b1.dhtml.com/lib.js','http://b2.dhtml.com/wwf.js','http://b3.dhtml.com/component.js'],_libcore={};//依赖库
	var _loaded = {};//已加载完成
	var _loading={};
	var _imports = [];//所有需要加载的js文件，不去重复
	var _importsIn={};//已加载，去重复
	//主函数
	var dhtml = function(){
		var args = Array.prototype.slice.call(arguments, 0);
		if(_firstRun){
			excute(_lib);
		}else{
			excute(args);
		}
	}
	dhtml.setMode=function(mode){
		dhtml.mode=mode;
		if(ie || (typeof(FrameHelper)=='undefined')){
			dhtml.mode='debug';
		}
	}
	var excute = function(args){
		var i = 0;
		for (; arg = args[i++];) {
			calc(arg,args[1]);
		}
		
		//第一次执行时，下载三个核心库，这时是不可能在毫秒内完成isPrepared
		//以后的n次是否可以出队取决于核心库是否已加载完成
		if(_firstRun || isPrepared()){
			dequeue();
			_firstRun=false;
		}
	}
	function parseUrl(url){
		if(url.indexOf('http://')<0){
			return [false,url];
		}else{
			url=url.replace('http://','');
			var urls=url.split('.');
			return [urls[0],url];
		}
	}
	function xhrLoad(url,callback){
		var response;
		var domain=parseUrl(url)[0];
		if(!domain){
			var xhr = _xhr();
			xhr.onreadystatechange = function(){
				if (4 == xhr.readyState) {
					var response = xhr.responseText;
					callback&&callback();
					_prepareCore(url,response);
					delete response;
				}
			};
			xhr.open('GET', url, true);
			xhr.send('');
		}
		else{
			if(typeof(FrameHelper)!="undefined"){
				var fs = FrameHelper.getFrame(domain);
				fs.contentWindow.xhrLoad(url,function(response){
						callback&&callback();
						_prepareCore(url,response);
						delete response;
				});
			}
		}
	}
	function _prepareCore(url,res){
		_libcore[url]=res;
		if(!arguments.callee.callCount){
			arguments.callee.callCount=0;
		}
		arguments.callee.callCount=arguments.callee.callCount+1;
		if(arguments.callee.callCount==_lib.length){
			for(var i=0;i<_lib.length;i++){
				_globalEval(_libcore[_lib[i]]);
			}
			for(u in _libcore){	delete _libcore[u];}
			_libcore=null;
		}
	}
	function scriptLoad(url,callback,charset){
		var head = doc.getElementsByTagName('head')[0] || doc.documentElement, node = doc.createElement('script');
		node.async=true;
		node.src =url;//+'?'+new Date();
		if (charset) 
			node.charset = 'utf-8';
		if (isFunction(callback)) {
			fn(node, callback);
		}
		//http://paulirish.com/2011/surefire-dom-element-insertion/
		head.insertBefore(node, head.lastChild);
	}
	function _globalEval(data, context){
		if (data && /\S/.test(data)) {
			context = context || document;
			var head = context.getElementsByTagName("head")[0] || context.documentElement, script = context.createElement("script");
			script.type = "text/javascript";
			script.text = data;
			head.insertBefore(script, head.firstChild);
			//head.removeChild(script);
			return true;
		}
		return false;
	};
	//处理传入的所有参数的依赖关系
	var calc = function(arg){
		var i = 0;
		//如果传入依赖类
		//如果存在多层依赖，则记录首层，并包含下层
		if (!!arg.requires || !!arg.name) {
			//如果不再存在依赖关系
			if(!arg.requires){
				/*-----------related to line 58/68 如果没有依赖走这里，如果有依赖走下面的if-------------------*/
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
					/*------------common work flow --------------*/
					_imports.push({name: arg.name,callback:isFunction(arg.callback)?arg.callback:null});
				}
			}else{//仍然存在上级依赖
				//arguments[1]-->[{n:arg.name},{n:arg.name}]
				var param={
					name:isString(arg.requires)?arg.requires:arg.requires.name,
					requires:arg.requires.requires?arg.requires.requires:null,
					callback:arg.requires.callback
				};
				arguments.callee(param,isArray(arguments[1])?arguments[1].concat([{name:arg.name,callback:arg.callback}]):[{name:arg.name,callback:arg.callback}]/*前N层*/);
			}
		}else{
			//仅传入非依赖类lib
			_imports.push({name: arg,callback:null});
		}
	}
	function isPrepared(){var i=0,item;	for(;item=_lib[i++];){if(_loaded[item]!=true){return false;	}}return true;}
	function isFunction(obj){return _toString.call(obj) === FUNCTION_CLASS;}
	function isString(obj){return _toString.call(obj) === STRING_CLASS;}
	function isArray(obj) { return obj&&obj.constructor === Array; }
	function indexOf(obj,it){var i=0,item;for(;item=obj[i++];){	if(item.name&&item.name==it){	return i-1;	}}return -1;}
	function inArray(obj,it){var i=0,item;for(;item=obj[i++];){if(item==it){return true;}}return false;}
	function dequeue(url, callback, charset){
		if ((url == undefined) || (url && url.type)) {
			//如果核心库未准备好并是首次执行 或已准备好核心库 才可以有下一次的出队操作
			//否则等待已出队库的执行回调
			if(dhtml.mode=='product' && !_firstRun && !isPrepared()){
				return;
			}
			if(dhtml.mode=='debug' && arguments.callee.called && !isPrepared()){
				return;
			}
			arguments.callee.called=true;
			var currentScript = _imports.shift();
			if (currentScript) {
				//当前文件正在下载或已下载完
				if(_loaded[currentScript.name] || _loading[currentScript.name]){
					if(_loaded[currentScript.name]){
						//把当前事件加到_importsIn里去，
						currentScript.callback&&currentScript.callback();
					}else{
						if(currentScript.callback){
							//要绑定事件到正在下载中的基类回调中去
							var cur=_importsIn[currentScript.name];
							if(cur){
								var c=cur.callback;
								cur.callback=function(){
									c&&c();
									currentScript.callback();
								};
							}
						}
					}
				}else{
					_loading[currentScript.name] = true;
					_importsIn[currentScript.name]=currentScript;
					dequeue(currentScript.name, function (){
						if(_importsIn[currentScript.name].callback)
						{
							(_importsIn[currentScript.name].callback)();
						}
						//console.log('ssssssss'+currentScript.name);
						_loaded[currentScript.name]=true;
						_loading[currentScript.name] = false;
						dequeue.called=false;
						dequeue();
					}, 'utf-8');
				}
				dequeue();
			}
		}
		else {
			if(inArray(_lib,url) && dhtml.mode=='product'){
				//if(ie){
				//	setTimeout(function(){xhrLoad(url,callback)},0);
				//}else{
					xhrLoad(url,callback);
				//}
			}else{
				scriptLoad(url,callback);
			}
		}
	}
	window.$script = dhtml;
	

})();
$script.setMode('product');
$script();