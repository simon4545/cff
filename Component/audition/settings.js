/**
 * 文件名: Settings.js 描述: SpeechRecorder 初始化配置文件
 * 
 * 功能说明：
 * 
 * 版本: 1.0.0.0 作者: zzwang@iflytek.com 日期：2013/1/25
 * 
 * 变更记录：
 */
SpeechRecorderSettings = {

	// SpeechRecorder根目录
	Root : "./speech/SpeechRecorder/",

	// 是否启用WebConsole日志
	EnableWebLog : false,

	// 云服务地址
	MspServer : "eduevaluate.voicecloud.cn:80", // 60.166.12.151:6503,
	// 192.168.73.35:1012
	// eduevaluate.voicecloud.cn:80
	// gz.voicecloud.cn:80
	// | 192.168.73.35:1012

	// 引擎类型
	EngineCategory : "ets",// lab

	// 应用日志等级
	LogLvl : 0,

	// msc日志等级
	MscLogLvl : 15,

	// 试音阀值
	AudioCheckThreshold : "5,35",

	// 插件列表,插件间用;分割，插件名和插件url用|分隔，形式为:( 插件名|插件url;插件名|插件名url )
	Plugins : "AudioChecker|./speech/SpeechRecorder/Plugins/AudioChecker.swf"
}

JWPlayerSettings = {
	PlayerSWF : "./speech/iFlyPlayer/jwplayer/player.swf"
}