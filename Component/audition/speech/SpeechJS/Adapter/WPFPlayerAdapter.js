/// <reference path="../SpeechJS.js" />

/*
* WPF 播放器适配器
*/

var WPFPlayerAdapters = [];

function WPFPlayerAdapter(option) {
    
    function play(url) {
        try {
            window.external.Play(url);
        } catch (error) {
            LogUtil.error("WPFPlayerAdapter::play, error:" + error);
        }
    }
    
    function stop() {
        
    }

    // callback
    function onPlayBegin(e) {
        option.onPlayBegin(e);
    }
    
    function onPlaying(e) {
        option.onPlaying(eval("(" +  e + ")"));
    }
    
    var adapter = {
        play: play,
        onPlayBegin: onPlayBegin,
        onPlaying: onPlaying
    };
    WPFPlayerAdapters.push(adapter);


    this.__proxy__.check.call(this);
    
    return adapter;
}

WPFPlayerAdapter.prototype = new PlayerAdapterBase();
WPFPlayerAdapter.prototype.constructor = WPFPlayerAdapter;

function wpfPlayerAdapterCall(method) {

    var args = [];

    for (var index = 1; index < arguments.length; index++) {
        args.push(arguments[index]);
    }

    for (index = 0; index < WPFPlayerAdapters.length; index++) {
        WPFPlayerAdapters[index][method].apply(WPFPlayerAdapters[index], args);
    }
}