/**
 * Created with JetBrains WebStorm.
 * User: qingwu
 * Date: 13-7-20
 * Time: 下午6:41
 * To change this template use File | Settings | File Templates.
 */


//处理android发送的消息
function dispatchClientMsg(msg) {
    console.log("dispatchClientMsg::" + JSON.stringify(msg));
    if (!msg) return;
    var origin = msg.origin;
    if (origin === 'AndroidPlayerAdapter' && AndroidPlayer('android_player')) {
        var playerEventType = msg.evt;
        switch (playerEventType) {
            case 'play_start':
                AndroidPlayer('android_player').jsInterface.onPlayBegin(msg.data);
                break;
            case 'play_resume':
                AndroidPlayer('android_player').jsInterface.onPlayBegin(msg.data);
                break;
            case 'play_pause':
                AndroidPlayer('android_player').jsInterface.onPause();
                break;
            case 'play_end':
                AndroidPlayer('android_player').jsInterface.onStop();
                break;
            case 'playing':
                var playingParam = {
                    position: parseFloat(msg.data.duration / 1000),
                    energy: parseInt(0)
                };
                AndroidPlayer('android_player').jsInterface.onPlaying(playingParam);
                break;
        }
    }
    else if (origin === 'AndroidRecorderAdapter' && AndroidRecorder('android_recorder')) {
        var recorderEventType = msg.evt;
        switch (recorderEventType) {
            case 'onReady':
                AndroidRecorder('android_recorder').jsInterface.onReady();
                break;
            case 'onError':
                AndroidRecorder('android_recorder').jsInterface.onError(msg.data);
                break;
            case 'onEvalResult':
                AndroidRecorder('android_recorder').jsInterface.onEvalResult(msg.data);
                break;
            case 'onTrackInfo':
                AndroidRecorder('android_recorder').jsInterface.onTrackInfo(msg.data);
                break;
            case 'onRecordBegin':
                AndroidRecorder('android_recorder').jsInterface.onRecordBegin();
                break;
            case 'onRecordEnd':
                AndroidRecorder('android_recorder').jsInterface.onRecordEnd();
                break;
            case 'onRecording':
                AndroidRecorder('android_recorder').jsInterface.onRecording(msg.data);
                break;
            //---------------------以下为播放器回调事件--------------------
            case 'onAudioLoaded':
                AndroidRecorder('android_recorder').jsInterface.onAudioLoaded(msg.data);
                break;
            case 'onPlayBegin':
                AndroidRecorder('android_recorder').jsInterface.onPlayBegin(msg.data);
                break;
            case 'onPlayStop':
                AndroidRecorder('android_recorder').jsInterface.onPlayStop(msg.data);
                break;
            case 'onPlaying':
                AndroidRecorder('android_recorder').jsInterface.onPlaying(msg.data);
                break;
        }
    }
}

var commAdapter = commAdapter || {};

/**
 * 接收java端发送的消息
 * @param msg
 */
commAdapter.dispatchClientMsg = function (msg) {
    if (!msg) return;
    dispatchClientMsg(msg);
}

/**
 * js调Android方法集合
 */
commAdapter.callAndroid = {
    /**
     * Android接口
     */
    commInterface: window.commInterface,
    /**
     * 停止正在播放的音频
     */
    stopPlayAudio: function () {
        this.commInterface.stopPlayAudio();
    },
    /**
     * 调用拍照
     * @param evtName 回调函数名
     * @param callback 回调函数
     * @returns {*}
     */
    playCamera: function (evtName, callback) {
        if (typeof callback === 'function' && eventDispatcher) {
            eventDispatcher.addEventListener(evtName, callback);
        }
        this.commInterface.playCamera(evtName);
    }
}

/**
 * 卡片播放器对象
 * @type {{play: Function, playStop: Function}}
 */
commAdapter.player = {
    playerInterface: window.playerInterface,

    /**
     * 音频预加载
     * @param packagePath
     * @param filePath
     */
    loadAudio: function (filePath) {
        this.playerInterface.loadAudio(filePath);
    },

    /**
     * 播放音频
     * @param packagePath 资源包id
     * @param filePath 本地文件路径
     */
    play: function (packagePath, filePath) {
        this.playerInterface.play(packagePath, filePath);
    },

    /**
     * 播放音频
     * @param filePath 本地文件路径
     */
    playFromUri: function (filePath) {
        this.playerInterface.playFromUri(filePath);
    },

    /**
     *  播放音频
     * @param beginPos
     * @param endPos
     */
    playRange: function (beginPos, endPos) {
        this.playerInterface.playRange(beginPos, endPos);
    },

    /**
     * 停止播放
     */
    playStop: function () {
        this.playerInterface.playStop();
    }
}

/**
 * 卡片录音器对象
 * @type {{recorderInterface: *, record: Function, stop: Function, loadAudio: Function, play: Function, playRange: Function, pause: Function, stopPlay: Function}}
 */
commAdapter.recorder = {
    recorderInterface: window.recorderInterface,

    /**
     * 录音
     * @param {JSON} recordOption {evalType: "read_word", evalText: "[word]?sheep?horse?hen?cow?goat?lamb", evalParams: "vadEnable=true, vadSpeechTail=2500", sndId: "word-card-1375859197931"}
     */
    record: function (recordOption) {
        return this.recorderInterface.record(recordOption);
    },

    /**
     * 停止评测录音
     * @param {boolean} isForce  true:强制停止评测(不会有后续事件的调用) false:正常停止录音
     */
    stop: function (isForce) {
        this.recorderInterface.stop(isForce);
    },
    /**
     * 播放用户录音
     * @param audioId
     * @param {boolean} autoPlay true 自动播放 false 只加载不播放
     */
    loadAudio: function (audioId, autoPlay) {
        this.recorderInterface.loadAudio(audioId, autoPlay);
    },

    /**
     * 播放用户录音，该方法调用前应先调用 loadAudio
     */
    play: function () {
        this.recorderInterface.play();
    },

    /**
     * 播放区域音频
     * @param begPos 开始位置
     * @param endPos 结束位置j
     */
    playRange: function (begPos, endPos) {
        this.recorderInterface.playRange(begPos, endPos);
    },

    /**
     * 暂不实现
     */
    pause: function () {
        this.recorderInterface.pause();
    },

    /**
     * 停止播放用户录音
     */
    stopPlay: function () {
        this.recorderInterface.stopPlay();
    }

    /**
     * 下载
     * adxing
     */

}

