/// <reference path="../SpeechJS.js" />

/*
 * 文件名: AndroidPlayerAdapter.js
 * 描述: AndroidPlayer SpeechJS适配器
 *
 * 功能说明：
 * 和Android中的播放器进行交互，让JS可以调用Android来进行放音功能， Android回调JS通知放音进度、音量等
 *
 * 版本: 1.0.0.0
 * 作者: qingwu@iflytek.com
 * 日期：2013/8/5
 *
 * 变更记录：
 *
 */

(function (win) {

    function AndroidPlayerAdapter(option) {
        var _this = this;
        _this.id = "android_player";
        var _player = new AndroidPlayer(_this.id, option);
        var _audioUrl;


        /**
         * 加载音频
         * @param {String} url 音频url地址
         */
        this.__proxy__.loadAudio = function (url) {
            /// <summary>加载音频</summary>
            _audioUrl = url;
            commAdapter.player.loadAudio(_audioUrl);
        };

        /**
         * 播放音频，需先调用loadAudio加载音频
         */
        this.__proxy__.play = function () {
            commAdapter.player.playFromUri(_audioUrl);
        };

        /**
         * 播放区域音频
         * @param {Number} beginPos 音频开始位置(单位:ms)
         * @param {Number} endPos   音频结束位置(单位:ms)
         */
        this.__proxy__.playRange = function (beginPos, endPos) {
            commAdapter.player.loadAudio(_audioUrl);
            commAdapter.player.playRange(beginPos, endPos);
        };

        this.__proxy__.pause = function () {
            /// <summary>暂停音频</summary>
        };
        /**
         * 停止播放
         */
        this.__proxy__.stop = function () {
            commAdapter.callAndroid.stopPlayAudio();
        };

        this.__proxy__.getVolume = function () {
            /// <summary>获取音量</summary>
        };

        this.__proxy__.setVolume = function (volume) {
            /// <summary>设置音量</summary>
            /// <param name="volume" value="Number">音量值 between 0 and 100</param>
        };

        this.__class__.check.call(this);

        // 模拟播放器准备完成事件
        setTimeout(function () {
            option.events.onReady && option.events.onReady.call(_this);
        }, 0);
    }

    var players = [];

    /**
     * 获取播放器回调接口
     * @param id
     * @param option
     * @returns {*}
     * @constructor
     */
    function AndroidPlayer(id, option) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id === id) {
                return players[i];
            }
        }

        if(!option){
            return null;
        }

        var player = new PlayInterface(option);
        player.id = id;
        players.push(player);
        console.log("AndroidPlayer create a new player, players length:" + players.length);
        return player;
    }

    function PlayInterface(option) {
        var _this = this;
        _this.events = option.events;
        // java call js
        _this.jsInterface = {
            onReady: function (e) {
                /// <summary>播放器加载完毕</summary>
                var callback = _this.events.onReady;
                if (callback) {
                    callback(e);
                }
            },
            onPlayBegin: function (e) {
                /// <summary>开始放音</summary>
                var callback = _this.events.onPlayBegin;
                if (callback) {
                    callback(e);
                }
            },
            onPlaying: function (e) {
                console.log("++++++++++++++++++++++++:onPlaying::" + JSON.stringify(e));
                /// <summary>放音中</summary>
                var callback = _this.events.onPlaying;
                if (callback) {
                    callback(e);
                }
            },
            onStop: function () {
                /// <summary>放音停止</summary>
                var callback = _this.events.onStop;
                if (callback) {
                    callback();
                }
            },
            onCompletion: function (e) {
                /// <summary>放音完成</summary>
                var callback = _this.events.onCompletion;
                if (callback) {
                    callback(e);
                }
            },
            onRangePlayEnd: function (e) {
                var callback = _this.events.onRangePlayEnd;
                if (callback) {
                    callback(e);
                }
            },
            onPause: function () {
                var callback = _this.events.onPause;
                if (callback) {
                    callback();
                }
            }
        };
    }

    AndroidPlayerAdapter.prototype = new SpeechJS.PlayerAdapterBase();
    AndroidPlayerAdapter.prototype.constructor = AndroidPlayerAdapter;
    win.AndroidPlayerAdapter = AndroidPlayerAdapter;
    win.AndroidPlayer = AndroidPlayer;
})(window);