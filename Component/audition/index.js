/**
 * Created with JetBrains WebStorm.
 * User: hlwang
 * Date: 13-12-27
 * Time: 下午1:13
 * To change this template use File | Settings | File Templates.
 */

/**
 * 录音失败信息
 * @type {{errCode: Array, errInfo: Array, errMsg: Array}}
 * @private
 */
var _error = {
    errCode : [ 0x7001, 0x7002, 0x7007, 0x7008, 0x7011, 0x7012, 0x7014,
        0x7022 ],
    errInfo : [ "无语音,或音量太小（语音部分平均幅度<100）", "语音长度过短（数据长度<2秒）",
        "严重信噪比低（信噪比<0）", "信噪比(0<信噪比<1)", "没有输入，请检测录音设备是否连接正常（纯零语音）",
        "截幅(5%<截幅比例<30%)", "有效语音过短（语音部分比例<10%）", "严重截幅（截幅比例>30%）" ],
    errMsg : [ "您的音量过低，请调高系统音量或以较大声音进行再次录音。", "录音时间过短，请重新录音并读满录音时间。",
        "您的录音中有过多噪音，无法正常进行评测，建议您更换录音设备后重新试音。",
        "您的录音中有过多噪音，无法正常进行评测，建议您更换录音设备后重新试音。",
        "录音设备有异常，请确保您的录音设备正常后重新录音。", "您的音量过高，请调低系统音量或以较低的声音再次进行录音。",
        "录音时间过短，请重新录音并读满录音时间。", "您的音量过高，请调低系统音量或以较低的声音再次进行录音。" ]
};

/**
 * 回调函数
 *
 */
var $ = jQuery;
var _CallBack = __attr__["Component_audition"]["callback"];
var imagePath = __attr__["Component_audition"]["imagePath"];
/*if( __attr__["Component_audition"]["actionType"]=='seajs' ){
    seajs.use('topicmodules/auditionnew/js/audition', function(load) {
        _CallBack = load;
    });
}*/

/**
 *
 * 试音整体流程 Model
 *
 */
var StepModel = (function () {

    /**
     * 初始化
     * @constructor
     */
    function StepModel() {
        this.id = "";          //每一步对应的Id
        this.nextEvent = null; //下一步 Function
        this.prevEvent = null; //上一步 Function
        this.havSkip = false;  //是否含有跳过试音按钮
    }

    /**
     * 初始化试音每一步的界面 （调用template.js模版引擎）
     */

    StepModel.prototype.show = function () {

        var step = "__step" + this.id.toString() + "__";
        var htmlResult = window[step]( {imagePath:imagePath} );
        $("#audition_show").html(htmlResult);

    };

    /**
     *初始化事件绑定
     */

    StepModel.prototype.bindEvent = function () {

        var _this = this;
        $("#step" + _this.id + "_next").on("click", function () {
            if( $(this).hasClass('btn_sblue_dis') ){
                return;
            }
            if (typeof _this.nextEvent == "function") {
                _this.nextEvent();
            }
        });

        $("#step" + _this.id + "_pre").on("click", function () {
            if( $(this).hasClass('btn_sblue_dis') ){
                return;
            }
            if (typeof _this.prevEvent == "function") {
                _this.prevEvent();
            }
        });

        if ( _this.havSkip ) {
            $(document).off('click',"a[name=btnSkip]");
            $("a[name=btnSkip]").on("click", function () {
                if( $("div[name='divSkip']").hasClass('btn_sgray_dis') ){
                    return;
                }
                $("#audition_close").trigger("click");
            });
        }

    };

    return StepModel;
})();

/**
 * 试音流程控制
 */

var AuditionStepCtrl = (function () {

    /**
     * 初始化
     * @constructor
     */
    function AuditionStepCtrl() {

        this.isShowSecSettings = false;  //是否显示安全设置面板
        this.speecher = "";              //加载SpeechJs及相关流程控制对象
        this.speech = null;              //load的SpeechJs对象
        this.options = {};               //加载引擎的相关参数
        this.secSetIsLoad = false;

    }

    /**
     * 界面展示及事件绑定
     */

    AuditionStepCtrl.prototype.show = function (model) {
        model.show();
        model.bindEvent();
    };

    /**
     * 加载引擎
     *
     * @param step 第几步
     */

    AuditionStepCtrl.prototype.initSpeechJs = function ( step ) {
        var _this = this;
        _this.speech = new Speecher();
        _this.speech.init( _this.options , function (speecher) {
            _this.speecher = speecher;
            if ( _this.isShowSecSettings ) {
                _this.showSecuritySettings();
            }

            //_this.setBtnCss( step );
            setTimeout(function() {
                _this.setBtnCss( step );
            }, 1000);
        });
        /*if ( _this.isShowSecSettings ) {
         setTimeout(function() {
         _this.showSecuritySettings();
         }, 1000);
         }
         setTimeout(function() {
         _this.setBtnCss( step );
         }, 1000);*/
    };

    /**
     * 释放清空引擎
     */

    AuditionStepCtrl.prototype.resetSpeechJs = function () {
        var _this = this;
        try {
            if( _this.speecher ){
                _this.speecher.Player.stop();// 停止原声
                _this.speecher.Recorder.stop(true);// 停止录音
                _this.speecher.Recorder.stopPlay();// 停止用户音
                //_this.speecher.dispose(  _this.speecher.id );
                SpeechJS.dispose(_this.speecher.id);
            }
        } catch (e) {

        }
    };

    /**
     * 显示Flash设置
     */

    AuditionStepCtrl.prototype.showSecuritySettings = function () {
        var _this = this;
        _this.speech.showSecuritySettings();
    };

    /**
     * 隐藏Flash设置
     */
    AuditionStepCtrl.prototype.recorderPanelHide = function () {
        var _this = this;
        _this.speech.recorderPanelHide();
    };

    /**
     * 设置按钮样式
     */
    AuditionStepCtrl.prototype.setBtnCss = function ( step ) {
        var _this = this;
        $("a[name = 'btnSkip']").parent().attr( "class" , "btn_small btn_sgray_nor" ).hover(function(){
            this.className='btn_small btn_sgray_hov';
        },function(){
            this.className='btn_small btn_sgray_nor';
        });

        if ( step != "3" ){
            $("#step" + step + "_next").attr( "class" , "btn_small btn_sblue_nor" ).hover(function(){
                this.className='btn_small btn_sblue_hov';
            },function(){
                this.className='btn_small btn_sblue_nor';
            });
        }
        if ( step == "3" ){
            $("#start_recorder").attr( "class" , "btn_audsytle2 btn_sgre_nor" ).hover(function(){
                this.className='btn_audsytle2 btn_sgre_hov';
            },function(){
                this.className='btn_audsytle2 btn_sgre_nor';
            });
        }

        $("#step" + step + "_pre").attr( "class" , "btn_small btn_sblue_nor" ).hover(function(){
            this.className='btn_small btn_sblue_hov';
        },function(){
            this.className='btn_small btn_sblue_nor';
        });

        _this.secSetIsLoad = true;

    };

    /**
     * 第0步
     *
     *      加载试音主体窗口
     */

    AuditionStepCtrl.prototype.init = function () {
        var _this = this;
        var htmlResult = __audwindow__({});
        $("#audition").html(htmlResult);
        $("#audition_close").on("click",function (){
            //_this.resetSpeechJs();
            var tag = $("input[type=checkbox][name=skipChk]").prop("checked");
            if ( _CallBack ) {
                window[_CallBack]();
            }
        });
    };

    /**
     * 第一步
     *
     *      使用推荐类型的麦克风
     */

    AuditionStepCtrl.prototype.initStepFir = function () {
        var _this = this;
        var stepModel = new StepModel();
        stepModel.id = 0;
        stepModel.havSkip = true;
        stepModel.nextEvent = function () {
            _this.initStepSec();
        };
        _this.show(stepModel);
    };

    /**
     * 第二步
     *
     *      正确佩戴麦克风
     */

    AuditionStepCtrl.prototype.initStepSec = function () {
        var _this = this;
        if ( _this.speecher ) {
            _this.resetSpeechJs();
        }
        var stepModel = new StepModel();
        stepModel.id = 1;
        stepModel.havSkip = true;
        stepModel.nextEvent = function () {
            _this.initStepThi();
        };
        stepModel.prevEvent = function () {
            _this.initStepFir();
        };
        _this.show(stepModel);
    };

    /**
     * 第三步
     *
     *      flash安全设定
     */

    AuditionStepCtrl.prototype.initStepThi = function () {
        var _this = this;
        var isFirstLoad = true;
        _this.secSetIsLoad = false;
        if ( _this.speecher ) {
            _this.resetSpeechJs();
        }
        if(SpeechJS){
            SpeechJS.dispose("speechjs");
        }
        var stepModel = new StepModel();
        stepModel.id = 2;
        stepModel.havSkip = true;
        stepModel.nextEvent = function () {
            if(  _this.secSetIsLoad ){
                var status = _this.speecher.Recorder.getMicrophoneState();
                if ( status === MicrophoneState.Denied ) {
                    _this.initStepFif();
                }

                if ( status === MicrophoneState.Allowed ) {
                    _this.initStepFou();
                }
            }
        };
        stepModel.prevEvent = function () {
            if(  _this.secSetIsLoad ){
                _this.initStepSec();
            }
        };
        _this.show(stepModel);
        _this.isShowSecSettings = true;
        _this.options = {
            volumeDiv: "recorder",
            settingDiv: "recorder-panel-outter",
            palyerDiv: "player",
            width: "1px",
            height: "1px",
            onMicrophoneState : function( status ) {
                if (status === MicrophoneState.NotFound) {
                    _this.initStepEig();
                    return;
                }
                //_this.recorderPanelHide();
                if ( !isFirstLoad ) {
                    if ( status === MicrophoneState.Denied ) {
                        // _this.initStepFif();
                        _this.speech.showSecuritySettings();
                    }

                    if ( status === MicrophoneState.Allowed ) {
                        _this.initStepFou();
                    }
                }
                isFirstLoad = false;
            }
        };
        _this.initSpeechJs( 2 );
    };

    /**
     * 第四步
     *
     *       开始试音
     */

    AuditionStepCtrl.prototype.initStepFou = function () {
        var _this = this;
        if ( _this.speecher ) {
            _this.resetSpeechJs();
        }
        var stepModel = new StepModel();
        stepModel.id = 3;
        stepModel.havSkip = true;
        stepModel.nextEvent = function () {
            _this.initStepFif();
        };
        stepModel.prevEvent = function () {
            _this.initStepThi();
        };
        _this.show(stepModel);
        _this.isShowSecSettings = false;
        _this.options = {
            volumeDiv: "recorder",
            settingDiv: "recorder-panel-outter",
            palyerDiv: "player",
            width: "1px",
            height: "1px",
            onMicrophoneState : function ( status ) {
                if (status === MicrophoneState.NotFound) {
                    _this.initStepEig();
                    return;
                }
                if ( status === MicrophoneState.Denied ) {
                    _this.initStepFif();
                }
            },
            stopPlay : function() {
                $("#start_recorder").hide();
                $("#recorder_count_down").show();
                $("#countDown").html("10秒");
                var count = 9;
                var countdown = setInterval(countDown, 1000);
                function countDown() {
                    $("#countDown").html(count + "秒");
                    if (count == 0) {
                        $("#countDown").html("0秒");
                        clearInterval(countdown);
                    }
                    count--;
                }
                _this.speecher.Recorder.audioCheck(11);
            },
            stopRecord : function(errCode) {

                if (errCode === 0) {
                    _this.initStepSev();
                }else{
                    var error = _error.errMsg[$.inArray( errCode, _error.errCode )];
                    _this.initStepSix( error );
                }
            },
            setRecBarVol : function(vol) {
                // / <summaruy>设置音量条进度</summaruy>
                if (vol) {
                    $("#recBarVol").width(parseInt(Math.sqrt(vol) * 7) + 30);
                } else {
                    $("#recBarVol").width(0);
                }
            }
        };
        _this.initSpeechJs( 3 );
        setTimeout(function() {
            _this.initStepFouBindEvent();
        }, 1000);
    };

    /**
     * 第四步录音事件绑定
     */

    AuditionStepCtrl.prototype.initStepFouBindEvent = function () {
        var _this = this;
        $("#btn_audStart").on("click", function () {
            if( $("#start_recorder").hasClass('btn_sgre_dis') ){
                return;
            }
            $(this).html("放音中...").css("cursor", "default")
                .parent().removeAttr("onmouseover")
                .removeAttr("onmouseout");
            _this.recorderStart();
        });
    };

    /**
     * 开始放音
     */

    AuditionStepCtrl.prototype.recorderStart = function () {
        var _this = this;
        _this.speecher.Player.loadAudio("./resource/audiocheck.mp3");
        _this.speecher.Player.play();
    };

    /**
     * 第五步
     *
     *       Reset安全设置
     */

    AuditionStepCtrl.prototype.initStepFif = function () {
        var _this = this;
        if ( _this.speecher ) {
            _this.resetSpeechJs();
        }
        var stepModel = new StepModel();
        stepModel.id = 4;
        stepModel.havSkip = true;
        stepModel.prevEvent = function () {
            _this.initStepThi();
        };
        _this.show(stepModel);
    };

    /**
     * 第六步
     *
     *       试音失败
     */

    AuditionStepCtrl.prototype.initStepSix = function ( error ) {
        var _this = this;
        if ( _this.speecher ) {
            _this.resetSpeechJs();
        }
        var stepModel = new StepModel();
        stepModel.id = 5;
        stepModel.havSkip = true;
        stepModel.prevEvent = function () {
            _this.initStepFou();
        };
        _this.show(stepModel);
        //$("#errorMsg").html( error );
    };

    /**
     * 第七步
     *
     *      试音成功
     */

    AuditionStepCtrl.prototype.initStepSev = function () {
        var _this = this;
        var stepModel = new StepModel();
        stepModel.id = 6;
        _this.show(stepModel);
        $("#end_aud_suc").on("click", function () {
            window[_CallBack]();
        });
    };

    /**
     * 第八步
     *
     *      没有检查到麦克风
     */

    AuditionStepCtrl.prototype.initStepEig = function () {
        var _this = this;
        if ( _this.speecher ) {
            _this.resetSpeechJs();
        }
        var stepModel = new StepModel();
        stepModel.id = 7;
        stepModel.havSkip = true;
        stepModel.prevEvent = function () {
            _this.initStepThi();
        };
        _this.show(stepModel);
    };

    return  AuditionStepCtrl;
})();


/**
 * 加载SpeechJs及相关流程控制对象
 */

var Speecher = (function () {

    /**
     * 初始化引擎控制对象
     * @constructor
     */

    function Speecher() {
        this.speecher = null;  //load的SpeechJs对象
        this.options = {};     //加载引擎对象
        this.recorderReady = false;
        this.playerReady = false;
        this.callBack = null;
    }

    /**
     * 初始化Init(供外部调用)
     * @param options
     * @param callback
     */

    Speecher.prototype.init = function ( options , callback ) {
        var _this = this;
        _this.options = options;
        _this.initSpeech(this.options);
        _this.callBack = callback;
    };

    /**
     * 初始化完成事件
     */

    Speecher.prototype.onReady = function () {
        var _this = this;
        if ( _this.recorderReady && _this.playerReady && typeof _this.callBack == "function") {
            _this.callBack( this.speecher );
        }
    };

    /**
     * load   SpeechJs
     * @param options
     */

    Speecher.prototype.initSpeech = function (options) {
        var _this = this;

        _this.speecher = SpeechJS.load({
            id: "speechjs",
            recorderOption: {
                adapter: SpeechJS.Adapters.SpeechRecorder,// 录音器适配器
                id: options.volumeDiv,// 录音器DIV的ID
                events: {
                    onRecordBegin: function () {
                        LogUtil.info("recorder onRecordBegin");
                    },
                    onEvalResult: function (e) {
                    },
                    onReady: function () {
                        LogUtil.info("Recorder is ready...");// 录音器初始化完成事件
                        _this.recorderReady = true;
                        _this.onReady();
                    },
                    onError: function (e) {
                        LogUtil.info("recorder player Error:"
                            + $.toJSON(e));
                    },
                    onPlaying: function (e) {
                    },
                    onAudioLoaded: function (e) {
                    },
                    onPlayStop: function (e) {

                    },
                    onRecording: function (e) {
                        if (e) {
                            options.setRecBarVol(e.energy);// 设置音量条进度
                        }
                    },
                    onMicrophoneState: function (status) {
                        options.onMicrophoneState( status );
                    },
                    onAudioCheckResult : function(e) {
                        options.stopRecord(e.ErrorCode);
                    }
                }
            },
            playerOption: {
                adapter: SpeechJS.Adapters.JWPlayer,// 播放器适配器
                id: options.palyerDiv,// 播放器DIV的ID
                width: "1px",// 播放器宽度
                height: "1px",// 播放器高度
                events: {
                    onReady: function () {
                        LogUtil.info("Player is ready...");
                        _this.playerReady = true;
                        _this.onReady();
                    },
                    onPlaying: function (e) {
                    },
                    onStop: function (e) {
                        options.stopPlay();
                    }
                }
            }
        });
    };
    Speecher.prototype.showSecuritySettings = function () {
        var _this = this;
        var div = $("#" + _this.options.settingDiv);
        div.css({
            width: "215px",
            height: "138px",
            //width: "300px",
            //height: "250px",
            left: "25%",
            top: "20%",
            _position: "absolute",
            _left: "expression(eval(documentElement.scrollLeft+documentElement.clientWidth / 2))",
            _top: "expression(eval(documentElement.scrollTop+documentElement.clientHeight / 2))",
            _margin: " -69px 0px 0px -107px"
        });
        _this.speecher.Recorder.showSecuritySettings();
    };

    /**
     * 隐藏录音控件
     */
    Speecher.prototype.recorderPanelHide = function () {
        $("#" + this.options.settingDiv).css({
            width: "1px",
            height: "1px",
            top: "3px",
            left: "2px",
            margin: " 0px 0px 0px 0px",
            _position: "absolute",
            _top: "3px",
            _left: "2px",
            _margin: " 0px 0px 0px 0px"
        });
        this.speecher.Recorder.showSkin(true);
    };


    return Speecher;
})();

var stepCtrl = new AuditionStepCtrl();
stepCtrl.init();
stepCtrl.initStepFir();

