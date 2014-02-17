/// <reference path="Adapter/JWPlayerAdapter.js" />
/// <reference path="Adapter/WPFRecorderAdapter.js" />
/// <reference path="Adapter/WPFPlayerAdapter.js" />
/// <reference path="Adapter/SpeechRecorderAdapter.js" />
/// <reference path="Adapter/AndroidPlayerAdapter.js" />
/// <reference path="Adapter/AndroidRecorderAdapter.js" />

/**
 * 文件名: SpeechJS.js
 * 描述: 声文同步JS
 *
 * 功能说明：
 * 1、篇章朗读 - 标准音朗读声文同步、录音评测跟踪同步
 * 2、句子评测 - 
 * 3、单词评测 -
 *
 * 版本: 1.0.1.0
 * 作者: yuwang@iflytek.com
 * 日期：2012/12/05
 *
 * 变更记录：
 * 2012/01/30 1.0.0.2 修改展现器基类，将DOM缓存及事件注册移至基类中
 * 2012/02/03 1.0.0.3 统一TTS中各处索引名称，修改展现器中缓存DOM和DOM事件注册可配置并增加onReady回调
 * 2013/02/20 1.0.0.4 增加TTS初始化onBeforeInitTTS事件处理, DOM缓存元素中添加层级间的关系索引
 * 2013/02/28 1.0.0.5 增加试卷文件处理，修复部分Bug
 * 2013/03/11 1.0.0.6 增加对朗读评测结果的处理，日志帮助类增加reload方法, Bug修复
 * 2013/12/04 1.0.1.0 增加dispose方法，增加smartbook适配器
 */

//------------------------------------------------  LogUtil  ---------------------------------------------
(function (options) {

    var _width = options.width;
    var _left = options.left;
    var _top = options.top;
    var _logLevel = 1;

    var _height = options.height;
    var _showPanel = options.showPanel === true;
    var _showConsole = options.showConsole === true;
    var _logPanel = document.createElement("div");

    if (document.body) {
        appendLogPanel();
    } else {
        addLoadEvent(appendLogPanel);
    }

    /**
    * 为document添加onload事件
    *
    * @method addLoadEvent
    * @param {Function} fn onload事件处理方法
    * @private
    */
    function addLoadEvent(fn) {

        // Mozilla, Opera etc.
        if (window.addEventListener) {
            window.addEventListener("load", fn, false);
        }
        // IE
        else if (document.attachEvent) {
            window.attachEvent("onload", fn);
        }
        // Others
        else {
            window['on' + event] = fn;
        }
    }

    /**
    * 向页面上添加日志容器
    *
    * @method appendLogPanel
    * @private
    */
    function appendLogPanel() {
        var css = "width:" + _width + "px; \
                    height:" + _height + "px; \
                    position:absolute; \
                    border:1px solid #ccc; \
                    background-color:#fff; \
                    left:" + _left + "px; \
                    top:" + _top + "px; \
                    word-wrap: break-word; \
                    overflow-y:scroll; \
                    display:" + (_showPanel ? "" : "none");

        _logPanel.style.cssText = css;
        document.body.appendChild(_logPanel);
    }

    /**
    * 格式化时间
    *
    * @method formatDate
    * @private
    * @param {String} pattern 样式名模式(例如: yyyy-MM-dd hh:mm:ss)
    * @return {String} 格式化后的时间字符串
    */
    function formatDate(pattern) {

        function fs(num) {
            return num < 10 ? "0" + num : num.toString();
        }

        var s = pattern.replace(/yyyy/g, this.getFullYear());
        s = s.replace(/MM/g, fs(this.getMonth() + 1));
        s = s.replace(/dd/g, fs(this.getDate()));
        s = s.replace(/hh/ig, fs(this.getHours()));
        s = s.replace(/mm/g, fs(this.getMinutes()));
        s = s.replace(/ss/g, fs(this.getSeconds()));
        var milliseconds = this.getMilliseconds();
        s = s.replace(/fff/g, milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds);

        return s;
    }

    /**
    * 显示消息
    *
    * @method showMessage
    * @private
    * @param {String} msg       消息内容
    * @param {String} perfix    消息前缀
    * @param {String} color     消息显示颜色
    **/
    function showMessage(msg, perfix, color) {
        if (_showPanel) {
            msg = formatDate.call(new Date(), "yyyy-MM-dd HH:mm:ss.fff") + " " + perfix + " : " + msg;
            var msgPanel = document.createElement("span");
            msgPanel.style.color = color;

            // ie, chrome, safari
            if (msgPanel.innerText !== undefined) {
                msgPanel.innerText = msg;
            } else { // firefox
                msgPanel.textContent = msg;
            }
            _logPanel.appendChild(msgPanel);
            _logPanel.appendChild(document.createElement("br"));

            _logPanel.scrollTop = _logPanel.scrollHeight;
        }
    }

    var LogCatLevel = {
        DEBUG: 3,
        INFO: 4,
        WARN: 5,
        ERROR: 6
    };

    /**
    * 显示LogCat消息, Android平台下使用(同时Andorid中要实现相应的日志适配器)
    *
    * @method showLogCat
    * @private
    * @param {Int} level      消息级别(参考LogCatLevel)
    * @param {String} msg     消息内容
    * @param {String} tag     消息标签
    **/
    function showLogCat(level, msg, tag) {
        if (window.LogCatInterface) {
            window.LogCatInterface.log(level, msg, tag || "SpeechJS Log");
        }
    }

    /**
    * 重新加载日志属性
    * 
    * LogUtil.reload({
    *    width: 300, 
    *    height: 450,
    *    left: 630,
    *    top: 10, 
    *    showPanel: true,           // 显示日志容器日志
    *    showConsole: true          // 显示控制台日志 
    * });
    *
    * @method reload
    * @param {JSON} option    配置参数
    **/
    function reload(option) {
        if (option && _logPanel) {
            if (typeof option.width === "number") {
                _width = option.width;
                _logPanel.style.width = _width + "px";
            }

            if (typeof option.height === "number") {
                _height = option.height;
                _logPanel.style.height = _height + "px";
            }

            if (typeof option.left === "number") {
                _left = option.left;
                _logPanel.style.left = _left + "px";
            }

            if (typeof option.top === "number") {
                _top = option.top;
                _logPanel.style.top = _top + "px";
            }

            if (typeof option.showPanel === "boolean") {
                _showPanel = option.showPanel;
                if (_showPanel) {
                    _logPanel.style.display = "";
                } else {
                    _logPanel.style.display = "none";
                }
            }

            if (typeof option.showConsole === "boolean") {
                _showConsole = option.showConsole;
            }
        }
    }

    window.LogUtil = {
        debug: function (msg, tag) {
            showMessage(msg, "DEBUG", "gray");
            if (_showConsole && window.console && window.console.log) {
                window.console.log(msg);
            }

            showLogCat(LogCatLevel.DEBUG, msg, tag);
        },
        info: function (msg, tag) {
            showMessage(msg, "INFO", "green");
            if (_showConsole && window.console && window.console.info) {
                window.console.info(msg);
            }

            showLogCat(LogCatLevel.INFO, msg, tag);
        },
        warn: function (msg, tag) {
            showMessage(msg, "WARN", "orange");
            if (_showConsole && window.console && window.console.warn) {
                window.console.warn(msg);
            }

            showLogCat(LogCatLevel.WARN, msg, tag);
        },
        error: function (msg, tag) {
            showMessage(msg, "ERROR", "red");
            if (_showConsole && window.console && window.console.error) {
                window.console.error(msg);
            }

            showLogCat(LogCatLevel.ERROR, msg, tag);
        },
        reload: reload,
        clear: function () {
            _logPanel.innerHTML = "";
        }
    };

})({ width: 300, height: 450, left: 630, top: 10, showPanel: false, showConsole: false });

//--------------------------------------------- SpeechJS Logic -------------------------------------------
(function (win){

    /**
    * SpeechJS
    *
    * @class SpeechJS
    * @static
    **/
    var $this = win.SpeechJS = {};			//SpeechJS

    LogUtil.info("--------- SpeechJS 1.0.0.7 -----------");
    
    /**
    * Ajax处理对象
    *
    * @property  SimpleAjax
    * @type SimpleAjax
    **/
    $this.SimpleAjax = new SimpleAjax();
    
     /**
    * 公用方法
    *
    * @property  Common
    * @type Common
    **/
    $this.Common = new Common();
    
    /**
    * Ajax请求类
    *
    * @class SimpleAjax
    * @constructor
    **/
    function SimpleAjax() {
        
        /**
        * ajax请求
        *
        * @method ajax
        * @param {Object} option ajax请求参数
        **/
        function ajax(option) {
            
            if(!option) {
                return;
            }
            
            var xmlhttp;

            if (window.XMLHttpRequest) {
                // IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new window.XMLHttpRequest();
            } else {
                // IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            var url = encodeURI(option.url);
            var isAsync = option.async !== false;
            xmlhttp.open(option.method || "GET", url, isAsync);
            xmlhttp.send();
            
            if(isAsync) {
                xmlhttp.onreadystatechange = onReadyStateChange;
            }else {
                onReadyStateChange();
            }

            function onReadyStateChange() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (option.success) {
                        option.success(xmlhttp.responseText, xmlhttp.status, xmlhttp);
                    }
                } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
                    if (option.error) {
                        option.error(xmlhttp.responseText, xmlhttp.status, xmlhttp);
                    }
                };
                
                
            }
        }
        
        return {
            ajax: ajax
        };
    }
    
    /**
    * 公用方法类
    *
    * @class Common
    * @constructor
    **/
    function Common() {
        
        /**
        * 克隆对象
        *
        * @method clone
        * @param {Object} obj 要克隆的对象
        * @return {Object}
        **/
        function clone(obj) {
            
            if(obj === undefined) {
                return undefined;
            }

            var objClone;
            if (obj.constructor === Object){
                objClone = new obj.constructor(); 
            }else{
                objClone = new obj.constructor(obj.valueOf()); 
            }
            
            for(var key in obj){
                if ( objClone[key] !== obj[key] ){ 
                    if (typeof obj[key] === 'object'){ 
                        objClone[key] = $this.Common.clone(obj[key]);
                    }else{
                        objClone[key] = obj[key];
                    }
                }
            }
            objClone.toString = obj.toString;
            objClone.valueOf = obj.valueOf;
            
            return objClone; 
        }
        
        /**
        * 将对象B中的属性扩展到对象A中
        *
        * @method extend
        * @param {Object} objA 对象A
        * @param {Object} objB 对象B
        * @param {Boolean} safe [options] true: 只扩展objA中本来没有的属性
        **/
        function extend(objA, objB, safe) {
            
            if(typeof objA !== "object" || typeof objB !== "object") {
                return;
            }
            
            for (var prop in objB) {
                if (safe) {
                    if(!objA.hasOwnProperty(prop)) {
                        objA[prop] = objB[prop];
                    }
                }
                else {
                    objA[prop] = objB[prop];
                }
            }
        }
        
        function stopPropagation() {
            
            if (this.stopPropagation) {
                this.stopPropagation();
            } else {
                this.cancelBubble = true;
            }
        }
        
        /**
        * 为Html元素添加事件，并修改执行上下文
        *
        * @method addEvent
        * @param {DOM} ele html元素
        * @param {String} event 事件名称
        * @param {Function} handleFun 事件处理函数
        * @param {Object} data 传递给事件处理函数的参数
        **/
        function addEvent(ele, event, handleFun, data) {
            
            // 如果有参数要传递给事件处理函数，则创建一个闭包
            var func;
            if(data !== undefined) {
                func = (function(passData) {
                    return function() {
                        handleFun.call(ele, arguments[0], passData);
                    };
                }(data));
            } else {
                func = handleFun;
            }
            
            // Mozilla, Opera etc.
            if (document.addEventListener) {
                ele.addEventListener(event, function () {
                    func.apply(ele,arguments);
                }, false);
            }

            // IE
            else if (document.attachEvent) {
                ele.attachEvent("on" + event, function () {
                    arguments.data = data || "";
                    func.apply(ele, arguments);
                });
            }

            // Others
            else {
                ele['on' + event] = function () {
                    func.apply(ele, arguments);
                };
            }
        }
        
        /**
        * 通过样式名找到HTML元素
        *
        * @method getElementsByClassName
        * @param {DOM} dom 执行上下文
        * @param {String} className 样式名
        * @return {Array}
        **/
        function getElementsByClassName(dom, className) {
            
            if(dom.getElementsByClassName){
                return dom.getElementsByClassName(className);
            }else{
                var returnElements = [];
                var els =  dom.all;
                var i = els.length;
                var pattern = new RegExp("(^|\\s)"+className+"(\\s|$)");
                for(var idx=0; idx < i; idx++) {
                    if (pattern.test(els[idx].className) ) {
                        returnElements.push(els[idx]);
                    }
                }
                return returnElements;
            }
        }

        return {
            clone:clone,
            extend:extend,
            addEvent:addEvent,
            getElementsByClassName:getElementsByClassName
        };
    }

    /**
    * 基础抽象类
    *
    * @class AbstractClassBase
    * @constructor 
    **/
    function AbstractClassBase() {
        return {
            __class__: {
                check: function() {
                    /// <summary>在子类中调用，检查子类是否实现了抽象类中定义的方法(注意在子类中调用时要修改this指向子类对象本身)</summary>

                    for (var prop in this) {
                        
                        // "__"开头的方法是基类内部方法，SpeechJS内部调用，不应该由应用层直接调用
                        if(prop.length > 2 && prop.substr(0,2) === "__"){
                            continue;
                        }
                        
                        // "$"开头的方法是基类默认实现方法, 应用层可直接调用
                        if(prop.length>1 && prop.substr(0,1) === "$") {
                            continue;
                        }

                        // 检查方法定义实现(子类中需要重写实现)
                        if (!this.hasOwnProperty(prop) && typeof(this[prop]) === "function" && prop !== "constructor") {

                            // 如果在子类中没有与方法名一样的属性，或者子类中的属性不是方法则提示出错
                            if (!this.__proxy__.hasOwnProperty(prop) || typeof(this.__proxy__[prop]) !== "function") {
                                LogUtil.error(prop + " need to be implement!");
                            }
                        }
                    }
                }
            }
        };
    }
    
    /**
    * Speecher核心类
    *
    * @class Speecher
    * @constructor 
    */
    function Speecher(settings) {
        
        var _this = this;   // cache this
        var _exSettings;
        
        /**
        * 展现器
        *
        * @property Presenter 
        * @private
        * @type Object
        **/
        var _presenter;
        
        /**
        * 录音器
        *
        * @property Recorder
        * @private
        * @type Object
        **/
        var _recorder; 
        
        /**
        * 播放器
        * 
        * @property Player 
        * @private
        * @type Object
        **/
        var _player;
        
        /**
        * 扩展初始化设置 
        *
        * @method extendSettings
        * @private
        * @param {Object} option 用户设置的初始化参数
        * @return {Object} 扩展后的初始化信息
        **/
        function extendSettings(option) {
            
            var exSetting = option;
            if(!exSetting.events) {
                exSetting.events = { };
            }
            
            // 设置Speehcer的ID
            var speecherId = option.id || "speecher-" + new Date().getTime();
            while($this.getSpeecher(speecherId) !== undefined) {
                LogUtil.warn(speecherId + " already exist, regenerate one");
                speecherId = "speecher-" + new Date().getTime();
            }
            exSetting.id = speecherId;
            
            return exSetting;
        }
        
        /**
        * 初始录音器
        * 
        * @method initRecorder
        * @private
        * @param {Object} option  录音器初始化参数
        * @return {Object}  录音器适配器
        **/
        function initRecorder(option) {
            /// <summary>初始化录音器</summary>
            /// <param name="option" type="Object">录音器设置参数</param>
            /// <returns type="Recorder" />
            
            var exOption = $this.Common.clone(option);
            if(!exOption.events) {
                exOption.events = { };
            }

            var eventsProxy = {
                onTrackInfo:function(e) {
                    var exTrackInfo = e;
                    if(_presenter) {
                         exTrackInfo = _presenter.TTS.extenndTrackInfo(e, _presenter.DOM);
                         _presenter.handleTrackInfo(exTrackInfo);
                    }
                    
                    if(option.events && option.events.onTrackInfo) {
                        option.events.onTrackInfo.call(this, exTrackInfo);
                    }
                },
                onEvalResult:function(e) {
                    
                    if(option.events && option.events.onEvalResult) {
                        option.events.onEvalResult.call(this,e);
                    }
                }
            };

            $this.Common.extend(exOption.events, eventsProxy);
            var record = RecorderFactory.getRecorder(exOption);
            
            return record;
        };
    
        /**
        * 初始化播放器
        * 
        * @method initPlayer
        * @private
        * @param {Object} option 播放器初始化参数
        * @return {Object} 播放器适配器
        **/
        function initPlayer(option) {
            /// <summary>初始化播放器</summary>
            /// <param name="option" type="Object">播放器设置参数</param>
            /// <returns type="Player" />
            
            var exOption = $this.Common.clone(option);
            if(!exOption.events) {
                exOption.events = { };
            }

            var eventsProxy = {
                onPlaying:function(e) {
                    
                    if(_presenter) {
                        _presenter.highlight(e.position * 1000);
                    }
                    
                    if(option.events && option.events.onPlaying) {
                        option.events.onPlaying.call(this, e);
                    }
                }  
            };

            $this.Common.extend(exOption.events, eventsProxy);
            
            var player =  PlayerFactory.getPlayer(exOption);

            return player;
        }
        
        /**
        * 初始化展现器
        *
        * @method initPresenter
        * @param {Object} option 展现器初始化参数
        * @async
        * @private
        **/
        function initPresenter(option) {

            var presenterOption = option.presenterOption;
            if(presenterOption) {
                presenterOption.events = presenterOption.events || { };
                var ttsSentences = new TTSSentences({
                        ttsUrl:option.ttsUrl,
                        ttsContent:option.ttsContent,    
                        onBeforeInitTTS:  presenterOption.events.onBeforeInitTTS,    
                        onInitialized : function(isSuccess) {
                	
                            LogUtil.debug("Speecher TTSSentences onInitialized isSuccess:" + isSuccess);
                    
                            if(isSuccess) {
                                _presenter = PresenterFactory.getPresenter(presenterOption);
                                _presenter.__init__(presenterOption, ttsSentences);
                                _this.Presenter = _presenter;
                        
                            } else {
                                LogUtil.error("TTS Sentences not initialize success!");
                            }

							// 处理试卷
							if(option.pyUrl || option.pyContent){
								handlePyInfo({pyUrl: option.pyUrl, pyContent: option.pyContent}, _presenter.DOM);
							};
                           
                            presenterOption.events.onReady && presenterOption.events.onReady.call(_presenter);
                        }
                    });
            }else {
                LogUtil.warn("invalid Presenter initialize option");
            }
        }
        
        /**
        * 评测试卷文件处理, 处理成功后会在句子DOM和篇章DOM上添加对应的评测文本
        *
        * @method initPresenter
		* @private
        * @param {String} pyInfo 试卷文件信息
        * @param {Object} dom DOM缓存

        */
        function handlePyInfo(pyInfo, dom) {
            var pyContent;
        
            if(pyInfo.pyContent) {
                pyContent = pyInfo.pyContent;
            }else if(pyInfo.pyUrl) {
                 $this.SimpleAjax.ajax({
                    url:  encodeURI(pyInfo.pyUrl),
                    async: false,
                    success: function(result) {
                        pyContent = result;
                    },
                    error: function(result, status) {
                        LogUtil.error("Get py error! status:" + status);
                    }
                });
            }
        
            if(pyContent) {
               
                dom.Paper = pyContent;
                var senPaper;
                
                // 已标注试卷
                if(pyContent.indexOf("[content]\r\n") > -1) {
                    senPaper  = pyContent.substring("[content]\r\n".length, pyContent.indexOf("\r\n[keywords]") - 1);
                }else { // 未标注试卷
                    senPaper = pyContent;
                }
                
                // 确定句子分隔符
                var senSpliter;
                if(new RegExp(/\.\r\n/).test(pyContent)) {
                    senSpliter = ".";
                } else {
                    senSpliter = "!";
                }

                if(new RegExp(senSpliter + '{2,}').test(senPaper)) {
                    throw new Error("试卷文件-多余的句子分隔符");
                }
                
                // 分割句子评测文本
                var senPaperArray = senPaper.split(senSpliter);
                if(senPaperArray.length !== dom.Sentences.length) {
                    LogUtil.warn("评测试卷与DOM不匹配...");
                     throw new Error("评测试卷与DOM不匹配..");
                } else {
                    var gloablSenIndex = 0;
                    for(var pIdx = 0; pIdx < dom.Paragraphs.length; pIdx++) {
                        var paraPaper = "";
                        var paragraph = dom.Paragraphs[pIdx];
                        for(var sIdx=0; sIdx<paragraph.Sentences.length; sIdx++,gloablSenIndex++) {
                            var sen = paragraph.Sentences[sIdx];
                            sen.Paper = senPaperArray[gloablSenIndex];
                            paraPaper += sen.Paper + senSpliter;
                        }
                        paragraph.Paper = paraPaper;
                    }
                }
            }
        }
        
        /**
        * 初始化
        *
        * @method init
        * @param {Object} option 初始化参数
        * @async
        * @private
        **/
        function init(option) {
            
            var exSettings = _exSettings = extendSettings(option);
            
        	LogUtil.debug("Speecher init | enter, id:" + exSettings.id);
            _this.id = exSettings.id;
            
             // 初始化展现器
            LogUtil.debug("Speecher init Presenter begin");
            initPresenter(exSettings);
            
            // 初始化录音器
            LogUtil.debug("Speecher initRecorder begin");
            var recorderOption = exSettings.recorderOption;
            if(recorderOption) {
                 _recorder = initRecorder(recorderOption);
                _this.Recorder = _recorder;
            }else {
                 LogUtil.warn("invalid Recorder initialize option");
            }
           
            // 初始化播放器
            LogUtil.debug("Speecher initPlayer begin");
            var playerOption = exSettings.playerOption;
            if(playerOption) {
                _player = initPlayer(playerOption);
                _this.Player = _player;
            }else {
                 LogUtil.warn("invalid Player initialize option");
            }
        }
       
        /**
        * 切换录音器
        * 
        * @method switchRecorder
        * @param {Object} option 新录音器初始化参数
        **/
        function switchRecorder(option) {
             /// <summary>切换录音器</summary>

            _this.Recorder = initRecorder(option);
        }
        
        /**
        * 切换播音器
        *
        * @method switchPlayer
        * @param {Object} option 新播放器初始化参数
        **/
        function switchPlayer(option) {
             /// <summary>切换播放器</summary>

            _this.Player = initPlayer(option);
        }
        
        function dispose() {
            if (_this.Recorder && _exSettings.recorderOption.adapter ===  SpeechJS.Adapters.SpeechRecorder) {
                _this.Recorder.dispose();
            }
            if (_this.Player && _exSettings.playerOption.adapter === SpeechJS.Adapters.JWPlayer) {
                _this.Player.dispose();
            }
        }
        
        // 初始化
        init(settings);

        // 暴露Public方法 
        var publicMethods = {
            switchRecorder : switchRecorder,
            switchPlayer : switchPlayer,
            dispose : dispose
        };

        $this.Common.extend(_this, publicMethods);

        return _this;
    }

    /**
    * TTS处理类
    *
    * @class TTSSentences
    * @constructor 
    */
    function TTSSentences(option) {
        var _this = this;
        var _allSentences = [];
        var _allWords = [];
		var _allEvalWords = [];

        if(option.ttsUrl) {
            $this.SimpleAjax.ajax({
                url: option.ttsUrl,
                success: function(result) {
                    initTTSContent(result);
                },
                error: function(result, status) {
                    LogUtil.error("Get tts error! status:" + status);
                    if (option.onInitialized) {
                        option.onInitialized(false);
                    }
                }
            });
        }else {
            initTTSContent(option.ttsContent);
        }
        
        /**
        * 初始化TTS文本
        *
        * @method initTTSContent
        * @param {String/JSON} ttsContent 初始TTS文本信息或原始TTS对象
        * @private
        **/
        function initTTSContent(ttsContent) {
            var ttsInfo;
            if(typeof ttsContent === "string") {
                ttsInfo = eval("(" + ttsContent + ")");
            }else {
                ttsInfo = ttsContent;
            }
            
            // 处理onBeforeInitTTS事件
            if(option.onBeforeInitTTS) {
                var result = option.onBeforeInitTTS.call(_this, ttsInfo);
                if(result !== false) {
                    initTTSInfo(ttsInfo);;
                }
            }else {
                initTTSInfo(ttsInfo);
            }
          
            if (option.onInitialized) {
                setTimeout(function() {
                    option.onInitialized(true);
                }, 0);
            }
            
            _this.getIndexByTime = getIndexByTime;
            _this.extenndTrackInfo = extenndTrackInfo;
        }
    
        /**
        * 根据TTS内容生成TTS信息
        *
        * @method initTTSInfo
        * @param {JSON} ttsInfo 初TTS JSON信息
        * @private
        **/
        function initTTSInfo(ttsJSON) {

            var sentences = ttsJSON.Sentences;
            var paragraphs = [];
            var paragraph = { Sentences:[], GlobalIndex: 0, Words:[] };
            paragraphs.push(paragraph);
            var currParagraphsIndex = 0;
            
            var senIndex = 0;
            var senGlobalIndex = 0;
            var wordGlobalIndex = 0;
            
            // 初始化段落
            for (var index = 0; index < sentences.length; index++) {
           
                var sen = sentences[index];
                sen.Words = [];
                sen.ParagraphIndex = currParagraphsIndex;
                if (sen.Text === "||。") {       // 段落以"||。"进行分隔
                    
                    currParagraphsIndex++;
                    paragraph = { Sentences: [], GlobalIndex: currParagraphsIndex, Words:[]};
                    paragraphs.push(paragraph);
                    sentences.splice(index--, 1);    // 删除段落分隔符，并将句子索引往回移1位
                    senIndex = 0;
                    continue;
                } else {    //添加句子
                    paragraph.Sentences.push(sen);
                    sen.Index = senIndex++;
                    sen.GlobalIndex = senGlobalIndex++;
                    sen.Words = [];
                    sen.ValidWords = [];
                    _allSentences.push(sen);
                
                    if(sen.Phrases.length < 1) {
                         throw new Error("TTS 句子中没有单词, 段落索引:" + currParagraphsIndex + ", 句子全局索引:" + senGlobalIndex);
                    }
                    
                    // 处理单词
                    for(var wordIndex =0 ; wordIndex<sen.Phrases.length;wordIndex++ ) {
                        var word = sen.Phrases[wordIndex];
                        word.Index = wordIndex;
                        word.GlobalIndex = wordGlobalIndex++;
                        word.SentenceIndex = sen.GlobalIndex;
                        word.ParagraphIndex = currParagraphsIndex;
                        _allWords.push(word);
                        sen.Words.push(word);
                        if(word.PY != "" && word.PT.indexOf("</Font>") < 0) {
                            sen.ValidWords.push(word);
							_allEvalWords.push(word);
                        }
                        paragraph.Words.push(word);
                    }

                    delete sen.Phrases;
                }
            }
            
            // 添加段落起止播放时间
            for(var pIdx=0; pIdx<paragraphs.length; pIdx++) {
                paragraph = paragraphs[pIdx];
                if(paragraph.Sentences.length < 1) {
                    throw new Error("TTS 段落中没有句子, 段落索引:" + pIdx);
                }
                paragraph.ST = paragraph.Sentences[0].ST;
                paragraph.ET = paragraph.Sentences[paragraph.Sentences.length - 1].ET;
            }

            _this.Paragraphs =  paragraphs;
            _this.AllSentences = _allSentences;
            _this.AllWords = _allWords;
			_this.AllEvalWords = _allEvalWords;
        }
    
        /**
        * 根据标准音播放位置获取索引信息
        *
        * @method getIndexByTime
        * @param {Number} position 音频位置,单位ms
        * @return {Object} 索引信息对象
        **/
        function getIndexByTime(position) {

            // NOTE:若可取到单词的准确切分信息，可以考虑采用折半查找来查找单词索引
        
           var wordIndex = 0;
           var sen = undefined;
           for(var senIndex=0; senIndex < _this.AllSentences.length; senIndex++) {
               sen = _this.AllSentences[senIndex];
               if(sen.ET * 1000 < position ) {
                   continue;
               }

               // 计算单词索引位置
               var avrageWordTime = (sen.ET - sen.ST) * 1000 / sen.ValidWords.length;
               if(position < sen.ST * 1000) {
                   wordIndex = -1;
               }else {
                   wordIndex = Math.floor((position -sen.ST * 1000 ) / avrageWordTime);
               }
           
               break;
           }
        
            return {
                ParagraphIndex: sen === undefined ?  -1 :  sen.ParagraphIndex,
                SentenceIndex: senIndex >  _this.AllSentences.length - 1 ? _this.AllSentences.length - 1 : senIndex,
                WordIndex: wordIndex > sen.ValidWords.length - 1 ? sen.ValidWords.length - 1 : wordIndex
            };
        }

        /**
        * 根据全局单词索引得到索引信息
        *
        * @method extenndTrackInfo
        * @param {Object} trackInfo   原始朗读跟踪信息
        * @param {Object} dom         缓存的DOM对象
        * @return {Object} 索引信息对象
        **/
        function extenndTrackInfo(trackInfo, dom) {

            var exTrackInfo = {TrackType : trackInfo.TrackType, ReadStatus : trackInfo.ReadStatus, OriginalTrackInfo: trackInfo};

            var sentencs = dom.Sentences;
            var words = dom.Words;
            
            // 句子跟踪
            if (trackInfo.TrackType === 2) {
                exTrackInfo.SentenceIndex = trackInfo.Index;
                exTrackInfo.ParagraphIndex = sentencs[trackInfo.Index].ParagraphIndex;
            }
            // 单词跟踪
            else if (trackInfo.TrackType === 3) {
                exTrackInfo.WordIndex = trackInfo.Index;
                exTrackInfo.SentenceIndex = words[trackInfo.Index].SentenceIndex;
                exTrackInfo.ParagraphIndex = words[trackInfo.Index].ParagraphIndex;
            };

            return exTrackInfo;
        }
        
        return _this;
    }

    /*
    * PresenterFactory
    */
    var PresenterFactory = {
        getPresenter:function(option) {
        	
        	LogUtil.debug("PresenterFactory::getPresenter | enter");
        	
            var presenter = undefined;
            
            // 自定义展现器
            if(option.customPresenter) {
            	LogUtil.debug("PresenterFactory::create custom presenter, typeof custom presenter:" + typeof option.customPresenter);
                presenter = new option.customPresenter(option);
            } else {    
            	LogUtil.debug("PresenterFactory::create default presenter name:" + option.presenter);
                 // 使用默认展现器
                 switch(option.presenter) {
                    case $this.Presenters.Chapter:
                        presenter = new ChapterPresenter(option);
                        break;
                    case $this.Presenters.Sentence:
                        presenter = new SentencePresenter(option);
                        break;
                    case $this.Presenters.Words:
                        presenter = new WordPresenter(option);
                        break;
                    default:
                        LogUtil.error("Unkonw presenter category:" + option.category);
                        break;    
                }
            }

            LogUtil.debug("PresenterFactory::getPresenter | leave");
            return presenter;
        }
    };
    
    /**
    * 展现器基类
    * 
    * @class PresenterBase
    * @constructor
    **/
    function PresenterBase() {

        var _this = this;
        var _proxy, _events;
        _this.__proxy__ = _proxy = { };
        _this.__events__ = _events = { };
        
        _this.TTS = { };
        _this.DOM = { };
        
        /**
        * 缓存DOM元素
        *
        * @method cacheDOM
        * @param {DOM} contentPanel   展现器容器
        **/
        function cacheDOM(contentPanel) {
            
            var senGlobalIndex = 0;
            var wordGlobalIndex = 0;
            
            // 缓存段落
            var paragraphPanels =  $this.Common.getElementsByClassName(contentPanel, $this.Defines.ParagraphClass);
            var sentencePanels = [];
            var wordPanels = [];
            for(var pIndex=0; pIndex < paragraphPanels.length; pIndex++) {
                var paragraph = paragraphPanels[pIndex];
                paragraph.GlobalIndex = pIndex;
                paragraph.Sentences = [];
                paragraph.Words = [];
                var sentences = $this.Common.getElementsByClassName(paragraph, $this.Defines.SentenceClass);

                // 缓存句子
                for(var sIndex=0; sIndex < sentences.length; sIndex++, senGlobalIndex++) {
                    var sen = sentences[sIndex];
                    sen.GlobalIndex = senGlobalIndex;
                    sen.ParagraphIndex = pIndex;
                    sen.Words = [];
                    var words =  $this.Common.getElementsByClassName(sen, $this.Defines.WordClass);
                    paragraph.Sentences.push(sen);
                    sentencePanels.push(sen);
                    
                    // 缓存单词
                    for(var wIndex=0; wIndex < words.length; wIndex++) {
                        var word = words[wIndex];
                        
                        word.GlobalIndex = wordGlobalIndex++;
                        word.SentenceIndex = senGlobalIndex;
                        word.ParagraphIndex = pIndex;
                        
                        wordPanels.push(word);
                        sen.Words.push(word);
                        paragraph.Words.push(word);
                    }
                }
            }
           
            return {Paragraphs: paragraphPanels, Sentences:sentencePanels, Words: wordPanels};
        }
        
        /**
        * 注册DOM事件
        *
        * @method registerEvents
        * @param {DOM} dom 缓存下来的DOM元素
        * @param {Object} events 事件回调
        **/
        function registerEvents(dom, events) {
            
            // 注册段落点击事件
            for(var pIdx=0; pIdx < dom.Paragraphs.length; pIdx++) {
                var paragraph = dom.Paragraphs[pIdx];
                
                $this.Common.addEvent(paragraph, "click", function() {
                    if(events && events.onParagraphPanelClick) {
                        events.onParagraphPanelClick.apply(this, arguments);
                    }
                }, _this.TTS.Paragraphs[pIdx]);  
                
                // 注册句子点击事件
                for(var sIdx=0; sIdx < paragraph.Sentences.length; sIdx++) {
                    var sentence = paragraph.Sentences[sIdx];
                   
                    $this.Common.addEvent(sentence, "click", function() {
                        if(events && events.onSentencePanelClick) {
                            events.onSentencePanelClick.apply(this, arguments);
                        }
                    }, _this.TTS.Paragraphs[pIdx].Sentences[sIdx]);  
                   
                    // 注册单词点击事件
                    for(var wIdx=0; wIdx < sentence.Words.length; wIdx++) {
                        $this.Common.addEvent( sentence.Words[wIdx], "click", function() {
                            if(events && events.onWordPanelClick) {
                                events.onWordPanelClick.apply(this, arguments);
                            }
                        },_this.TTS.Paragraphs[pIdx].Sentences[sIdx].Words[wIdx]);  
                    }
                }
            }
        };
        
        _this.__init__ = function(option, ttsInfo) {
            var events = option.events;
            var contentPanel = document.getElementById(option.contentPanelId);
            _this.TTS = ttsInfo;
            contentPanel.innerHTML = _this.buildHTML(ttsInfo);
            
            if(option.cacheDOM == false) {
                 return;
            }
            _this.DOM = cacheDOM(contentPanel);
            
            if(option.registerEvents == false) {
                return;
            }
            
            registerEvents(_this.DOM, events);
        };

        /**
        * 处理评测结果
        *
        * @method $handleEvalResult 
        * @param {Object} evalResult 评测结果JSON
        * @protected
        **/
        _this.$handleEvalResult = function(evalResult) {
            var words = [];
            
            for(var senIdx=0; senIdx < evalResult.Sentences.length; senIdx++) {
                var sen = evalResult.Sentences[senIdx];
                for(var wIdx=0;wIdx<sen.Words.length;wIdx++) {
                    var word = sen.Words[wIdx];
                    words.push(word);
                }
            }

            _this._evalResultWords = words;
        };
        
		/**
        * 根据用户音播放位置获取单词
        *
        * @method $getReadWord
        * @param {Number} position 时间(单位: ms)
        * @protected
        **/
        _this.$getReadWord = function(position) {
            
            var word;
            for(var wIdx=0; wIdx < _this._evalResultWords.length; wIdx++) {
                word = _this._evalResultWords[wIdx];
                if(word.BegPos <= position && position < word.EndPos) {
                    return  _this.DOM.Words[word.GlobalIndex];
                }
            }

            return undefined;
        };
        
        /*
        * @protected
        */
        _this.buildHTML = function(ttsInfo) {
            /// <summary>构建页面HTML</summary>
            
            return _proxy.buildHTML(ttsInfo);
        };

        _this.handleTrackInfo = function(exTrackInfo) {
            /// <summary>朗读跟踪</summary>
            /// <param name="exTrackInfo" type="Object">扩展的跟踪信息</param>
            
            _proxy.handleTrackInfo(exTrackInfo);
        };
        
        _this.highlight = function(postion) {
            /// <summary>跟踪高亮</summary>
            /// <param name="position" type="int">播放进度位置(单位:ms)</param>

            _proxy.highlight(postion);
        };

        _this.clearHighlight = function() {
            /// <summary>清除高亮</summary>

            _proxy.clearHighlight();
        };

        _events.onBeforeHighlight = function() {
            return true;
        };

        _events.onHighlight = function() {
            
        };

        return _this;
    }
    PresenterBase.prototype = new AbstractClassBase();
    PresenterBase.prototype.constructor = PresenterBase;
    $this.PresenterBase = PresenterBase;

    /**
    * 篇章朗读默认展现器
    *
    * @class ChapterPresenter
    * @constructor
    * @extends PresenterBase
    */
    function ChapterPresenter() {

        var _this = this;
        
        // 创建HTML元素
        this.__proxy__.buildHTML = function(tts) {
            var paragraphs = tts.Paragraphs;
            var html = "";

            // 添加段落
            for (var paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {

                var paragraph = paragraphs[paragraphIndex];
                html += '<p class="' + $this.Defines.ParagraphClass +' speech-chap-para" pIndex="' + paragraphIndex + '">';

                // 添加句子
                for (var senIndex = 0; senIndex < paragraph.Sentences.length; senIndex++) {

                    var sen = paragraph.Sentences[senIndex];
                    html += '<span class="' + $this.Defines.SentenceClass +'" sIdx="' + senIndex + '">';

                    // 添加单词
                    var words = sen.Words;
                    for (var wIndex = 0; wIndex < words.length; wIndex++) {
                        
                        var word = words[wIndex];
                        if (word.PY == "" && word.PT.indexOf("</Font>") > -1) {
                            html += '<span wIdx="' + wIndex + '">' + word.PT.replace("</Font>", "") + ' </span>';
                        }
                        else {
                            html += '<span class="' + SpeechJS.Defines.WordClass + '" wIdx="' + wIndex + '" ttsIdx="' + word.GlobalIndex +'">' + word.PT + ' </span>';
                        }
                    }

                    html += '</span>';
                }

                html += '</p>';
            }

            return html;
        };
    
        this.__proxy__.highlight = function(position) {
            LogUtil.debug("ChapterPresenter highlight:" + position);
            
            var indexInfo = _this.TTS.getIndexByTime(position);

            if (indexInfo.ParagraphIndex > -1 && indexInfo.SentenceIndex > -1 && indexInfo.WordIndex > -1) {
                var sen = _this.DOM.Sentences[indexInfo.SentenceIndex];
                sen.Words[indexInfo.WordIndex].style.color = "#0013ec";
            }
        };
    
        this.__proxy__.handleTrackInfo = function(trackInfo) {
        
            // 句子跟踪
            if (trackInfo.TrackType === 2) {
            
            }
            // 单词跟踪
            else if (trackInfo.TrackType === 3) {

                var wordPanel = _this.DOM.Words[trackInfo.WordIndex];
                if (wordPanel !== undefined) {
                    var css;
                    switch (trackInfo.ReadStatus) {
                        // unread                 
                        case 0:
                            css = "unread";
                            break;
                        // checking                  
                        case 1:
                            css = "checking";
                            break;
                        // "read";                  
                        case 2:
                        // "reread";
                        case 3:
                            css = "read";
                            break;
                        default:
                            css = "unknow";
                            break;
                    }
                
                    if(css == "read") {
                        wordPanel.style.color = "blue";
                    }
                }
            }
        };

        this.__proxy__.clearHighlight = function() {
            LogUtil.debug("ChapterPresenter clearHighlight");
            
            for(var index=0; index<_this.DOM.Words.length;index++) {
                _this.DOM.Words[index].style.color = "#000";
            }
        };

        this.__class__.check.call(this);
    }
    ChapterPresenter.prototype = new PresenterBase();
    ChapterPresenter.prototype.constructor = ChapterPresenter;
    
    /**
    * 句子朗读默认展现器
    *
    * @class SentencePresenter
    * @constructor
    * @extends PresenterBase
    */
    function SentencePresenter() {

        this.__proxy__.buildHTML = function(ttsInfo) {
            var paragraphs = ttsInfo.Paragraphs;
            var html = '<div class="' + $this.Defines.ParagraphClass +'">';

            // 添加段落
            for (var paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {

                var paragraph = paragraphs[paragraphIndex];

                // 添加句子
                for (var senIndex = 0; senIndex < paragraph.Sentences.length; senIndex++) {

                    var sen = paragraph.Sentences[senIndex];
                    html += '<span class="' + $this.Defines.SentenceClass + ' speech-sentence-sen" sIdx="' + senIndex + '">';

                    // 添加单词
                    var words = sen.Words;
                    for (var wIndex = 0; wIndex < words.length; wIndex++) {
                        
                        var word = words[wIndex];
                        if (word.PY == "" && word.PT.indexOf("</Font>") > -1) {
                            html += '<span wIdx="' + wIndex + '">' + word.PT.replace("</Font>", "") + ' </span>';
                        }
                        else {
                            html += '<span class="' + SpeechJS.Defines.WordClass + '" wIdx="' + wIndex + '" ttsIdx="' + word.GlobalIndex +'">' + word.PT + ' </span>';
                        }
                    }

                    html += '</span>';
                }
            }

            html += '</div>';

            return html;
        };

        this.__proxy__.handleTrackInfo = function(trackInfo) {
            
        };
        
        this.__proxy__.highlight = function() {

        };

        this.__proxy__.clearHighlight = function() {
        };
        
        this.__class__.check.call(this);
    }
    SentencePresenter.prototype = new PresenterBase();
    SentencePresenter.prototype.constructor = SentencePresenter;

    /**
    * 单词朗读默认展现器
    *
    * @class WordPresenter
    * @constructor
    * @extends PresenterBase
    */
    function WordPresenter() {
        
        this.__proxy__.buildHTML = function(ttsInfo) {
            var paragraphs = ttsInfo.Paragraphs;
            var html = "<div class='"+ $this.Defines.ParagraphClass +"'><div class='" + $this.Defines.SentenceClass +"'>";

            // 添加段落
            for (var paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {

                var paragraph = paragraphs[paragraphIndex];

                // 添加句子
                for (var senIndex = 0; senIndex < paragraph.Sentences.length; senIndex++) {

                    var sen = paragraph.Sentences[senIndex];

                    // 添加单词
                    var words = sen.Words;
                    for (var wIndex = 0; wIndex < words.length; wIndex++) {
                        html += '<span class="' + $this.Defines.WordClass +' speech-words-word" wIdx="' + wIndex + '">' + words[wIndex].PT + ' </span>';
                    }
                }
            }

            html += "</div></div>";
            return html;
        };
             
        this.__proxy__.handleTrackInfo = function(trackInfo) {
            LogUtil.debug("WordPresenter", trackInfo);
        };

        this.__proxy__.highlight  = function() {

        };

        this.__proxy__.clearHighlight = function() {
        
        };
        
        this.__class__.check.call(this);
    }
    WordPresenter.prototype = new PresenterBase();
    WordPresenter.prototype.constructor = WordPresenter;
    
    //---------------------------------------------- Recorder ------------------------------------------

    /**
    * 录音器工厂
    *
    * @class RecorderFactory
    * @static
    */
    var RecorderFactory = {
        
        getRecorder: function(option) {

            var recorder;
            
            switch(option.adapter) {
                case $this.Adapters.WPFRecorder:
                    recorder = new WPFRecorderAdapter({
                        onSoundEnergy: option.events.onSoundEnergy || function () {},
                        onRecordBegin: option.onRecordBegin || function () {},
                        onTrackInfo: option.onTrackInfo || function() {}
                    });
                    break;
                case $this.Adapters.SpeechRecorder:
                    recorder = new win.SpeechRecorderAdapter(option);
                    break;
                case $this.Adapters.AndroidRecorder:
                    recorder = new AndroidRecorderAdapter(option);
                    break;
                default:
                    throw new Error("SpeechJS - unknow recorder adapter");
            }
           
            return recorder;
        }
    };
    
    /*
    * RecorderAdapterBase
    */
    function RecorderAdapterBase() {
        var _recordAdapter = this;
        var _events;
        _recordAdapter.__events__ = _events = {};
        _recordAdapter.__proxy__ = { };

        //
        // Method Define 
        //
        _recordAdapter.record = function(option) {
            /// <summary>开始录音</summary>
            /// <param name="option" type="Object">录音参数</param>
            
            return this.__proxy__.record(option);
        };

        _recordAdapter.stop = function(isForce) {
            /// <summary>停止录音</summary>
            /// <param name="isForce" type="Boolean">是否强制停止</param>
            
            return this.__proxy__.stop(isForce);
        };
        
        //
        // Events Define 
        //
        
        _events.onReady = function() {
            /// <summary>录音器准备完毕事件</summary>
        };
        
        _events.onBeforeRecord = function() {
            /// <summary>录音开始前事件</summary>
            
            return true;
        };

        _events.onRecordBegin = function() {
            /// <summary>录音开始事件</summary>
        };

        _events.onRecordEnd = function() {
            /// <summary>录音结束事件</summary>
        };

        _events.onRecording = function() {
            /// <summary>音量回调</summary>
        };
        
        _events.onTrackInfo = function() {
            /// <summary>评测跟踪回调</summary>
        };

        _events.onEvalResult = function() {
            /// <summary>评测结果</summary>
        };

        _events.onError = function() {
            /// <summary>录音出错</summary>
        };
        
        return _recordAdapter;
    }
    RecorderAdapterBase.prototype = new AbstractClassBase();
    RecorderAdapterBase.prototype.constructor = RecorderAdapterBase;
    $this.RecorderAdapterBase = RecorderAdapterBase;

    //---------------------------------------------- Player  -----------------------------------------
    
    /*
    * Player Factory
    */
    var PlayerFactory = {

        getPlayer: function(option) {
            /// <summary>获取播放器</summary>
            /// <param name="option" type="Object">
            /// 参数说明:
            /// {
            ///     adapter:""      // 适配器名称, 取值:WPF、Flash、MediaPlayer
            /// }
            /// </param>
        
            var player = undefined;

            switch (option.adapter) {
                case $this.Adapters.WPFPlayer:
                    player = new WPFPlayerAdapter({
                            onPlayBegin: option.onPlayBegin || function() {},
                            onPlaying: option.onPlaying || function() {}
                        });
                    break;
                case $this.Adapters.JWPlayer:
                    player = new JWPlayerAdapter(option);
                case $this.Adapters.MediaPlayer:
                    break;
                case $this.Adapters.AndroidPlayer:
                    player = new AndroidPlayerAdapter(option);
                    break;
                case $this.Adapters.SmartBookPlayer:
                    player = new SmartBookPlayerAdapter(option);
                    break;
                default:
                    throw new Error("SpeechJS - unknow player adapter");
            }

            return player;
        }
    };

    /*
    * PlayerAdapterBase
    */
    function PlayerAdapterBase() {

        var playerAdapter = this;
        var _events;
        playerAdapter.__proxy__  = { };
        playerAdapter.__events__ = _events = {};
        
        //
        // Method Define 
        //
        playerAdapter.loadAudio = function(url) {
            /// <summary>加载音频</summary>
            this.__proxy__.loadAudio.apply(this, arguments);
        };
        
        playerAdapter.play = function() {
            /// <summary>播放音频</summary>
            
            this.__proxy__.play();
        };

        playerAdapter.playRange = function(beginPos, endPos) {
            /// <summary>播放一段音频</summary>
            /// <param name="beginPos" type="int">开始位置(ms)</param>
            /// <param name="endPos" type="int">结束位置(ms)</param>
            
            this.__proxy__.playRange(beginPos, endPos);
        };

        playerAdapter.pause = function () {
            /// <summary>暂停音频</summary>
            
            this.__proxy__.pause();
        };

        playerAdapter.stop = function() {
            /// <summary>停止音频</summary>
            
            this.__proxy__.stop();
        };

        playerAdapter.getVolume = function() {
            /// <summary>获取音量</summary>

            return this.__proxy__.getVolume();
        };
        
        playerAdapter.setVolume = function(volume) {
            /// <summary>设置音量</summary>
            /// <param name="volume" type="Number">音量值, 0-100</param>

            return this.__proxy__.setVolume(volume);
        };

        playerAdapter.setMute = function(isMute) {
            /// <summary>设置静音</summary>
            /// <param name="isMute" type="Boolean">是否是静音</param>

            this.__proxy__.setMute(isMute);
        };

        //
        // Events Define 
        //
        _events.onReady = function() {
             /// <summary>播放器加载完毕</summary>
        };
        
        _events.onPlayBegin = function() {
            /// <summary>开始放音</summary>
        };

        _events.onBuffering = function() {
            /// <summary>音频缓冲</summary>
        };
        
        _events.onPlaying = function () {
            /// <summary>放音中</summary>
        };

        _events.onPause = function() {
            /// <summary>暂停</summary>
        };

        _events.onStop = function() {
            /// <summary>放音停止</summary>
        };

        _events.onError = function() {
            /// <summary>出错</summary>
        };

        return playerAdapter;
    }
    PlayerAdapterBase.prototype = new AbstractClassBase();
    PlayerAdapterBase.prototype.constructor = PlayerAdapterBase;
    $this.PlayerAdapterBase = PlayerAdapterBase;
 
    //---------------------------------------------- SpeechJS  -----------------------------------------

    (function(speechJS) {
        
        // Adapter Name Define
        speechJS.Adapters = {
            SpeechRecorder: "SpeechRecorder",
            WPFRecorder: "WPFRecorder",
            AndroidRecorder:"AndroidRecorder",
         
            JWPlayer: "JWPlayer",
            MediaPlayer: "MediaPlayer",
            WPFPlayer: "WPFPlayer",
            AndroidPlayer: "AndroidPlayer",
            SmartBookPlayer: "SmartBookPlayer"
        };

        // Default Presenter Name Define
        speechJS.Presenters = {
            Chapter:"Chapter",
            Sentence:"Sentence",
            Words:"Words"
        };

        speechJS.Defines = {
            ParagraphClass:"spc-para",
            SentenceClass:"spc-sent",
            WordClass:"spc-word"
        };

        /**
        * Speecher数组
        *
        * @property  Speechers
        * @private
        * @type Array.<Speecher>
        */
        var _speechers = [];

        speechJS.getSpeecher = function(speecherId) {
            if(speecherId === undefined) {
                return undefined;
            }
            
            for(var i=0; i < _speechers.length; i++) {
                if(_speechers[i].id === speecherId) {
                    return speechJS.Speechers[i];
                }
            }

            return undefined;
        };

        speechJS.dispose = function(speecherId) {
            var speecher = speechJS.getSpeecher(speecherId);
            if (speecher !== undefined) {
                speecher.dispose();

                for (var i = 0; i < _speechers.length; i++) {
                    if (_speechers[i].id === speecherId) {
                        break;
                    }
                }
                
                _speechers.splice(i, 1);
            }
        };
        
        /**
        * 加载一个Speecher对象
        *
        * @method load
        * @param {Object} option Speecher加载参数
        * @return {Speecher} 
        */
        speechJS.load = function(option) {
            var speecher = new Speecher(option);
            _speechers.push(speecher);
            return speecher;
        };

        speechJS.Speechers = _speechers;
    })($this);
    
})(window);