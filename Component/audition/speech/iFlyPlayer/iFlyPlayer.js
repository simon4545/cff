/**
 * 文件名: iFlyPlayer.js
 * 描述: Web播放器封装类
 *
 * 版本: 1.0.2.1
 * 作者: yuwang@iflytek.com
 * 日期：2012/2/25
 *
 * 变更记录：
 * 1.0.0.0   2013/03/27     增加jwPlyaer封装类在音频播放开始时返回音频持续时间属性
 * 1.0.1.1   2013/04/18     修复区域播放停止回调中标志位设置有误的Bug
 * 1.0.1.2   2013/05/09     JWPlayer参数playerId改成id, 与录音器中统一
 * 1.0.1.3   2013/05/24     修复加载大音频后立即playRange末尾音频不能正常播放的bug
 * 1.0.1.4   2013/06/03     增加音频缓冲控制，等到音频缓冲完毕之后才进行播放
 * 1.0.2.0   2013/09/17     增加音频加载时needSeek参数
 * 1.0.2.1   2013/12/04     增加dispose方法
 */

/**
* 播放器基类
*
* @class iFlyPlayer
* @constructor
*/
function iFlyPlayer() {
    // Public Method
	
    /**
	* 加载音频
	*
	* @method loadAudio
	* @param {String} url 音频url地址
	*/
    this.loadAudio = function (url) {
        this.__proxy__.loadAudio.apply(this, arguments);
    };

	/**
	* 播放音频，需先调用loadAudio加载音频
	*
	* @method play
	*/
    this.play = function () {
        this.__proxy__.play.apply(this, arguments);
    };

	/**
	* 播放区域音频
	*
	* @method playRange
	* @param {Number} beginPos 音频开始位置(单位:ms)
	* @param {Number} endPos   音频结束位置(单位:ms)
	*/
    this.playRange = function (beginPos, endPos) {
        this.__proxy__.playRange.apply(this, arguments);
    };
    
	/**
	* 暂停音频
	*
	* @method pause
	*/
    this.pause = function () {
         this.__proxy__.pause.apply(this, arguments);
    };
    
	/**
	* 停止音频
	*
	* @method stop
	*/
    this.stop = function () {
        this.__proxy__.stop.apply(this, arguments);
    };

	/**
	* 获取音量
	*
	* @method getVolume
	* @return {Number} 当前播放器音量 (0-100)
	*/
    this.getVolume = function () {
        return this.__proxy__.apply(this, arguments);
    };

	/**
	* 设置音量
	*
	* @method setVolume
	* @param {Number} volume (0-100)
	*/
    this.setVolume = function (volume) {
        this.__proxy__.setVolume.apply(this, arguments);
    };

    /**
    * 设置静音
    *
    * @method setMute
    * @param {Boolean} isMute
    */
    this.setMute = function (isMute) {
        // this.__proxy__.setMute(setMute);
    };

    /**
    * 释放swf
    *
    * @method dispose
    */
    this.dispose = function () {
        this.__proxy__.dispose();
    };

    // Callback
    this.onReady = function () { this.__proxy__.addEventListener("onReady", arguments[0]); };
    this.onError = function () { this.__proxy__.addEventListener("onError", arguments[0]); };
    this.onPlayBegin = function () { this.__proxy__.addEventListener("onPlayBegin", arguments[0]); };
    this.onPlaying = function () { this.__proxy__.addEventListener("onPlaying", arguments[0]); };
    this.onBuffering = function () { this.__proxy__.addEventListener("onBuffering", arguments[0]); };
    this.onPause = function () { this.__proxy__.addEventListener("onPause", arguments[0]); }; ;
    this.onStop = function () { this.__proxy__.addEventListener("onStop", arguments[0]); }; ;
}

(function(win) {
	
	// 播放器设置
    if (!win.JWPlayerSettings) {
        win.JWPlayerSettings = {
            PlayerSWF: "js/iFlyPlayer/jwplayer/player.swf"
        };
    }
    
	/**
	* JWPlayer封装类
	*
	* @class JWPlayer
	* @extends iFlyPlayer
	* @constructor
	*/
    function JWPlayer(option) {

        option = option || {};
        option.events = option.events || {};

        this.__proxy__ = {};
        var _this = this;
        var _events;
        var _isPlayRange;
        var _rangeET;
        var _state = "IDLE";
        var _audioLoading;					// 音频是否正在加载
        var _bufferPercent;
        var _pendingPlayRnage = [];
        var _pendingPlay;
        var _audioUrl;

        if (option.events) {
            _events = option.events;    // 事件由适配器触发，不由jwplayer内部代码直接触发
            delete option.events;
        }

        option.width = option.width || 1;
        option.height = option.height || 1;
        option.players = [{ type: "flash", src: JWPlayerSettings.PlayerSWF}];
        option.id = option.id || "jwplayer-" + new Date().getTime();

        // 页面上如果不存在对应播放器id的dom元素，则创建一个
        if (document.getElementById(option.id) === null) {
            var playerPanel = document.createElement("div");
            playerPanel.id = option.id;
            document.body.appendChild(playerPanel);
        }

        var _jw = jwplayer(option.id).setup(option);

        //------------------------------------------ callback -----------------------------------------

        this.__proxy__.addEventListener = function(fnName, handler) {
              // TODO: 处理非参数传递方式的事件注册  
        };
    
        _jw.onReady(function (e) {
            _jw.setVolume(100);
            var callback = _events.onReady;
            if (callback) {
                callback.call(_this, e);
            }
        });

        _jw.onError(function (e) {
            _audioLoading = false;
            var callback = _events.onError;
            if (callback) {
                callback.call(_this, e);
            }
        });

        _jw.onTime(function (e) {
            
            debug("onTime, _audioLoading:" + _audioLoading + ", _state:" +_state + ", _bufferPercent:" + _bufferPercent);
            if(_audioLoading && _bufferPercent === 100) {
                      
                _jw.stop();
				_jw.setMute(false);
               
                setTimeout(function() {
                    _audioLoading = false;
                    
                    if(_pendingPlay) {
                         debug("onTime, pending play trigger" );
                        _jw.play(true);
                        _pendingPlay = false;
                    }
                
                    while(_pendingPlayRnage.length > 0) {
                        var rangeInfo = _pendingPlayRnage.shift();
                         debug("onTime, pending _pendingPlayRnage trigger:" +  rangeInfo.begPos + "," + rangeInfo.endPos);
                        _this.__proxy__.playRange(rangeInfo.begPos, rangeInfo.endPos);
                    }
                }, 0);
            }
            
            // 处理区域播放停止
            if (!_audioLoading && _isPlayRange && e.position >= _rangeET) {
                _isPlayRange = false;
                _rangeET = undefined;
                _jw.stop();
            }
            
            // 播放回调
            if (!_audioLoading && (_state === "BUFFERING" || _state === "PLAYING")) {
                var callback = _events.onPlaying;
                if (callback) {
                    callback.call(_this, e);
                }
            }
        });

		_jw.onBufferChange(function(e){
		    _bufferPercent = e.bufferPercent;
		});
		
        _jw.onBeforePlay(function (e) {

        });

        // e.oldstate (String): the state the player moved from. Can be BUFFERING or PAUSED.
        _jw.onPlay(function (e) {
            _state = e.newstate;
           // LogUtil.debug("onPlay :: Player state changed from " + e.oldstate + " to " + e.newstate);
         
            var callback = _events.onPlayBegin;
            if (!_audioLoading && callback) {
                e.duration = _jw.getDuration();
                callback.call(_this, e);
            }
        });

        // e.oldstate (String): the state the player moved from. Can be BUFFERING or PLAYING.
        _jw.onPause(function (e) {
            _state = e.newstate;
           // LogUtil.debug("onPause :: Player state changed from " + e.oldstate + " to " + e.newstate);

            var callback = _events.onPause;
            if (!_audioLoading && callback) {
                callback.call(_this, e);
            }
        });

        // e.oldstate (String): the state the player moved from. Can be IDLE, PLAYING or PAUSED.
        _jw.onBuffer(function (e) {
            _state = e.newstate;
           // LogUtil.debug("onBuffer :: Player state changed from " + e.oldstate + " to " + e.newstate);

            var callback = _events.onBuffering;
            if (!_audioLoading && callback) {
                callback.call(_this, e);
            }
        });

        //e.oldstate (String): the state the player moved from. Can be BUFFERING, PLAYING or PAUSED.
        _jw.onIdle(function (e) {
            _state = e.newstate;
           // LogUtil.debug("onIdle :: Player state changed from " + e.oldstate + " to " + e.newstate);

            if (_isPlayRange) {
                _isPlayRange = false;
                _rangeET = undefined;
            }

            var callback = _events.onStop;
            if (!_audioLoading && callback) {
				// 使用setTimeout来确保jwplayer内部状态恢复正常
				setTimeout(function(){
					callback.call(_this, e);
				},0);                
            }
        });
        
        //------------------------------------------ public method ---------------------------------------

        /**
         *
         * @param url
         * @param {boolean} needSeek 音频加载后是否需要seek，在音频较大且不需要立即调用playRange方法时该参数可设为false
         */
        this.__proxy__.loadAudio = function (url, needSeek) {
            if(_audioUrl === url) {
                return;
            }

            _audioUrl = url;

            if(needSeek !== false) {
            
                _state = "IDLE";
                _audioLoading = true;
                _jw.setMute(true);
                _jw.load(url);
                _jw.play(true); // 让音频加载之后立即播放一次，解决大文件加载后不能立即seek播放的问题
            }  else {
                _jw.load(url);
            }
        };

        this.__proxy__.play = function () {
			if(_audioLoading) {
                 debug("_pendingPlay:");
                _pendingPlay = true;
            } else {
                debug("play:");
                _jw.play(true);    
            }  
        };

        this.__proxy__.playRange = function (begPos, endPos) {
            
            if(_audioLoading) {
                debug("_pendingPlayRnage push:" + begPos + "," + endPos);
                _pendingPlayRnage.push({ begPos: begPos, endPos: endPos });
            }
            else {
                debug("playRange:" + begPos + "," + endPos);
                _isPlayRange = true;
                _rangeET = endPos / 1000;
                _jw.seek(begPos / 1000);
                _jw.play(true);
            }
        };

        this.__proxy__.pause = function () {
            _jw.pause(true);
        };

        this.__proxy__.stop = function () {
			_pendingPlay = false;
			while(_pendingPlayRnage.length > 0) {
				_pendingPlayRnage.pop();
			}
            _jw.stop();
        };

        this.__proxy__.getVolume = function () {
            return _jw.getVolume();
        };

        this.__proxy__.setVolume = function (volume) {
            if (!isNaN(volume)) {
                if (volume < 0) {
                    volume = 0;
                } else if (volume > 100) {
                    volume = 100;
                }

                _jw.setVolume(volume);
            }
        };

        this.getDuration = function() {
            return _jw.getDuration();
        };
        
         this.__proxy__.dispose = function() {
            jwplayer(option.id).remove();
        };
        
    };
    JWPlayer.prototype = new iFlyPlayer();
    JWPlayer.prototype.constructor = JWPlayer;

    function debug(msg) {
        //console.info(msg);
    };
    
    win.JWPlayer = JWPlayer;
    
})(window);