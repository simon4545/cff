window.NC = window.NC || {};
function limit(el, showTo, fixed) {
    var minX, minY, maxX, maxY, centerX, centerY, hc,
        doc = $(document.body), winWidth, winHeight, docLeft,
        docTop;
    if (!showTo) {
        showTo = $(document.body);
    }
    showTo = $(showTo);


    winWidth = $(window).width();
    winHeight = $(window).height();
    docLeft = doc.scrollLeft();
    docTop = doc.scrollTop();

    el = $(el);

    boxWidth = el.outerWidth();
    boxHeight = el.outerHeight();
    if (showTo.css('position') == "static") {
        var pos = showTo.position();
        docLeft = pos.left;
        docTop = pos.top;
    }
    if (fixed) {
        minX = 0;
        maxX = winWidth - boxWidth;
        centerX = maxX / 2;
        minY = 0;
        maxY = winHeight - boxHeight;
        hc = winHeight * 0.5 - boxHeight / 2;// vertical center by golden section
        centerY = (boxHeight < 4 * winHeight / 7) ? hc : maxY / 2;
    }
    else {
        minX = docLeft;
        maxX = winWidth + minX - boxWidth;
        centerX = maxX / 2;
        minY = docTop;
        maxY = winHeight + minY - boxHeight;
        hc = winHeight * 0.5 - boxHeight / 2 + minY;// vertical center by golden section
        centerY = (boxHeight < 4 * winHeight / 7) ? hc : (maxY + minY) / 2;
    }
    if (centerX < 0) {
        centerX = 0;
    }
    if (centerY < 0) {
        centerY = 0;
    }
    return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        centerX: centerX,
        centerY: centerY
    };
}
var Loading = NC.Loading = function (config) {
    this.config = config || this.defaultConfig;
    this._init();
}
Loading.prototype = {
    defaultConfig: {
        outline: true,
        text: 'Loading...',
        mask: false,
        center: true,
        target: null,
        zindex: 100
    },
    _init: function () {
        if (this.config.target && this.config.target != document.body) {
            this.config.target = $(this.config.target);
        }
        else {
            this.config.target = $('body');
        }
        this.isinner=true;
        this.beforeRender();
    },
    beforeRender: function () {
        var html = __template__({text:this.config.text});
        this.view = $(html);
        this.view.appendTo(this.config.target);
        this.el=this.view.eq(0);
        if (this.config.mask) {
            this.mask = this.view.eq(1);
        }
    },
    afterRender: function () {
        this.show();
        if (this.config.center) {
            this.center();
        }
    },
    text: function (v) {
        if (v) {
            this.config.text = v;
        }
        else {
            return this.config.text;
        }
    },
    show: function () {
        this.config.target.append(this.view)
        this.el.css({
            'z-index': this.config.zindex
        }).show();
        this.config.center&&(this.center());
        if(this.config.mask){
            this.mask.show();
        }
        return this;
    },
    hide: function () {
        this.el.hide();
        if (this.config.mask) {
            this.mask.hide();
        }
        return this;
    },
    center: function () {
        var pos, css = {
            'position': 'absolute'
        };
        if (this.isinner) {
            var el = $(this.config.target);
            pos = el.position();
            css.left = pos.left + parseInt(el.css("margin-left"), 10) + (el.outerWidth() - this.el.outerWidth()) / 2;
            css.top = pos.top + parseInt(el.css("margin-top"), 10) + (el.outerHeight() - this.el.outerHeight()) / 2;
        }
        else {
            pos = limit(this.view, this.config.target);
            css.left = pos.centerX;
            css.top = pos.centerY;
        }
        this.el.css(css);
        return this;
    }
}