/// <reference path="swfobject.js" />

/**
 * 文件名: SpeechRecorder.js
 * 描述: SpeechRecorder.swf JS接口文件
 *
 * 功能说明：
 * 1、动态在页面中添加SpeechRecorder的Flash对象
 * 2、暴露SpeechRecorder对象提供给JS调用的方法
 * 3、提供SpeechRecorder对象的事件回调
 *
 * @version: 1.0.8.0
 * @author: yuwang@iflytek.com
 * 日期：2013/1/6
 *
 * 变更记录：
 *           2013/01/28     调整音频播放接口方法
 *           2013/02/02     增加录音回放状态回调
 *           2013/04/16     增加听写接口及回调、增加对Flash播放器的判断
 *           2013/04/23     增加停止听写方法
 * 1.0.5.0   2013/05/15   增加合成方法和回调
 * 1.0.5.1   2013/05/22   去除onDownloadState回调、修改Console方法、规范回调事件名称
 * 1.0.5.3   2013/05/28   事件回调名称调整、增加合成进度回调
 * 1.0.6.2   2013/07/15   修改Doc注释，修复多处拼写错误
 * 1.0.7.0   2013/09/03   增加loginSuccess回调
 * 1.0.7.1   2013/09/18   优化事件处理, 修改SeResultFormat定义
 * 1.0.7.2   2013/09/29   添加DOWNLOAD_PROGRESS事件
 * 1.0.7.3   2013/11/19   增加SeeCN引擎错误码及动态规划枚举定义
 * 1.0.7.4   2013/11/22   增加IAT_KEY事件
 * 1.0.8.0   2013/11/29   增加dispose方法，解决IE内存泄露问题
 */

(function (win) {

    /**
     * SpeechRecorder正常运行需要的Flash Player版本
     * @type {string}
     * @const
     */
    var FLASH_PLAYER_VERSION = "11.1.0";

    //------------------------------------------------  Defined  ---------------------------------------------

    /**
     * Flash播放器状态
     * @type {{Normal: number, NotInstall: number, OldVersion: number}}
     * @enum
     */
    var FlashPlayerState = {
        /** 正常 */
        Normal: 1,

        /** 未安装 */
        NotInstall: 2,

        /** 版本过低 */
        OldVersion: 3
    };

    /**
     * 麦克风状态
     * @type {{Allowed: number, Denied: number, NotFound: number, NoEnoughSize: number}}
     * @enum
     */
    var MicrophoneState = {
        /**  允许使用麦克风 */
        Allowed: 1,

        /**  拒绝使用麦克风 */
        Denied: 2,

        /**  没有发现麦克风设备 */
        NotFound: 3,

        /** flash没有足够尺寸显示安全设置面板 */
        NoEnoughSize: 4
    };


    /**
     * 评测类型
     * @type {{ReadSentence: string, ReadChapter: string, ReadChoice: string, ReadWord: string, Retelling: string, Topic: string, SimpleExpression: string, CheckChapter: string, CheckSentence: string, CheckWord: string, ReadChapterCn: string, ReadSentenceCn: string, ReadWordCn: string, ReadSyllable: string}}
     * @enum
     */
    var SeEvalType = {
        /**  句子朗读  */
        ReadSentence: "read_sentence",

        /**  篇章朗读 */
        ReadChapter: "read_chapter",

        /**  选择题 */
        ReadChoice: "read_choice",

        /**  单词朗读 */
        ReadWord: "read_word",
		
		/** 英文句子模仿朗读 */
		SentenceImitation : "sentence_imitation",

        /**  复述题转写 */
        Retelling: "retelling",

        /**  话题表述 */
        Topic: "topic",

        /**  情景反应 */
        SimpleExpression: "simple_expression",

        /**  篇章纠错 */
        CheckChapter: "check_chapter",

        /**  句子纠错 */
        CheckSentence: "check_sentence",

        /**  单词纠错 */
        CheckWord: "check_word",

        /**  中文篇章朗读  */
        ReadChapterCn: "cn_read_chapter",

        /**  中文句子朗读  */
        ReadSentenceCn: "cn_read_sentence",

        /**  中文词语朗读  */
        ReadWordCn: "cn_read_word",

        /**  中文单字朗读 */
        ReadSyllable: "read_syllable"
    };

    /**
     * 评测回调类型
     * @type {{ERROR: number, SCORE: number, ENDPOINT: number, TRACKINFO: number, EXCEPTINFO: number, RETELING: number}}
     * @enum
     */
    var EvalCallbackType = {

        /**  错误 */
        ERROR: 3,

        /**  最终结果 */
        SCORE: 4,

        /**  端点检测 */
        ENDPOINT: 6,

        /**  朗读跟踪 */
        TRACKINFO: 7,

        /**  语音异常 */
        EXCEPTINFO: 12,

        /** 背诵转写中间结果 */
        RETELING: 14
    };

    /**
     * 评测结果格式
     * @type {{PLAIN: string, COMPLETE: string}}
     * @enum
     */
    var SeResultFormat = {
	
        /** 简单结果 */
        PLAIN: "plain",

        /** 完整结果 */
        COMPLETE: "complete",

        /** 完整结果属性简写*/
        ABBR_COMPLETE: "abbrComplete"
    };

    /**
     * 录音状态
     * @type {{Begin: number, End: number}}
     * @enum
     */
    var RecordStatus = {
	
        /** 录音开始 */
        Begin: 0,

        /** 录音停止 */
        End: 1
    };

    /**
     * SpeechRecorder错误类别
     * @type {{UnknownError: number, AppError: number, MSXError: number, EngineError: number}}
     * @enum
     */
    var SpeechRecorderErrorType = {

        /** 未知错误 */
        UnknownError: -1,

        /**  应用层错误 */
        AppError: 1,

        /**  MSP/MSC 错误 */
        MSXError: 2,

        /**  引擎错误 */
        EngineError: 3
    };

    /**
     * SEE 中文错误码
     * @type {{ErrorVowel: number, ErrorConsonant: number, ErrorTone: number}}
     * @enum
     */
    var SeeCNErrorCode = {
        /**
         *  声母发音错
         */
        ErrorVowel: 1,

        /**
         *  韵母发音错
         */
        ErrorConsonant : 2,

        /**
         * 韵母声调(调型)错
         */
        ErrorTone : 4
    };

    /**
     * 动态规划信息
     * @type {{Correct: number, MissRead: number, InsertRead: number, BackRead: number, Replace: number}}
     * @enum
     */
    var DpMessage = {
        /**
         * 正确
         */
        Correct : 0,

        /**
         * 漏读
         */
        MissRead:16,

        /**
         * 增读
         */
        InsertRead: 32,

        /**
         *回读
         */
        BackRead: 64,

        /**
         *替换
         */
        Replace: 128
    };

    //------------------------------------------------  Common  ---------------------------------------------

    /**
     * 打印浏览器控制台消息（swf文件内部调用该方法讲日志打印到浏览器控制台中）
     * @param {string} level  消息级别
     * @param {string} msg 消息文本
     * @private
     */
    function SpeechRecorderConsole(level, msg) {

        if (window.console) {
            switch (level) {
                case "DEBUG":
                    window.console.log(msg);
                    break;
                case "INFO":
                    window.console.info(msg);
                    break;
                case "WARN":
                    window.console.warn(msg);
                    break;
                case "ERROR":
                case "FATAL":
                    window.console.error(msg);
                    break;
                default:
                    window.console.log(msg);
                    break;
            }
        }
    }

    /**
     *
     * @type {{addFn: Function, removeFn: Function, runArrFn: Function}}
     * @private
     */
    var AudioCommon = {
        /**
         *
         * @param {Array.<Function>} fnArr
         * @param fn
         */
        addFn: function (fnArr, fn) {
            for (var i = 0; i < fnArr.length; i++) {
                if (fnArr[i] === fn) {
                    return;
                }
            }
            fnArr.push(fn);
        },

        /**
         *
         * @param {Array.<Function>} fnArr
         * @param {...} fn
         */
        removeFn: function (fnArr, fn) {
            for (var i = 0; i < fnArr.length; i++) {
                if (fnArr[i] === fn) {
                    fnArr.splice(i, 1);
                    return;
                }
            }
        },

        /**
         *
         * @param {Array.<Function>} fnArr
         * @param {...} args
         */
        runArrFn: function (fnArr, args) {
            for (var i = 0; i < fnArr.length; i++) {
                var fn = fnArr[i];
                if (typeof fn === 'function') {
                    fn.apply(this, args);
                }
            }
        }
    };

    //------------------------------------------------  Core Logic  ---------------------------------------------

    /**
     *  SpeechRecorder缓存列表
     *  @private
     */
    var SpeechRecorderList = {};

    /**
     * 创建或查找SpeechRecorder对象
     *
     * @param {string} element 录音器id
     * @param {JSON} options 初始化参数
     * @param {boolean} reload 是否重新加载 (true: 重新加载一个对象, false: 在缓存中没有相同id对象时才创建一个对象)
     * @return {SpeechRecorderObject}  SpeechRecorder对象
     */
    var SpeechRecorder = function (element, options, reload) {

        if (reload !== true && SpeechRecorderList[element]) {
            return SpeechRecorderList[element];
        }

        var obj = new SpeechRecorderObject(element, options);
        SpeechRecorderList[element] = obj;
        return obj;
    };

    /**
     * SpeechRecorder事件定义
     * @type {{READY: string, ERROR: string, RECORD_STATE: string, EVAL_RESULT: string, RECORDING: string, MICROPHONE_STATE: string, PLAYING: string, PLAY_STATE: string, AUDIO_LOADED: string, AUDIO_CHECK_RESULT: string, PLUGIN_LOAD: string, IAT_RESULT: string, IAT_COMPLETE: string, IAT_KEY:string, SYNTH_PROGRESS: string, SYNTH_RESULT: string, DOWNLOAD_PROGRESS：string}}
     * @enum
     */
    var SpeechRecorderEvent = {
        READY: "ready",
        ERROR: "error",
        RECORD_STATE: "recordState",
        EVAL_RESULT: "evalResult",
        RECORDING: "recording",
        MICROPHONE_STATE: "microphoneState",
        PLAYING: "playing",
        PLAY_STATE: "playState",
        LOGIN_SUCCESS: "loginSuccess",
        AUDIO_LOADED: "audioLoaded",
        AUDIO_CHECK_RESULT: "audioCheckResult",
        PLUGIN_LOAD: "pluginLoad",
        IAT_RESULT: "iatResult",
        IAT_COMPLETE: "iatComplete",   
        SYNTH_PROGRESS: "synthProgress",
        SYNTH_RESULT: "synthResult",
        DOWNLOAD_PROGRESS: "downloadProgress"
    };

    /**
     * SWF与JS通信的事件中转类
     * @constructor
     * @private
     */
    function AudioEventEx() {

        var events = {};
        var audioEventEx = {__events: events};

        for (var eventName in SpeechRecorderEvent) {

            var eventType = SpeechRecorderEvent[eventName];

            // add event invoke array
            events[eventType] = [];

            // add event handler
            (function (type) {
                audioEventEx[type] = function () {
                    AudioCommon.runArrFn(events[type], arguments);
                }
            })(eventType);
        }

        return audioEventEx;
    }

    /**
     * SpeechRecorder代理类
     * @constructor
     */
    function SpeechRecorderObject() {
        var _this = this;

        function init() {
            _this.element = arguments[0];
            _this.options = arguments[1];
            _this.options.flashVars.loadType = 1;
            _this.auidoEventEx = new AudioEventEx();

            swfobject.embedSWF(
                _this.options.swf,
                _this.element,
                _this.options.width,
                _this.options.height,
                FLASH_PLAYER_VERSION,
                _this.options.expressInstall,
                _this.options.flashVars);

            _this.elemObj = function () {
                return swfobject.getObjectById(_this.element);
            };
        }

        init.apply(_this, arguments);
        return _this;
    };

    //------------------------------------------------  Method  ---------------------------------------------
    SpeechRecorderObject.prototype = {

        /**
         * 添加事件
         * @param {string} eventName
         * @param {Function} fn
         */
        addEventListener: function (eventName, fn) {
            var eventsList = this.auidoEventEx.__events[eventName];
            if (eventsList) {
                AudioCommon.addFn(eventsList, fn);
            }
        },

        /**
         * 移除事件
         * @param {string} eventName
         * @param {Function} fn
         */
        removeEventListener: function (eventName, fn) {
            var eventsList = this.auidoEventEx.__events[eventName];
            if (eventsList) {
                AudioCommon.removeFn(eventsList, fn);
            }
        },

        /**
         * 获取Flash播放器状态
         * @returns {{state: FlashPlayerState, msg: string}}
         */
        getFlashPlayerState: function () {
            if (!swfobject.hasFlashPlayerVersion('8.0.0')) {
                return { state: FlashPlayerState.NotInstall, msg: "未检测到Flash播放器" };
            } else if (!swfobject.hasFlashPlayerVersion(FLASH_PLAYER_VERSION)) {
                return { state: FlashPlayerState.OldVersion, msg: "Flash播放器版本过低，请升级至" + FLASH_PLAYER_VERSION + "或以上版本" };
            } else {
                return { state: FlashPlayerState.Normal, msg: "Flash播放器正常" };
            }
        },

        /**
         * 开始评测录音
         * @param {JSON} evalParam 评测参数
         * @see com.iflytek.model.SeEvalParam
         * @returns {boolean}  true: 调用成功 false:调用失败
         */
        beginEvaluate: function (evalParam) {
            return this.elemObj().beginEvaluate(evalParam);
        },

        /**
         * 停止评测录音
         * @param {boolean} isForce  true:强制停止评测(不会有后续事件的调用) false:正常停止录音
         * @returns {boolean} true: 调用成功 false:调用失败
         */
        endEvaluate: function (isForce) {
            return this.elemObj().endEvaluate(isForce === true);
        },

        /**
         * 开始录音试音，试音功能需要加载AudioChecker插件
         * 试音结束后会触发SpeechRecorderEvent.AUDIO_CHECK_RESULT事件
         * @param {number} audioTime 试音时长(单位s,精确到ds 1s=10ds)
         * @returns {boolean}  true:方法调用成功 false:调用失败
         */
        audioCheck: function (audioTime) {
            return this.elemObj().audioCheck(audioTime);
        },

        /**
         *  播放评测流程中最后一次录音
         */
        playRecordAudio: function () {
            this.elemObj().playRecordAudio();
        },

        /**
         *  显示安全设置面板
         */
        showSecuritySettings: function () {
            var recorderObj = this.elemObj();
            if (recorderObj.clientWidth >= 214 && recorderObj.clientHeight >= 137) {
                recorderObj.showSecuritySettings();
            }
            else {
                this.auidoEventEx.microphoneState(MicrophoneState.NoEnoughSize);
            }
        },

        /**
         * 获取麦克风状态
         * @returns {int}当前麦克风状态
         * @see com.iflytek.define.MicrophoneState
         */
        getMicrophoneState: function () {
            return this.elemObj().getMicrophoneState();
        },

        /**
         * 获取麦克风增益
         * @returns {uint} 当前麦克风增益值
         */
        getMicrophoneGain: function () {
            return this.elemObj().getMicrophoneGain();
        },

        /**
         *  设置麦克风增益
         * @param {uint} gain 增益值(0-100)
         */
        setMicrophoneGain: function (gain) {
            if (!isNaN(gain)) {
                gain = Math.round(gain);
                this.elemObj().setMicrophoneGain(gain);
            }
        },

        /**
         * 加载音频
         * @param {string} audioId  音频ID
         * @param {boolean?} autoPlay true:加载完毕后立即播放, false:只加载,不播放
         */
        loadAudio: function (audioId, autoPlay) {
            this.elemObj().loadAudio(audioId, autoPlay === true);
        },

        /**
         * 播放音频
         */
        playAudio: function () {
            this.elemObj().playAudio();
        },

        /**
         * 播放区域音频
         * @param {uint} begPos 音频开始位置,单位ms
         * @param {uint} endPos 音频结束位置,单位ms
         */
        playRange: function (begPos, endPos) {
            this.elemObj().playRange(begPos, endPos);
        },

        /**
         * 暂停音频
         */
        pauseAudio: function () {
            this.elemObj().pauseAudio();
        },

        /**
         *  停止音频
         */
        stopAudio: function () {
            this.elemObj().stopAudio();
        },

        /**
         *  获取录音器放音音量
         * @returns {number} 当前放音音量
         */
        getVolume: function () {
            return this.elemObj().getVolume();
        },

        /**
         * 设置录音器放音音量
         * @param {number} vol 放音音量(0-100)
         */
        setVolume: function (vol) {
            this.elemObj().setVolume(vol);
        },

        /**
         * 设置是否静音
         * @param {boolean} isMute  true:静音 false:非静音
         */
        setMute: function (isMute) {
            this.elemObj().setMute(isMute);
        },

        /**
         * 开启听写功能
         * @param {int} timeout   听写语音超时时间(单位: ms), 默认2000
         */
        enableIAT: function (timeout) {
            if (typeof timeout === "undefined") {
                timeout = 2000;
            }

            this.elemObj().enableIAT(timeout);
        },

        /**
         * 开始听写
         * @param {JSON} recogParam 听写参数
         * @see com.iflytek.model.RecognizeParam
         */
        beginRecognize: function (recogParam) {

            this.elemObj().beginRecognize(recogParam);
        },

        /**
         *  结束听写,等待听写结果
         */
        endRecognize: function () {
            this.elemObj().endRecognize();
        },

        /**
         *  终止听写流程
         */
        abortRecognize: function () {
            this.elemObj().abortRecognize();
        },

        /**
         * 开启合成功能
         * @param {int?} timeout  合成超时时间(单位: ms), 默认10000
         */
        enableTTS: function (timeout) {
            if (typeof timeout === "undefined") {
                timeout = 10000;
            }

            this.elemObj().enableTTS(timeout);
        },

        /**
         * 开始合成
         * @param {JSON} synthParam 合成参数
         * @see com.iflytek.model.SynthetizeParam
         */
        beginSynthesize: function (synthParam) {
            this.elemObj().beginSynthesize(synthParam);
        },

        /**
         * 终止合成
         */
        abortSynthesize: function () {
            this.elemObj().abortSynthesize();
        },

        /**
         * 设置是否显示皮肤
         * @param {boolean} isShow  true:显示 false:隐藏
         */
        showSkin: function (isShow) {
            this.elemObj().showSkin(isShow);
        },

        /**
         * 释放speechrecorder: 1.删除flash 2.从SpeechRecorderList中删除
         */
        dispose: function () {
            swfobject.removeSWF(this.element);
            delete SpeechRecorderList[this.element];
        }
    };

    win.SpeechRecorder = SpeechRecorder;
    win.SpeechRecorderEvent = SpeechRecorderEvent;

    win.FlashPlayerState = FlashPlayerState;
    win.MicrophoneState = MicrophoneState;
    win.SeEvalType = SeEvalType;
    win.SeResultFormat = SeResultFormat;
    win.EvalCallbackType = EvalCallbackType;
    win.RecordStatus = RecordStatus;
    win.SpeechRecorderErrorType = SpeechRecorderErrorType;
    win.SeeCNErrorCode = SeeCNErrorCode;
    win.DpMessage = DpMessage;

    win.SpeechRecorderConsole = SpeechRecorderConsole;
})(window);