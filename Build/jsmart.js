!function (factory) {
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
}(function (exports) {
    var nc = typeof exports !== 'undefined' ? exports : {};
    if(typeof require != 'undefined'){
        var fs = require('./file.js'), path = require('path'),iconv = require('iconv-lite');
        var filter=require('./pages.js'),util=require('./util.js');
    }
    var reMarker = function () {
        this._tokens = [];
        this._included=[];
        this._basePath = '';
    };
    reMarker.prototype.startTag = '{';
    reMarker.prototype.endTag = '}';
    reMarker.prototype.setBasePath = function (basePath) {
        this._basePath = basePath;
        return this;
    }
    reMarker.prototype.setIncluded = function (val) {
        this._included.push(val);
        return this;
    }
    reMarker.prototype.getIncluded=function(){
        return this._included;
    }
    reMarker.prototype.parse = function (templ) {
        var TAG_REGEX = escapeRegExp(this.startTag) + '(?:\\s*)((?:[\\\/\\$])*[\\w\\*]+)(?:\\s*)(.*?)(?:\\1*)(?:\\s*)' + escapeRegExp(this.endTag);
        var matchRegexp = new RegExp(TAG_REGEX, 'gim');
        var _nodeToken = [],
            _matched, _lastIndex = 0;
        while (_matched = matchRegexp.exec(templ)) {
            if (_lastIndex != _matched.index) {
                _nodeToken.push({
                    type: 'text',
                    value: templ.substring(_lastIndex, _matched.index),
                    matched: templ.substring(_lastIndex, _matched.index),
                    index: _lastIndex
                });
            }
            _nodeToken.push({
                type: 'expression',
                expr: _matched[1],
                value: _matched[2],
                matched: _matched[0],
                index: _matched.index
            });
            _lastIndex = _matched.index + _matched[0].length;
        }
        //得到所有的token
        _nodeToken.push({
            type: 'text',
            value: templ.substring(_lastIndex),
            matched: templ.substring(_lastIndex),
            index: _lastIndex
        });
        var _parser = new Parser(_nodeToken);
        return _parser.parse(this);
    }
    reMarker.prototype.proc = function (templ, data) {
        var that = this,
            _complied;
        try {
            var content = this.parse(templ);
            _complied = new Function('$data', content + ';return _out.join("");');
        } catch (ex) {
            throw  new Error( '模板解析出错'+ex.message); ;
        }
        if (!data) {
            return _complied;
        }
        //todo:以后要删除这段，这段方式没有{script}好
        var _html=_complied.call(this, data);
        var _temp='';
        for(var i=0;i<this._included.length;i++){
            var _path=path.dirname(this._included[i]);
            _path=_path.replace(global.BasePath,'/');
            var _fileName=path.join(_path,'index.js');
            _temp += '<script src="'+util.formatUrlSplit(_fileName)+'"></script>\r\n';
        }
        if(_html.match(/<\/body>([\s|\S]*?)<\/html>/i)){
            _html=_html.replace(/(<\/body>([\s|\S]*?)<\/html>)/ig,_temp+'$1');
        }else{
            _html+=_temp;
        }
        return _html;
    }

    function escapeRegExp(string) {
        return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }

    /**
     * 移除不安全代码
     * @param html
     * @returns {*|void}
     */
    function removeUnsafe(html) {
        var _templ = html.replace(/([\r\n])/ig, '\\n').replace(/\s{2,}/ig, ' ').replace(/\'/ig, "\\\'");
        return _templ;
    }

    function phpToJSVar(v, needRemove) {
        if (needRemove > 0) {
            return v;
        } else {
            return v.replace(/\$(([a-zA-Z_][a-zA-Z0-9_]*))(\.\[)*/ig, function ($0, $1) {
                return $1;
            })
        }
    }

    /**
     * 取到模板文件并渲染mock数据
     * @param url
     * @returns {string}
     */
    function fetch(url) {
        var data,_html='';
        data = fs.getContentText(url);
        var TEMPLATE_REGEX=/<!--template-->([\s|\S]*?)<!--\/template-->/ig
        //var matchs=data.match(/<script\s*type="remark-template"[^>]*>([\s|\S]*?)<\/script>/i);
        var match=data.match(/<!--template-->([\s|\S]*?)<!--\/template-->/i);
        while(match=TEMPLATE_REGEX.exec(data))
        {
            _html+=match[1];
        }
        var _html=filter.HTMLFilter(_html,url);
        return _html;
    }

    var VAR_REGEX = /\$(([a-zA-Z_][a-zA-Z0-9_]*)(\.[a-zA-Z_][a-zA-Z0-9_]*)*(\[[^\]]+\]*)*)/ig;
    //var ATTRI_REGEX = /(?:[\s]*(?:([^=\s]+?)=)?((?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"]+)+))+?/ig;
    var ATTRI_REGEX = /(?:[\s]*(?:([^=\s]+?)\s*=\s*)?(?:(?:"([^"\\]*)"|'([^'\\]*)'|([^\s'"]+)+)))+?/ig;

    function Parser(tokens) {
        this._tokens = tokens;
        this._output = '';
        this.regexps = {};
        //this.tagRegExp();
    }

    Parser.openEachTag = 0;
    Parser.openLiteralTag = 0;
    Parser.prototype.parse = function (reMarker) {
        var _matched;
        this._reMarker = reMarker || {};
/*        if (this._reMarker._included) {
            this._output = ''
        }
        else {
            this._output = 'var _out=[];with($data){';
        }*/
        this._output = 'var _out=[];with($data){';
        for (var i = 0; i < this._tokens.length; i++) {
            var token = this._tokens[i];
            //防止literal中止
            if (token.expr == '/literal') {
                this.functions[token.expr].call(this, attributes, this.getAttributes(attributes));
                continue;
            }
            if (token.type == 'text' || Parser.openLiteralTag > 0) {
                this._output += "_out.push('" + removeUnsafe(token.matched) + "');\r\n";
                continue;
            }

            var expr = token.expr;
            expr = expr == 'elseif' ? 'if' : expr;
            var attributes = token.value;
            //表达示
            if (this.functions[expr]) {
                this._output += this.functions[expr].call(this, token.matched, this.getAttributes(attributes));
            } else { //变量或非正常表达式
                this._output += "_out.push(" + phpToJSVar(expr + token.value, Parser.openEachTag) + ");\r\n";
            }
        }

       /* if (!this._reMarker._included) {
            this._output += '};'
        }*/
        this._output += '};'
        return this._output;
    }
    Parser.prototype.getAttributes = function (attributes) {
        if (!attributes) {
            return [];
        }
        var _matched, _i = 0;
        var attributes_new = {};
        while (_matched = ATTRI_REGEX.exec((' ' + attributes))) {
            var key;
            var value;
            if (typeof _matched[1] === 'undefined') {
                key = _i;
                value = _matched[0].replace(/^\s+|\s+$/g, '');
                _i++;
            } else {
                key = _matched[1];
                value = _matched[2]||_matched[3]||_matched[4];
            }
            //value = $.Smarty.value(value);
            attributes_new[key] = value;
        }

        attributes = attributes_new;
        return attributes;
    }

    Parser.prototype.needSkip = function (param) {
        var result = false;
        switch (param) {
            case '':
            case 'index':
            case 'input':
            case '__proto__':
                // For some reason, Chrome is the only browser which adds these
                result = true;
                break;
        }
        return result;
    }
    Parser.prototype.functions = {
        //注释
        '*': function (content, attribute) {
            return ''; //'<!--' + content + '-->';
        },
        '/foreach': function (content, attribute) {
            var _temp = [];

            _temp.push('}/*for end*/}/*if end*/');
            _temp.push('}();');
            Parser.openEachTag--;
            return _temp.join('\r\n');
        },
        'include': function (content, attributes) {
            if (attributes['file'] == undefined) {
                return 'include语法错误' + content;
            }

            for (var arg_name in attributes) {
                var arg_value = attributes[arg_name];

                var arg_value_match = arg_value.match(/\(.*?\)/g);

                if (arg_value_match != null) {
                    for (var i = 0; i < arg_value_match.length; i++) {
                        arg_value = arg_value.replace(arg_value_match[i], "'+" + this._parse_vars(arg_value_match[i].replace(/[\(\)]/g, '')) + "+'");
                    }
                }

                if (arg_name == 'file') {
                    include_file = arg_value;
                    continue;
                } else if (arg_name == 'assign') {
                    var assign_var = arg_value;
                    continue;
                }
                if (typeof arg_value == 'boolean')
                    arg_value = arg_value ? 'true' : 'false';
            }
            var url = path.join(this._reMarker._basePath, attributes['file']);
            var content = fetch(url);
            this._reMarker.setIncluded(url);
            return '_out.push(\''+removeUnsafe(content)+'\');';
            //return new reMarker().setIncluded(true).parse(content);
            //var template_id = attributes['file'].indexOf('.smarty') != -1 ? (attributes['file'].substring(0, attributes['file'].lastIndexOf('.'))) : attributes['file'];
            //return '_out.push(\'<script type="text/javascript" src="' + template_id + '.js"><\/scr' + 'ipt>\');';
        },
        //赋值
        assign: function (content, attr) {
            if (typeof attr['var'] === 'undefined' || typeof attr.value === 'undefined') {
                return 'assign语法错误' + content;
            }
            var value = attr['value'];
            if (value === '[]') { // Make an object
                value = {};
            }
            var key = attr['var'].replace(/'|"/ig, '');
            //要做成转换语句了
            return 'var ' + key + '=' + attr.value + ';';
        },
        //
        'foreachelse':function(content, attr){
            return '}}else{{';
        },
        //循环
        foreach: function (content, attributes) { // Sections
            var from = attributes.from;
            var item = attributes.item;
            if (!from && !item) {
                return 'assign语法错误' + content;
            }

            var key = attributes.key || null;
            var name = attributes.name || Math.round(Math.random() * 10000);

            var _temp = [];
            //TODO foreach.show没有实现
            _temp.push('~function(){');
            _temp.push('if('+phpToJSVar(from, Parser.openEachTag)+'){');
            _temp.push('for (var i in ' + phpToJSVar(from, Parser.openEachTag) + ') {');
            _temp.push('var i=parseInt(i);');
            _temp.push('var length = 0;for (var k in ' + phpToJSVar(from, Parser.openEachTag) + ') {++length;}');
            _temp.push('var $smarty={};$smarty.foreach={};');
            _temp.push('$smarty.foreach[' + name + '] ={};');
            _temp.push('$smarty.foreach[' + name + '].index= i;');
            _temp.push('$smarty.foreach[' + name + '].iteration= i+1;');
            _temp.push('$smarty.foreach[' + name + '].first= i==0;');
            _temp.push('$smarty.foreach[' + name + '].last= i==length-1;');
            _temp.push('$smarty.foreach[' + name + '].total= length;');
            _temp.push('var $' + item + '= ' + phpToJSVar(from, Parser.openEachTag) + '[i];');
            key && _temp.push('$' + key + '= i;');
            _temp.push('i++;');
            Parser.openEachTag++;
            return _temp.join('\r\n');
        },
        "/if": function (content, attributes) {
            return '};';
        },
        "else": function (content, attributes) {
            return '}else{';
        },
        "else": function (content, attributes) {
            return '}else{';
        },
        "if": function (content, attributes) {
            var statements = '';
            var values = [];

            var attribute, statement, is, left, middle, right;
            var reset = function () {
                statement = '';
                is = false;
                left = '';
                middle = '';
                right = '== 0';
            };
            var add = function () {
                statement = is ? '(' + statement + left + ') ' + middle + right : statement;
                statements += statement;
            };

            reset();

            for (i in attributes) {
                if (this.needSkip(i)) continue;
                attribute = attributes[i];
                if (this.needSkip(attribute)) continue;
                switch (attribute) {
                    case 'is':
                        is = true;
                        break;
                    case 'not':
                        right = right === '== 0' ? '!= 0' : '== 0';
                        break;
                    case 'div':
                        break;
                    case 'even':
                        middle = '% 2 ';
                        break;
                    case 'odd':
                        right = right === '== 0' ? '!= 0' : '== 0';
                        middle = '% 2 ';
                        break;
                    case 'by':
                        left = left + ' / ';
                        break;
                    case '||':
                    case '&&':
                        add();
                        statements += attribute + ' ';
                        reset();
                        break;
                    default:
                        if (typeof this.operators[attribute] !== 'undefined') {
                            statement += this.operators[attribute] + ' ';
                        } else {
                            if (is) {
                                left += attribute + ' ';
                            } else {
                                statement += phpToJSVar(attribute, Parser.openEachTag) + ' ';
                            }
                        }
                        break;
                }
            }
            add();
            var _temp = 'if(' + statements + '){';
            if (content.match(/\{elseif\s+[^\}]*\}/i)) {
                _temp = '}else if(' + statements + '){'
            }
            return _temp;
        },
        //字面常量
        literal: function (content, attributes) {
            Parser.openLiteralTag++;
            return '';
        },
        //字面常量
        '/literal': function (content, attributes) {
            Parser.openLiteralTag--;
            return '';
        }
    }
    Parser.prototype.buildTagMatch = function (regexp, ruler) {
        var r = '';
        if (regexp instanceof RegExp) {
            regexp.global && (r += 'g');
            regexp.ignoreCase && (r += 'i');
            regexp.multiline && (r += 'm');
            regexp = regexp.source;
        }
        r = r || ruler || '';
        return new RegExp(escapeRegExp(this._reMarker.startTag) + escapeRegExp(regexp) + escapeRegExp(this._reMarker.endTag), r);
    }
    Parser.prototype.operators = {
        "eq": '==',
        "ne": '!=',
        "neq": '!=',
        "gt": '>',
        "lt": '<',
        "ge": '>=',
        "gte": '>=',
        "le": '<=',
        "lte": '<=',
        // not:        '!',
        "and": '&&',
        "or": '||',
        "mod": '%',

        '==': '==',
        '===': '===',
        '!=': '!=',
        '>': '>',
        '<': '<',
        '>=': '>=',
        '<=': '<=',
        '!': '!',
        '%': '%',

        '(': '(',
        ')': ')',

        '0': 0,
        'false': false,

        'null': null,
        'undefined': null
    };
    nc.reMarker = reMarker;
});
//如果内嵌入web页面,则自动将模板导出为JS变量
!function (factory) {
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
            window[_id] = new window.NC.reMarker().proc(templates[t].innerHTML);
        }
    }
}(function (exports) {
});


//todo:多层的偱环include会出现组件嵌组件的情况，则内部的js不会加到底部，以后会改用在页面中加{script}的方式