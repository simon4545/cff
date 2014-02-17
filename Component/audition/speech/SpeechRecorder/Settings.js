/*
* 文件名: Settings.js
* 描述: SpeechRecorder 初始化配置文件
*/

SpeechRecorderSettings = {
    // 是否是调试状态
    IsDebug: false,
    
    // SpeechRecorder根目录
    Root: "js/SpeechRecorder/",          
    
    // 是否启用WebConsole日志
    EnableWebLog: false,
    
    // 云服务地址
    MspServer: "220.178.7.101:80", //60.166.12.151:6503   /*听写电信入口*/,
											   // eduevaluate.voicecloud.cn:80 /*评测合肥电信域名*/ | 192.168.73.35:1012 /*内部调试地址*/

    // 应用日志等级
    LogLvl: 0,
    
    // msc日志等级
    MscLogLvl:15,
    
    // 试音阀值
    AudioCheckThreshold:"15,35",

    // 插件列表,插件间用;分割，插件名和插件url用|分隔，形式为:( 插件名|插件url;插件名|插件名url )
    Plugins: "AudioChecker|js/SpeechRecorder/Plugins/AudioChecker.swf"
}