
/*
* WPF 录音适配器
*/
var WPFRecorderAdapters = [];

function WPFRecorderAdapter(option) {

    function echo() {
        try {
            LogUtil.info(window.external.Echo("WPFAdapter"));
        } catch (error) {
            LogUtil.error(error);
        }
    };

    function beginRecord(recordInfo) {
        try {
            window.external.BeginRecord(recordInfo);
        } catch (error) {
            LogUtil.error(error);
        }
    };

    function stop() {
        try {
            window.external.Stop();
        } catch (error) {
            LogUtil.error(error);
        }
    };
    
    // callback
    function onSoundEnergy(e) {
        option.onSoundEnergy(eval("(" + e + ")"));
    };

    function onRecordBegin(e) {
        option.onRecordBegin(eval("(" + e + ")"));
    }

    function onTrackInfo(e) {
        option.onTrackInfo(eval("(" + e + ")"));
    }
    
    var adapter = {
        echo: echo,
        beginRecord: beginRecord,
        stop: stop,
        onSoundEnergy: onSoundEnergy,
        onRecordBegin: onRecordBegin,
        onTrackInfo: onTrackInfo
    };
    WPFRecorderAdapters.push(adapter);
    
    return adapter;
};


function wpfRecorderAdapterCall(method) {
    
    var args = [];

    for (var index = 1; index < arguments.length; index++) {
        args.push(arguments[index]);
    }

    for (index = 0; index < WPFRecorderAdapters.length; index++) {
        WPFRecorderAdapters[index][method].apply(WPFRecorderAdapters[index], args);
    }
}

