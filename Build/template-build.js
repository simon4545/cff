! function(factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var target = module['exports'] || exports;
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        //define(['exports'],function(exports){
        //    exports.abc = function(){}
        //});
        define(['exports'], factory);
    } else {
        factory(window['NC'] = {});
    }
}(function(exports) {
    function reMarker(templ, data, type) {
        var _type = type || 'JavaScript';
        if (arguments.length === 1 ||(!data && type)) {
            var _templ = reMarker[_type].parse(templ);
            return _templ;
/*            return function(data) {
                return reMarker[_type].proc(_templ, data);
            }*/
        }
        data = data || {};
        return reMarker[_type].proc(reMarker[_type].parse(templ), data);
    }
    /**
     * 工具方法
     * @type {Object}
     */
    var _utils = {
        trim: function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        lTrim: function(str) {
            return str.replace(/(^\s*)/g, "");
        },
        rTrim: function(str) {
            return str.replace(/(\s*$)/g, "");
        },
        removeEmpty: function(arr) {
            var splitStr = _separator(arr);
            var REMOVE_REGEX = new RegExp(splitStr + splitStr);
            var REMOVE_HEAD_REGEX = new RegExp('^' + splitStr);
            return arr.join(splitStr).replace(REMOVE_REGEX, splitStr).replace(REMOVE_HEAD_REGEX, '').split(splitStr);
        },
        filter: function(str) {
            return str.replace('&lt;', '<').replace('&gt;', '>');
        }
    };
    /**
     * 设定分隔符
     * @param  {String} str 字符串源
     * @return {String}     分隔符
     */
    function _separator(str) {
        var separator = '';
        do {
            separator = String.fromCharCode(Math.random(0, 1) * 100 + 255);
        }
        while (str.indexOf(separator) >= 0);
        return separator;
    };
    /**
     * 移除不安全代码
     * @param html
     * @returns {*|void}
     */
    function removeUnsafe(html) {
        var _templ = html.replace(/[\r|\n|\t]/ig, '').replace(/\s{2,}/ig, ' ').replace(/\'/ig, "\\\'");
        return _templ;
    }
    /**
     * 找出匹配的键值对
     * @param {Array} value 数组
     * @returns {Array}
     */
    function findPairs(value) {
        var cache = [];
        if (Object.prototype.toString.call(value) === '[object Array]') {
            var KEY_REGEX = /\b(\w+)\s*?=/g;
            var commandStr = value.join(' ');
            var _sp = _separator(commandStr);
            commandStr = commandStr.replace(KEY_REGEX, _sp + "$1" + _sp);
            value = _utils.removeEmpty(commandStr.split(_sp));
            if (value.length % 2 == 0) {
                for (var i = 0; i < value.length; i = i + 2) {
                    var _pair = [value[i], value[i + 1]];
                    cache = cache.concat(_pair);
                }
            }
        }
        return cache;
    }
    var VAR_REGEX=/^[a-zA-Z_][a-zA-Z0-9_]*$/im;

    function _setVarToken(arr){
        return arr.map(function(value){
            if(VAR_REGEX.test(value)===true){
                value='$'+value;
            }
            return value;
        });
    }
    reMarker.PHP = (function() {
        var Ruler = {
            guid: 0
        };
        /**
         * 匹配语法规则处理
         * @type {{ruler: Function, rulerAssign: Function, rulerEndSwitch: Function, rulerCase: Function, rulerDefault: Function, rulerSwitch: Function, rulerElseIf: Function, rulerBreak: Function, rulerElse: Function, rulerEndIf: Function, rulerIf: Function, rulerEndList: Function, rulerList: Function}}
         */
        Ruler.regRuler = {
            ruler: function(str) {
                var listArr = Ruler.util.removeEmpty(str.split(' '));
                //import,include
                var ruler = {
                    "list": this.rulerList,
                    "if": this.rulerIf,
                    "break": this.rulerBreak,
                    '/#list': this.rulerEndList,
                    'else': this.rulerElse,
                    "/#if": this.rulerEndIf,
                    'elseif': this.rulerElseIf,
                    'switch': this.rulerSwitch,
                    'case': this.rulerCase,
                    'default': this.rulerDefault,
                    '/#switch': this.rulerEndSwitch,
                    'assign': this.rulerAssign,
                    'return': this.rulerReturn
                };
                return (ruler[listArr[0]]).call(this, listArr);

            },
            rulerReturn: function() {
                return 'return;';
            },
            /**
             * 定义变量
             * @param arr
             * @returns {string}
             */
            rulerAssign: function(arr) {
                var result = [],
                    count;
                var rt = findPairs(arr.slice(1));
                count = rt.length;
                for (j = 0; j < count; j += 2) {
                    var name = rt[j];
                    result.push('$' + name + '=' + rt[j + 1] + ';');
                }
                return result.join('');
            },
            rulerEndSwitch: function(arr) {
                return '}';
            },
            rulerCase: function(arr) {
                return ('case ' + arr[1] + ':');
            },
            rulerDefault: function() {
                return 'default:';
            },
            rulerSwitch: function(arr) {
               arr= _setVarToken(arr);

                return 'switch(' + arr.join('').replace('switch', '') + '){';
            },
            rulerElseIf: function(arr) {
                if (arr.length < 2) {
                    return false;
                }
                arr=_setVarToken(arr.slice(1));
                return '}else if(' + Ruler.util.filter(arr.join('')) + '){';
            },
            rulerBreak: function() {
                return 'break;';
            },
            rulerElse: function(arr) {
                return '}else{';
            },
            rulerEndIf: function(arr) {
                return '}';
            },
            rulerIf: function(arr) {
                if (arr.length < 2) {
                    return false;
                }
                arr=_setVarToken(arr.slice(1));

                return 'if(' + Ruler.util.filter(arr.join('')) + '){';
            },
            rulerEndList: function(arr) {
                return '}';
            },
            /**
             * 循环列表方法
             * @param arr
             * @returns {string}
             */
            rulerList: function(arr) {
                var listName, loopName, loopIndexName, loopHasNextName, result = [];
                if (arr.length != 4) {
                    return;
                }
                var _guid = Ruler.guid++;
                loopName = arr[3];
                listName = arr[1];
                loopIndexName = loopName + '_index';
                loopHasNextName = loopName + '_has_next';
                //如果变量名不是传统的字母或数字
                if (!/^\w+$/.test(listName)) {
                    if (listName.indexOf('$') !== 0) {
                        listName = '$' + listName;
                    }
                    var _listName = '$_list' + _guid;
                    result.push(_listName + '=' + listName + ';');
                    listName = _listName;
                } else {
                    listName = '$' + listName;
                }
                loopName = '$' + loopName;
                loopIndexName = '$' + loopIndexName;
                loopHasNextName = '$' + loopHasNextName;
                result.push([
                    '$_i{guid}=0',
                    '$count{guid}=count(' + listName + ')',
                    loopName,
                    loopIndexName,
                    loopHasNextName + ';'
                ].join(';'));

                result.push('for(;$_i{guid}<$count{guid};$_i{guid}++){');
                result.push(loopName + '=' + listName + '[$_i{guid}];');
                result.push(loopIndexName + '=$_i{guid};');
                result.push(loopHasNextName + '=$_i{guid}!==$count{guid}-1;');
                return result.join('').replace(/\{guid\}/ig, _guid);
            }
        };
        /**
         * 内嵌函数，待扩展
         * @type {{trim: Function, lTrim: Function, rTrim: Function, removeEmpty: Function, filter: Function}}
         */
        Ruler.util = {
            trim: function(str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            lTrim: function(str) {
                return str.replace(/(^\s*)/g, "");
            },
            rTrim: function(str) {
                return str.replace(/(\s*$)/g, "");
            },
            removeEmpty: function(arr) {
                var splitStr = _separator(arr);
                var REMOVE_REGEX = new RegExp(splitStr + splitStr);
                var REMOVE_HEAD_REGEX = new RegExp('^' + splitStr);
                return arr.join(splitStr).replace(REMOVE_REGEX, splitStr).replace(REMOVE_HEAD_REGEX, '').split(splitStr);
            },
            filter: function(str) {
                return str.replace('&lt;', '<').replace('&gt;', '>');
            }
        };
        /**
         * 将模板语法解释为JS语法
         * @param _templ 模板字符串
         * @returns {String} 语法解析后的
         * @private
         */
        function _parse(_templ) {
            var chunks = [],
                replaced = [],
                compiled;
            var printPrefix = "$__buf__.=";
            var lastIndex = 0;
            var ss = /<#.+?>|\${.+?}|<\/#.+?>|<@.+?>/ig;
            /**
             * 将模块中的匹配替换为相应语言的语法
             * @param  {String} str  输入
             * @param  {Number} type 0普通字符 1变量 2表达式
             * @return {Null}
             */
            function _pushStr(str, type) {
                if (str !== '') {
                    if (type == 2) {
                        replaced.push(str)
                    } else {

                        if (type == 1) {
                            replaced.push(printPrefix + str + ';')
                        } else {
                            str = str.replace(/"/ig, "\\\"");
                            replaced.push(printPrefix + '"' + str + '";')
                        }
                    }
                }
            }

            //移除不安全代码
            _templ = removeUnsafe(_templ);
            _templ.replace(ss, function repalceHandler(match, index) {
                if (lastIndex != index) {
                    var _temp_ = _templ.substring(lastIndex, index);
                    if (Ruler.util.trim(_temp_) != '')
                        _pushStr(_templ.substring(lastIndex, index));
                    chunks.push(_temp_);
                }
                if (match[0] == '$') {
                    _pushStr('$' + match.substring(2, match.length - 1), 1);
                } else {
                    //是注释，暂时不处理
                    if (match[0] == '<' && match[1] == '#' && match[2] == '-') {

                    } else {
                        if (match[0] == '<' && match[1] == '#') {
                            _pushStr(Ruler.regRuler.ruler(match.substring(2, match.length - 1)), 2);
                        } else if (match[1] == '/' && match[2] == '#') {
                            _pushStr(Ruler.regRuler.ruler(match.substring(1, match.length - 1)), 2);
                        }
                        chunks.push(match);
                    }
                }
                //set the last match index as current match index plus matched value length
                lastIndex = index + match.length;
            });
            //add the end string for replaced string
            if (lastIndex < _templ.length) {
                _pushStr(_templ.substring(lastIndex));
            }
            //if no matched replace
            if (!replaced.length) {
                _pushStr(_templ);
            }


            replaced = ["$__buf__='';", replaced.join(''), ";echo($__buf__);"].join('');
            return replaced;
        }

        function _proc(html, data) {
            return html;
        }



        return {
            parse: _parse,
            proc: _proc
        }
    })();
    reMarker.JavaScript = (function() {
        var Ruler = {};
        /**
         * 匹配语法规则处理
         * @type {{ruler: Function, rulerAssign: Function, rulerEndSwitch: Function, rulerCase: Function, rulerDefault: Function, rulerSwitch: Function, rulerElseIf: Function, rulerBreak: Function, rulerElse: Function, rulerEndIf: Function, rulerIf: Function, rulerEndList: Function, rulerList: Function}}
         */
        Ruler.regRuler = {
            ruler: function(str) {
                var listArr = Ruler.util.removeEmpty(str.split(' '));
                //import,include
                var ruler = {
                    "list": this.rulerList,
                    "if": this.rulerIf,
                    "break": this.rulerBreak,
                    '/#list': this.rulerEndList,
                    'else': this.rulerElse,
                    "/#if": this.rulerEndIf,
                    'elseif': this.rulerElseIf,
                    'switch': this.rulerSwitch,
                    'case': this.rulerCase,
                    'default': this.rulerDefault,
                    '/#switch': this.rulerEndSwitch,
                    'assign': this.rulerAssign,
                    'return': this.rulerReturn
                };
                return (ruler[listArr[0]]).call(this, listArr);

            },
            rulerReturn: function() {
                return 'return;';
            },
            /**
             * 定义变量
             * @param arr
             * @returns {string}
             */
            rulerAssign: function(arr) {
                var result = [],
                    count;
                var rt = findPairs(arr.slice(1));
                count = rt.length;
                for (j = 0; j < count; j += 2) {
                    var name = rt[j];
                    result.push('var ');
                    result.push(name + '=' + rt[j + 1] + ';');
                }
                return result.join('');
            },
            rulerEndSwitch: function(arr) {
                return '}';
            },
            rulerCase: function(arr) {
                return ('case ' + arr[1] + ':');
            },
            rulerDefault: function() {
                return 'default:';
            },
            rulerSwitch: function(arr) {
                return 'switch(' + arr.join('').replace('switch', '') + '){';
            },
            rulerElseIf: function(arr) {
                if (arr.length < 2) {
                    return false;
                }
                return '}else if(' + Ruler.util.filter(arr.slice(1).join('')) + '){';
            },
            rulerBreak: function() {
                return 'break;';
            },
            rulerElse: function(arr) {
                return '}else{';
            },
            rulerEndIf: function(arr) {
                return '}';
            },
            rulerIf: function(arr) {
                if (arr.length < 2) {
                    return false;
                }
                return 'if(' + Ruler.util.filter(arr.slice(1).join('')) + '){';
            },
            rulerEndList: function(arr) {
                return '}})();';
            },
            /**
             * 循环列表方法
             * @param arr
             * @returns {string}
             */
            rulerList: function(arr) {
                var listName, loopName, loopIndexName, loopHasNextName, result = [];
                if (arr.length != 4) {
                    return;
                }
                loopName = arr[3];
                listName = arr[1];
                loopIndexName = loopName + '_index';
                loopHasNextName = loopName + '_has_next';

                result.push('(function(){');
                if (!/^\w+$/.test(listName)) {
                    result.push('var _list=' + listName + ';');
                    listName = '_list';
                }
                result.push([
                    'var _i=0',
                    '_count=' + listName + '.length',
                    loopName,
                    loopIndexName,
                    loopHasNextName + ';'
                ].join(','));
                result.push('for(;_i<_count;_i++){');
                result.push(loopName + '=' + listName + '[_i];');
                result.push(loopIndexName + '=_i;');
                result.push(loopHasNextName + '=_i!==_count-1;');
                return result.join('');
            }
        };
        /**
         * 内嵌函数，待扩展
         * @type {{trim: Function, lTrim: Function, rTrim: Function, removeEmpty: Function, filter: Function}}
         */
        Ruler.util = {
            trim: function(str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            lTrim: function(str) {
                return str.replace(/(^\s*)/g, "");
            },
            rTrim: function(str) {
                return str.replace(/(\s*$)/g, "");
            },
            removeEmpty: function(arr) {
                var splitStr = _separator(arr);
                var REMOVE_REGEX = new RegExp(splitStr + splitStr);
                var REMOVE_HEAD_REGEX = new RegExp('^' + splitStr);
                return arr.join(splitStr).replace(REMOVE_REGEX, splitStr).replace(REMOVE_HEAD_REGEX, '').split(splitStr);
            },
            filter: function(str) {
                return str.replace('&lt;', '<').replace('&gt;', '>');
            }
        };
        /**
         * 将模板语法解释为JS语法
         * @param _templ 模板字符串
         * @returns {String} 语法解析后的
         * @private
         */
        function _parse(_templ) {
            var chunks = [],
                replaced = [],
                compiled;
            var printPrefix = "__buf__.push(";
            var lastIndex = 0;
            var ss = /<#.+?>|\${.+?}|<\/#.+?>|<@.+?>/ig;
            /**
             * 将模块中的匹配替换为相应语言的语法
             * @param  {String} str  输入
             * @param  {Number} type 0普通字符 1变量 2表达式
             * @return {Null}
             */
            function _pushStr(str, type) {
                str = str.replace(/'/g, "\\'");
                if (str !== '') {
                    if (type == 1) {
                        replaced.push(printPrefix + str + ');')
                    } else if (type == 2) {
                        replaced.push(str)
                    } else {
                        replaced.push(printPrefix + '\'' + str + '\');')
                    }
                }
            }

            //移除不安全代码
            _templ = removeUnsafe(_templ);
            _templ.replace(ss, function(match, index) {
                //the last match index of all template
                //上次匹配结束位置与当前匹配的位置之间可能会有一些字符，也要加进来
                if (lastIndex != index) {
                    var _temp_ = _templ.substring(lastIndex, index);
                    if (Ruler.util.trim(_temp_) != '')
                        _pushStr(_templ.substring(lastIndex, index));
                    chunks.push(_temp_);
                }
                if (match[0] == '$') {
                    _pushStr(match.substring(2, match.length - 1), 1);
                    //replaced.push(printPrefix + match.substring(2, match.length - 1) + ');');
                } else {
                    //是注释，暂时不处理
                    if (match[0] == '<' && match[1] == '#' && match[2] == '-') {

                    } else {
                        if (match[0] == '<' && match[1] == '#') {
                            _pushStr(Ruler.regRuler.ruler(match.substring(2, match.length - 1)), 2);
                        } else if (match[1] == '/' && match[2] == '#') {
                            _pushStr(Ruler.regRuler.ruler(match.substring(1, match.length - 1)), 2);
                        } else {}
                        chunks.push(match);
                    }

                }
                //set the last match index as current match index plus matched value length
                lastIndex = index + match.length;
            });
            //add the end string for replaced string
            if (lastIndex < _templ.length) {
                _pushStr(_templ.substring(lastIndex));
            }
            //if no matched replace
            if (!replaced.length) {
                _pushStr(_templ);
            }


            replaced = ["var __buf__=[],$index=null;with($data){", replaced.join(''), "} return __buf__.join('');"].join('');
            return replaced;
        }

        function _proc(html, data) {
            var util = {};
            if (Ruler.util) {
                var _util = Ruler.util;
                for (var key in _util) {
                    util[key] = _util[key];
                }
            }
            if (Object.prototype.toString.call(data) !== '[object Object]') {
                data = {};
            }
            var replaced = html;
            try {
                compiled = new Function("$data", "$util", replaced);
            } catch (e) {
                throw "template code error";
            }
            return compiled.call(window, data, util)
        }

        return {
            parse: _parse,
            proc: _proc
        }
    })();
    /*
     模板引擎，使用freemark语法，目前已知最快的
     作者：陈鑫
     */
    var nc = typeof exports !== 'undefined' ? exports : {};
    nc.reMarker = {
        /**
         * 柯里化模板语法，二次传入
         * @param templ
         * @returns {Function}
         */
        proc: reMarker,
        parse:reMarker
    };

});
//如果内嵌入web页面,则自动将模板导出为JS变量
! function(factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var target = module['exports'] || exports;
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        define(['exports'], factory);
    } else {
        var scriptTags = document.getElementsByTagName('script'),
            templates = [];
        for (var i = 0; i < scriptTags.length; i++) {
            if (scriptTags[i].getAttribute('type') == 'remark-template') {
                templates.push(scriptTags[i]);
            }
        }
        for (var t = 0; t < templates.length; t++) {
            var _id = '__' + templates[t].id + '__';
            window[_id] = window.NC.reMarker.proc(templates[t].innerHTML);
        }
    }
}(function(exports) {});