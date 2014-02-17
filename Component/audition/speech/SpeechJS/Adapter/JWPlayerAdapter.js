/// <reference path="../SpeechJS.js" />
/// <reference path="../../iFlyPlayer/iFlyPlayer.js" />

/*
* 文件名: JWPlayerAdapter.js
* 描述: JWPlayer SpeechJS适配器
*
* 功能说明：
* 封装JWPlayer播放器功能，提供给SpeechJS使用
*
* 版本: 1.0.1.0
* 作者: yuwang@iflytek.com
* 日期：2012/1/14
*
* 变更记录：
* 2013/01/29    增加对播放器id指定无效情况的判断
* 2013/05/07    增加缓存
* 2013/05/09    JWPlayer参数playerId改成id, 与录音器中统一
* 2013/12/04    增加dispose方法 
*/

(function (win) {

    var _players = [];

    function JWPlayerAdapter(option) {

        var _this = this;
        option = option || {};
        option.events = option.events || {};

        var _id = option.id || "speech-jwplayer-adapter-" + new Date().getTime();

        for (var i = 0; i < _players.length; i++) {
            if (_id === _players[i].id) {
                return _players[i];
            }
        };

        _this.id = option.id = _id;
        _players.push(_this);
        var _jw = new JWPlayer(option);

        //------------------------------------------ public method ---------------------------------------
        this.__proxy__.loadAudio = function (url) {
            _jw.loadAudio.apply(_jw, arguments);
        };

        this.__proxy__.play = function () {
            _jw.play();
        };

        this.__proxy__.playRange = function (beginPos, endPos) {
            _jw.playRange(beginPos, endPos);
        };

        this.__proxy__.pause = function () {
            _jw.pause();
        };

        this.__proxy__.stop = function () {
            _jw.stop();
        };

        this.__proxy__.getVolume = function () {
            return _jw.getVolume();
        };

        this.__proxy__.setVolume = function (volume) {
            _jw.setVolume(volume);
        };

        this.__proxy__.setMute = function (isMute) {
            _jw.setMute(isMute);
        };

        this.dispose = function () {
            for (var k = 0; k < _players.length; k++) {
                if (_this.id === _players[i].id) {
                    break;
                }
            }

            if (i < _players.length) {
                _players.splice(i, 1);
                _jw.dispose();
            }
        };

        this.__class__.check.call(this);
    };

    JWPlayerAdapter.prototype = new SpeechJS.PlayerAdapterBase();
    JWPlayerAdapter.prototype.constructor = JWPlayerAdapter;

    win.JWPlayerAdapter = JWPlayerAdapter;
})(window);