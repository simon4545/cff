/// <reference path="../SpeechJS.js" />

/*
 * 文件名: AndroidRecorderAdapter.js
 * 描述: AndroidRecorder SpeechJS适配器
 *
 * 功能说明：
 * 和Android中的录音器及引擎进行交互，让JS可以调用Android来进行录音、评测等功能， Android回调JS通知评测结果
 *
 * 版本: 1.0.0.0
 * 作者: qingwu@iflytek.com
 * 日期：2013/8/6
 *
 * 变更记录：
 *
 */

(function (win) {

    function AndroidRecorderAdapter(option) {
        var _this = this;
        _this.id = "android_recorder";
        var _recorder = new AndroidRecorderObj(option);
        var _recorderInterface = new AndroidRecorder(_this.id, option);

        /**
         * 开始录音
         * @param {JSON} recordOprion 评测参数
         * @returns {*}
         */
        this.__proxy__.record = function (recordOprion) {
            return _recorder.record(recordOprion);
        };

        /**
         * 停止评测录音
         * @param {boolean} isForce  true:强制停止评测(不会有后续事件的调用) false:正常停止录音
         * @returns {boolean} true: 调用成功 false:调用失败
         */
        this.__proxy__.stop = function (isForce) {
            return _recorder.stop(isForce);
        };

        this.loadAudio = function (audioId, autoPlay) {
            _recorder.loadAudio(audioId, autoPlay);
        };

        this.play = function () {
            _recorder.play();
        };

        this.playRange = function (begPos, endPos) {
            _recorder.playRange(begPos, endPos);
        };

        this.pause = function () {
            _recorder.pause();
        };

        this.stopPlay = function () {
            _recorder.stopPlay();
        };

        this.getFlashPlayerState = function () {
            return _recorder.getFlashPlayerState();
        };

        this.__class__.check.call(this);

        // 模拟录音器准备完成事件
        setTimeout(function () {
            _recorderInterface.jsInterface.onReady();
        }, 0);
    }

    var recorders = [];

    /**
     * 获取录音器回调接口
     * @param id
     * @param option
     * @returns {*}
     * @constructor
     */
    function AndroidRecorder(id, option) {
        for (var i = 0; i < recorders.length; i++) {
            if (recorders[i].id === id) {
                return recorders[i];
            }
        }

        if (!option) {
            return null;
        }

        var recorder = new RecorderInterface(option);
        recorder.id = id;
        recorders.push(recorder);
        console.log("AndroidRecorder create a new recorder, recorders length:" + recorders.length);
        return recorder;
    }

    function RecorderInterface(option) {
        var _this = this;
        _this.events = option.events || {};
        _this.jsInterface = {
            onReady: function () {
                var callback = _this.events.onReady;
                if (callback) {
                    callback();
                }
            },
            /**
             * 录音开始
             * @param e 暂无参数
             */
            onRecordBegin: function (e) {
                var callback = _this.events.onRecordBegin;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 录音结束
             * @param e 暂无参数
             */
            onRecordEnd: function (e) {
                var callback = _this.events.onRecordEnd;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 录音中
             * @param {JSON} e { time:Number, energy:Number } energy: 音量 time:录音时长
             */
            onRecording: function (e) {
                var callback = _this.events.onRecording;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 朗读跟踪
             * @param e
             */
            onTrackInfo: function (e) {
                var callback = _this.events.onTrackInfo;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 评测结果
             * @param {JSON} e { resultType:int, result:Object }
             */
            onEvalResult: function (e) {
                var callback = _this.events.onEvalResult;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 错误
             * @param {JSON} e { errorType: int, errorCode: int,  msg: String }
             */
            onError: function (e) {
                var callback = _this.events.onError;
                if (callback) {
                    callback(e);
                }
            },
            //--------------------------以下为播放器回调事件----------------------------
            /**
             * 音频加载完成
             * @param e { audioLength: Number }  audioLength: 音频总长度，ms
             */
            onAudioLoaded: function (e) {
                var callback = _this.events.onAudioLoaded;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 播放用户录音开始
             * @param {JSON} e {oldstate:String, newstate:String }  状态值：IDLE PLAYING PAUSE
             */
            onPlayBegin: function (e) {
                var callback = _this.events.onPlayBegin;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 播放结束
             * @param {JSON} e {oldstate:String, newstate:String }  状态值：IDLE PLAYING PAUSE
             */
            onPlayStop: function (e) {
                var callback = _this.events.onPlayStop;
                if (callback) {
                    callback(e);
                }
            },
            /**
             * 音频播放中
             * @param {JSON} e { energy:Number, position:Number } energy: 音频能量值， position: 当前播放位置,单位ms
             *
             */
            onPlaying: function (e) {
                var callback = _this.events.onPlaying;
                if (callback) {
                    callback(e);
                }
            }
        };
    }

    function AndroidRecorderObj() {

    }

    AndroidRecorderObj.prototype = {
        /**
         * 录音
         * @param {JSON} recordOption {evalType: "read_word", evalText: "[word]?sheep?horse?hen?cow?goat?lamb", evalParams: "vadEnable=true, vadSpeechTail=2500", sndId: "word-card-1375859197931"}
         */
        record: function (recordOption) {
            if (typeof recordOption === 'object') {
                params = JSON.stringify(recordOption);
            }
            var state = commAdapter.recorder.record(params);
            return Boolean(state);
        },
        /**
         * 停止评测录音
         * @param {boolean} isForce  true:强制停止评测(不会有后续事件的调用) false:正常停止录音
         */
        stop: function (isForce) {
            commAdapter.recorder.stop(isForce);
        },
        /**
         * 播放用户录音
         * @param audioId
         * @param {boolean} autoPlay true 自动播放 false 只加载不播放
         */
        loadAudio: function (audioId, autoPlay) {
            commAdapter.recorder.loadAudio(audioId, autoPlay !== false);
        },
        play: function () {
            commAdapter.recorder.play();
        },
        /**
         * 播放区域音频
         * @param begPos 开始位置
         * @param endPos 结束位置j
         */
        playRange: function (begPos, endPos) {
            commAdapter.recorder.playRange(begPos, endPos);
        },
        /**
         * 暂不实现
         */
        pause: function () {

        },
        /**
         * 停止播放用户录音
         */
        stopPlay: function () {
            commAdapter.recorder.stopPlay();
        }
    };

    AndroidRecorderAdapter.prototype = new SpeechJS.RecorderAdapterBase();
    AndroidRecorderAdapter.prototype.constructor = AndroidRecorderAdapter;
    win.AndroidRecorderAdapter = AndroidRecorderAdapter;
    win.AndroidRecorder = AndroidRecorder;
})(window);
