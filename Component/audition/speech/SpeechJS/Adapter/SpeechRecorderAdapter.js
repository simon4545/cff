/// <reference path="../SpeechJS.js" />
/// <reference path="../../SpeechRecorder/SpeechRecorder.js" />
/// <reference path="../../SpeechRecorder/Settings.js" />

/**
 * 文件名: SpeechRecorderAdapter.js
 * 描述: SpeechRecorder SpeechJS适配器
 *
 * 功能说明：
 * 对SpeechRecorder 进行封装，方便SpeechJS中使用
 *
 * 版本: 1.0.4.0
 * 作者: yuwang@iflytek.com
 * 日期：2012/1/23
 *
 * 变更记录：
 * 		  2013/01/28     增加播放用户原声相关方法及回调
 * 		  2013/02/02     增加录音回放状态回调
 * 		  2013/03/06     增加试音方法
 * 		  2013/03/27     增加Debug模式判断，及播放录音方法
 * 		  2013/04/23     修改SpeechRecorder对象事件注册代码、去除听写相关接口
 * 1.0.3.2 2013/05/07    增加缓存
 * 1.0.3.3 2013/05/07    暴露获取flash状态的方法
 * 1.0.3.4 2013/05/22    去除onDownloadState回调, 去除SpeechRecorder初始化时audioCheckThreshold参数
 * 1.0.3.7 2013/07/14    代码微调
 * 1.0.4.0 2013/12/04    增加dispose方法
 */

/**
 * SpeechRecorderAdapter
 */
(function (win) {

    var _recorders = [];

    function SpeechRecorderAdapter(option) {

        var _this = this;

        var _id = option.id || "speech-recorder-adapter-" + new Date().getTime();

        // 查看缓存中是否已经有相同id的播放器
        for (var i = 0; i < _recorders.length; i++) {
            if (_id === _recorders[i].id) {
                return _recorders[i];
            }
        }

        _this.id = _id;
        _recorders.push(_this);
        var _events = option.events || {};
        var _proxy;
        _this.__proxy__ = _proxy = {};

        // 页面上如果不存在对应录音器id的dom元素，则创建一个
        if (document.getElementById(_this.id) === null) {
            var playerPanel = document.createElement("div");
            playerPanel.id = _this.id;
            document.body.appendChild(playerPanel);
        }

        if (!win.SpeechRecorderSettings) {
            LogUtil.error("SpeechRecorderAdapter::Cannot find SpeechRecorder Settings...");
            return null;
        }

        var swfUrl = option.speechRecorderUrl ? option.speechRecorderUrl : SpeechRecorderSettings.Root + "SpeechRecorder.swf";

        if (SpeechRecorderSettings.IsDebug === true) {
            swfUrl += "?r=" + Math.random();
        }
        var recordOptios = {
            swf: swfUrl,
            width: option.width || "100%",
            height: option.height || "100%",
            expressInstall: SpeechRecorderSettings.Root + "expressInstall.swf",
            flashVars: {
                skin: SpeechRecorderSettings.Root + "Skins/sound.swf",
                recorderId: _this.id,
                enableWebLog: SpeechRecorderSettings.EnableWebLog,
                mspServer: SpeechRecorderSettings.MspServer,
                logLvl: SpeechRecorderSettings.LogLvl,
                mscLogLvl: SpeechRecorderSettings.MscLogLvl,
                plugins: SpeechRecorderSettings.Plugins
            }
        };

        var _recorder = new SpeechRecorder(_this.id, recordOptios);

        // 注册录音器回调事件
        _recorder.addEventListener(SpeechRecorderEvent.READY, onReady);
        _recorder.addEventListener(SpeechRecorderEvent.ERROR, onError);
        _recorder.addEventListener(SpeechRecorderEvent.RECORD_STATE, onRecordState);
        _recorder.addEventListener(SpeechRecorderEvent.EVAL_RESULT, onEvalResult);
        _recorder.addEventListener(SpeechRecorderEvent.RECORDING, onRecording);
        _recorder.addEventListener(SpeechRecorderEvent.MICROPHONE_STATE, onMicrophoneState);
        _recorder.addEventListener(SpeechRecorderEvent.PLAYING, onPlaying);
        _recorder.addEventListener(SpeechRecorderEvent.PLAY_STATE, onPlayState);
        _recorder.addEventListener(SpeechRecorderEvent.AUDIO_LOADED, onAudioLoaded);
        _recorder.addEventListener(SpeechRecorderEvent.AUDIO_CHECK_RESULT, onAudioCheckResult);
        _recorder.addEventListener(SpeechRecorderEvent.PLUGIN_LOAD, onPluginLoad);
        _recorder.addEventListener(SpeechRecorderEvent.IAT_RESULT, onIATResult);
        _recorder.addEventListener(SpeechRecorderEvent.IAT_COMPLETE, onIATComplete);

        function onPlayState(e) {
            LogUtil.debug("SpeechRecorderAdapter::onPlayState, oldstate:" + e.oldstate + ", newstate:" + e.newstate);
            if (e.newstate === "PLAYING" && e.oldstate !== "PLAYING") {
                _events.onPlayBegin && _events.onPlayBegin.call(_this, e);
            } else if (e.newstate === "PAUSE" && e.oldstate === "PLAYING") {
                _events.onPlayPause && _events.onPlayPause.call(_this, e);
            } else if (e.newstate === "IDLE" && e.oldstate !== "IDLE") {
                _events.onPlayStop && _events.onPlayStop.call(_this, e);
            }
        }

        function onReady() {
            _events.onReady && _events.onReady.call(_this);
        }

        function onError(e) {

            LogUtil.error("SpeechRecorderAdapter::onError - { ErrorType:" + e.errorType + ", Msg:" + e.msg + ", errorCode:" + e.errorCode + "}");

            _recorder.endEvaluate(true);

            var callback = _events.onError || _this.__events__.onError;
            if (callback) {
                callback.call(_this, e);
            }
        };

        function onRecording(e) {
            var callback = _events.onRecording || _this.__events__.onRecording;
            if (callback) {
                callback.call(_this, e);
            }
        };

        function onRecordState(e) {
            var callback;
            // 录音开始
            if (e === RecordStatus.Begin) {
                callback = _events.onRecordBegin || _this.__events__.onRecordBegin;
                callback.call(_this);
            }
            // 录音结束
            else if (e === RecordStatus.End) {
                callback = _events.onRecordEnd || _this.__events__.onRecordEnd;
                callback.call(_this);
            }
        }

        function onMicrophoneState(status) {
            _events.onMicrophoneState && _events.onMicrophoneState.call(_this, status);
        }

        function onAudioLoaded(e) {
            _events.onAudioLoaded && _events.onAudioLoaded.call(_this, e);
        }

        function onAudioCheckResult(e) {
            _events.onAudioCheckResult && _events.onAudioCheckResult.call(_this, e);
        }

        function onIATResult(e) {
            _events.onIATResult && _events.onIATResult.call(_this, e);
        }

        function onIATComplete(e) {
            _events.onIATComplete && _events.onIATComplete.call(_this, e);
        }

        function onPlaying(e) {
            _events.onPlaying && _events.onPlaying.call(_this, e);
        }

        function onEvalResult(e) {

            switch (e.resultType) {
                case EvalCallbackType.TRACKINFO:
                    var callback = _events.onTrackInfo || _this.__events__.onTrackInfo;
                    callback.call(_this, e.result);
                    break;
                case EvalCallbackType.SCORE:
                default:
                    callback = _events.onEvalResult || _this.__events__.onEvalResult;
                    callback.call(_this, e);
                    break;
            }
        }

        function onPluginLoad(e) {
            _events.onPluginLoad && _events.onPluginLoad.call(_this, e);
        }

        _proxy.record = function (recordOption) {

            var callback = _events.onBeforeRecord || _this.__events__.onBeforeRecord;
            if (callback.call(_this, recordOption) !== false) {
                return _recorder.beginEvaluate(recordOption);
            }

            return false;
        };

        _proxy.stop = function (isForce) {
            return _recorder.endEvaluate(isForce);
        };

        this.playRecordAudio = function () {
            _recorder.playRecordAudio();
        };

        this.showSecuritySettings = function () {
            _recorder.showSecuritySettings();
        };

        this.getMicrophoneState = function () {
            return _recorder.getMicrophoneState();
        };

        this.getMicrophoneGain = function () {
            return _recorder.getMicrophoneGain();
        };

        this.setMicrophoneGain = function (gain) {
            _recorder.setMicrophoneGain(gain);
        };

        this.getFlashPlayerState = function () {
            return _recorder.getFlashPlayerState();
        };

        this.loadAudio = function (audioId, autoPlay) {
            _recorder.loadAudio(audioId, autoPlay !== false);
        };

        this.play = function () {
            _recorder.playAudio();
        };

        this.playRange = function (begPos, endPos) {
            _recorder.playRange(begPos, endPos);
        };

        this.pause = function () {
            _recorder.pauseAudio();
        };

        this.stopPlay = function () {
            _recorder.stopAudio();
        };

        this.getVolume = function () {
            return _recorder.getVolume();
        };

        this.setVolume = function (vol) {
            _recorder.setVolume(vol);
        };

        this.setMute = function (isMute) {
            _recorder.setMute(isMute);
        };

        this.showSkin = function (isShow) {
            _recorder.showSkin(isShow);
        };

        this.audioCheck = function (audioTime) {
            return _recorder.audioCheck(audioTime);
        };

        this.dispose = function () {
            for (var k = 0; k < _recorders.length; k++) {
                if (_this.id === _recorders[i].id) {
                    break;
                }
            }

            if (i < _recorders.length) {
                _recorders.splice(i, 1);
                _recorder.dispose();
            }
        };

        this.__class__.check.call(this);
    };

    SpeechRecorderAdapter.prototype = new SpeechJS.RecorderAdapterBase();
    SpeechRecorderAdapter.prototype.constructor = SpeechRecorderAdapter;

    win.SpeechRecorderAdapter = SpeechRecorderAdapter;

})(window);